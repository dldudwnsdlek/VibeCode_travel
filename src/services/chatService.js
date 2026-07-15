// src/services/chatService.js
// 챗봇 UI(ChatWidget.vue)와 Netlify Function 사이를 잇는 서비스.
// 1) 질문과 관련된 지역데이터/게시글만 선별
// 2) 최근 대화 히스토리만 잘라서 함께 전송 (토큰 비용 절감)
// 3) 서버리스 함수를 호출해 답변을 받아옴

import { loadDataIndex } from './dataService'
import { selectRelevantContext, selectRelevantPosts } from './contextSelector'

const CHAT_ENDPOINT = '/.netlify/functions/chat'
const MAX_HISTORY_TURNS = 6 // 최근 6턴(사용자+봇 합산)만 컨텍스트로 전송

/**
 * 게시판 서비스는 박지우님 구현에 맞춰 이 함수만 연결하면 됨.
 * boardService.js 쪽에 예: export function getAllPosts() { ... return JSON.parse(localStorage...) }
 * 형태로 구현되어 있다면 아래 import를 활성화.
 */
let getAllPosts = () => []
export function registerBoardSource(fn) {
  getAllPosts = fn
}

/**
 * @param {string} question 사용자가 입력한 질문
 * @param {Array<{role: 'user'|'assistant', content: string}>} history 지금까지의 대화 (UI의 messages 배열)
 * @returns {Promise<string>} AI 답변 텍스트
 */
export async function sendChatMessage(question, history = []) {
  if (!question || !question.trim()) {
    throw new Error('질문을 입력해주세요.')
  }

  const dataIndex = await loadDataIndex()
  const relevantData = selectRelevantContext(question, dataIndex, { limit: 6 })

  let relevantPosts = []
  try {
    const allPosts = getAllPosts()
    relevantPosts = selectRelevantPosts(question, allPosts, { limit: 3 })
  } catch (e) {
    console.warn('게시글 검색 실패 (게시판 서비스 미연결일 수 있음):', e)
  }

  const context = [
    ...relevantData.map((d) => ({
      type: 'poi',
      title: d.title,
      category: d.category,
      addr: d.addr,
      tel: d.tel,
      eventStart: d.eventStart,
      eventEnd: d.eventEnd,
      eventPlace: d.eventPlace,
    })),
    ...relevantPosts.map((p) => ({
      type: 'post',
      title: p.title,
      content: (p.content || '').slice(0, 200),
    })),
  ]

  const trimmedHistory = history
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content }))

  let res
  try {
    res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context, history: trimmedHistory }),
    })
  } catch (networkErr) {
    throw new Error('네트워크 연결을 확인해주세요.')
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody.error || '챗봇 응답을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.')
  }

  const data = await res.json()
  return data.answer
}
