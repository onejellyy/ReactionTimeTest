"use client"

import type { CartState, Order, OrderInfo, OrderStatus } from "@/lib/cart-types"

// 주문 생성
export function createOrder(cart: CartState, orderInfo: OrderInfo): Order {
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  const date = new Date().toISOString()

  const order: Order = {
    id: orderId,
    date,
    items: [...cart.items],
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    tax: cart.tax,
    total: cart.total,
    status: "pending",
    shippingAddress: { ...orderInfo.shippingAddress },
    paymentMethod: orderInfo.paymentMethod,
  }

  // 로컬 스토리지에 주문 저장
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem("orders", JSON.stringify(orders))

  return order
}

// 주문 목록 가져오기
export function getOrders(): Order[] {
  if (typeof window === "undefined") {
    return []
  }

  const ordersJson = localStorage.getItem("orders")
  if (!ordersJson) {
    return []
  }

  try {
    return JSON.parse(ordersJson)
  } catch (error) {
    console.error("주문 데이터 파싱 오류:", error)
    return []
  }
}

// 주문 상세 가져오기
export function getOrder(orderId: string): Order | undefined {
  const orders = getOrders()
  return orders.find((order) => order.id === orderId)
}

// 주문 상태 업데이트
export function updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
  const orders = getOrders()
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex === -1) {
    return undefined
  }

  orders[orderIndex].status = status

  // 배송 중 상태로 변경 시 추적 번호 생성
  if (status === "shipped" && !orders[orderIndex].trackingNumber) {
    orders[orderIndex].trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }

  localStorage.setItem("orders", JSON.stringify(orders))
  return orders[orderIndex]
}

// 사용자 주문 목록 가져오기 (이메일로 필터링)
export function getUserOrders(email: string): Order[] {
  const orders = getOrders()
  return orders.filter((order) => order.shippingAddress.email === email)
}

// 주문에 결제 키 추가
export function addPaymentKeyToOrder(orderId: string, paymentKey: string): Order | undefined {
  const orders = getOrders()
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex === -1) {
    return undefined
  }

  orders[orderIndex].paymentKey = paymentKey
  localStorage.setItem("orders", JSON.stringify(orders))
  return orders[orderIndex]
}

// 결제 정보 조회 함수 추가
export async function getPaymentInfo(paymentKey: string) {
  // 실제 구현에서는 결제 API를 호출해야 함
  // 이 예제에서는 더미 데이터 반환
  return {
    success: true,
    data: {
      paymentKey: paymentKey,
      method: "카드",
      totalAmount: 650000,
      balanceAmount: 650000,
      status: "DONE",
      requestedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      card: {
        company: "신한카드",
        number: "1234-****-****-5678",
        installmentPlanMonths: 0,
      },
    },
  }
}
