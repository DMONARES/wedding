<template>
	<form @submit.prevent="handleSubmit" class="form">
		<label>
			Ваше имя:
			<input v-model="name" required type="text" />
		</label>

		<label>
			Сколько человек придёт:
			<input v-model="count" required type="number" min="1" />
		</label>

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

const name = ref("");
const count = ref("");
const message = ref("");
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
	loading.value = true;
	successMessage.value = "";
	errorMessage.value = "";

	try {
		const res = await fetch("/api/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: name.value,
				count: count.value,
				message: message.value,
			}),
		});

		const data = await res.json();

		if (data.ok) {
			successMessage.value = "Спасибо! Заявка отправлена 💌";
			name.value = "";
			count.value = "";
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
	gap: 12px;
	max-width: 500px;
	margin: 0 auto;
}

input,
textarea {
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #ccc;
	font-family: inherit;
	font-size: 16px;
}

button {
	padding: 12px;
	background-color: #2f3e46;
	color: white;
	font-weight: bold;
	border: none;
	border-radius: 10px;
	cursor: pointer;
	transition: background 0.2s ease;
}

button:disabled {
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
