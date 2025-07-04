<template>
	<section class="hero">
		<div class="video-overlay"></div>
		<video v-if="false" class="hero-media" autoplay muted loop playsinline>
			<source src="/videos/hero-wedding-1.webm" type="video/webm" />
		</video>

		<div class="hero-content">
			<div class="names-container">
				<h1 class="name name--first">Игорь</h1>
				<div class="ampersand">&</div>
				<h1 class="name name--second">Анита</h1>
			</div>

			<div class="divider"></div>

			<p class="wedding-date">
				<span class="day-month">3 августа</span>
				<span class="year">2025</span>
			</p>

			<p class="invitation-text">
				Приглашаем вас разделить с нами <br> этот особенный день
			</p>
		</div>
		<div class="scroll-down-arrow" @click="scrollToNextSection">
			<svg width="96" height="40" viewBox="0 0 96 40" fill="none">
				<defs>
					<linearGradient id="arrow-gradient" x1="16" y1="28" x2="80" y2="28" gradientUnits="userSpaceOnUse">
						<stop offset="0%" stop-color="white" stop-opacity="0" />
						<stop offset="15%" stop-color="white" stop-opacity="1" />
						<stop offset="85%" stop-color="white" stop-opacity="1" />
						<stop offset="100%" stop-color="white" stop-opacity="0" />
					</linearGradient>
				</defs>
				<path d="M16 24 L48 32 L80 24" stroke="url(#arrow-gradient)" stroke-width="2.2" stroke-linecap="round"
					stroke-linejoin="round" fill="none" />
			</svg>
		</div>
	</section>
</template>

<script setup>
import { onMounted } from "vue";
import gsap from "gsap";

onMounted(() =>
{
	gsap.from(".hero-content > *", {
		duration: 1.8,
		y: 40,
		opacity: 0,
		stagger: 0.4,
		ease: "power3.out",
		delay: 0.6,
	});
});

function scrollToNextSection()
{
	const hero = document.querySelector('.hero');
	let nextSection = null;
	if (hero)
	{
		let el = hero.nextElementSibling;
		while (el)
		{
			if (el.offsetHeight > 0 && (el.tagName === 'SECTION' || el.classList.contains('YandexMap')))
			{
				nextSection = el;
				break;
			}
			el = el.nextElementSibling;
		}
	}
	if (!nextSection)
	{
		nextSection = document.querySelector('.YandexMap, .next-section, section');
	}
	if (nextSection)
	{
		nextSection.scrollIntoView({ behavior: 'smooth' });
	}
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Marcellus&family=Playfair+Display:wght@400;500&display=swap");

.hero {
	--highlight: #8a6f8f;
	--accent: #d4c8bc;
	--text-light: rgba(255, 255, 255, 0.9);

	position: relative;
	height: 100vh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-image: url('/images/hero-image-desktop.webp');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

.hero-media {
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
	background: linear-gradient(to bottom,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(138, 111, 143, 0.2) 100%);
	z-index: 0;
}

.hero-content {
	position: relative;
	z-index: 2;
	text-align: center;
	color: white;
	padding: 0 2rem;
	max-width: 1200px;
	width: 100%;
}

.names-container {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;
}

.name {
	font-family: "Marcellus", serif;
	font-weight: 400;
	font-size: clamp(3rem, 8vw, 5rem);
	line-height: 1.1;
	letter-spacing: 0.02em;
	color: var(--text-light);
	margin: 0;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ampersand {
	font-family: "Cormorant Garamond", serif;
	font-weight: 400;
	font-size: clamp(2rem, 5vw, 3rem);
	color: var(--text-light);
	line-height: 1;
	margin: 0 1.5rem;
	font-style: italic;
}

.divider {
	width: 120px;
	height: 1px;
	background: $highlight;
	margin: 2rem auto;
	opacity: 0.6;
}

.wedding-date {
	font-family: "Playfair Display", serif;
	font-weight: 500;
	font-size: clamp(1.6rem, 3vw, 2.2rem);
	letter-spacing: 0.12em;
	color: var(--text-light);
	margin-bottom: 2rem;
	text-transform: uppercase;
	display: flex;
	flex-direction: column;
	align-items: center;

	span {
		color: var(--text-light);
	}
}

.day-month {
	font-size: 1em;
}

.year {
	font-size: 0.9em;
	margin-top: 0.3rem;
	letter-spacing: 0.15em;
	font-weight: 400;
}

.invitation-text {
	font-family: "Cormorant Garamond", serif;
	font-weight: 400;
	font-size: clamp(1.1rem, 2vw, 1.4rem);
	line-height: 1.6;
	color: var(--text-light);
	max-width: 500px;
	margin: 0 auto;
	letter-spacing: 0.03em;
}

/* Адаптив для планшетов и мобильных */
@media (max-width: 1024px) {
	.names-container {
		flex-direction: column;
	}

	.name {
		font-size: clamp(3.2rem, 9vw, 4.5rem);
	}

	.name--first {
		margin-bottom: -0.8rem;
	}

	.name--second {
		margin-top: -0.8rem;
	}

	.ampersand {
		margin: 0.5rem 0;
		font-size: clamp(2.2rem, 6vw, 3.2rem);
	}
}

@media (min-width: 768px) {
	.wedding-date {
		flex-direction: row;
		justify-content: center;
		gap: 0.8rem;
	}

	.year {
		margin-top: 0;
		position: relative;
		padding-left: 0.8rem;
	}

	.year::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 2px;
		height: 1em;
		background: $highlight;
		opacity: 0.6;
	}
}

@media (max-width: 480px) {
	.invitation-text br {
		display: none;
	}
}

@media (max-width: 768px) {
	.hero {
		background-image: url('/images/hero-image-mobile.webp');
	}
}

.scroll-down-arrow {
	position: absolute;
	left: 50%;
	bottom: 60px;
	transform: translateX(-50%);
	cursor: pointer;
	z-index: 10;
	animation: arrow-bounce 1.6s infinite;
	opacity: 0.85;
	transition: opacity 0.2s;
}

.scroll-down-arrow svg {
	width: 96px;
	height: 40px;
	display: block;
	filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
}

.scroll-down-arrow:hover {
	opacity: 1;
}

@keyframes arrow-bounce {

	0%,
	100% {
		transform: translateX(-50%) translateY(0);
	}

	50% {
		transform: translateX(-50%) translateY(16px);
	}
}
</style>
