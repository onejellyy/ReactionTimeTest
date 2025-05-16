import express from "express"
import { signup, login, getCurrentUser } from "../controllers/auth.controller"
import { protect } from "../middleware/auth.middleware"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", protect, getCurrentUser)

export default router
