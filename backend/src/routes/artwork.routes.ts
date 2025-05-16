import express from "express"
import {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from "../controllers/artwork.controller"
import { protect, admin } from "../middleware/auth.middleware"

const router = express.Router()

router.route("/").get(getAllArtworks).post(protect, admin, createArtwork)

router.route("/:id").get(getArtworkById).put(protect, admin, updateArtwork).delete(protect, admin, deleteArtwork)

export default router
