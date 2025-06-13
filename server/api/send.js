import { readFileSync } from "fs";
import { join } from "path";
import { google } from "googleapis";
import { readBody, defineEventHandler, useRuntimeConfig } from "#imports";

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { name, count, message } = body;

	const config = useRuntimeConfig();

	const text = `
👤 Новая заявка:
Имя: ${name}
Количество человек: ${count}
Комментарий: ${message || "—"}
`;

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

		const appendResult = await sheets.spreadsheets.values.append({
			spreadsheetId: config.googleSheetId,
			range: "Лист1!A:C",
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [[name, count, message || "—"]],
			},
		});
		console.log("Google Sheets append result:", appendResult.data);
	} catch (err) {
		console.error("Ошибка при записи в Google Sheets:", err.response?.data || err.message || err);
	}

	return { ok: true };
});
