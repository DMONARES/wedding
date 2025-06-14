import { readFileSync } from "fs";
import { join } from "path";
import { google } from "googleapis";
import { readBody, defineEventHandler, useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const credentials = JSON.parse(config.googleCredentialsJson);

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { guests, message } = body;

	const config = useRuntimeConfig();

	// Формируем текст для Telegram
	const guestsList = guests
		.map((guest, index) => `${index + 1}. ${guest.name || "Без имени"}`)
		.join("\n");

	const text = `
👤 Новая заявка:
Гости (${guests.length}):
${guestsList}
Комментарий: ${message || "—"}
`;

	// Отправляем в Telegram
	await fetch(
		`https://api.telegram.org/bot${config.telegramToken}/sendMessage`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: config.telegramChatId,
				text,
			}),
		}
	);

	try {
		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});
		const client = await auth.getClient();
		const sheets = google.sheets({ version: "v4", auth: client });

		// Подготавливаем данные для Google Sheets
		const values = [];
		const totalGuests = guests.length;

		guests.forEach((guest, index) => {
			if (index === 0) {
				// Первый гость (основной) - с количеством и комментарием
				values.push([
					guest.name || "Без имени",
					totalGuests,
					message || "—",
				]);
			} else {
				// Остальные гости - только имена
				values.push([guest.name || "Без имени", "", ""]);
			}
		});

		// Записываем данные в Google Sheets
		const appendResult = await sheets.spreadsheets.values.append({
			spreadsheetId: config.googleSheetId,
			range: "Лист1!A:C",
			valueInputOption: "USER_ENTERED",
			resource: {
				values: values,
			},
		});

		console.log("Google Sheets append result:", appendResult.data);

		// Применяем форматирование
		await formatGoogleSheet(
			sheets,
			config.googleSheetId,
			appendResult.data.updates.updatedRange,
			guests.length
		);
	} catch (err) {
		console.error(
			"Ошибка при записи в Google Sheets:",
			err.response?.data || err.message || err
		);
	}

	return { ok: true };
});

/**
 * Функция для форматирования Google Sheets
 * Применяет чередующиеся цвета фона и жирный шрифт только для имен основных гостей
 */
async function formatGoogleSheet(
	sheets,
	spreadsheetId,
	updatedRange,
	guestsCount
) {
	try {
		// Извлекаем номера строк из updatedRange (например, "Лист1!A2:C4")
		const rangeMatch = updatedRange.match(/!A(\d+):C(\d+)/);
		if (!rangeMatch) return;

		const startRow = parseInt(rangeMatch[1]) - 1; // Google Sheets API использует 0-based индексы
		const endRow = parseInt(rangeMatch[2]) - 1;

		// Получаем общее количество строк в таблице для определения цвета группы
		const allDataResponse = await sheets.spreadsheets.values.get({
			spreadsheetId: spreadsheetId,
			range: "A:C",
		});

		const allRows = allDataResponse.data.values || [];
		const totalRowsBeforeInsert = allRows.length - guestsCount;

		// Определяем, какой цвет должен быть у этой группы (чередование групп)
		let groupNumber = 0;
		for (let i = 1; i < totalRowsBeforeInsert; i++) {
			// Начинаем с 1, чтобы пропустить заголовок
			if (allRows[i] && allRows[i][1] && !isNaN(allRows[i][1])) {
				groupNumber++;
			}
		}

		// Определяем цвет для текущей группы (четные - голубой, нечетные - белый)
		const isBlueGroup = groupNumber % 2 === 0;
		const backgroundColor = isBlueGroup
			? { red: 0.8, green: 0.9, blue: 1.0 } // Светло-голубой
			: { red: 1.0, green: 1.0, blue: 1.0 }; // Белый

		const requests = [];

		for (let row = startRow; row <= endRow; row++) {
			const isMainGuest = row === startRow; // Только первая строка группы - основной гость

			// Форматируем колонку A (имя) - жирным только для основного гостя
			requests.push({
				repeatCell: {
					range: {
						sheetId: 0,
						startRowIndex: row,
						endRowIndex: row + 1,
						startColumnIndex: 0,
						endColumnIndex: 1,
					},
					cell: {
						userEnteredFormat: {
							backgroundColor: backgroundColor,
							textFormat: {
								bold: isMainGuest, // Жирным только основного гостя
							},
						},
					},
					fields: "userEnteredFormat(backgroundColor,textFormat)",
				},
			});

			// Форматируем колонки B и C (количество и комментарий) - обычным шрифтом
			requests.push({
				repeatCell: {
					range: {
						sheetId: 0,
						startRowIndex: row,
						endRowIndex: row + 1,
						startColumnIndex: 1,
						endColumnIndex: 3,
					},
					cell: {
						userEnteredFormat: {
							backgroundColor: backgroundColor,
							textFormat: {
								bold: false, // Всегда обычный шрифт
							},
						},
					},
					fields: "userEnteredFormat(backgroundColor,textFormat)",
				},
			});
		}

		// Применяем форматирование
		if (requests.length > 0) {
			await sheets.spreadsheets.batchUpdate({
				spreadsheetId: spreadsheetId,
				resource: {
					requests: requests,
				},
			});
		}
	} catch (error) {
		console.error("Ошибка при форматировании Google Sheets:", error);
	}
}

/**
 * Функция для обновления формулы подсчета гостей
 */
async function updateGuestCountFormula(sheets, spreadsheetId) {
	try {
		// Находим первую пустую строку в колонке A
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: spreadsheetId,
			range: "A:A",
		});

		const values = response.data.values || [];
		const lastRow = values.length + 2; // +2 для отступа

		// Добавляем формулу для подсчета общего количества гостей
		await sheets.spreadsheets.values.update({
			spreadsheetId: spreadsheetId,
			range: `A${lastRow}:B${lastRow}`,
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [["ИТОГО ГОСТЕЙ:", "=СУММ(B:B)"]],
			},
		});

		// Форматируем итоговую строку (жирный шрифт, желтый фон)
		await sheets.spreadsheets.batchUpdate({
			spreadsheetId: spreadsheetId,
			resource: {
				requests: [
					{
						repeatCell: {
							range: {
								sheetId: 0,
								startRowIndex: lastRow - 1,
								endRowIndex: lastRow,
								startColumnIndex: 0,
								endColumnIndex: 2,
							},
							cell: {
								userEnteredFormat: {
									backgroundColor: {
										red: 1.0,
										green: 1.0,
										blue: 0.8,
									}, // Светло-желтый
									textFormat: {
										bold: true,
									},
								},
							},
							fields: "userEnteredFormat(backgroundColor,textFormat)",
						},
					},
				],
			},
		});
	} catch (error) {
		console.error("Ошибка при добавлении формулы подсчета:", error);
	}
}
