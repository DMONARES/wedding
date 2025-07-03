<template>
	<section class="timer-section">
		<div class="container">
			<div class="timer-content">
				<h2 class="section-title">До начала торжества осталось</h2>

				<div class="timer-grid">
					<div class="timer-unit">
						<div class="timer-value">{{ days }}</div>
						<div class="timer-label">Дней</div>
					</div>

					<div class="timer-unit">
						<div class="timer-value">{{ hours }}</div>
						<div class="timer-label">Часов</div>
					</div>

					<div class="timer-unit">
						<div class="timer-value">{{ minutes }}</div>
						<div class="timer-label">Минут</div>
					</div>

					<div class="timer-unit">
						<div class="timer-value">{{ seconds }}</div>
						<div class="timer-label">Секунд</div>
					</div>
				</div>

				<div class="divider"></div>

				<p class="timer-message">
					С нетерпением ждём момента, когда разделим этот особенный
					день с вами
				</p>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const weddingDate = new Date("2025-08-03T14:00:00");
const days = ref("00");
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");

let interval;

const updateTimer = () => {
	const now = new Date();
	const diff = weddingDate - now;

	if (diff <= 0) {
		clearInterval(interval);
		days.value = "00";
		hours.value = "00";
		minutes.value = "00";
		seconds.value = "00";
		return;
	}

	const d = Math.floor(diff / (1000 * 60 * 60 * 24));
	const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const s = Math.floor((diff % (1000 * 60)) / 1000);

	days.value = d.toString().padStart(2, "0");
	hours.value = h.toString().padStart(2, "0");
	minutes.value = m.toString().padStart(2, "0");
	seconds.value = s.toString().padStart(2, "0");
};

onMounted(() => {
	updateTimer();
	interval = setInterval(updateTimer, 1000);
});

onBeforeUnmount(() => {
	clearInterval(interval);
});
</script>

<style scoped lang="scss">
.timer-section {
	padding: 6rem 1.5rem;
	background: $surface;
	position: relative;
	overflow: hidden;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
}

.timer-content {
	text-align: center;
}

.section-title {
	font-family: "Playfair Display", serif;
	font-size: clamp(2rem, 5vw, 3rem);
	color: $text;
	margin-bottom: 3rem;
	font-weight: 500;
}

.timer-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 3rem;
}

.timer-unit {
	background: $base;
	border-radius: 16px;
	padding: 1.5rem;
	width: calc(25% - 2rem);
	min-width: 120px;
	max-width: 160px;
	box-sizing: border-box;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	transition: transform 0.3s ease;

	&:hover {
		transform: translateY(-8px);
	}
}

.timer-value {
	font-family: "Avenir Next Cyr", sans-serif;
	font-size: clamp(2rem, 6vw, 3.5rem);
	font-weight: 600;
	color: $highlight;
	line-height: 1.2;
	margin-bottom: 0.5rem;
}

.timer-label {
	font-family: "Avenir Next Cyr", sans-serif;
	font-size: clamp(0.9rem, 2vw, 1.1rem);
	color: $text;
	opacity: 0.8;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.divider {
	width: 100px;
	height: 1px;
	background: $highlight;
	margin: 3rem auto;
	opacity: 0.6;
}

.timer-message {
	font-family: "Cormorant Garamond", serif;
	font-size: clamp(1.2rem, 3vw, 1.5rem);
	color: $text;
	max-width: 600px;
	margin: 0 auto;
	font-style: italic;
	line-height: 1.6;
}

/* Адаптив для средних экранов (622px и меньше) */
@media (max-width: 768px) {
	.timer-section {
		padding: 4rem 1rem;
	}

	.timer-unit {
		width: calc(50% - 1rem);
		min-width: 140px;
		max-width: 180px;
		padding: 1.2rem;
		margin-bottom: 1rem;
	}

	.timer-grid {
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}
}

/* Адаптив для мобильных */
@media (max-width: 480px) {
	.timer-unit {
		width: calc(50% - 0.5rem);
		min-width: 100px;
		padding: 1rem;
	}

	.timer-value {
		font-size: clamp(1.8rem, 8vw, 2.5rem);
	}

	.timer-label {
		font-size: 0.85rem;
	}

	.timer-message {
		font-size: 1.1rem;
	}
}

/* Для очень маленьких экранов */
@media (max-width: 360px) {
	.timer-unit {
		min-width: 80px;
		padding: 0.8rem;
	}

	.timer-value {
		font-size: 1.6rem;
	}
}
</style>
