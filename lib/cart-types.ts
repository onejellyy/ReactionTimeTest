// 장바구니 아이템 타입
export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

// 장바구니 상태 타입
export interface CartState {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

// 주문 정보 타입
export interface OrderInfo {
  shippingAddress: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  cardInfo?: {
    number: string
    name: string
    expiry: string
    cvc: string
  }
}

// 주문 상태 타입
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

// 주문 타입
export interface Order {
  id: string
  date: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  shippingAddress: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  trackingNumber?: string
  paymentKey?: string // 토스페이먼츠 결제 키
}
