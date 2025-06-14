<template>
	<div class="ui-counter">
		<button
			class="ui-counter__button"
			@click="$emit('decrease')"
			:disabled="value <= min"
			type="button"
		>
			−
		</button>
		<div class="ui-counter__value">
			{{ value }}
		</div>
		<button
			class="ui-counter__button"
			@click="$emit('increase')"
			:disabled="disabledPlus"
			type="button"
		>
			+
		</button>
	</div>
</template>

<script setup>
const props = defineProps({
	value: {
		type: Number,
		required: true,
	},
	min: {
		type: Number,
		default: 1,
	},
	max: {
		type: Number,
		default: Infinity,
	},
	disabledPlus: {
		type: Boolean,
		default: false,
	},
});

defineEmits(["increase", "decrease"]);
</script>

<style lang="scss" scoped>
.ui-counter {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;

	&__button {
		width: 3rem;
		height: 3rem;
		background: $surface;
		border: 1px solid $accent;
		font-size: 1.5rem;
		font-weight: 500;
		color: $text;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		font-family: $firstFont;

		&:hover:not(:disabled) {
			background: $highlight;
			color: $white;
			border-color: $highlight;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			color: $gray;
		}
	}

	&__value {
		width: 3rem;
		height: 3rem;
		background: $surface;
		border: 1px solid $accent;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.125rem;
		font-weight: 500;
		color: $text;
		font-family: $firstFont;
	}
}
</style>
