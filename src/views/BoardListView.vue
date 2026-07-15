<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllPosts } from '@/services/boardService'

const posts = ref([])

onMounted(() => {
  posts.value = getAllPosts().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
})
</script>

<template>
  <section>
    <div class="board-header">
      <h1>게시판</h1>
      <RouterLink to="/board/new" class="btn-primary">글쓰기</RouterLink>
    </div>

    <p v-if="posts.length === 0" class="empty">아직 게시글이 없습니다.</p>

    <ul v-else class="post-list">
      <li v-for="post in posts" :key="post.id">
        <RouterLink :to="`/board/${post.id}`">
          <span class="post-title">{{ post.title }}</span>
          <span class="post-date">{{ new Date(post.createdAt).toLocaleDateString('ko-KR') }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.btn-primary {
  background: #2f6fed;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
}
.empty {
  color: #888;
  font-size: 14px;
}
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eee;
}
.post-list li + li {
  border-top: 1px solid #eee;
}
.post-list a {
  display: flex;
  justify-content: space-between;
  padding: 14px 16px;
  text-decoration: none;
  color: #222;
}
.post-date {
  color: #999;
  font-size: 12px;
}
</style>
