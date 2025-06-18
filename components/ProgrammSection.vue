<template>
	<section class="program-section">
		<div class="content-container">
			<h2 class="section-title">Программа дня</h2>
			<div class="swiper-container" ref="swiperContainer">
				<div class="swiper-wrapper">
					<div
						v-for="(item, index) in program"
						:key="index"
						class="swiper-slide program-slide"
					>
						<div class="slide-content">
							<div class="program-header" ref="headers">
								<h3 class="program-title">{{ item.title }}</h3>
								<span class="program-time">{{
									item.time
								}}</span>
							</div>
							<div class="line-container"></div>
							<p class="program-description">
								{{ item.description }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import Swiper from "swiper";
import "swiper/css";

const swiperContainer = ref(null);
const headers = ref([]);

const program = [
	{
		time: "14:00",
		title: "Сбор гостей",
		description: "Встреча гостей с шампанским и легкими закусками",
	},
	{
		time: "15:30",
		title: "Церемония",
		description: "Торжественное бракосочетание в ротонде",
	},
	{
		time: "16:30",
		title: "Фотосессия",
		description: "Свадебная прогулка по живописным локациям",
	},
	{
		time: "18:00",
		title: "Банкет",
		description: "Торжественный ужин с развлекательной программой",
	},
	{
		time: "22:00",
		title: "Торт и поздравления",
		description: "Разрезание свадебного торта и теплые пожелания",
	},
];

let swiper = null;
let resizeTimeout = null;

const equalizeHeaderHeights = () => {
	const headerElements = headers.value;
	if (!headerElements?.length) return;

	// Reset heights
	headerElements.forEach((h) => (h.style.height = "auto"));

	// Find max height and apply
	const maxHeight = Math.max(...headerElements.map((h) => h.offsetHeight));
	headerElements.forEach((h) => (h.style.height = `${maxHeight}px`));
};

const handleResize = () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(equalizeHeaderHeights, 200);
};

onMounted(async () => {
	await nextTick();

	swiper = new Swiper(swiperContainer.value, {
		slidesPerView: "auto",
		spaceBetween: 0,
		freeMode: true,
		centeredSlides: false,
	});

	equalizeHeaderHeights();
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	clearTimeout(resizeTimeout);
	swiper?.destroy();
});
</script>

<style lang="scss" scoped>
.program-section {
	background: $surface;
	padding: 6rem 1.5rem;
	position: relative;
	overflow: hidden;
}

.section-title {
	font-family: "Playfair Display", serif;
	font-size: clamp(2.2rem, 5vw, 3rem);
	color: $text;
	margin-bottom: 4rem;
	position: relative;
	text-align: center;
	font-weight: 500;

	&::after {
		content: "";
		display: block;
		width: 80px;
		height: 2px;
		background: $accent;
		margin: 1.5rem auto 0;
	}
}

.swiper-container {
	width: 100%;
	padding: 0;
}

.swiper-wrapper {
	display: flex;
	align-items: stretch;
	padding-left: 10%;

	@media (max-width: 1024px) {
		padding-left: 7%;
	}

	@media (max-width: 768px) {
		padding-left: 1.5rem;
	}
}

.program-slide {
	width: 300px;
	height: auto;
	flex-shrink: 0;
}

.slide-content {
	height: 100%;
	text-align: left;
}

.program-header {
	padding-right: 20px;
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 15px;
}

.program-time {
	font-family: "Playfair Display", serif;
	font-size: 1.2rem;
	color: $highlight;
	white-space: nowrap;
	margin-right: 15px;
}

.line-container {
	position: relative;
	height: 2px;
	margin: 0.5rem 0 1.5rem;
	width: 100%;
	background: rgba($text, 0.2);

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 8px;
		height: 8px;
		background: $highlight;
		border-radius: 50%;
		z-index: 2;
	}
}

.program-title {
	font-family: "Marcellus", serif;
	font-size: 1.4rem;
	color: $text;
	margin: 0;
	font-weight: 500;
	flex-grow: 1;
}

.program-description {
	margin-top: 0;
	padding-right: 20px;
	font-family: "Avenir Next Cyr", sans-serif;
	font-size: 1.1rem;
	line-height: 1.6;
	color: $text;
	opacity: 0.9;
	text-wrap: balance;
}

/* Адаптив */
@media (max-width: 768px) {
	.program-section {
		padding: 4rem 1rem;
	}

	.program-slide {
		width: 200px;
	}

	.swiper-wrapper {
		padding-right: 20px;
	}

	.program-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.program-time {
		font-size: 0.9rem;
		margin-top: 0.3rem;
		margin-bottom: 10px;
		order: 1;
	}

	.program-title {
		order: 2;
		font-size: 1.2rem;
	}

	.program-description {
		font-size: 1rem;
	}
}
</style>
