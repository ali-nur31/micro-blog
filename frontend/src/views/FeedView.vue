<template>
  <div class="container animate-fade-in">
    <div class="feed-header">
      <h2>Global Feed</h2>
      <p>See what everyone is talking about.</p>
    </div>
    <PostCreate v-if="isAuthenticated" @post-created="handlePostCreated" />
    <div v-else class="glass login-prompt animate-slide-down">
      <p>Log in to join the conversation and create posts with custom styles.</p>
      <router-link to="/login" class="btn-primary login-prompt-btn">Login</router-link>
    </div>
    <div v-if="loadingPosts" class="loading-state">
      <span class="loader"></span> Loading posts...
    </div>
    <div v-else-if="posts.length === 0" class="empty-state glass">
      <p>No posts yet. Be the first to say something!</p>
    </div>
    <div v-else class="post-list">
      <div v-for="post in posts" :key="post.id" class="glass post-card animate-fade-in">
        <div class="post-header">
          <span class="author">@{{ post.username }}</span>
          <span class="date">{{ formatDate(post.createdAt) }}</span>
        </div>
        <div class="post-content custom-styled" v-html="post.content"></div>
        <div v-if="post.username === currentUsername" class="post-actions">
          <button @click="openEditModal(post)" class="btn-secondary edit-btn">Edit</button>
          <button @click="deletePost(post.id)" class="btn-secondary delete-btn">Delete</button>
        </div>
      </div>
    </div>
    <div v-if="isEditModalOpen" class="modal-overlay" @click="closeEditModal">
      <div class="glass modal-content" @click.stop>
        <h3>Edit Post</h3>
        <textarea v-model="editContent" class="input-field content-input" rows="5"></textarea>
        <div class="modal-actions">
          <button @click="closeEditModal" class="btn-secondary">Cancel</button>
          <button @click="saveEdit" class="btn-primary" :disabled="saving">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';
import PostCreate from '../components/PostCreate.vue';

const posts = ref([]);
const loadingPosts = ref(true);
const isAuthenticated = ref(!!localStorage.getItem('token'));

const currentUsername = computed(() => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).sub;
  } catch (e) {
    return null;
  }
});

const isEditModalOpen = ref(false);
const editPostId = ref(null);
const editContent = ref('');
const saving = ref(false);

const fetchPosts = async () => {
  loadingPosts.value = true;
  try {
    isAuthenticated.value = !!localStorage.getItem('token');
    const response = await api.get('/posts');
    posts.value = response.data;
  } catch (err) {
  } finally {
    loadingPosts.value = false;
  }
};

const handlePostCreated = (newPost) => {
  posts.value.unshift(newPost);
};

const openEditModal = (post) => {
  editPostId.value = post.id;
  editContent.value = post.content;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editPostId.value = null;
  editContent.value = '';
};

const saveEdit = async () => {
  if (!editContent.value.trim() || saving.value) return;
  saving.value = true;
  try {
    const response = await api.put(`/posts/${editPostId.value}`, { content: editContent.value });
    const index = posts.value.findIndex(p => p.id === editPostId.value);
    if (index !== -1) {
      posts.value[index] = response.data;
    }
    closeEditModal();
  } catch (err) {
  } finally {
    saving.value = false;
  }
};

const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`);
    posts.value = posts.value.filter(p => p.id !== id);
  } catch (err) {
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.feed-header {
  margin-bottom: 24px;
}
.feed-header h2 {
  margin-bottom: 4px;
  font-size: 2rem;
  background: linear-gradient(90deg, #e6edf3, #8b949e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.feed-header p {
  margin-top: 0;
  font-size: 1.1rem;
}
.login-prompt {
  padding: 24px;
  text-align: center;
  margin-bottom: 30px;
  background: rgba(88, 166, 255, 0.05);
  border-color: rgba(88, 166, 255, 0.2);
}
.login-prompt p {
  margin-bottom: 16px;
  color: var(--text-primary);
}
.login-prompt-btn {
  display: inline-block;
  text-decoration: none;
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.post-card {
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
  border-color: rgba(88, 166, 255, 0.3);
}
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}
.author {
  font-weight: 600;
  color: var(--accent-color);
  font-size: 0.95rem;
}
.date {
  color: var(--text-secondary);
  font-size: 0.85rem;
}
.post-content {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 1.05rem;
  word-break: break-word;
}
.post-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(48, 54, 61, 0.3);
  justify-content: flex-end;
}
.edit-btn, .delete-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
}
.delete-btn {
  color: #f85149;
  border-color: rgba(248, 81, 73, 0.3);
}
.delete-btn:hover {
  color: #f85149;
  border-color: #f85149;
  background: rgba(248, 81, 73, 0.1);
}
.empty-state, .loading-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}
.loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--text-secondary);
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}
@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.custom-styled :deep(*) {
  max-width: 100%;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 24px;
}
.modal-content h3 {
  margin-bottom: 16px;
  margin-top: 0;
}
.content-input {
  width: 100%;
  resize: vertical;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
