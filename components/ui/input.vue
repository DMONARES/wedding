<template>
	<div class="ui-input">
		<label v-if="label" class="ui-input__label">{{ label }}</label>
		<input
			:type="type"
			:placeholder="placeholder"
			class="ui-input__field"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
		/>
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
}
</style>
