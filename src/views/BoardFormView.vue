<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPostById, createPost, updatePost } from '@/services/boardService'

const props = defineProps({ id: String })
const router = useRouter()
const isEditMode = computed(() => !!props.id)

const title = ref('')
const content = ref('')
const password = ref('')
const errorMessage = ref('')

onMounted(() => {
  if (isEditMode.value) {
    const post = getPostById(props.id)
    if (!post) {
      errorMessage.value = '게시글을 찾을 수 없습니다.'
      return
    }
    title.value = post.title
    content.value = post.content
    // 수정 모드에서는 비밀번호를 다시 입력받음 (서버에 저장된 값과 비교)
  }
})

function handleSubmit() {
  errorMessage.value = ''
  try {
    if (isEditMode.value) {
      updatePost(props.id, { title: title.value, content: content.value, password: password.value })
      router.push(`/board/${props.id}`)
    } else {
      const newId = createPost({ title: title.value, content: content.value, password: password.value })
      router.push(`/board/${newId}`)
    }
  } catch (e) {
    errorMessage.value = e.message
  }
}
</script>

<template>
  <section>
    <h1>{{ isEditMode ? '게시글 수정' : '게시글 작성' }}</h1>

    <form class="post-form" @submit.prevent="handleSubmit">
      <label>
        제목
        <input v-model="title" type="text" required maxlength="100" />
      </label>

      <label>
        내용
        <textarea v-model="content" rows="8" required></textarea>
      </label>

      <label>
        비밀번호 {{ isEditMode ? '(수정 확인용)' : '(수정·삭제 시 필요)' }}
        <input v-model="password" type="password" required />
      </label>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <div class="form-actions">
        <button type="button" @click="router.back()">취소</button>
        <button type="submit" class="btn-primary">{{ isEditMode ? '수정 완료' : '작성 완료' }}</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #555;
}
input,
textarea {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.form-actions button {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
.btn-primary {
  background: #2f6fed;
  color: #fff;
  border-color: #2f6fed !important;
}
.error {
  color: #d33;
  font-size: 13px;
}
</style>
