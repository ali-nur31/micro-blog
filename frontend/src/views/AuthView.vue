<template>
  <div class="container animate-fade-in auth-container">
    <div class="glass auth-card">
      <h2 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Join Us' }}</h2>
      <p class="auth-subtitle">
        {{ isLogin ? 'Enter your details to access your feed.' : 'Create an account to start posting.' }}
      </p>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <form @submit.prevent="handleSubmit">
        <label for="username">Username</label>
        <input 
          id="username"
          v-model="username" 
          type="text" 
          class="input-field" 
          placeholder="Enter username" 
          required 
        />

        <label for="password">Password</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          class="input-field" 
          placeholder="Enter password" 
          required 
        />

        <button type="submit" class="btn-primary auth-submit" :disabled="loading">
          {{ loading ? 'Processing...' : (isLogin ? 'Login' : 'Register') }}
        </button>
      </form>

      <div class="auth-toggle">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button @click="isLogin = !isLogin; error = ''" class="toggle-btn">
          {{ isLogin ? 'Sign up' : 'Log in' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const isLogin = ref(true);
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    const endpoint = isLogin.value ? 'auth/login' : 'auth/register';
    const response = await api.post(endpoint, {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.token);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Authentication failed. Please check credentials or try another username.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
  min-height: 80vh;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  text-align: center;
}

.auth-title {
  margin-bottom: 8px;
  font-size: 1.8rem;
}

.auth-subtitle {
  margin-bottom: 30px;
  font-size: 0.95rem;
}

form {
  text-align: left;
}

form label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.auth-submit {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
}

.auth-toggle {
  margin-top: 24px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 600;
  cursor: pointer;
  padding: 0 5px;
}

.toggle-btn:hover {
  text-decoration: underline;
}

.error-msg {
  background: rgba(248, 81, 73, 0.1);
  color: #f85149;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(248, 81, 73, 0.4);
}
</style>
