<template>
	<div class="styles-page">
		<section class="section">
			<h2 class="title title--xl mb-lg">Цвета</h2>
			<div class="colors-grid">
				<div
					v-for="(color, name) in colors"
					:key="name"
					class="color-card"
					:style="{ backgroundColor: color }"
				>
					<span class="color-card__name">{{ name }}</span>
					<span class="color-card__value">{{ color }}</span>
				</div>
			</div>
		</section>

		<section class="section">
			<h2 class="title title--xl mb-lg">Типографика</h2>

			<div class="typography-block mb-xl">
				<h3 class="title title--lg mb-md">Шрифт: {{ fontFamily }}</h3>
				<p class="text text--md">Основной шрифт для всех текстов</p>
			</div>

			<div class="typography-examples">
				<div
					v-for="item in typography"
					:key="item.class"
					:class="item.class"
				>
					{{ item.text || sampleText }}
				</div>
			</div>
		</section>

		<section class="section">
			<h2 class="title title--xl mb-lg">Компоненты</h2>

			<div class="component-example mb-xl">
				<h3 class="title title--lg mb-md">Разделитель</h3>
				<div class="divider"></div>
			</div>

			<div class="component-example">
				<h3 class="title title--lg mb-md">Кнопка</h3>
				<button class="button">Нажми меня</button>
			</div>
		</section>

		<section class="section">
			<h2 class="title title--xl mb-lg">UI Components</h2>

			<div class="component-grid">
				<div class="component-example">
					<h3 class="title title--lg mb-md">Buttons</h3>
					<div class="buttons-group">
						<UiButton variant="primary">Primary</UiButton>
						<UiButton variant="secondary">Secondary</UiButton>
						<UiButton variant="icon">+</UiButton>
					</div>
				</div>

				<div class="component-example">
					<h3 class="title title--lg mb-md">Inputs</h3>
					<UiInput
						v-model="inputValue"
						label="Name"
						placeholder="Enter your name"
					/>
					<pre>Value: {{ inputValue }}</pre>
				</div>

				<div class="component-example">
					<h3 class="title title--lg mb-md">Counter</h3>
					<UiCounter v-model="counterValue" :min="0" :max="5" />
					<pre>Value: {{ counterValue }}</pre>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
const fontFamily = "Avenir Next Cyr";
const sampleText =
	"Съешь ещё этих мягких французских булок, да выпей чаю. 1234567890";

const colors = {
	base: "#F9F7F4",
	surface: "#EFECE7",
	accent: "#D4C8BC",
	text: "#2A2A2A",
	highlight: "#8A6F8F",
	black: "#282C34",
	gray: "#82868E",
	lightGray: "#E8E8E7",
	red: "#DC1020",
	white: "#FFFFFF",
};

const typography = [
	{ class: "title title--xxl", text: "Заголовок XXL" },
	{ class: "title title--xl", text: "Заголовок XL" },
	{ class: "title title--lg", text: "Заголовок LG" },
	{ class: "text text--lead", text: "Текст Lead (1.25rem)" },
	{ class: "text text--md", text: "Текст Medium (1.125rem)" },
	{ class: "text text--sm", text: "Текст Small (1rem)" },
	{ class: "text text--light", text: "Текст Light (серый)" },
	{ class: "text text--uppercase", text: "Текст в верхнем регистре" },
	{ class: "date", text: "14 СЕНТЯБРЯ 2025" },
];
</script>

<style lang="scss" scoped>
.styles-page {
	padding: 3rem 0;
	background: $base;
}

.section {
	margin-bottom: 4rem;
	padding: 0 2rem;
}

.colors-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1.5rem;
}

.color-card {
	height: 120px;
	padding: 1rem;
	border: 1px solid rgba($text, 0.1);
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	color: $text;

	&__name {
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	&__value {
		font-size: 0.875rem;
		opacity: 0.8;
	}
}

.typography-examples > * {
	margin-bottom: 1.5rem;
	border-bottom: 1px solid rgba($text, 0.1);
	padding-bottom: 1rem;
}

.button {
	padding: 1rem 2rem;
	background: $highlight;
	color: white;
	border: none;
	font-family: $firstFont;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	cursor: pointer;
	@include smooth;

	&:hover {
		background: darken($highlight, 10%);
	}
}
.component-grid {
	display: grid;
	gap: 3rem;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.buttons-group {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}

pre {
	margin-top: 1rem;
	padding: 1rem;
	background: $surface;
	border: 1px solid $accent;
	font-size: 0.875rem;
}
</style>
