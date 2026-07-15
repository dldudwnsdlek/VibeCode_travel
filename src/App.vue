<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ChatWidget from '@/components/chatbot/ChatWidget.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink to="/" class="logo">LocalHub</RouterLink>
      <nav class="app-nav">
        <RouterLink to="/">홈</RouterLink>
        <RouterLink to="/board">게시판</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      이 서비스는 한국관광공사 Tour API(TourAPI 4.0)의 데이터를 활용하였습니다. ·
      출처: 한국관광공사 (data.go.kr/data/15101578/openapi.do) · 라이선스: 공공누리 제3유형
    </footer>

    <ChatWidget />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: -apple-system, 'Pretendard', 'Malgun Gothic', sans-serif;
  background: #fafafa;
  color: #222;
}
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo {
  font-weight: 700;
  font-size: 18px;
  color: #2f6fed;
  text-decoration: none;
}
.app-nav {
  display: flex;
  gap: 16px;
}
.app-nav a {
  color: #444;
  text-decoration: none;
  font-size: 14px;
}
.app-nav a.router-link-exact-active {
  color: #2f6fed;
  font-weight: 600;
}
.app-main {
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px 80px;
}
.app-footer {
  font-size: 11px;
  color: #999;
  text-align: center;
  padding: 12px;
  border-top: 1px solid #eee;
  background: #fff;
}
</style>
