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
	padding: 1rem 2rem;
	border: none;
	font-family: $firstFont;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	cursor: pointer;
	@include smooth;

	&--primary {
		background: $highlight;
		color: white;

		&:hover {
			background: adjust-color($surface, $lightness: -10%);
		}
	}

	&--secondary {
		background: $accent;
		color: $text;
	}

	&--icon {
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}
}
</style>
