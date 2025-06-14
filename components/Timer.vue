<template>
	<client-only>
		<div class="timer">
			<div
				v-for="(item, idx) in timeParts"
				:key="item.label"
				class="timer-part"
			>
				<div class="digits">
					<transition name="digit-flip" mode="out-in">
						<span
							class="digit-box"
							:key="item.value[0] + '-left-' + item.label"
						>
							{{ item.value[0] }}
						</span>
					</transition>
					<span class="digit-separator"></span>
					<transition name="digit-flip" mode="out-in">
						<span
							class="digit-box"
							:key="item.value[1] + '-right-' + item.label"
						>
							{{ item.value[1] }}
						</span>
					</transition>
				</div>
				<span class="label">{{ item.label }}</span>
			</div>
		</div>
	</client-only>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const endDate = new Date("2025-08-01T00:00:00");
const now = ref(new Date());
let timer;

const getTimeLeft = () => {
	const diff = endDate - now.value;
	const total = Math.max(0, diff);
	const days = Math.floor(total / (1000 * 60 * 60 * 24));
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((total / (1000 * 60)) % 60);
	const seconds = Math.floor((total / 1000) % 60);
	return { days, hours, minutes, seconds };
};

const timeLeft = ref(getTimeLeft());

const pad = (num, len = 2) => String(num).padStart(len, "0");

const timeParts = computed(() => [
	{ label: "дней", value: pad(timeLeft.value.days, 2).split("") },
	{ label: "часов", value: pad(timeLeft.value.hours, 2).split("") },
	{ label: "минут", value: pad(timeLeft.value.minutes, 2).split("") },
	{ label: "секунд", value: pad(timeLeft.value.seconds, 2).split("") },
]);

onMounted(() => {
	timer = setInterval(() => {
		now.value = new Date();
		timeLeft.value = getTimeLeft();
	}, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped lang="scss">
.timer {
	display: flex;
	gap: 16px;
	justify-content: center;
	align-items: flex-end;
}
.timer-part {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.digits {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 90px;
}
.digit-box {
	display: inline-block;
	width: 36px;
	height: 48px;
	background: #000;
	font-size: 2rem;
	font-weight: bold;
	color: #fff;
	margin: 0;
	text-align: center;
	line-height: 48px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
	transition: background 0.2s;
	overflow: hidden;
	vertical-align: top;
}
.digit-separator {
	position: relative;

	&:after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		width: 10px;
		height: 100%;
		background-color: #000;
		z-index: 100;
	}
}
.label {
	font-size: 0.75rem;
	color: #888;
	margin-top: 4px;
	letter-spacing: 0.05em;
}

/* Анимация смены цифр */
.digit-flip-enter-active,
.digit-flip-leave-active {
	transition: transform 0.3s, opacity 0.3s;
}
.digit-flip-enter-from {
	transform: translateY(-100%);
	opacity: 0;
}
.digit-flip-enter-to {
	transform: translateY(0);
	opacity: 1;
}
.digit-flip-leave-from {
	transform: translateY(0);
	opacity: 1;
}
.digit-flip-leave-to {
	transform: translateY(100%);
	opacity: 0;
}
</style>
