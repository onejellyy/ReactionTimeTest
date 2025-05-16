import axios from "axios"

// API 기본 URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 인증 오류 처리 (401)
    if (error.response && error.response.status === 401) {
      // 토큰 만료 시 로그아웃
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("currentUser")
        // 로그인 페이지로 리다이렉트
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
