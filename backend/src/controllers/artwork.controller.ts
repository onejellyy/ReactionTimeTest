import type { Request, Response } from "express"
import Artwork from "../models/Artwork"
import Order from "../models/Order"

// 기존 코드는 유지하고 아래 함수를 추가합니다

// 인기 작품 가져오기
export const getPopularArtworks = async (req: Request, res: Response) => {
  try {
    const limit = Number.parseInt(req.query.limit as string) || 5

    // 조회수 기준으로 정렬
    const artworks = await Artwork.find().sort({ views: -1 }).limit(limit)

    // 판매 수 계산 (실제로는 Order 모델에서 계산해야 함)
    const popularArtworks = await Promise.all(
      artworks.map(async (artwork) => {
        // 이 작품이 포함된 주문 항목 수 계산
        const salesCount = await Order.countDocuments({
          "items.artwork": artwork._id,
        })

        return {
          _id: artwork._id,
          title: artwork.title,
          year: artwork.year || new Date().getFullYear().toString(),
          views: artwork.views || 0,
          sales: salesCount,
        }
      }),
    )

    res.status(200).json({
      success: true,
      count: popularArtworks.length,
      data: popularArtworks,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
