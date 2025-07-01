<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useGuests } from "@/composables/useGuests";
import UiModal from "@/components/UiModal.vue";
import TrashIcon from "@/components/icons/trash.vue";

const { guests, loading, error, fetchGuests, deleteGuest, deleting } =
	useGuests();

onMounted(() => {
	fetchGuests();
});

// guests.value = [{ group_id, main_guest, main_guest_id, comment, companions: [{id, name}, ...] }]
function getGroups() {
	if (!Array.isArray(guests.value)) return [];
	return guests.value.map((group: any) => {
		const all = [
			{ id: group.main_guest_id, name: group.main_guest, isMain: true },
			...(group.companions || []).map((c: any) => ({
				id: c.id,
				name: c.name,
				isMain: false,
			})),
		];
		return {
			guests: all,
			comment: group.comment,
			groupId: group.group_id,
			mainGuestId: group.main_guest_id,
			mainGuestName: group.main_guest,
			allGuestIds: [
				group.main_guest_id,
				...group.companions.map((c) => c.id),
			],
		};
	});
}

const totalGuests = computed(() => {
	if (!Array.isArray(guests.value)) return 0;
	return guests.value.reduce(
		(sum, group) => sum + 1 + (group.companions?.length || 0),
		0
	);
});

// Модалка подтверждения удаления
const showModal = ref(false);
const deleteTarget = ref<{
	id?: number | string;
	type: "group" | "guest";
	name: string;
	allGuestIds?: (number | string)[];
} | null>(null);

function askDeleteGroup(group: any) {
	deleteTarget.value = {
		type: "group",
		name: group.mainGuestName,
		allGuestIds: group.allGuestIds,
	};
	showModal.value = true;
}
function askDeleteGuest(guestId: number, guestName: string) {
	deleteTarget.value = { id: guestId, type: "guest", name: guestName };
	showModal.value = true;
}
async function confirmDelete() {
	if (!deleteTarget.value) return;
	if (deleteTarget.value.type === "group" && deleteTarget.value.allGuestIds) {
		for (const id of deleteTarget.value.allGuestIds) {
			await deleteGuest(id);
		}
	} else if (deleteTarget.value.type === "guest" && deleteTarget.value.id) {
		await deleteGuest(deleteTarget.value.id);
	}
	showModal.value = false;
	deleteTarget.value = null;
}
function cancelDelete() {
	showModal.value = false;
	deleteTarget.value = null;
}
</script>

<template>
	<div class="guests-page">
		<div class="guests-page__header">
			<h2 class="guests-page__title">Список гостей</h2>
			<div class="guests-page__counter">
				Гостей всего:
				<span class="guests-page__counter-value">{{
					totalGuests
				}}</span>
			</div>
		</div>
		<div v-if="loading" class="guests-page__loading">Загрузка...</div>
		<div v-else-if="error" class="guests-page__error">{{ error }}</div>
		<div v-else>
			<div class="guests-page__table-wrapper">
				<table class="guests-page__table">
					<thead>
						<tr class="guests-page__row guests-page__row--head">
							<th
								class="guests-page__cell guests-page__cell--head"
							>
								ФИО гостей
							</th>
							<th
								class="guests-page__cell guests-page__cell--head"
							>
								Кол-во гостей
							</th>
							<th
								class="guests-page__cell guests-page__cell--head"
							>
								Комментарий
							</th>
						</tr>
					</thead>
					<tbody>
						<template
							v-for="(group, groupIdx) in getGroups()"
							:key="groupIdx"
						>
							<tr
								v-for="(guest, idx) in group.guests"
								:key="guest.id + '-' + idx"
								:class="[
									'guests-page__row',
									guest.isMain
										? 'guests-page__row--main'
										: '',
									groupIdx !== 0 && idx === 0
										? 'guests-page__row--separator'
										: '',
								]"
								:style="
									idx === 0 && groupIdx !== 0
										? {
												'border-top':
													'2px solid var(--accent, #2a2a2a)',
										  }
										: {}
								"
							>
								<td
									:class="[
										'guests-page__cell',
										guest.isMain
											? 'guests-page__cell--main'
											: '',
									]"
								>
									<div
										class="guests-page__cell-content guests-page__cell-content--minimal"
									>
										<span class="guests-page__cell-name">{{
											guest.name
										}}</span>
										<span
											class="guests-page__cell-spacer"
										></span>
										<!-- Кнопка удаления основного гостя (только у основного гостя) -->
										<button
											v-if="guest.isMain"
											class="guests-page__icon-btn guests-page__icon-btn--delete"
											:title="`Удалить только основного гостя (${guest.name})`"
											@click="
												askDeleteGuest(
													guest.id,
													guest.name
												)
											"
											:disabled="deleting"
										>
											<TrashIcon />
										</button>
										<!-- Кнопка удаления обычного гостя (только у обычных гостей) -->
										<button
											v-if="!guest.isMain"
											class="guests-page__icon-btn guests-page__icon-btn--delete"
											:title="`Удалить гостя (${guest.name})`"
											@click="
												askDeleteGuest(
													guest.id,
													guest.name
												)
											"
											:disabled="deleting"
										>
											<TrashIcon />
										</button>
										<!-- Кнопка удаления всей группы (отдельная, справа у основного гостя) -->
										<button
											v-if="guest.isMain"
											class="guests-page__icon-btn guests-page__icon-btn--delete guests-page__icon-btn--group"
											:title="`Удалить всю группу (${guest.name}) и всех её гостей`"
											@click="askDeleteGroup(group)"
											:disabled="deleting"
											style="margin-left: 0.7em;"
										>
											<TrashIcon />
										</button>
									</div>
								</td>
								<td
									v-if="idx === 0"
									:rowspan="group.guests.length"
									class="guests-page__cell guests-page__cell--count"
								>
									{{ group.guests.length }}
								</td>
								<td
									v-if="idx === 0"
									:rowspan="group.guests.length"
									class="guests-page__cell guests-page__cell--comment"
								>
									{{ group.comment || "—" }}
								</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
		<UiModal v-model="showModal">
			<template v-if="deleteTarget">
				<div class="guests-page__modal-minimal">
					<div class="guests-page__modal-icon">
						<svg
							width="38"
							height="38"
							viewBox="0 0 38 38"
							fill="none"
						>
							<circle cx="19" cy="19" r="19" fill="#fff0f0" />
							<path
								d="M19 11V21"
								stroke="#d32f2f"
								stroke-width="2.2"
								stroke-linecap="round"
							/>
							<circle cx="19" cy="27" r="1.5" fill="#d32f2f" />
						</svg>
					</div>
					<div
						class="guests-page__modal-text guests-page__modal-text--minimal"
					>
						<span v-if="deleteTarget.type === 'group'"
							>Удалить всю группу <b>«{{ deleteTarget.name }}»</b> и всех её
							гостей?</span
						><span v-else
							>Удалить гостя <b>«{{ deleteTarget.name }}»</b>?</span
						>
					</div>
					<div
						class="guests-page__modal-actions guests-page__modal-actions--minimal"
					>
						<button
							class="guests-page__modal-btn guests-page__modal-btn--danger"
							@click="confirmDelete"
							:disabled="deleting"
						>
							{{ deleting ? "Удаление..." : "Удалить" }}
						</button>
						<button
							class="guests-page__modal-btn guests-page__modal-btn--ghost"
							@click="cancelDelete"
							:disabled="deleting"
						>
							Отмена
						</button>
					</div>
				</div>
			</template>
		</UiModal>
	</div>
</template>

<style lang="scss" scoped>
.guests-page {
	max-width: 900px;
	margin: 4rem auto 2rem;
	padding: 2rem 1rem;
	background: $surface;
	border: 1px solid $accent;
	border-radius: 18px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);

	&__header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 2.2rem;
	}

	&__title {
		font-family: "Playfair Display", serif;
		font-size: clamp(1.6rem, 3vw, 2.1rem);
		color: $text;
		text-align: left;
		font-weight: 500;
		margin: 0;
	}

	&__counter {
		font-size: 1.1rem;
		color: $text;
		background: $accent;
		border-radius: 1.2em;
		padding: 0.35em 1.1em;
		font-weight: 500;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		gap: 0.5em;
	}
	&__counter-value {
		font-size: 1.25em;
		font-weight: 700;
		margin-left: 0.3em;
		color: #fff;
	}

	&__table-wrapper {
		overflow-x: auto;
	}

	&__table {
		width: 100%;
		border-collapse: collapse;
		background: $surface;
		min-width: 600px;
		border: 1.5px solid $accent;
		border-radius: 12px;
		overflow: hidden;
	}

	&__row {
		// жирная линия теперь через style на tr
		&--main .guests-page__cell--main {
			font-weight: 700;
			color: $text;
		}
	}

	&__cell {
		padding: 0.85rem 1.1rem;
		text-align: left;
		vertical-align: top;
		font-size: 1.08rem;
		border: 1px solid #e0e0e0;
		background: $surface;
		box-sizing: border-box;

		&--head {
			background: $accent;
			color: #fff;
			font-weight: 600;
			letter-spacing: 0.02em;
			border: 1px solid $accent;
			text-align: left;
			vertical-align: top;
		}
		&--main {
			font-weight: 700;
			color: $text;
		}
		&--count,
		&--comment {
			vertical-align: top;
		}
		&--comment {
			max-width: 260px;
			word-break: break-word;
			font-size: 1rem;
			color: $text;
		}
	}

	&__loading,
	&__error {
		text-align: center;
		margin: 2rem 0;
		color: $accent;
		font-size: 1.2rem;
	}

	&__cell-content {
		display: flex;
		align-items: center;
		gap: 0.7em;
	}
	&__delete-btn {
		background: #fff0f0;
		color: #d32f2f;
		border: 1px solid #d32f2f;
		border-radius: 7px;
		padding: 0.25em 0.8em;
		font-size: 0.98em;
		font-weight: 500;
		margin-left: 0.3em;
		cursor: pointer;
		transition: background 0.18s, color 0.18s, border 0.18s;
		&:hover:not(:disabled) {
			background: #d32f2f;
			color: #fff;
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
		&--group {
			margin-left: 1em;
		}
	}
	// Модалка
	&__modal-title {
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 0.5em;
		color: $text;
	}
	&__modal-text {
		font-size: 1.05rem;
		margin-bottom: 1.2em;
		color: $text;
	}
	&__modal-actions {
		display: flex;
		gap: 1em;
		justify-content: flex-end;
	}
	&__modal-btn {
		padding: 0.5em 1.3em;
		border-radius: 7px;
		border: 1px solid $accent;
		background: $surface;
		color: $accent;
		font-size: 1.05em;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.18s, color 0.18s, border 0.18s;
		&:hover:not(:disabled) {
			background: $accent;
			color: #fff;
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
		&--danger {
			background: #fff0f0;
			color: #d32f2f;
			border: 1px solid #d32f2f;
			&:hover:not(:disabled) {
				background: #d32f2f;
				color: #fff;
			}
		}
	}

	@media (max-width: 700px) {
		padding: 1rem 0.2rem;
		border-radius: 10px;
		&__header {
			flex-direction: column;
			align-items: stretch;
			gap: 0.7em;
		}
		&__table {
			min-width: 400px;
			font-size: 0.98rem;
		}
		&__cell {
			padding: 0.6rem 0.5rem;
		}
		&__title {
			font-size: 1.2rem;
		}
	}

	&__cell-content--minimal {
		display: flex;
		align-items: center;
		gap: 0.3em;
		min-height: 32px;
		position: relative;
	}
	&__cell-name {
		flex: 0 1 auto;
		min-width: 0;
		word-break: break-word;
	}
	&__cell-spacer {
		flex: 1 1 auto;
	}
	&__icon-btn {
		background: none;
		border: none;
		padding: 0.18em;
		border-radius: 50%;
		color: #bdbdbd;
		font-size: 1.1em;
		margin-left: 0.2em;
		cursor: pointer;
		transition: color 0.18s, background 0.18s, opacity 0.18s;
		opacity: 0.3;
		// Показывать ярче только при наведении на строку
		.guests-page__row:hover & {
			opacity: 1;
			color: #d32f2f;
			background: #fff0f0;
		}
		&:hover:not(:disabled) {
			color: #d32f2f;
			background: #fff0f0;
			opacity: 1;
		}
		&:disabled {
			opacity: 0.2;
			cursor: not-allowed;
		}
	}
	// Модалка минимал
	&__modal-minimal {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.1em;
		padding: 0.5em 0.2em 0.2em;
	}
	&__modal-icon {
		margin-bottom: 0.2em;
	}
	&__modal-text--minimal {
		font-size: 1.08rem;
		color: $text;
		text-align: center;
		margin-bottom: 0.2em;
	}
	&__modal-actions--minimal {
		display: flex;
		gap: 0.7em;
		justify-content: center;
	}
	&__modal-btn--danger {
		background: #d32f2f;
		color: #fff;
		border: none;
		border-radius: 7px;
		padding: 0.5em 1.3em;
		font-size: 1.05em;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.18s, color 0.18s;
		&:hover:not(:disabled) {
			background: #b71c1c;
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
	&__modal-btn--ghost {
		background: none;
		color: $text;
		border: none;
		border-radius: 7px;
		padding: 0.5em 1.3em;
		font-size: 1.05em;
		font-weight: 500;
		cursor: pointer;
		transition: color 0.18s;
		&:hover:not(:disabled) {
			color: $accent;
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
}
</style>
