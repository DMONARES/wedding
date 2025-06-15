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

			<button
				v-if="variant === 'removable'"
				type="button"
				@click="$emit('remove')"
				class="ui-input__remove-btn"
				:class="{
					'ui-input__remove-btn--focused': isFocused,
				}"
			>
				<svg viewBox="0 0 24 24" width="16" height="16">
					<path
						fill="currentColor"
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
					/>
				</svg>
			</button>
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
	margin-bottom: 1.5rem;

	&__label {
		display: block;
		margin-bottom: 0.5rem;
		font-family: "Playfair Display", serif;
		font-size: 1.1rem;
		color: $text;
		font-weight: 500;
	}

	&__container {
		position: relative;
	}

	&__field-wrapper {
		position: relative;
	}

	&__field {
		width: 100%;
		padding: 1.2rem 1.5rem;
		border: 1px solid $accent;
		background: $surface;
		font-family: "Avenir Next Cyr", sans-serif;
		font-size: 1.1rem;
		line-height: 1.5;
		color: $text;
		transition: all 0.3s ease;

		&--textarea {
			min-height: 150px;
			resize: vertical;
		}

		&:focus {
			outline: none;
			border-color: $highlight;
			box-shadow: 0 0 0 2px rgba($highlight, 0.2);
		}
	}

	&__placeholder {
		position: absolute;
		left: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		color: $gray;
		font-size: 1.1rem;
		line-height: 1.5;
		pointer-events: none;
		transition: all 0.3s ease;
		background: transparent;
		padding: 0 0.5rem;
		font-family: "Avenir Next Cyr", sans-serif;
		z-index: 1; /* Исправление обрезания плейсхолдера */

		&--active {
			top: 0;
			transform: translateY(-50%);
			font-size: 0.9rem;
			color: $highlight;
			background: $surface; /* Важно для перекрытия границы */
			padding: 0 0.3rem;
			z-index: 2;
		}
	}

	&__field--textarea + &__placeholder {
		top: 1.5rem;
		transform: none;

		&--active {
			top: 0;
			transform: translateY(-50%);
		}
	}

	&__remove-btn {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: $gray;
		transition: all 0.3s ease;
		border-radius: 50%;

		svg {
			transition: all 0.3s ease;
		}

		&--focused {
			color: $highlight;
		}

		&:hover {
			color: $text;
			background: rgba($highlight, 0.1);
		}
	}

	/* Адаптив для плейсхолдера */
	@media (max-width: 768px) {
		&__placeholder {
			font-size: 1rem;

			&--active {
				font-size: 0.8rem;
			}
		}

		&__field {
			padding: 1rem;
			font-size: 1rem;
		}
	}
}
</style>
