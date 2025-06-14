<template>
	<form @submit.prevent="handleSubmit" class="form">
		<div class="guests-section">
			<label class="section-title">Гости:</label>

			<div
				v-for="(guest, index) in guests"
				:key="index"
				class="guest-input"
			>
				<input
					v-model="guest.name"
					:placeholder="`Имя гостя ${index + 1}${
						index === 0 ? ' (основной)' : ''
					}`"
					required
					type="text"
					class="guest-input__field"
				/>
				<button
					v-if="index > 0"
					type="button"
					@click="removeGuest(index)"
					class="guest-input__remove"
				>
					×
				</button>
			</div>

			<UiCounter
				:value="guests.length"
				:min="1"
				:max="10"
				:disabled-plus="guests.length >= 10"
				@increase="addGuest"
				@decrease="removeLastGuest"
			/>
		</div>

		<div class="form-group">
			<label class="form-label">Комментарий (необязательно):</label>
			<textarea v-model="message" class="form-textarea" />
		</div>

		<button type="submit" class="form-submit" :disabled="loading">
			{{ loading ? "Отправка..." : "Отправить" }}
		</button>

		<p v-if="successMessage" class="form-message form-message--success">
			{{ successMessage }}
		</p>
		<p v-if="errorMessage" class="form-message form-message--error">
			{{ errorMessage }}
		</p>
	</form>
</template>

<script setup>
import { ref } from "vue";
const guests = ref([{ name: "" }]);
const message = ref("");
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

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

const removeGuest = (index) => {
	if (guests.value.length > 1) {
		guests.value.splice(index, 1);
	}
};

const handleSubmit = async () => {
	loading.value = true;
	successMessage.value = "";
	errorMessage.value = "";

	try {
		const res = await fetch("/api/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				guests: guests.value.filter((g) => g.name.trim() !== ""),
				message: message.value,
			}),
		});

		const data = await res.json();
		if (data.ok) {
			successMessage.value = "Спасибо! Заявка отправлена 💌";
			guests.value = [{ name: "" }];
			message.value = "";
		} else {
			throw new Error(data.error || "Ошибка отправки");
		}
	} catch (err) {
		errorMessage.value = "Ошибка при отправке. Попробуйте позже.";
		console.error(err);
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
/* Стили остаются без изменений */
.form {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	max-width: 500px;
	margin: 0 auto;
	padding: 2rem;
	background: $surface;
	border: 1px solid $accent;
}

.guests-section {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.section-title {
	font-weight: 700;
	font-size: 1.125rem;
	color: $text;
}

.guest-input {
	display: flex;
	align-items: center;
	gap: 0.5rem;

	&__field {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid $accent;
		background: $base;
		font-family: $firstFont;
		@include smooth;

		&:focus {
			outline: none;
			border-color: $highlight;
		}
	}

	&__remove {
		width: 2rem;
		height: 2rem;
		border: 1px solid $red;
		background: $red;
		color: white;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		@include smooth;

		&:hover {
			background: darken($red, 10%);
		}
	}
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-label {
	font-weight: 500;
	color: $text;
}

.form-textarea {
	padding: 0.75rem;
	min-height: 6rem;
	border: 1px solid $accent;
	background: $base;
	font-family: $firstFont;
	resize: vertical;
	@include smooth;

	&:focus {
		outline: none;
		border-color: $highlight;
	}
}

.form-submit {
	padding: 1rem;
	background: $highlight;
	color: white;
	border: none;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	cursor: pointer;
	@include smooth;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&:hover:not(:disabled) {
		background: darken($highlight, 10%);
	}
}

.form-message {
	font-weight: 500;
	text-align: center;

	&--success {
		color: darken(green, 10%);
	}

	&--error {
		color: $red;
	}
}
</style>
