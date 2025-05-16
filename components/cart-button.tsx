"use client"

import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export function CartButton() {
  const { cart, setIsCartOpen } = useCart()
  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => setIsCartOpen(true)}
      aria-label="장바구니 열기"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
          {itemCount}
        </span>
      )}
    </Button>
  )
}
