<template>
	<section class="location-section">
		<div class="location-container">
			<div class="location-info">
				<div class="info-content">
					<h2 class="section-title">Место проведения</h2>

					<div class="info-group">
						<h3>Загородный клуб «Лес и Река»</h3>
						<p class="address">
							<svg class="icon" viewBox="0 0 24 24">
								<path
									d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"
								/>
							</svg>
							Владикавказ, ул. Лесная, 15
						</p>
					</div>

					<div class="info-grid">
						<div class="info-item">
							<svg class="icon" viewBox="0 0 24 24">
								<path
									d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
								/>
								<path
									d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
								/>
							</svg>
							<div>
								<h4>Дата и время</h4>
								<p>1 августа 2025 года<br />Начало в 15:00</p>
							</div>
						</div>

						<div class="info-item">
							<svg class="icon" viewBox="0 0 24 24">
								<path
									d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-2h4v2zm0-4H7v-2h4v2zm0-4H7V7h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z"
								/>
							</svg>
							<div>
								<h4>Парковка</h4>
								<p>Бесплатная охраняемая парковка на 50 мест</p>
							</div>
						</div>

						<div class="info-item">
							<svg class="icon" viewBox="0 0 24 24">
								<path
									d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
								/>
							</svg>
							<div>
								<h4>Дресс-код</h4>
								<p>
									Вечерние наряды<br />Цветовая палитра:
									пастельные тона
								</p>
							</div>
						</div>
					</div>

					<div class="transport-info">
						<h4>Как добраться:</h4>
						<ul>
							<li>От центра города - 15 минут на автомобиле</li>
							<li>Такси: закажите через приложение Maxim</li>
							<li>Автобус №102 до остановки "Лесной клуб"</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="map-wrapper">
				<div id="map" class="map-container" />
			</div>
		</div>
	</section>
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

		const placemark = new ymaps.Placemark([43.029421, 44.677549], {
			balloonContent: "Загородный клуб «Лес и Река»",
		});

		map.geoObjects.add(placemark);

		// Отключаем зум колесиком мыши
		map.behaviors.disable("scrollZoom");
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

<style scoped lang="scss">
.location-section {
	background: var(--base);
	padding: 0;
	position: relative;
	overflow: hidden;
}

.location-container {
	display: flex;
	min-height: 600px;
}

.location-info {
	flex: 0 0 50%;
	display: flex;
	align-items: center;
	padding: 0 5% 0 10%;
	background: var(--base);
	z-index: 2;
}

.info-content {
	max-width: 500px;
	width: 100%;
}

.section-title {
	font-family: "Playfair Display", serif;
	font-size: clamp(2.2rem, 5vw, 3rem);
	color: var(--text);
	margin-bottom: 2.5rem;
	position: relative;
	font-weight: 500;
}

.info-group {
	margin-bottom: 3rem;

	h3 {
		font-family: "Marcellus", serif;
		font-size: clamp(1.6rem, 3vw, 2rem);
		color: var(--text);
		margin-bottom: 0.5rem;
	}
}

.address {
	font-family: "Avenir Next Cyr", sans-serif;
	font-size: 1.2rem;
	color: var(--text);
	display: flex;
	align-items: center;
	gap: 0.8rem;
	opacity: 0.9;
}

.info-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.8rem;
	margin-bottom: 3rem;
}

.info-item {
	display: flex;
	gap: 1.2rem;
	align-items: flex-start;

	h4 {
		font-family: "Playfair Display", serif;
		font-size: 1.2rem;
		color: var(--text);
		margin-bottom: 0.3rem;
	}

	p {
		font-family: "Avenir Next Cyr", sans-serif;
		font-size: 1rem;
		color: var(--text);
		opacity: 0.85;
		line-height: 1.5;
	}
}

.icon {
	width: 24px;
	height: 24px;
	fill: var(--highlight);
	flex-shrink: 0;
	margin-top: 4px;
}

.transport-info {
	h4 {
		font-family: "Playfair Display", serif;
		font-size: 1.2rem;
		color: var(--text);
		margin-bottom: 0.8rem;
	}

	ul {
		list-style: none;
		padding-left: 0;

		li {
			font-family: "Avenir Next Cyr", sans-serif;
			font-size: 1rem;
			color: var(--text);
			opacity: 0.85;
			padding-left: 1.5rem;
			position: relative;
			margin-bottom: 0.6rem;
			line-height: 1.5;

			&::before {
				content: "•";
				position: absolute;
				left: 0;
				color: var(--highlight);
			}
		}
	}
}

.map-wrapper {
	flex: 1;
	position: relative;
}

.map-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

/* Скрытие элементов карты */
:deep(.ymaps-2-1-79-copyrights-pane),
:deep(.ymaps-2-1-79-controls__control),
:deep(.ymaps-2-1-79-map-copyrights-promo) {
	display: none !important;
}

/* Адаптив для планшетов */
@media (max-width: 1024px) {
	.location-info {
		padding: 0 5% 0 7%;
	}

	.info-grid {
		gap: 1.2rem;
	}
}

/* Адаптив для мобильных */
@media (max-width: 768px) {
	.location-container {
		flex-direction: column;
		min-height: auto;
	}

	.location-info {
		flex: none;
		width: 100%;
		padding: 3rem 1.5rem;
		order: 1;
	}

	.map-wrapper {
		flex: none;
		height: 400px;
		order: 2;
	}
}
</style>
