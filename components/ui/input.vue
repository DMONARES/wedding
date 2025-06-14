<template>
	<div class="ui-input">
		<label v-if="label" class="ui-input__label">{{ label }}</label>
		<div class="ui-input__container">
			<div class="ui-input__field-wrapper">
				<input
					v-if="type !== 'textarea'"
					:type="type"
					:value="modelValue"
					@input="$emit('update:modelValue', $event.target.value)"
					@focus="handleFocus"
					@blur="handleBlur"
					class="ui-input__field"
					:class="{
						'ui-input__field--filled': hasValue || isFocused,
					}"
				/>
				<textarea
					v-else
					:value="modelValue"
					@input="$emit('update:modelValue', $event.target.value)"
					@focus="handleFocus"
					@blur="handleBlur"
					class="ui-input__field ui-input__field--textarea"
					:class="{
						'ui-input__field--filled': hasValue || isFocused,
					}"
				></textarea>

				<span
					class="ui-input__placeholder"
					:class="{
						'ui-input__placeholder--active': hasValue || isFocused,
					}"
				>
					{{ placeholder }}
				</span>
			</div>

			<div v-if="$slots.suffix" class="ui-input__suffix">
				<slot name="suffix"></slot>
			</div>

			<button
				v-if="variant === 'removable'"
				type="button"
				@click="$emit('remove')"
				class="ui-input__remove-btn"
				:class="{
					'ui-input__remove-btn--focused': isFocused,
				}"
			></button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	modelValue: String,
	label: String,
	placeholder: String,
	type: {
		type: String,
		default: "text",
	},
	variant: {
		type: String,
		default: "default",
	},
});

const emit = defineEmits(["update:modelValue", "remove"]);

const isFocused = ref(false);

const hasValue = computed(() => {
	return props.modelValue && props.modelValue.trim().length > 0;
});

const handleFocus = () => {
	isFocused.value = true;
};

const handleBlur = () => {
	isFocused.value = false;
};
</script>

<style lang="scss" scoped>
.ui-input {
	&__label {
		display: block;
		margin-bottom: 8px;
		font-weight: 500;
		color: $text;
	}

	&__container {
		position: relative;
	}

	&__field-wrapper {
		position: relative;
	}

	&__field {
		width: 100%;
		padding: 16px;
		border: 1px solid $accent;
		background: $surface;
		font-family: $firstFont;
		font-size: 16px;
		line-height: 24px;
		@include smooth;

		&--textarea {
			min-height: 120px;
			resize: none;
		}

		&:focus {
			outline: none;
			border-color: $highlight;
		}
	}

	&__placeholder {
		position: absolute;
		left: 16px;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
		font-size: 16px;
		line-height: 24px;
		pointer-events: none;
		transition: all 0.2s ease;
		background: $surface;
		padding: 0 4px;

		&--active {
			top: 0;
			transform: translateY(-50%);
			font-size: 12px;
			color: $highlight;
		}
	}

	&__field--textarea + &__placeholder {
		top: 16px;
		transform: none;

		&.ui-input__placeholder--active {
			top: 0;
			transform: translateY(-50%);
		}
	}

	&__suffix {
		position: absolute;
		right: 16px;
		top: 50%;
		transform: translateY(-50%);
	}

	&__remove-btn {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 58px;
		height: 58px;
		border: none;
		background: #efece7;
		border: 1px solid $accent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		@include smooth;

		&--focused {
			border-color: $highlight;
		}

		&::before {
			content: "";
			font-size: 18px;
			color: #999;
			width: 20px;
			height: 3px;
			background-color: $highlight;
			line-height: 1;
		}

		&:hover {
			&::before {
				color: $text;
			}
		}
	}
}
</style>
