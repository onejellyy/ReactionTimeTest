"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

import type { CartItem, CartState } from "@/lib/cart-types"

// 장바구니 컨텍스트 타입
interface CartContextType {
  cart: CartState
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

// 기본 장바구니 상태
const defaultCartState: CartState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
}

// 장바구니 컨텍스트 생성
const CartContext = createContext<CartContextType | undefined>(undefined)

// 장바구니 프로바이더 컴포넌트
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(defaultCartState)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // 장바구니 상태 계산 함수
  const calculateCart = (items: CartItem[]): CartState => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? (subtotal > 100000 ? 0 : 3000) : 0 // 10만원 이상 무료 배송
    const tax = Math.round(subtotal * 0.1) // 10% 세금
    const total = subtotal + shipping + tax

    return {
      items,
      subtotal,
      shipping,
      tax,
      total,
    }
  }

  // 로컬 스토리지에서 장바구니 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(calculateCart(parsedCart.items))
        } catch (error) {
          console.error("장바구니 데이터 파싱 오류:", error)
          setCart(defaultCartState)
        }
      }
    }
  }, [])

  // 장바구니 상태 저장
  useEffect(() => {
    if (typeof window !== "undefined" && cart.items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  // 장바구니에 상품 추가
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((i) => i.id === item.id)

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        // 이미 장바구니에 있는 상품이면 수량 증가
        updatedItems = [...prevCart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
      } else {
        // 새 상품 추가
        updatedItems = [...prevCart.items, { ...item, quantity: 1 }]
      }

      // 장바구니 열기
      setIsCartOpen(true)

      return calculateCart(updatedItems)
    })
  }

  // 장바구니에서 상품 제거
  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== id)
      return calculateCart(updatedItems)
    })
  }

  // 상품 수량 업데이트
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      return calculateCart(updatedItems)
    })
  }

  // 장바구니 비우기
  const clearCart = () => {
    setCart(defaultCartState)
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// 장바구니 컨텍스트 사용 훅
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
