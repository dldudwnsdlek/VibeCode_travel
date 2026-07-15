<script setup>
import { ref, onMounted } from 'vue'
import { loadDataIndex } from '@/services/dataService'
import MapView from '@/components/map/MapView.vue'

const categoryCounts = ref({})
const isLoading = ref(true)
const loadError = ref('')

onMounted(async () => {
  try {
    const index = await loadDataIndex()
    const counts = {}
    index.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    categoryCounts.value = counts
  } catch (e) {
    loadError.value = '지역 데이터를 불러오는 중 문제가 발생했습니다.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="home">
    <h1>서울 지역정보, 한곳에서</h1>
    <p class="subtitle">관광지·맛집·축제 정보를 지도에서 탐색하고, 챗봇에게 물어보세요.</p>

    <p v-if="loadError" class="error">{{ loadError }}</p>
    <p v-else-if="isLoading" class="loading">데이터 불러오는 중...</p>
    <ul v-else class="category-summary">
      <li v-for="(count, category) in categoryCounts" :key="category">
        {{ category }} <strong>{{ count }}</strong>
      </li>
    </ul>

    <MapView />
  </section>
</template>

<style scoped>
.home h1 {
  font-size: 22px;
  margin-bottom: 4px;
}
.subtitle {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}
.category-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}
.category-summary li {
  background: #eef2ff;
  color: #2f6fed;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
}
.loading,
.error {
  font-size: 13px;
  color: #888;
}
.error {
  color: #d33;
}
</style>
