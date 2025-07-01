<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { login, isAuth } = useAuth();
const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

if (isAuth.value) {
  router.replace("/guests");
}

async function handleLogin() {
  loading.value = true;
  error.value = "";
  try {
    await login(username.value, password.value);
    router.replace("/guests");
  } catch (e: any) {
    error.value = e.data?.error || e.message || "Ошибка авторизации";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-page__form" @submit.prevent="handleLogin">
      <h2 class="login-page__title">Вход для администратора</h2>
      <div class="login-page__group">
        <label class="login-page__label">Логин</label>
        <input v-model="username" class="login-page__input" type="text" autocomplete="username" required />
      </div>
      <div class="login-page__group">
        <label class="login-page__label">Пароль</label>
        <input v-model="password" class="login-page__input" type="password" autocomplete="current-password" required />
      </div>
      <button class="login-page__button" :disabled="loading">
        {{ loading ? "Вход..." : "Войти" }}
      </button>
      <div v-if="error" class="login-page__error">{{ error }}</div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $surface;

  &__form {
    min-width: 320px;
    max-width: 380px;
    margin: 0 auto;
    padding: 2.5rem 2rem 2rem;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    border: 1px solid $accent;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  &__title {
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    color: $text;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  &__label {
    font-size: 1rem;
    color: $text;
    font-weight: 500;
  }
  &__input {
    padding: 0.7em 1em;
    border: 1px solid $accent;
    border-radius: 8px;
    font-size: 1.08rem;
    background: $surface;
    color: $text;
    outline: none;
    transition: border 0.2s;
    &:focus {
      border-color: darken($accent, 10%);
    }
  }
  &__button {
    margin-top: 0.7rem;
    padding: 0.7em 1em;
    background: $accent;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    &:hover:not(:disabled) {
      background: darken($accent, 7%);
    }
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  &__error {
    color: #d32f2f;
    background: #fff0f0;
    border-radius: 6px;
    padding: 0.5em 1em;
    font-size: 1rem;
    text-align: center;
    margin-top: 0.5em;
  }
}
</style> 