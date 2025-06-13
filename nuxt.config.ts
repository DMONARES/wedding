// https://nuxt.com/docs/api/configuration/nuxt-config
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

	// если вам нужно проксировать получение данных с элемента ( или любые другие ) - раскоментируйте код ниже и добавьте данные в env файл с ключом process.env.NUXT_PUBLIC_ELEMENT_HOST ⬇️

	// nitro: {
	// 	devProxy: {
	// 		'/element': {
	// 			target: process.env.NUXT_PUBLIC_ELEMENT_HOST,
	// 			changeOrigin: true
	// 		},
	// 	},
	// },

	// css base configuration
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
