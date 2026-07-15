<template>
  <div class="chat-widget">
    <button
      class="chat-fab"
      type="button"
      @click="isOpen = !isOpen"
      :aria-label="isOpen ? '챗봇 닫기' : '챗봇 열기'"
    >
      {{ isOpen ? '✕' : '💬' }}
    </button>

    <div v-if="isOpen" class="chat-panel">
      <header class="chat-header">
        <span>LocalHub 챗봇</span>
        <button type="button" class="chat-close" @click="isOpen = false" aria-label="닫기">✕</button>
      </header>

      <div class="chat-messages" ref="messageListEl">
        <p v-if="messages.length === 0" class="chat-empty">
          관광지, 맛집, 축제, 게시글에 대해 무엇이든 물어보세요!
        </p>

        <div v-for="(msg, i) in messages" :key="i" :class="['chat-bubble', msg.role]">
          {{ msg.content }}
        </div>

        <div v-if="isLoading" class="chat-bubble assistant loading">답변 작성 중...</div>
        <p v-if="errorMessage" class="chat-error">{{ errorMessage }}</p>
      </div>

      <form class="chat-input-row" @submit.prevent="handleSubmit">
        <input
          v-model="draft"
          type="text"
          placeholder="예) 홍대 근처 가볼만한 곳 추천해줘"
          :disabled="isLoading"
        />
        <button type="submit" :disabled="isLoading || !draft.trim()">전송</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { sendChatMessage } from '@/services/chatService'

const isOpen = ref(false)
const draft = ref('')
const messages = ref([]) // { role: 'user' | 'assistant', content: string }
const isLoading = ref(false)
const errorMessage = ref('')
const messageListEl = ref(null)

async function scrollToBottom() {
  await nextTick()
  if (messageListEl.value) {
    messageListEl.value.scrollTop = messageListEl.value.scrollHeight
  }
}

async function handleSubmit() {
  const question = draft.value.trim()
  if (!question || isLoading.value) return

  errorMessage.value = ''
  messages.value.push({ role: 'user', content: question })
  draft.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const answer = await sendChatMessage(question, messages.value)
    messages.value.push({ role: 'assistant', content: answer })
  } catch (err) {
    errorMessage.value = err.message || '챗봇 응답 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped>
.chat-widget {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
}

.chat-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  font-size: 22px;
  background: #2f6fed;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.chat-panel {
  position: fixed;
  right: 20px;
  bottom: 88px;
  width: 320px;
  max-width: calc(100vw - 40px);
  height: 440px;
  max-height: calc(100vh - 140px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #2f6fed;
  color: #fff;
  font-weight: 600;
}

.chat-close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-empty {
  color: #888;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
}

.chat-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-bubble.user {
  align-self: flex-end;
  background: #2f6fed;
  color: #fff;
}

.chat-bubble.assistant {
  align-self: flex-start;
  background: #f1f1f1;
  color: #222;
}

.chat-bubble.loading {
  opacity: 0.6;
}

.chat-error {
  color: #d33;
  font-size: 13px;
  padding: 4px 8px;
}

.chat-input-row {
  display: flex;
  border-top: 1px solid #eee;
  padding: 8px;
  gap: 8px;
}

.chat-input-row input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.chat-input-row button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background: #2f6fed;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.chat-input-row button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 400px) {
  .chat-panel {
    right: 10px;
    left: 10px;
    width: auto;
  }
  .chat-widget {
    right: 10px;
    bottom: 10px;
  }
}
</style>
