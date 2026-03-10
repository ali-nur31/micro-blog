<template>
  <div class="glass post-create-card animate-slide-down">
    <h3>Create a Post</h3>
    <form @submit.prevent="submitPost">
      <textarea 
        v-model="content" 
        class="input-field content-input" 
        placeholder="Write your post... You can use HTML like <b>bold</b> or <span style='color: red'>red text</span>."
        rows="4"
        required
      ></textarea>
      
      <div class="submit-row">
        <span class="hint">Tags allowed: div, span, b, i, style attributes.</span>
        <button type="submit" class="btn-primary" :disabled="loading || !content.trim()">
          {{ loading ? 'Posting...' : 'Post' }}
        </button>
      </div>
    </form>
    <div v-if="error" class="error-text">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api';

const emit = defineEmits(['post-created']);
const content = ref('');
const loading = ref(false);
const error = ref('');

const submitPost = async () => {
  if (!content.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.post('/posts', { content: content.value });
    emit('post-created', response.data);
    content.value = '';
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please log in again.';
    } else {
      error.value = err.response?.data?.message || 'Failed to create post.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.post-create-card {
  padding: 24px;
  margin-bottom: 30px;
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.content-input {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  margin-bottom: 12px;
}

.submit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.error-text {
  color: #f85149;
  font-size: 0.85rem;
  margin-top: 10px;
}
</style>
