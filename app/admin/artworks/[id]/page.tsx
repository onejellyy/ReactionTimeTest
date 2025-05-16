"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/image-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { deleteImageFromBlob } from "@/lib/blob-actions"
import { useAdminAuth } from "@/lib/admin-auth"

// 작품 타입 정의
interface Artwork {
  id: number
  title: string
  year: number
  category: string
  medium: string
  dimensions: string
  price: number
  description: string
  image: string
  imagePath: string
  available: boolean
}

export default function EditArtworkPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [formData, setFormData] = useState<Partial<Artwork>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 작품 데이터 가져오기
    const storedArtworks = localStorage.getItem("artworks")

    if (storedArtworks) {
      const artworks = JSON.parse(storedArtworks)
      const foundArtwork = artworks.find((a: Artwork) => a.id === Number(params.id))

      if (foundArtwork) {
        setArtwork(foundArtwork)
        setFormData(foundArtwork)
      } else if (params.id === "new") {
        // 새 작품 추가 시 기본값 설정
        const newId = artworks.length > 0 ? Math.max(...artworks.map((a: Artwork) => a.id)) + 1 : 1
        const newArtwork = {
          id: newId,
          title: "",
          year: new Date().getFullYear(),
          category: "회화",
          medium: "",
          dimensions: "",
          price: 500000,
          description: "",
          image: "",
          imagePath: "",
          available: true,
        }
        setArtwork(newArtwork)
        setFormData(newArtwork)
      }
    }
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "year" ? Number(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      available: checked,
    }))
  }

  const handleImageChange = ({ url, pathname }: { url: string; pathname: string }) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
      imagePath: pathname,
    }))
  }

  const handleImageDelete = async () => {
    // 기존 이미지가 있으면 Vercel Blob에서 삭제
    if (formData.imagePath) {
      await deleteImageFromBlob(formData.imagePath)
    }

    setFormData((prev) => ({
      ...prev,
      image: "",
      imagePath: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // 로컬 스토리지에서 작품 데이터 가져오기
    const storedArtworks = localStorage.getItem("artworks")
    let artworks = storedArtworks ? JSON.parse(storedArtworks) : []

    if (params.id === "new") {
      // 새 작품 추가
      artworks.push(formData)
    } else {
      // 기존 작품 수정
      const oldArtwork = artworks.find((a: Artwork) => a.id === Number(params.id))

      // 이미지가 변경되었고 기존 이미지가 있으면 Vercel Blob에서 삭제
      if (oldArtwork && oldArtwork.imagePath && oldArtwork.imagePath !== formData.imagePath) {
        await deleteImageFromBlob(oldArtwork.imagePath)
      }

      artworks = artworks.map((a: Artwork) => (a.id === Number(params.id) ? { ...a, ...formData } : a))
    }

    localStorage.setItem("artworks", JSON.stringify(artworks))

    // 저장 후 작품 목록 페이지로 이동
    setTimeout(() => {
      setIsSaving(false)
      router.push("/admin/artworks")
    }, 500)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">로딩 중...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>로그인이 필요합니다.</p>
      </div>
    )
  }

  if (!artwork && params.id !== "new") {
    return (
      <div className="flex items-center justify-center h-full">
        <p>작품을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/artworks" className="inline-flex items-center text-sm font-medium hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          작품 목록으로 돌아가기
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{params.id === "new" ? "새 작품 추가" : "작품 수정"}</h1>
        <p className="text-gray-500">작품 정보를 입력하고 저장하세요.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>작품 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">작품 제목</Label>
                <Input id="title" name="title" value={formData.title || ""} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">제작 연도</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year || new Date().getFullYear()}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select
                    value={formData.category || "회화"}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="회화">회화</SelectItem>
                      <SelectItem value="사진">사진</SelectItem>
                      <SelectItem value="조각">조각</SelectItem>
                      <SelectItem value="설치">설치</SelectItem>
                      <SelectItem value="미디어">미디어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">재료</Label>
                <Input
                  id="medium"
                  name="medium"
                  value={formData.medium || ""}
                  onChange={handleChange}
                  placeholder="예: 캔버스에 아크릴"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">크기</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions || ""}
                  onChange={handleChange}
                  placeholder="예: 100 x 80 cm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">가격 (원)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || 0}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">작품 설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>작품 이미지</Label>
                <ImageUpload
                  value={formData.image || ""}
                  pathname={formData.imagePath || ""}
                  onChange={handleImageChange}
                  onDelete={handleImageDelete}
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="available" checked={formData.available} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="available">판매 가능</Label>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "저장 중..." : "저장하기"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>작품 미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <div className="relative aspect-[4/3] w-full bg-gray-100 flex items-center justify-center">
                  {formData.image ? (
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt={formData.title || "작품 미리보기"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">이미지 없음</div>
                  )}
                  {formData.available === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                        판매 완료
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{formData.title || "작품 제목"}</h3>
                  <p className="text-sm text-gray-500">
                    {formData.category || "카테고리"}, {formData.year || new Date().getFullYear()}
                  </p>
                  <p className="mt-2 font-medium">{(formData.price || 0).toLocaleString()}원</p>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {formData.description || "작품 설명이 여기에 표시됩니다."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vercel Blob 스토리지 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>이미지 저장소:</strong> Vercel Blob
                </p>
                {formData.imagePath && (
                  <p>
                    <strong>이미지 경로:</strong> {formData.imagePath}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  이미지는 Vercel Blob 스토리지에 안전하게 저장됩니다. 이미지는 전 세계 CDN을 통해 빠르게 제공되며,
                  자동으로 최적화됩니다.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>도움말</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>작품 이미지:</strong> 작품 이미지를 업로드하려면 이미지 영역을 클릭하거나 파일을 끌어다
                  놓으세요. 이미지는 Vercel Blob 스토리지에 저장됩니다.
                </p>
                <p>
                  <strong>작품 제목:</strong> 작품의 공식 제목을 입력하세요.
                </p>
                <p>
                  <strong>제작 연도:</strong> 작품이 완성된 연도를 입력하세요.
                </p>
                <p>
                  <strong>카테고리:</strong> 작품의 주요 카테고리를 선택하세요.
                </p>
                <p>
                  <strong>재료:</strong> 작품에 사용된 재료를 입력하세요. (예: 캔버스에 아크릴, 디지털 프린트)
                </p>
                <p>
                  <strong>크기:</strong> 작품의 물리적 크기를 입력하세요. (예: 100 x 80 cm)
                </p>
                <p>
                  <strong>가격:</strong> 작품의 판매 가격을 원 단위로 입력하세요.
                </p>
                <p>
                  <strong>작품 설명:</strong> 작품에 대한 설명, 영감, 제작 과정 등을 자세히 입력하세요.
                </p>
                <p>
                  <strong>판매 가능:</strong> 작품이 현재 판매 가능한 상태인지 체크하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
