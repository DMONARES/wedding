import api from "@/api";
import { ref } from "vue";
import { authorizedFetch } from "@/composables/useApi";

export const useGuests = () => {
	const guests = ref<any[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const deleting = ref(false);

	const fetchGuests = async () => {
		loading.value = true;
		error.value = null;
		try {
			const data = await $fetch(api.getGuests);
			guests.value = data;
		} catch (e: any) {
			error.value = e.message || "Ошибка загрузки гостей";
		} finally {
			loading.value = false;
		}
	};

	const deleteGuest = async (id: number | string) => {
		deleting.value = true;
		try {
			await authorizedFetch(api.deleteGuest(id), { method: "DELETE" });
			await fetchGuests();
		} catch (e: any) {
			error.value = e.message || "Ошибка удаления гостя";
		} finally {
			deleting.value = false;
		}
	};

	return {
		guests,
		loading,
		error,
		deleting,
		fetchGuests,
		deleteGuest,
	};
};
