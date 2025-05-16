"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Plus, Search, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAdmin } from "@/contexts/admin-context"
import { getAllArtworks, deleteArtwork } from "@/lib/artwork-service"

export default function ArtworksPage() {
  const { isAdmin } = useAdmin()
  const { toast } = useToast()
  const [artworks, setArtworks] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [artworkToDelete, setArtworkToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingArtworks, setLoadingArtworks] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const fetchArtworks = async () => {
      if (isAdmin) {
        setLoadingArtworks(true)
        const result = await getAllArtworks()

        if (result.success) {
          setArtworks(result.data)
        } else {
          toast({
            title: "오류",
            description: result.error || "작품 목록을 불러오는 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        }
        setLoadingArtworks(false)
      }
    }

    fetchArtworks()
  }, [isAdmin, toast])

  // 작품 삭제 처리
  const handleDeleteArtwork = async () => {
    if (!artworkToDelete) return

    setIsDeleting(true)
    const result = await deleteArtwork(artworkToDelete._id)

    if (result.success) {
      setArtworks((prev) => prev.filter((artwork) => artwork._id !== artworkToDelete._id))
      toast({
        title: "작품 삭제 완료",
        description: "작품이 성공적으로 삭제되었습니다.",
      })
    } else {
      toast({
        title: "작품 삭제 실패",
        description: result.error || "작품을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }

    setIsDeleting(false)
    setDeleteDialogOpen(false)
    setArtworkToDelete(null)
  }

  // 검색 및 필터링
  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || artwork.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // 정렬
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "price-high":
        return b.price - a.price
      case "price-low":
        return a.price - b.price
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">작품 관리</h1>
          <p className="text-gray-500">작품을 추가, 수정, 삭제하세요.</p>
        </div>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="mr-2 h-4 w-4" />새 작품 추가
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="작품 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 카테고리</SelectItem>
            <SelectItem value="회화">회화</SelectItem>
            <SelectItem value="사진">사진</SelectItem>
            <SelectItem value="조각">조각</SelectItem>
            <SelectItem value="설치">설치</SelectItem>
            <SelectItem value="미디어">미디어</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
            <SelectItem value="price-high">가격 높은순</SelectItem>
            <SelectItem value="price-low">가격 낮은순</SelectItem>
            <SelectItem value="title-asc">제목 오름차순</SelectItem>
            <SelectItem value="title-desc">제목 내림차순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loadingArtworks ? (
        <div className="flex justify-center items-center py-12">
          <p>작품을 불러오는 중...</p>
        </div>
      ) : sortedArtworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <Search className="h-6 w-6 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">작품을 찾을 수 없습니다</h2>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "검색어와 일치하는 작품이 없습니다."
              : categoryFilter !== "all"
                ? "해당 카테고리에 작품이 없습니다."
                : "등록된 작품이 없습니다."}
          </p>
          <Button asChild>
            <Link href="/admin/artworks/new">
              <Plus className="mr-2 h-4 w-4" />새 작품 추가
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedArtworks.map((artwork) => (
            <Card key={artwork._id}>
              <CardHeader className="p-0">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
                  <Image src={artwork.image || "/placeholder.svg"} alt={artwork.title} fill className="object-cover" />
                  {!artwork.available && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive">판매 완료</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg">{artwork.title}</CardTitle>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">카테고리</span>
                    <span>{artwork.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">제작 연도</span>
                    <span>{artwork.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">가격</span>
                    <span className="font-medium">{artwork.price.toLocaleString()}원</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/artworks/${artwork._id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    수정
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setArtworkToDelete(artwork)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>작품 삭제</DialogTitle>
            <DialogDescription>정말로 이 작품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          {artworkToDelete && (
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={artworkToDelete.image || "/placeholder.svg"}
                  alt={artworkToDelete.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{artworkToDelete.title}</p>
                <p className="text-sm text-gray-500">
                  {artworkToDelete.category}, {artworkToDelete.year}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteArtwork} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
