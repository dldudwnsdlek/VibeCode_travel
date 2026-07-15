<script setup>
import { ref, onMounted, watch } from 'vue'
import { loadDataIndex } from '@/services/dataService'

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY
console.log('카카오 키:', KAKAO_KEY)

const mapEl = ref(null)
const allItems = ref([])
const activeCategory = ref('전체')
const categories = ref(['전체'])
const selectedItem = ref(null)
const loadFailed = ref(false)

let mapInstance = null
let markers = []

function loadKakaoScript() {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }
    if (!KAKAO_KEY) {
      reject(new Error('VITE_KAKAO_MAP_APP_KEY가 설정되지 않았습니다.'))
      return
    }
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`
    script.onload = () => window.kakao.maps.load(resolve)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function clearMarkers() {
  markers.forEach((m) => m.setMap(null))
  markers = []
}

function renderMarkers() {
  if (!mapInstance) return
  clearMarkers()

  const items = allItems.value.filter(
    (item) =>
      item.lat &&
      item.lng &&
      (activeCategory.value === '전체' || item.category === activeCategory.value)
  )

  items.forEach((item) => {
    const position = new window.kakao.maps.LatLng(item.lat, item.lng)
    const marker = new window.kakao.maps.Marker({ position, map: mapInstance })
    window.kakao.maps.event.addListener(marker, 'click', () => {
      selectedItem.value = item
    })
    markers.push(marker)
  })
}

watch(activeCategory, renderMarkers)

onMounted(async () => {
  try {
    allItems.value = await loadDataIndex()
    categories.value = ['전체', ...new Set(allItems.value.map((i) => i.category))]
  } catch (e) {
    console.error('지역 데이터 로드 실패:', e)
  }

  try {
    await loadKakaoScript()
    mapInstance = new window.kakao.maps.Map(mapEl.value, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 기준
      level: 8,
    })
    renderMarkers()
  } catch (e) {
    console.error('카카오맵 로드 실패:', e)
    loadFailed.value = true
  }
})
</script>

<template>
  <div class="map-section">
    <div class="map-filters">
      <button
        v-for="c in categories"
        :key="c"
        :class="['filter-btn', { active: activeCategory === c }]"
        @click="activeCategory = c"
      >
        {{ c }}
      </button>
    </div>

    <p v-if="loadFailed" class="map-error">
      지도를 불러오지 못했습니다. VITE_KAKAO_MAP_APP_KEY 환경변수와 카카오 개발자
      콘솔의 허용 도메인 등록 여부를 확인해주세요.
    </p>
    <div v-else ref="mapEl" class="map-canvas"></div>

    <div v-if="selectedItem" class="place-popup">
      <strong>{{ selectedItem.title }}</strong>
      <span class="category-tag">{{ selectedItem.category }}</span>
      <p>{{ selectedItem.addr }}</p>
      <p v-if="selectedItem.tel">{{ selectedItem.tel }}</p>
      <p v-if="selectedItem.eventStart">
        {{ selectedItem.eventStart }} ~ {{ selectedItem.eventEnd }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.map-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.filter-btn {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}
.filter-btn.active {
  background: #2f6fed;
  color: #fff;
  border-color: #2f6fed;
}
.map-canvas {
  width: 100%;
  height: 420px;
  border-radius: 10px;
  background: #eee;
}
.map-error {
  padding: 40px 16px;
  text-align: center;
  color: #d33;
  font-size: 13px;
  background: #fff5f5;
  border-radius: 10px;
}
.place-popup {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  font-size: 13px;
}
.category-tag {
  margin-left: 8px;
  font-size: 11px;
  color: #2f6fed;
}
</style>
