"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPageContent } from "@/lib/content-actions"
import { getAllArtworks } from "@/lib/artwork-service"

export default function GalleryPage() {
  const content = getPageContent("gallery")
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true)
      const result = await getAllArtworks()
      if (result.success) {
        setArtworks(result.data)
      }
      setLoading(false)
    }

    fetchArtworks()
  }, [])

  // 카테고리 필터링
  const filteredArtworks =
    category === "all" ? artworks : artworks.filter((artwork: any) => artwork.category === category)

  // 정렬
  const sortedArtworks = [...filteredArtworks].sort((a: any, b: any) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      default:
        return 0
    }
  })

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">{content.title}</h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {content.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === "all" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setCategory("all")}
              >
                전체
              </Button>
              <Button
                variant={category === "회화" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setCategory("회화")}
              >
                회화
              </Button>
              <Button
                variant={category === "사진" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setCategory("사진")}
              >
                사진
              </Button>
              <Button
                variant={category === "조각" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setCategory("조각")}
              >
                조각
              </Button>
            </div>
            <div className="w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">최신순</SelectItem>
                  <SelectItem value="oldest">오래된순</SelectItem>
                  <SelectItem value="price-asc">가격 낮은순</SelectItem>
                  <SelectItem value="price-desc">가격 높은순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p>작품을 불러오는 중...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArtworks.map((artwork: any) => (
                <Card key={artwork._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="block">
                      <Link href={`/artwork/${artwork._id}`} className="block">
                        <div className="relative aspect-[3/4] w-full">
                          <Image
                            src={artwork.image || "/placeholder.svg"}
                            alt={artwork.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/artwork/${artwork._id}`}>
                          <h3 className="font-medium">{artwork.title}</h3>
                          <p className="text-sm text-gray-500">
                            {artwork.category}, {artwork.year}
                          </p>
                          <p className="mt-2 font-medium">{artwork.price.toLocaleString()}원</p>
                        </Link>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/contact">구매 문의</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && sortedArtworks.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <p>해당 카테고리에 작품이 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
