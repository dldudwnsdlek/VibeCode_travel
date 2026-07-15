<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPostById, deletePost } from '@/services/boardService'

const props = defineProps({ id: String })
const router = useRouter()

const post = ref(null)
const notFound = ref(false)
const showDeleteModal = ref(false)
const deletePassword = ref('')
const deleteError = ref('')

onMounted(() => {
  const found = getPostById(props.id)
  if (!found) {
    notFound.value = true
    return
  }
  post.value = found
})

function goEdit() {
  router.push(`/board/${props.id}/edit`)
}

function confirmDelete() {
  deleteError.value = ''
  try {
    deletePost(props.id, deletePassword.value)
    router.push('/board')
  } catch (e) {
    deleteError.value = e.message
  }
}
</script>

<template>
  <section>
    <p v-if="notFound" class="empty">게시글을 찾을 수 없습니다.</p>

    <article v-else-if="post" class="post-detail">
      <h1>{{ post.title }}</h1>
      <p class="post-meta">
        작성일 {{ new Date(post.createdAt).toLocaleString('ko-KR') }}
        <span v-if="post.updatedAt !== post.createdAt">(수정됨)</span>
      </p>
      <p class="post-content">{{ post.content }}</p>

      <div class="post-actions">
        <button @click="goEdit">수정</button>
        <button class="danger" @click="showDeleteModal = true">삭제</button>
      </div>
    </article>

    <div v-if="showDeleteModal" class="modal-backdrop" @click.self="showDeleteModal = false">
      <div class="modal">
        <h3>비밀번호 확인</h3>
        <input v-model="deletePassword" type="password" placeholder="작성 시 입력한 비밀번호" />
        <p v-if="deleteError" class="error">{{ deleteError }}</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false">취소</button>
          <button class="danger" @click="confirmDelete">삭제</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.post-detail {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
}
.post-meta {
  color: #999;
  font-size: 12px;
  margin-bottom: 16px;
}
.post-content {
  white-space: pre-wrap;
  line-height: 1.6;
  min-height: 120px;
}
.post-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  justify-content: flex-end;
}
.post-actions button {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
.danger {
  color: #d33;
  border-color: #f3c2c2 !important;
}
.empty {
  color: #888;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 280px;
}
.modal input {
  width: 100%;
  padding: 8px;
  margin: 12px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.error {
  color: #d33;
  font-size: 12px;
}
</style>
