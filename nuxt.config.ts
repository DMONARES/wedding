export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },

	modules: ["@pinia/nuxt"],

	runtimeConfig: {
		telegramToken: process.env.TELEGRAM_TOKEN,
		telegramChatId: process.env.TELEGRAM_CHAT_ID,
		googleSheetId: process.env.GOOGLE_SHEET_ID,
		googleCredentialsJson: process.env.GOOGLE_CREDENTIALS_JSON,
	},

	css: ["@/assets/styles/index.scss"],

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern",
					silenceDeprecations: [
						"import",
						"global-builtin",
						"legacy-js-api",
					],
					additionalData: `@use "@/assets/styles/base/_variables.scss" as *;  @use "@/assets/styles/base/_mixins.scss" as *;`,
				},
			},
		},
	},
});
