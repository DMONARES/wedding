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
				/>
				<button
					v-if="index > 0"
					type="button"
					@click="removeGuest(index)"
					class="remove-btn"
				>
					×
				</button>
			</div>

			<div class="counter-controls">
				<button
					type="button"
					@click="decreaseGuests"
					:disabled="guests.length <= 1"
					class="counter-btn"
				>
					-
				</button>
				<span class="counter-display"
					>{{ guests.length }} {{ getGuestWord(guests.length) }}</span
				>
				<button
					type="button"
					@click="increaseGuests"
					class="counter-btn"
				>
					+
				</button>
			</div>
		</div>

		<label>
			Комментарий (необязательно):
			<textarea v-model="message" />
		</label>

		<button type="submit" :disabled="loading">
			{{ loading ? "Отправка..." : "Отправить" }}
		</button>

		<p v-if="successMessage" class="success">{{ successMessage }}</p>
		<p v-if="errorMessage" class="error">{{ errorMessage }}</p>
	</form>
</template>

<script setup>
import { ref } from "vue";

const guests = ref([{ name: "" }]);
const message = ref("");
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const increaseGuests = () => {
	guests.value.push({ name: "" });
};

const decreaseGuests = () => {
	if (guests.value.length > 1) {
		guests.value.pop();
	}
};

const removeGuest = (index) => {
	if (guests.value.length > 1) {
		guests.value.splice(index, 1);
	}
};

const getGuestWord = (count) => {
	if (count === 1) return "гость";
	if (count >= 2 && count <= 4) return "гостя";
	return "гостей";
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
				guests: guests.value,
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

<style scoped>
.form {
	display: flex;
	flex-direction: column;
	gap: 20px;
	max-width: 500px;
	margin: 0 auto;
}

.guests-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.section-title {
	font-weight: bold;
	font-size: 16px;
}

.guest-input {
	display: flex;
	align-items: center;
	gap: 8px;
}

.guest-input input {
	flex: 1;
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #ccc;
	font-family: inherit;
	font-size: 16px;
}

.remove-btn {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 1px solid #ff4444;
	background: #ff4444;
	color: white;
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s ease;
}

.remove-btn:hover {
	background: #cc3333;
}

.counter-controls {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
	margin-top: 8px;
}

.counter-btn {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 2px solid #2f3e46;
	background: white;
	color: #2f3e46;
	font-size: 20px;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.counter-btn:hover:not(:disabled) {
	background: #2f3e46;
	color: white;
}

.counter-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.counter-display {
	font-weight: bold;
	font-size: 16px;
	min-width: 100px;
	text-align: center;
}

textarea {
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #ccc;
	font-family: inherit;
	font-size: 16px;
	min-height: 80px;
	resize: vertical;
}

button[type="submit"] {
	padding: 12px;
	background-color: #2f3e46;
	color: white;
	font-weight: bold;
	border: none;
	border-radius: 10px;
	cursor: pointer;
	transition: background 0.2s ease;
}

button[type="submit"]:disabled {
	background: #aaa;
	cursor: not-allowed;
}

.success {
	color: green;
	font-weight: bold;
}

.error {
	color: red;
	font-weight: bold;
}
</style>
