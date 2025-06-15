<template>
	<section class="hero" ref="heroSection">
		<div class="video-overlay"></div>
		<video
			class="hero-video"
			autoplay
			muted
			loop
			playsinline
			:poster="videoPoster"
		>
			<source src="/videos/hero-wedding-1.webm" type="video/webm" />
		</video>

		<div class="hero-content">
			<h1 class="hero-title">{{ names }}</h1>
			<div class="hero-divider"></div>
			<p class="hero-date">{{ weddingDate }}</p>
			<p class="hero-invitation">
				Приглашаем вас разделить с нами радость нашего особенного дня
			</p>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const heroSection = ref(null);
const names = ref("Анита & Игорь");
const weddingDate = ref("1 августа 2025 года");
const videoPoster = "/images/hero-poster.png";

onMounted(() => {
	// Анимация появления текста
	gsap.from(".hero-content > *", {
		duration: 1.5,
		y: 30,
		opacity: 0,
		stagger: 0.3,
		ease: "power3.out",
		delay: 0.5,
	});
});
</script>

<style scoped>
.hero {
	position: relative;
	height: 100vh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.hero-video {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: -1;
}

.video-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		to bottom,
		rgba(42, 42, 42, 0.6) 0%,
		rgba(138, 111, 143, 0.4) 100%
	);
	z-index: 0;
}

.hero-content {
	position: relative;
	z-index: 2;
	text-align: center;
	color: var(--white);
	padding: 0 20px;
	max-width: 1200px;
}

.hero-title {
	font-family: "Playfair Display", serif;
	font-size: 5rem;
	font-weight: 400;
	letter-spacing: 0.5rem;
	margin-bottom: 1.5rem;
	text-transform: uppercase;
	color: var(--white);
}

.hero-divider {
	width: 100px;
	height: 2px;
	background: var(--accent);
	margin: 0 auto 1.5rem;
}

.hero-date {
	font-family: "Montserrat", sans-serif;
	font-size: 1.5rem;
	letter-spacing: 0.3rem;
	margin-bottom: 2rem;
}

.hero-invitation {
	font-family: "Montserrat", sans-serif;
	font-size: 1.2rem;
	max-width: 600px;
	margin: 0 auto;
	line-height: 1.6;
	font-weight: 300;
}

.scroll-hint {
	position: absolute;
	bottom: 40px;
	left: 50%;
	transform: translateX(-50%);
	background: transparent;
	border: none;
	color: var(--white);
	cursor: pointer;
	animation: bounce 2s infinite;
}

@keyframes bounce {
	0%,
	20%,
	50%,
	80%,
	100% {
		transform: translateY(0) translateX(-50%);
	}
	40% {
		transform: translateY(-20px) translateX(-50%);
	}
	60% {
		transform: translateY(-10px) translateX(-50%);
	}
}

@media (max-width: 768px) {
	.hero-title {
		font-size: 3rem;
		letter-spacing: 0.3rem;
	}

	.hero-date {
		font-size: 1.2rem;
	}
}
</style>
