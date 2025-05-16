import apiClient from "./api-client"
import type { CartState, OrderInfo } from "./cart-types"

// 주문 생성
export const createOrder = async (cart: CartState, orderInfo: OrderInfo) => {
  try {
    const orderData = {
      items: cart.items.map((item) => ({
        artwork: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: orderInfo.shippingAddress,
      paymentMethod: orderInfo.paymentMethod,
    }

    const response = await apiClient.post("/orders", orderData)

    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "주문을 생성하는 중 오류가 발생했습니다",
    }
  }
}

// 사용자 주문 목록 가져오기
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get("/orders/myorders")
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "주문 목록을 가져오는 중 오류가 발생했습니다",
    }
  }
}

// 주문 상세 정보 가져오기
export const getOrderById = async (id: string) => {
  try {
    const response = await apiClient.get(`/orders/${id}`)
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "주문 정보를 가져오는 중 오류가 발생했습니다",
    }
  }
}

// 주문 상태 업데이트 (관리자용)
export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await apiClient.put(`/orders/${id}`, { status })
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "주문 상태를 업데이트하는 중 오류가 발생했습니다",
    }
  }
}

// 모든 주문 가져오기 (관리자용)
export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/orders")
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "주문 목록을 가져오는 중 오류가 발생했습니다",
    }
  }
}
