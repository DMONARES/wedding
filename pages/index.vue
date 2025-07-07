<script setup>
const showPreloader = ref(true);
const catArt = `
 /\\_/\\
( o.o )
 > ^ <
`;

useHead({
	title: "Wedding",
	meta: [
		{
			name: "description",
			content:
				"Приглашаем вас на нашу свадьбу 3 августа 2025 года. Подробности, программа, карта и RSVP.",
		},
		{
			name: "keywords",
			content: "свадьба, Игорь и Анита, приглашение, 2025, rsvp",
		},
		{ property: "og:title", content: "Свадьба Игоря и Аниты" },
		{
			property: "og:description",
			content: "Приглашаем вас разделить с нами этот особенный день!",
		},
		{ property: "og:image", content: "https://wedding-call.ru/images/hero-image-desktop.jpg" },
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://wedding-call.ru" },
	],
});

onMounted(() => {
	setTimeout(() => {
		showPreloader.value = false;
		document.body.style.overflow = "auto";
	}, 5000);
	console.log(catArt);
});
</script>

<template>
	<div v-if="showPreloader" class="preloader-container"></div>

	<div v-else class="main-content">
		<HeroSection />
		<TimerSection />
		<div id="content-section" class="content-container">
			<MyForm />
		</div>
		<YandexMap />
	</div>
</template>

<style>
html,
body {
	overflow: auto !important;
	height: auto !important;
}

.preloader-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 10000;
}

.main-content {
	position: relative;
}
</style>
