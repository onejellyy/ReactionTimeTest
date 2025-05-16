"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrders } from "@/lib/order-actions"
import type { Order } from "@/lib/cart-types"
import { useAdminAuth } from "@/lib/admin-auth"

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    // 주문 목록 가져오기
    const ordersList = getOrders()
    setOrders(ordersList)
  }, [])

  // 주문 상태에 따른 필터링
  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter)

  // 주문 상태에 따른 배지 색상
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "outline"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  // 주문 상태 한글 표시
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "주문 접수"
      case "processing":
        return "처리 중"
      case "shipped":
        return "배송 중"
      case "delivered":
        return "배송 완료"
      case "cancelled":
        return "취소됨"
      default:
        return status
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">로딩 중...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">주문 관리</h1>
          <p className="text-gray-500">고객 주문을 관리하고 상태를 업데이트하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="모든 주문" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 주문</SelectItem>
              <SelectItem value="pending">주문 접수</SelectItem>
              <SelectItem value="processing">처리 중</SelectItem>
              <SelectItem value="shipped">배송 중</SelectItem>
              <SelectItem value="delivered">배송 완료</SelectItem>
              <SelectItem value="cancelled">취소됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">주문이 없습니다</h2>
          <p className="text-gray-500 mb-4">
            {filter === "all" ? "아직 주문이 없습니다." : `${getStatusText(filter)} 상태의 주문이 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => {
            // 주문 날짜 포맷팅
            const orderDate = new Date(order.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })

            return (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{order.shippingAddress.name}</CardTitle>
                      <CardDescription>{orderDate}</CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusText(order.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">주문번호</span>
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">상품 수</span>
                      <span>{order.items.length}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">결제 방법</span>
                      <span>{order.paymentMethod === "card" ? "신용카드" : "무통장 입금"}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>총 금액</span>
                      <span>{order.total.toLocaleString()}원</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/admin/orders/${order.id}`}>상세 보기</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
