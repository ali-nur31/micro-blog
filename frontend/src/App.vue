<template>
  <div id="app">
    <nav class="navbar glass animate-slide-down">
      <div class="nav-brand">
        <h1>MicroBlog</h1>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Feed</router-link>
        <template v-if="isAuthenticated">
          <button @click="logout" class="btn-secondary logout-btn">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link btn-primary login-btn">Login</router-link>
        </template>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isAuthenticated = ref(!!localStorage.getItem('token'));

watch(route, () => {
  isAuthenticated.value = !!localStorage.getItem('token');
});

const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  router.push('/login');
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  margin: 16px auto;
  max-width: 800px;
  border-radius: 16px;
  position: sticky;
  top: 16px;
  z-index: 100;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(90deg, #58a6ff, #a371f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--text-primary);
}

.login-btn {
  color: #0d1117 !important;
  text-decoration: none;
}

.main-content {
  padding-top: 10px;
}
</style>
