import { ref, computed } from "vue";
import { useCookie } from '#app'
import api from "@/api";

const TOKEN_KEY = "wedding_token";

const token = useCookie(TOKEN_KEY)
const isAuth = computed(() => !!token.value)

function setToken(newToken: string) {
	token.value = newToken;
	isAuth.value = true;
}

function clearToken() {
	token.value = null;
	isAuth.value = false;
}

async function login(username: string, password: string) {
	try {
		const res = await $fetch(api.login, {
			method: "POST",
			body: { username, password },
		});
		if (res.token) {
			setToken(res.token);
			return true;
		}
		throw new Error("Нет токена в ответе");
	} catch (e: any) {
		clearToken();
		throw e;
	}
}

function logout() {
	clearToken();
}

function getToken() {
	return token.value;
}

export function useAuth() {
	return {
		isAuth,
		token,
		login,
		logout,
		getToken,
	};
}
