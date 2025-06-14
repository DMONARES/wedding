<template>
	<div class="ui-counter">
		<button
			class="ui-counter__button"
			@click="$emit('increase')"
			:disabled="disabledPlus"
		>
			+
		</button>
		<span class="ui-counter__value">{{ value }} {{ guestWord }}</span>
		<button
			class="ui-counter__button"
			@click="$emit('decrease')"
			:disabled="value <= min"
		>
			−
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

const guestWord = computed(() => {
	const count = props.value; // Используем props.value
	if (count === 1) return "гость";
	if (count >= 2 && count <= 4) return "гостя";
	return "гостей";
});
</script>

<style lang="scss" scoped>
.ui-counter {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;

	&__button {
		width: 2.5rem;
		height: 2.5rem;
		background: $surface;
		border: 1px solid $accent;
		font-size: 1.25rem;
		cursor: pointer;
		@include smooth;

		&:hover:not(:disabled) {
			background: $highlight;
			color: white;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	&__value {
		min-width: 6rem;
		text-align: center;
		font-weight: 500;
	}
}
</style>
