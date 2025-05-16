import type { Request, Response } from "express"
import Order from "../models/order.model"
import Artwork from "../models/artwork.model"

// 주문 생성
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    // 주문 항목 확인
    if (items && items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "주문 항목이 없습니다",
      })
    }

    // 주문 항목 가격 계산
    let subtotal = 0
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const artwork = await Artwork.findById(item.artwork)
        if (!artwork) {
          throw new Error(`작품 ID ${item.artwork}를 찾을 수 없습니다`)
        }

        subtotal += artwork.price * item.quantity

        return {
          artwork: artwork._id,
          title: artwork.title,
          price: artwork.price,
          image: artwork.image,
          quantity: item.quantity,
        }
      }),
    )

    // 배송비 계산
    const shipping = subtotal > 100000 ? 0 : 3000

    // 세금 계산
    const tax = Math.round(subtotal * 0.1)

    // 총액 계산
    const total = subtotal + shipping + tax

    // 주문 생성
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
    })

    res.status(201).json({
      success: true,
      data: order,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 사용자 주문 목록 가져오기
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 주문 상세 정보 가져오기
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    // 주문이 없는 경우
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "주문을 찾을 수 없습니다",
      })
    }

    // 관리자가 아니고 자신의 주문이 아닌 경우
    if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "접근 권한이 없습니다",
      })
    }

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 주문 상태 업데이트
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body

    const order = await Order.findById(req.params.id)

    // 주문이 없는 경우
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "주문을 찾을 수 없습니다",
      })
    }

    // 주문 상태 업데이트
    order.status = status

    // 배송 중 상태로 변경 시 추적 번호 생성
    if (status === "shipped" && !order.trackingNumber) {
      order.trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }

    const updatedOrder = await order.save()

    res.status(200).json({
      success: true,
      data: updatedOrder,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 모든 주문 가져오기 (관리자용)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email")

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 최근 판매 내역 가져오기
export const getRecentSales = async (req: Request, res: Response) => {
  try {
    const limit = Number.parseInt(req.query.limit as string) || 5

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name email")
      .populate("items.artwork", "title price image")

    // 응답 형식에 맞게 데이터 변환
    const recentSales = orders
      .flatMap((order) =>
        order.items.map((item) => ({
          _id: item._id,
          title: item.title,
          buyer: order.user.name,
          price: item.price,
          date: order.createdAt,
        })),
      )
      .slice(0, limit)

    res.status(200).json({
      success: true,
      count: recentSales.length,
      data: recentSales,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
