"use client"

import type React from "react"

import { useCallback, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { uploadImageToBlob } from "@/lib/blob-actions"

interface ImageUploadProps {
  value: string
  pathname: string
  onChange: (value: { url: string; pathname: string }) => void
  onDelete: () => void
  disabled?: boolean
}

export function ImageUpload({ value, pathname, onChange, onDelete, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled || isUploading) return

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFileUpload(file)
      }
    },
    [disabled, isUploading],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isUploading) return

    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image")) {
      alert("이미지 파일만 업로드할 수 있습니다.")
      return
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    setIsUploading(true)

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append("file", file)

      // 서버 액션을 통해 Vercel Blob에 업로드
      const result = await uploadImageToBlob(formData)

      if (result.success && result.url) {
        onChange({ url: result.url, pathname: result.pathname })
      } else {
        alert(result.error || "이미지 업로드에 실패했습니다.")
      }
    } catch (error) {
      console.error("업로드 오류:", error)
      alert("이미지 업로드 중 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onDelete()
    },
    [onDelete],
  )

  return (
    <div className="space-y-4 w-full">
      <Card
        className={`relative border-2 border-dashed transition-colors ${
          isDragging ? "border-black" : "border-gray-300"
        } hover:border-gray-400 ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isUploading) {
            document.getElementById("image-upload")?.click()
          }
        }}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          {isUploading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="h-12 w-12 mb-4 animate-spin" />
              <div className="text-lg font-medium">업로드 중...</div>
            </div>
          ) : value ? (
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={value || "/placeholder.svg"}
                alt="업로드된 이미지"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">이미지 삭제</span>
              </Button>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <ImagePlus className="h-12 w-12 mb-4" />
              <div className="text-lg font-medium">이미지를 업로드하세요</div>
              <div className="text-sm mt-1">클릭하거나 파일을 끌어다 놓으세요</div>
              <div className="text-xs mt-2">PNG, JPG, WEBP (최대 5MB)</div>
            </div>
          )}
        </CardContent>
      </Card>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  )
}
