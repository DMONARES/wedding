<template>
	<section class="hero">
		<div class="video-overlay"></div>
		<video class="hero-video" autoplay muted loop playsinline>
			<source src="/videos/hero-wedding-1.webm" type="video/webm" />
		</video>

		<div class="hero-content">
			<div class="names-container">
				<h1 class="name name--first">Анита</h1>
				<div class="ampersand">&</div>
				<h1 class="name name--second">Игорь</h1>
			</div>

			<div class="divider"></div>

			<p class="wedding-date">
				<span class="day-month">1 августа</span>
				<span class="year">2025</span>
			</p>

			<p class="invitation-text">
				С великой радостью приглашаем вас<br />на нашу свадебную
				церемонию
			</p>
		</div>
	</section>
</template>

<script setup>
import { onMounted } from "vue";
import gsap from "gsap";

onMounted(() => {
	gsap.from(".hero-content > *", {
		duration: 1.8,
		y: 40,
		opacity: 0,
		stagger: 0.4,
		ease: "power3.out",
		delay: 0.6,
	});
});
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
		rgba(0, 0, 0, 0.4) 0%,
		rgba(138, 111, 143, 0.2) 100%
	);
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
	background: var(--accent);
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
		background: var(--accent);
		opacity: 0.6;
	}
}

@media (max-width: 480px) {
	.invitation-text br {
		display: none;
	}
}
</style>
