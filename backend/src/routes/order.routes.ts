import express from "express"
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getRecentSales,
} from "../controllers/order.controller"
import { protect, admin } from "../middleware/auth.middleware"

const router = express.Router()

router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders)

router.get("/myorders", protect, getUserOrders)

router.route("/:id").get(protect, getOrderById).put(protect, admin, updateOrderStatus)

// 기존 라우트는 유지하고 아래 라우트를 추가합니다

// 최근 판매 내역 가져오기 (관리자만 접근 가능)
router.get("/recent", protect, admin, getRecentSales)

export default router
