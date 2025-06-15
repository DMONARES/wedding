<template>
	<section class="story-section" id="our-story">
		<div class="content-container">
			<h2 class="section-title">Наша история</h2>

			<div class="story-grid">
				<div
					v-for="(story, index) in stories"
					:key="index"
					class="story-block"
					:class="{ 'text-first': index % 2 !== 0 }"
					:ref="(el) => (storyRefs[index] = el)"
				>
					<div
						class="photo-block"
						:style="{ backgroundImage: `url(${story.image})` }"
					></div>

					<div class="text-block">
						<h3>{{ story.title }}</h3>
						<p>{{ story.text }}</p>
						<span class="date">{{ story.date }}</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const stories = [
	{
		title: "Первая встреча",
		text: "Тот самый дождливый вечер в кофейне, где мы случайно заняли один столик. Помните, как вы пролили кофе на мою книгу?",
		date: "12 мая 2019",
		image: "images/1.jpg",
	},
	{
		title: "Первое путешествие",
		text: "Горы Кавказа, где мы заблудились и нашли не только дорогу назад, но и нечто большее в наших отношениях.",
		date: "Июль 2020",
		image: "images/2.jpg",
	},
	{
		title: "Предложение",
		text: "Романтический ужин с видом на ночной город. Вы на коленях, я в слезах, а вокруг - миллионы огней.",
		date: "3 января 2023",
		image: "images/3.jpg",
	},
	{
		title: "Подготовка",
		text: "Месяцы счастливых хлопот: выбор цветов, дегустация тортов и бесконечные 'а вот если...' за чашкой чая.",
		date: "2024-2025",
		image: "images/4.jpg",
	},
];

const storyRefs = ref([]);

// Простой вариант анимации без GSAP
const animateOnScroll = () => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = 1;
					entry.target.style.transform = "translateY(0)";
				}
			});
		},
		{ threshold: 0.1 }
	);

	storyRefs.value.forEach((block) => {
		if (block) observer.observe(block);
	});

	// Анимация для заголовка
	const title = document.querySelector(".section-title");
	if (title) {
		setTimeout(() => {
			title.style.opacity = 1;
			title.style.transform = "translateY(0)";
		}, 300);
	}
};

onMounted(() => {
	animateOnScroll();
});
</script>

<style scoped lang="scss">
.story-section {
	background: var(--base);
	padding: 6rem 1.5rem;
	overflow: hidden;
}

.content-container {
	max-width: 1400px;
	margin: 0 auto;
}

.section-title {
	font-family: "Playfair Display", serif;
	font-size: clamp(2.5rem, 5vw, 3.5rem);
	text-align: center;
	color: var(--text);
	margin-bottom: 4rem;
	position: relative;
	font-weight: 500;

	/* Анимация для заголовка */
	opacity: 0;
	transform: translateY(30px);
	transition: opacity 0.8s ease, transform 0.8s ease;

	&::after {
		content: "";
		display: block;
		width: 80px;
		height: 2px;
		background: var(--accent);
		margin: 1.5rem auto 0;
	}
}

.story-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0;
}

.story-block {
	display: grid;
	grid-template-columns: 1fr 1fr;
	min-height: 500px;

	/* Анимация для блоков */
	opacity: 0;
	transform: translateY(40px);
	transition: opacity 0.8s ease, transform 0.8s ease;

	&.text-first {
		.text-block {
			order: 1;
		}
		.photo-block {
			order: 2;
		}
	}
}

.photo-block {
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	transition: transform 0.5s ease;
}

.text-block {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 4rem;
	background: var(--surface);

	h3 {
		font-family: "Playfair Display", serif;
		font-size: clamp(1.8rem, 3vw, 2.2rem);
		color: var(--text);
		margin-bottom: 1.5rem;
		line-height: 1.3;
		font-weight: 500;
	}

	p {
		font-family: "Avenir Next Cyr", sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.25rem);
		line-height: 1.7;
		color: var(--text);
		margin-bottom: 2rem;
		max-width: 600px;
		font-weight: 400;
		opacity: 0.9;
	}

	.date {
		font-family: "Playfair Display", serif;
		font-size: 1.1rem;
		color: var(--highlight);
		letter-spacing: 0.05em;
		font-weight: 500;
	}
}

/* Адаптив для планшетов */
@media (max-width: 1024px) {
	.story-block {
		min-height: 450px;
	}

	.text-block {
		padding: 3rem;

		p {
			font-size: clamp(1.1rem, 2.5vw, 1.3rem);
		}
	}
}

/* Адаптив для мобильных */
@media (max-width: 768px) {
	.story-section {
		padding: 4rem 1rem;
	}

	.section-title {
		margin-bottom: 2rem;
		text-align: left;

		&::after {
			margin-left: 0;
		}
	}

	.story-block {
		grid-template-columns: 1fr;
		min-height: auto;

		&.text-first {
			.text-block {
				order: 2;
			}
			.photo-block {
				order: 1;
			}
		}
	}

	.photo-block {
		height: 300px;
	}

	.text-block {
		padding: 2.5rem 1.5rem;

		p {
			max-width: 100%;
			font-size: 1.1rem;
			line-height: 1.6;
		}

		.date {
			font-size: 1rem;
		}
	}
}

@media (max-width: 480px) {
	.text-block {
		padding: 2rem 1.2rem;

		h3 {
			font-size: 1.6rem;
		}

		p {
			font-size: 1rem;
		}
	}
}
</style>
