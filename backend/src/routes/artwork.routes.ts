import express from "express"
import {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getPopularArtworks,
} from "../controllers/artwork.controller"
import { protect, admin } from "../middleware/auth.middleware"

const router = express.Router()

router.route("/").get(getAllArtworks).post(protect, admin, createArtwork)

router.route("/:id").get(getArtworkById).put(protect, admin, updateArtwork).delete(protect, admin, deleteArtwork)

// 기존 라우트는 유지하고 아래 라우트를 추가합니다

// 인기 작품 가져오기
router.get("/popular", getPopularArtworks)

export default router
