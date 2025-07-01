<template>
	<transition name="ui-modal-fade">
		<div v-if="modelValue" class="ui-modal" @mousedown.self="close">
			<div class="ui-modal__content">
				<button
					class="ui-modal__close"
					@click="close"
					aria-label="Закрыть"
				>
					&times;
				</button>
				<slot />
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

function close() {
	emit("update:modelValue", false);
}
</script>

<style lang="scss" scoped>
.ui-modal {
	position: fixed;
	z-index: 1000;
	inset: 0;
	background: rgba(30, 30, 30, 0.32);
	display: flex;
	align-items: center;
	justify-content: center;
	animation: ui-modal-fadein 0.2s;

	&__content {
		background: #fff;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
		padding: 2.2rem 2rem 1.5rem;
		min-width: 320px;
		max-width: 95vw;
		min-height: 80px;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 1.2rem;
	}
	&__close {
		position: absolute;
		top: 1.1rem;
		right: 1.1rem;
		background: none;
		border: none;
		font-size: 2rem;
		color: $accent;
		cursor: pointer;
		transition: color 0.2s;
		&:hover {
			color: darken($accent, 10%);
		}
	}
}

.ui-modal-fade-enter-active,
.ui-modal-fade-leave-active {
	transition: opacity 0.18s;
}
.ui-modal-fade-enter-from,
.ui-modal-fade-leave-to {
	opacity: 0;
}

@keyframes ui-modal-fadein {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
