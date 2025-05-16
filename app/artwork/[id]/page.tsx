"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { getArtworkById } from "@/lib/artwork-service"

export default function ArtworkPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [artwork, setArtwork] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [relatedArtworks, setRelatedArtworks] = useState<any[]>([])

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true)
      const result = await getArtworkById(params.id)

      if (result.success) {
        setArtwork(result.data)

        // 관련 작품 가져오기 (실제로는 API 호출로 구현)
        // 이 예제에서는 더미 데이터 사용
        setRelatedArtworks([
          {
            _id: "1",
            title: "관련 작품 1",
            year: 2022,
            category: "회화",
            price: 550000,
            image: `/placeholder.svg?height=400&width=300`,
          },
          {
            _id: "2",
            title: "관련 작품 2",
            year: 2022,
            category: "회화",
            price: 600000,
            image: `/placeholder.svg?height=400&width=300`,
          },
          {
            _id: "3",
            title: "관련 작품 3",
            year: 2022,
            category: "회화",
            price: 650000,
            image: `/placeholder.svg?height=400&width=300`,
          },
        ])
      } else {
        toast({
          title: "오류",
          description: result.error || "작품을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }

      setLoading(false)
    }

    fetchArtwork()
  }, [params.id, toast])

  if (loading) {
    return (
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12 flex justify-center items-center">
          <p>작품 정보를 불러오는 중...</p>
        </div>
      </main>
    )
  }

  if (!artwork) {
    return (
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <p>작품을 찾을 수 없습니다.</p>
          <Link href="/gallery" className="inline-flex items-center text-sm font-medium mt-4 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            갤러리로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <Link href="/gallery" className="inline-flex items-center text-sm font-medium mb-6 hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          갤러리로 돌아가기
        </Link>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
            <Image
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{artwork.title}</h1>
              <p className="text-gray-500">
                {artwork.year}, {artwork.category}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{artwork.price.toLocaleString()}원</p>
                <p className="text-sm text-gray-500">{artwork.available ? "구매 가능" : "판매 완료"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">찜하기</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">공유하기</span>
                </Button>
              </div>
            </div>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">상세 정보</TabsTrigger>
                <TabsTrigger value="shipping">배송 정보</TabsTrigger>
                <TabsTrigger value="returns">환불 정책</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">작가</div>
                  <div>아티스트 이름</div>
                  <div className="text-gray-500">제작 연도</div>
                  <div>{artwork.year}</div>
                  <div className="text-gray-500">재료</div>
                  <div>{artwork.medium}</div>
                  <div className="text-gray-500">크기</div>
                  <div>{artwork.dimensions}</div>
                </div>
                <p>{artwork.description}</p>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <p className="text-sm">
                  모든 작품은 주문 확인 후 3-5일 이내에 발송됩니다. 작품은 전문 포장 업체를 통해 안전하게 포장되어
                  배송됩니다. 국내 배송은 무료이며, 해외 배송의 경우 별도의 배송비가 부과됩니다.
                </p>
              </TabsContent>
              <TabsContent value="returns" className="pt-4">
                <p className="text-sm">
                  작품 수령 후 7일 이내에 작품 상태에 문제가 있을 경우 환불이 가능합니다. 단순 변심에 의한 환불은
                  불가능하며, 작품 상태에 문제가 있을 경우에만 환불이 가능합니다. 환불 요청 시 작품의 상태를 확인할 수
                  있는 사진을 함께 보내주셔야 합니다.
                </p>
              </TabsContent>
            </Tabs>
            <div className="space-y-4">
              <Button className="w-full" size="lg" asChild>
                <Link href="/contact">구매 문의하기</Link>
              </Button>
              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link href="/contact">문의하기</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">관련 작품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArtworks.map((relatedArtwork) => (
              <Link href={`/artwork/${relatedArtwork._id}`} key={relatedArtwork._id} className="group">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                  <Image
                    src={relatedArtwork.image || "/placeholder.svg"}
                    alt={relatedArtwork.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium">{relatedArtwork.title}</h3>
                  <p className="text-sm text-gray-500">
                    {relatedArtwork.category}, {relatedArtwork.year}
                  </p>
                  <p className="mt-1 font-medium">{relatedArtwork.price.toLocaleString()}원</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
