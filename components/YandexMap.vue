<template>
	<div class="map-wrapper">
		<div id="map" class="map-container" />
	</div>
</template>

<script setup>
import { onMounted } from "vue";

const initMap = () => {
	const ymaps = window.ymaps;
	ymaps.ready(() => {
		const map = new ymaps.Map("map", {
			center: [43.029421, 44.677549],
			zoom: 14,
			controls: [],
		});

		map.geoObjects.add(
			new ymaps.Placemark([43.029421, 44.677549], {
				balloonContent: "Загородный клуб «Лес и Река»",
			})
		);
	});
};

onMounted(() => {
	if (!window.ymaps) {
		const script = document.createElement("script");
		script.src =
			"https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=9564604a-4d17-4de4-9fef-00341fcf7a31";
		script.onload = initMap;
		document.head.appendChild(script);
	} else {
		initMap();
	}
});
</script>

<style lang="scss">
.map-wrapper {
	width: 100%;
	max-width: 300px;
	margin: 0 auto;
	padding: 20px 0;
}

.map-container {
	height: 500px;
	width: 100%;
	border-radius: 16px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	overflow: hidden;
}
/* Убираем блоки "Как добраться", "Создать свою карту" */
.map-container .ymaps-2-1-79-copyrights-pane,
.map-container .ymaps-2-1-79-controls__control,
.ymaps-2-1-79-map-copyrights-promo {
	display: none !important;
}
</style>
