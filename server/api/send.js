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

	const tgRes = await $fetch(
		`https://api.telegram.org/bot${config.telegramToken}/sendMessage`,
		{
			method: "POST",
			body: {
				chat_id: config.telegramChatId,
				text,
			},
		}
	);

	return { ok: true };
});
