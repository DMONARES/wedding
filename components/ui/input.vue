<template>
	<div class="ui-input">
		<label v-if="label" class="ui-input__label">{{ label }}</label>
		<div class="ui-input__container">
			<input
				v-if="type !== 'textarea'"
				:type="type"
				:placeholder="placeholder"
				class="ui-input__field"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value)"
			/>
			<textarea
				v-else
				:placeholder="placeholder"
				class="ui-input__field"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value)"
			></textarea>
			<div v-if="$slots.suffix" class="ui-input__suffix">
				<slot name="suffix"></slot>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	modelValue: String,
	label: String,
	placeholder: String,
	type: {
		type: String,
		default: "text",
	},
});

defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.ui-input {
	margin-bottom: 1.5rem;

	&__label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: $text;
	}

	&__container {
		position: relative;
	}

	&__field {
		width: 100%;
		padding: 1rem;
		border: 1px solid $accent;
		background: $surface;
		font-family: $firstFont;
		@include smooth;

		&:focus {
			outline: none;
			border-color: $highlight;
		}
	}

	&__suffix {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
