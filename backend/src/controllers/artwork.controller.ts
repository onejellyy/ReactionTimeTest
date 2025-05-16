import type { Request, Response } from "express"
import Artwork from "../models/artwork.model"

// 모든 작품 가져오기
export const getAllArtworks = async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: artworks.length,
      data: artworks,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 작품 상세 정보 가져오기
export const getArtworkById = async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.findById(req.params.id)

    if (!artwork) {
      return res.status(404).json({
        success: false,
        error: "작품을 찾을 수 없습니다",
      })
    }

    res.status(200).json({
      success: true,
      data: artwork,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 작품 생성
export const createArtwork = async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.create(req.body)

    res.status(201).json({
      success: true,
      data: artwork,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 작품 업데이트
export const updateArtwork = async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!artwork) {
      return res.status(404).json({
        success: false,
        error: "작품을 찾을 수 없습니다",
      })
    }

    res.status(200).json({
      success: true,
      data: artwork,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 작품 삭제
export const deleteArtwork = async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.findByIdAndDelete(req.params.id)

    if (!artwork) {
      return res.status(404).json({
        success: false,
        error: "작품을 찾을 수 없습니다",
      })
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
