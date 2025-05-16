import apiClient from "./api-client"

// 대시보드 통계 데이터 가져오기
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/dashboard/stats")
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    // API가 아직 구현되지 않았거나 오류가 발생한 경우 기본값 반환
    console.error("대시보드 통계 데이터를 가져오는 중 오류 발생:", error)
    return {
      success: false,
      error: error.response?.data?.error || "통계 데이터를 가져오는 중 오류가 발생했습니다",
      // 기본 데이터 제공
      data: {
        totalArtworks: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalVisitors: 0,
      },
    }
  }
}

// 최근 판매 내역 가져오기
export const getRecentSales = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/orders/recent?limit=${limit}`)
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error("최근 판매 내역을 가져오는 중 오류 발생:", error)
    return {
      success: false,
      error: error.response?.data?.error || "최근 판매 내역을 가져오는 중 오류가 발생했습니다",
      data: [],
    }
  }
}

// 인기 작품 가져오기
export const getPopularArtworks = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/artworks/popular?limit=${limit}`)
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error("인기 작품을 가져오는 중 오류 발생:", error)
    return {
      success: false,
      error: error.response?.data?.error || "인기 작품을 가져오는 중 오류가 발생했습니다",
      data: [],
    }
  }
}

// 대시보드에 필요한 모든 데이터 한 번에 가져오기
export const getDashboardData = async () => {
  try {
    // 병렬로 모든 API 요청 실행
    const [statsResult, recentSalesResult, popularArtworksResult] = await Promise.all([
      getDashboardStats(),
      getRecentSales(),
      getPopularArtworks(),
    ])

    return {
      success: true,
      stats: statsResult.data,
      recentSales: recentSalesResult.data,
      popularArtworks: popularArtworksResult.data,
    }
  } catch (error: any) {
    console.error("대시보드 데이터를 가져오는 중 오류 발생:", error)
    return {
      success: false,
      error: "대시보드 데이터를 가져오는 중 오류가 발생했습니다",
      stats: {
        totalArtworks: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalVisitors: 0,
      },
      recentSales: [],
      popularArtworks: [],
    }
  }
}
