<template>
	<form @submit.prevent="handleSubmit" class="form">
		<div class="guests-section">
			<label class="section-title">Гости:</label>

			<div
				v-for="(guest, index) in guests"
				:key="index"
				class="guest-input-wrapper"
			>
				<div class="guest-input-container">
					<UiInput
						v-model="guest.name"
						:placeholder="`Имя гостя ${index + 1}${
							index === 0 ? ' (основной)' : ''
						}`"
						class="guest-input"
						:class="{ 'has-remove': index > 0 }"
					>
						<template v-if="index > 0" #suffix>
							<button
								type="button"
								@click.stop="removeGuest(index)"
								class="guest-input__remove"
							>
								—
							</button>
						</template>
					</UiInput>
				</div>
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
			<UiInput
				v-model="message"
				placeholder="Комментарий (необязательно)"
				type="textarea"
			/>
		</div>

		<button type="submit" class="form-submit" :disabled="loading">
			{{ loading ? "Отправка..." : "Подтвердить присутствие" }}
		</button>

		<div v-if="successMessage" class="form-message form-message--success">
			{{ successMessage }}
		</div>
	</form>
</template>

<script setup>
const guests = ref([{ name: "" }]);
const message = ref("");
const loading = ref(false);
const successMessage = ref("");

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

	// Удаляем пустые поля гостей (кроме основного)
	const cleanedGuests = [
		guests.value[0],
		...guests.value.slice(1).filter((g) => g.name.trim() !== ""),
	];

	// Проверка основного гостя
	if (!cleanedGuests[0]?.name?.trim()) {
		loading.value = false;
		return;
	}

	try {
		const res = await $fetch("/api/send", {
			method: "POST",
			body: {
				guests: cleanedGuests,
				message: message.value,
			},
		});

		if (res.ok) {
			successMessage.value = "Ваше присутствие подтверждено! Ждём вас ❤️";
			guests.value = [{ name: "" }];
			message.value = "";
		}
	} catch (err) {
		console.error(err);
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
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
	margin-bottom: 0.5rem;
}

.guest-input-container {
	position: relative;
}

:deep(.guest-input.has-remove) {
	.ui-input__field {
		padding-right: 3rem;
	}
}

.guest-input__remove {
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%);
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	color: $gray;
	font-size: 1.2rem;
	cursor: pointer;
	@include smooth;

	&:hover {
		color: $red;
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
	padding: 1rem;
	margin-top: 1rem;

	&--success {
		color: $highlight;
		background: rgba($highlight, 0.1);
	}
}
</style>
