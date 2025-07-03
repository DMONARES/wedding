import { useAuth } from "@/composables/useAuth";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
	if (to.path === "/guests" || to.path === "/guests/") {
		const { isAuth } = useAuth();
		if (!isAuth.value) {
			return navigateTo("/login");
		}
	}
});
