"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingCart, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"

export function CartSheet() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            장바구니
          </SheetTitle>
          <SheetDescription>
            {cart.items.length > 0
              ? `${cart.items.length}개의 작품이 장바구니에 있습니다.`
              : "장바구니가 비어있습니다."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {cart.items.length > 0 ? (
            <ul className="space-y-5">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3 className="pr-8 text-sm font-medium">
                        <Link
                          href={`/artwork/${item.id}`}
                          className="hover:underline"
                          onClick={() => setIsCartOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="ml-4 text-sm font-medium">{item.price.toLocaleString()}원</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-l-md"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">수량 감소</span>
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-r-md"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">수량 증가</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">삭제</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <ShoppingCart className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500">장바구니가 비어있습니다.</p>
              <SheetClose asChild>
                <Button variant="link" className="mt-2" asChild>
                  <Link href="/gallery">작품 구경하기</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <>
            <div className="space-y-2 py-4 text-sm">
              <div className="flex justify-between">
                <p>소계</p>
                <p className="font-medium">{cart.subtotal.toLocaleString()}원</p>
              </div>
              <div className="flex justify-between">
                <p>배송비</p>
                <p className="font-medium">{cart.shipping > 0 ? `${cart.shipping.toLocaleString()}원` : "무료"}</p>
              </div>
              <div className="flex justify-between">
                <p>세금 (10%)</p>
                <p className="font-medium">{cart.tax.toLocaleString()}원</p>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-medium">
                <p>총계</p>
                <p>{cart.total.toLocaleString()}원</p>
              </div>
            </div>

            <SheetFooter className="flex-col gap-2 sm:flex-col">
              <SheetClose asChild>
                <Button className="w-full" asChild>
                  <Link href="/checkout">결제하기</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/gallery">쇼핑 계속하기</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
