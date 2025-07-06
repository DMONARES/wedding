<template>
	<form @submit.prevent="handleSubmit" class="form">
		<h2 class="section-title">Подтвердите присутствие</h2>

		<div class="form-content">
			<div class="guests-section">
				<div class="guests-header">
					<div class="guests-label">
						<p>Ваши данные</p>
						<!-- <p class="hint">
							Добавьте гостей, которые придут с вами
						</p> -->
					</div>

					<!-- <div class="counter-wrapper">
						<UiCounter
							:value="guests.length"
							:min="1"
							:max="10"
							:disabled-plus="guests.length >= 10"
							@increase="addGuest"
							@decrease="removeLastGuest"
						/>
						<span class="counter-label">Количество гостей</span>
					</div> -->
				</div>

				<div class="guests-list">
					<TransitionGroup name="guest" tag="div">
						<div
						v-for="(guest, index) in guests"
							:key="index"
							class="guest-input-wrapper"
						>
							<div class="guest-input-container">
								<UiInput
									v-model="guest.name"
									:placeholder="
										index === 0 ? 'Ваше ФИО' : 'ФИО гостя'
									"
									class="guest-input"
									:variant="
										index === 0 ? 'default' : 'removable'
									"
									@remove="removeGuest(index)"
								/>
							</div>
						</div>
					</TransitionGroup>
				</div>
			</div>

			<div class="form-group">
				<UiInput
					v-model="message"
					placeholder="Комментарий"
					type="textarea"
				/>
			</div>

			<UiButton type="submit" class="form-submit" :disabled="loading">
				{{ loading ? "Отправка..." : "Отправить" }}
			</UiButton>

			<div v-if="isSuccess" class="success-overlay">
				<div class="success-content">
					<svg viewBox="0 0 24 24" width="64" height="64">
						<path
							fill="$highlight"
							d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
						/>
					</svg>
					<h3>Спасибо за подтверждение!</h3>
					<p>Ваше присутствие успешно подтверждено</p>
					<p class="countdown">
						Форма закроется через {{ countdown }} сек
					</p>
				</div>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useApi } from "@/composables/useApi";

const { sendForm, loading } = useApi();

const guests = ref([{ name: "" }]);
const message = ref("");
const isSuccess = ref(false);
const countdown = ref(5);
let timer: NodeJS.Timeout | null = null;

const addGuest = () => {
	if (guests.value.length < 10) {
		guests.value.push({ name: "" });
	}
};

const removeLastGuest = () => {
	if (guests.value.length > 1) {
		guests.value.pop();
	}
};

const removeGuest = (index: number) => {
	if (index > 0 && guests.value.length > 1) {
		guests.value.splice(index, 1);
	}
};

watch(
	() => guests.value.length,
	(newCount) => {
		if (newCount < 1) guests.value = [{ name: "" }];
		if (newCount > 10) guests.value.splice(10);
	}
);

const startSuccessTimer = () => {
	countdown.value = 5;
	if (timer) clearInterval(timer);
	timer = setInterval(() => {
		countdown.value--;
		if (countdown.value <= 0) {
			isSuccess.value = false;
			clearInterval(timer!);
		}
	}, 1000);
};

const handleSubmit = async () => {
	try {
		const validGuests = guests.value.map((g) => ({
			name: g.name.trim() || "Без имени",
		}));
		await sendForm(validGuests, message.value.trim());

		isSuccess.value = true;
		startSuccessTimer();

		guests.value = [{ name: "" }];
		message.value = "";
	} catch (e) {
		console.error(e);
	}
};
</script>

<style lang="scss" scoped>
.form {
	max-width: 700px;
	margin: 0 auto;
	padding: 3rem 2.5rem;
	background: $surface;
	border: 1px solid $accent;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	position: relative;
	overflow: hidden;
}

.section-title {
	font-family: "Playfair Display", serif;
	font-size: clamp(1.8rem, 3vw, 2.2rem);
	color: $text;
	margin-bottom: 1.5rem;
	position: relative;
	text-align: center;
	font-weight: 500;

	&::after {
		content: "";
		display: block;
		width: 80px;
		height: 2px;
		background: $accent;
		margin: 1rem auto 0;
	}
}

.form-content {
	display: flex;
	flex-direction: column;
	gap: 1.2rem;
}

.guests-section {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
}

.guests-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 0.8rem;
	flex-wrap: wrap;
	gap: 0.8rem;
}

.guests-label {
	p {
		font-family: "Avenir Next Cyr", sans-serif;
		font-size: 1.1rem;
		color: $text;
		margin: 0;

		&.hint {
			font-size: 0.85rem;
			opacity: 0.7;
			margin-top: 0.1rem;
		}
	}
}

.counter-wrapper {
	display: flex;
	align-items: center;
	gap: 0.8rem;
}

.counter-label {
	font-family: "Avenir Next Cyr", sans-serif;
	font-size: 1rem;
	color: $text;
	opacity: 0.9;
}

.guest-input-wrapper {
	width: 100%;

	&:first-child {
		margin-top: 10px;
	}
}

.guest-input-container {
	position: relative;
	margin-bottom: 0.3rem;
}

.guests-list {
	max-height: 50vh;
	overflow-y: auto;
	padding-right: 0.5rem;

	/* Стили для скроллбара */
	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-track {
		background: rgba($accent, 0.1);
	}

	&::-webkit-scrollbar-thumb {
		background: rgba($highlight, 0.4);
		border-radius: 2px;

		&:hover {
			background: $highlight;
		}
	}
}

.form-group {
	margin-top: 0.5rem;
}

.form-submit {
	margin-top: 0.5rem;
	align-self: center;
	min-width: 200px;
}

.success-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba($surface, 0.95);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	padding: 2rem;
	animation: fadeIn 0.5s ease;
}

.success-content {
	text-align: center;
	max-width: 400px;

	svg {
		margin-bottom: 1rem;
	}

	h3 {
		font-family: "Playfair Display", serif;
		font-size: 1.6rem;
		color: $text;
		margin-bottom: 0.8rem;
	}

	p {
		font-family: "Avenir Next Cyr", sans-serif;
		font-size: 1rem;
		color: $text;
		opacity: 0.9;
		line-height: 1.5;

		&.countdown {
			margin-top: 1.5rem;
			font-size: 0.85rem;
			opacity: 0.7;
		}
	}
}

/* Анимации */
.guest-move,
.guest-enter-active,
.guest-leave-active {
	transition: all 0.5s ease;
	width: 100%;
}

.guest-enter-from,
.guest-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.guest-leave-active {
	position: absolute;
	width: 100%;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/* Адаптив */
@media (max-width: 768px) {
	.form {
		padding: 1.8rem 1.5rem;
	}

	.guests-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.counter-wrapper {
		width: 100%;
		justify-content: space-between;
	}

	.section-title {
		text-align: left;
		font-size: 1.6rem;

		&::after {
			margin-left: 0;
		}
	}

	.guests-list {
		max-height: 40vh;
	}

	.guests-label p {
		font-size: 1rem;

		&.hint {
			font-size: 0.75rem;
		}
	}

	.counter-label {
		font-size: 0.9rem;
	}
}

@media (max-width: 480px) {
	.form {
		padding: 1.5rem 1.2rem;
	}

	.guests-label p {
		font-size: 0.95rem;
	}

	.success-content {
		h3 {
			font-size: 1.4rem;
		}

		p {
			font-size: 0.9rem;
		}
	}
}
</style>
