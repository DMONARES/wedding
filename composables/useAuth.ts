import { ref } from "vue";
import Cookies from "js-cookie";
import api from "@/api";

const TOKEN_KEY = "wedding_token";

const token = ref<string | null>(Cookies.get(TOKEN_KEY) || null);
const isAuth = ref(!!token.value);

function setToken(newToken: string) {
	token.value = newToken;
	isAuth.value = true;
	Cookies.set(TOKEN_KEY, newToken, { expires: 7 });
}

function clearToken() {
	token.value = null;
	isAuth.value = false;
	Cookies.remove(TOKEN_KEY);
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
