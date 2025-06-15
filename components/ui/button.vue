<template>
	<button
		:class="['ui-button', `ui-button--${variant}`]"
		@click="$emit('click')"
	>
		<slot />
	</button>
</template>

<script setup>
defineProps({
	variant: {
		type: String,
		default: "primary",
		validator: (val) => ["primary", "secondary", "icon"].includes(val),
	},
});

defineEmits(["click"]);
</script>

<style lang="scss" scoped>
.ui-button {
	padding: 1rem 2.5rem;
	border: none;
	font-family: "Playfair Display", serif;
	font-size: 1.1rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	z-index: 1;

	&::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		transition: transform 0.3s ease;
	}

	&--primary {
		background: transparent;
		color: $text;
		border: 1px solid $highlight;

		&::after {
			background: $highlight;
			transform: translateY(100%);
		}

		&:hover {
			background-color: #8a6f8f;
			color: white;

			&::after {
				transform: translateY(0);
			}
		}
	}

	&--secondary {
		background: $surface;
		color: $text;
		border: 1px solid $highlight;

		&:hover {
			background: $highlight;
			color: white;
			border-color: $highlight;
		}
	}

	&--icon {
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border-radius: 50%;
		background: var(--surface);
		border: 1px solid $highlight;

		&:hover {
			background: $highlight;
			color: white;
			border-color: $highlight;
		}
	}
}
</style>
