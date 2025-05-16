import express from "express"
import { getDashboardStats } from "../controllers/dashboard.controller"
import { protect, admin } from "../middleware/auth.middleware"

const router = express.Router()

// 대시보드 통계 데이터 가져오기 (관리자만 접근 가능)
router.get("/stats", protect, admin, getDashboardStats)

export default router
