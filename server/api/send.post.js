import { readFileSync } from "fs";
import { join } from "path";
import { google } from "googleapis";
import { readBody, defineEventHandler, useRuntimeConfig } from "#imports";

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

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
			appendResult.data.updates.updatedRange
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
 * Применяет чередующиеся цвета фона и жирный шрифт для основных гостей
 */
async function formatGoogleSheet(sheets, spreadsheetId, updatedRange) {
	try {
		// Извлекаем номера строк из updatedRange (например, "Лист1!A2:C4")
		const rangeMatch = updatedRange.match(/!A(\d+):C(\d+)/);
		if (!rangeMatch) return;

		const startRow = parseInt(rangeMatch[1]) - 1; // Google Sheets API использует 0-based индексы
		const endRow = parseInt(rangeMatch[2]) - 1;

		const requests = [];
		let isMainGuest = true;
		let currentBackgroundColor = { red: 0.8, green: 0.9, blue: 1.0 }; // Светло-голубой

		for (let row = startRow; row <= endRow; row++) {
			// Определяем цвет фона и нужно ли делать жирным
			const backgroundColor = currentBackgroundColor;
			const isBold = isMainGuest;

			// Форматируем всю строку
			requests.push({
				repeatCell: {
					range: {
						sheetId: 0,
						startRowIndex: row,
						endRowIndex: row + 1,
						startColumnIndex: 0,
						endColumnIndex: 3,
					},
					cell: {
						userEnteredFormat: {
							backgroundColor: backgroundColor,
							textFormat: {
								bold: isBold,
							},
						},
					},
					fields: "userEnteredFormat(backgroundColor,textFormat)",
				},
			});

			// Проверяем, является ли следующая строка основным гостем
			// (если в колонке B есть число, то это основной гость)
			if (row < endRow) {
				// Получаем данные следующей строки для проверки
				const nextRowData = await sheets.spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: `Лист1!B${row + 2}:B${row + 2}`,
				});

				const nextRowHasCount =
					nextRowData.data.values &&
					nextRowData.data.values[0] &&
					nextRowData.data.values[0][0] &&
					!isNaN(nextRowData.data.values[0][0]);

				if (nextRowHasCount) {
					// Следующая строка - основной гость, меняем цвет
					isMainGuest = true;
					currentBackgroundColor =
						currentBackgroundColor.red === 1
							? { red: 0.8, green: 0.9, blue: 1.0 } // Светло-голубой
							: { red: 1.0, green: 1.0, blue: 1.0 }; // Белый
				} else {
					// Следующая строка - дополнительный гость
					isMainGuest = false;
				}
			}
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
