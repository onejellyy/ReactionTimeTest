"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getOrder, updateOrderStatus, getPaymentInfo } from "@/lib/order-actions"
import type { Order, OrderStatus } from "@/lib/cart-types"
import type { PaymentInfo } from "@/lib/payment-types"
import { useAdminAuth } from "@/lib/admin-auth"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const fetchOrderData = async () => {
      // 주문 정보 가져오기
      const orderData = getOrder(params.id)
      if (orderData) {
        setOrder(orderData)

        // 결제 정보 가져오기 (카드 결제인 경우)
        if (orderData.paymentMethod === "card" && orderData.paymentKey) {
          try {
            const paymentResult = await getPaymentInfo(orderData.paymentKey)
            if (paymentResult.success && paymentResult.data) {
              setPaymentInfo(paymentResult.data)
            }
          } catch (error) {
            console.error("결제 정보 조회 오류:", error)
          }
        }
      }
      setLoading(false)
    }

    fetchOrderData()
  }, [params.id])

  // 주문 상태 업데이트
  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return

    setUpdatingStatus(true)
    const updatedOrder = updateOrderStatus(order.id, status)

    if (updatedOrder) {
      setOrder(updatedOrder)
      toast({
        title: "주문 상태가 업데이트되었습니다",
        description: `주문 #${order.id}의 상태가 "${getStatusText(status)}"(으)로 변경되었습니다.`,
      })
    } else {
      toast({
        title: "주문 상태 업데이트 실패",
        description: "주문 상태를 업데이트하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }

    setUpdatingStatus(false)
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

  if (loading) {
    return <div className="flex items-center justify-center h-full">주문 정보를 불러오는 중...</div>
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>주문을 찾을 수 없습니다.</p>
      </div>
    )
  }

  // 주문 날짜 포맷팅
  const orderDate = new Date(order.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          주문 목록으로 돌아가기
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">주문 #{order.id}</h1>
          <p className="text-gray-500">{orderDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={order.status}
            onValueChange={(value: OrderStatus) => handleStatusChange(value)}
            disabled={updatingStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="주문 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">주문 접수</SelectItem>
              <SelectItem value="processing">처리 중</SelectItem>
              <SelectItem value="shipped">배송 중</SelectItem>
              <SelectItem value="delivered">배송 완료</SelectItem>
              <SelectItem value="cancelled">취소됨</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusText(order.status)}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>주문 상품</CardTitle>
            <CardDescription>주문에 포함된 작품 목록</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()}원</p>
                  </div>
                  <p className="text-sm text-gray-500">수량: {item.quantity}</p>
                  <p className="text-sm text-gray-500">개당: {item.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>소계</span>
                  <span>{order.subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>{order.shipping > 0 ? `${order.shipping.toLocaleString()}원` : "무료"}</span>
                </div>
                <div className="flex justify-between">
                  <span>세금 (10%)</span>
                  <span>{order.tax.toLocaleString()}원</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>총계</span>
                <span>{order.total.toLocaleString()}원</span>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium">결제 방법</p>
                <p className="text-sm text-gray-500">{order.paymentMethod === "card" ? "신용카드" : "무통장 입금"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>고객 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-sm text-gray-500">{order.shippingAddress.email}</p>
              <p className="text-sm text-gray-500">{order.shippingAddress.phone}</p>
              <Separator className="my-2" />
              <p className="font-medium">배송 주소</p>
              <p className="text-sm text-gray-500">{order.shippingAddress.address}</p>
              <p className="text-sm text-gray-500">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
            </CardContent>
          </Card>

          {order.status === "shipped" && order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle>배송 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">운송장 번호</p>
                </div>
                <p className="text-sm">{order.trackingNumber}</p>
              </CardContent>
            </Card>
          )}

          {paymentInfo && (
            <Card>
              <CardHeader>
                <CardTitle>결제 정보</CardTitle>
                <CardDescription>토스페이먼츠 결제 상세</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">결제 상태</p>
                  <p className="text-sm">{paymentInfo.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">결제 방법</p>
                  <p className="text-sm">{paymentInfo.method}</p>
                </div>
                {paymentInfo.card && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">카드 정보</p>
                    <p className="text-sm">
                      {paymentInfo.card.company} {paymentInfo.card.number}
                    </p>
                    {paymentInfo.card.installmentPlanMonths > 0 && (
                      <p className="text-sm">{paymentInfo.card.installmentPlanMonths}개월 할부</p>
                    )}
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium">결제 시간</p>
                  <p className="text-sm">
                    {new Date(paymentInfo.approvedAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a
                      href={`https://dashboard.tosspayments.com/payments/${paymentInfo.paymentKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      토스페이먼츠 대시보드에서 보기
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
