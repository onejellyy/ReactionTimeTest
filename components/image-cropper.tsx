"use client"

import { useCallback, useEffect, useState } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImageCropperProps {
  open: boolean
  onClose: () => void
  src: string
  onCropComplete: (croppedImageUrl: string) => void
  aspectRatio?: number
}

export function ImageCropper({ open, onClose, src, onCropComplete, aspectRatio = 4 / 3 }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90 / aspectRatio,
    x: 5,
    y: 5,
  })
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  const onImageLoad = useCallback(
    (img: HTMLImageElement) => {
      setImageRef(img)

      // 이미지 로드 시 초기 크롭 영역 설정
      const width = 90
      const height = width / aspectRatio
      setCrop({
        unit: "%",
        width,
        height,
        x: (100 - width) / 2,
        y: (100 - height) / 2,
      })
    },
    [aspectRatio],
  )

  const getCroppedImg = useCallback(() => {
    if (!imageRef || !completedCrop) return

    const canvas = document.createElement("canvas")
    const scaleX = imageRef.naturalWidth / imageRef.width
    const scaleY = imageRef.naturalHeight / imageRef.height
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      return
    }

    canvas.width = completedCrop.width
    canvas.height = completedCrop.height

    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    )

    return canvas.toDataURL("image/jpeg")
  }, [imageRef, completedCrop])

  const handleCropComplete = useCallback(() => {
    const croppedImageUrl = getCroppedImg()
    if (croppedImageUrl) {
      onCropComplete(croppedImageUrl)
      onClose()
    }
  }, [getCroppedImg, onCropComplete, onClose])

  // 다이얼로그가 닫힐 때 크롭 상태 초기화
  useEffect(() => {
    if (!open) {
      setCompletedCrop(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>이미지 자르기</DialogTitle>
          <DialogDescription>작품 이미지를 원하는 영역으로 조정하세요. 최적의 비율은 4:3입니다.</DialogDescription>
        </DialogHeader>
        <div className="py-4 overflow-auto max-h-[60vh]">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            className="max-w-full"
          >
            <img
              src={src || "/placeholder.svg"}
              alt="크롭할 이미지"
              onLoad={(e) => onImageLoad(e.currentTarget)}
              className="max-w-full"
            />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleCropComplete}>적용하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
