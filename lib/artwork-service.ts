import apiClient from "./api-client"

// 모든 작품 가져오기
export const getAllArtworks = async () => {
  try {
    const response = await apiClient.get("/artworks")
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "작품 목록을 가져오는 중 오류가 발생했습니다",
    }
  }
}

// 작품 상세 정보 가져오기
export const getArtworkById = async (id: string) => {
  try {
    const response = await apiClient.get(`/artworks/${id}`)
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "작품 정보를 가져오는 중 오류가 발생했습니다",
    }
  }
}

// 작품 생성
export const createArtwork = async (artworkData: any) => {
  try {
    const response = await apiClient.post("/artworks", artworkData)
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "작품을 생성하는 중 오류가 발생했습니다",
    }
  }
}

// 작품 업데이트
export const updateArtwork = async (id: string, artworkData: any) => {
  try {
    const response = await apiClient.put(`/artworks/${id}`, artworkData)
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "작품을 업데이트하는 중 오류가 발생했습니다",
    }
  }
}

// 작품 삭제
export const deleteArtwork = async (id: string) => {
  try {
    await apiClient.delete(`/artworks/${id}`)
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "작품을 삭제하는 중 오류가 발생했습니다",
    }
  }
}
