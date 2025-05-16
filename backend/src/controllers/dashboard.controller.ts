import type { Request, Response } from "express"
import Artwork from "../models/artwork.model"
import Order from "../models/order.model"
import User from "../models/user.model"

// 대시보드 통계 데이터 가져오기
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 총 작품 수
    const totalArtworks = await Artwork.countDocuments()

    // 판매된 작품 수 (주문 항목 수)
    const orders = await Order.find()
    const totalSales = orders.reduce((acc, order) => acc + order.items.length, 0)

    // 총 수익
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)

    // 방문자 수 (사용자 수로 대체)
    const totalVisitors = await User.countDocuments()

    res.status(200).json({
      success: true,
      data: {
        totalArtworks,
        totalSales,
        totalRevenue,
        totalVisitors,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
