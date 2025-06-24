import api from "@/api";
import { ref } from "vue";

export const useApi = () => {
	const loading = ref(false);
	const error = ref<string | null>(null);

	// Единственный нужный тебе метод
	const sendForm = async (
		guestsList: { name: string }[],
		comment: string
	) => {
		const main_guest = guestsList[0]?.name || "Без имени";
		const companions = guestsList
			.slice(1)
			.map((g) => g.name || "Без имени");

		loading.value = true;
		error.value = null;

		try {
			await $fetch(api.addGuest, {
				method: "POST",
				body: {
					main_guest,
					companions,
					comment,
				},
			});
		} catch (e: any) {
			error.value = e.message;
			throw e;
		} finally {
			loading.value = false;
		}
	};

	return {
		sendForm,
		loading,
		error,
	};
};
