import express from "express"
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller"
import { protect, admin } from "../middleware/auth.middleware"

const router = express.Router()

router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders)

router.get("/myorders", protect, getUserOrders)

router.route("/:id").get(protect, getOrderById).put(protect, admin, updateOrderStatus)

export default router
