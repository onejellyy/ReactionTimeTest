"use client"

import Image from "next/image"
import { getPageContent } from "@/lib/content-actions"

export default function AboutPage() {
  const content = getPageContent("about")

  // 전시 이력 데이터 (실제로는 데이터베이스나 CMS에서 가져올 수 있습니다)
  const exhibitions = [
    {
      year: "2023",
      title: "자연과 도시의 조화",
      location: "서울 현대 미술관",
      description: "개인전",
    },
    {
      year: "2022",
      title: "빛과 그림자",
      location: "부산 아트 갤러리",
      description: "그룹전",
    },
    {
      year: "2021",
      title: "현대 미술의 새로운 시각",
      location: "대구 예술 센터",
      description: "초대전",
    },
    {
      year: "2020",
      title: "색채의 향연",
      location: "인천 문화 예술관",
      description: "기획전",
    },
    {
      year: "2019",
      title: "감성의 공간",
      location: "광주 비엔날레",
      description: "참여 작가",
    },
  ]

  // 줄바꿈 처리
  const bioWithLineBreaks = content.bio.split("\\n").map((line, i) => <p key={i}>{line}</p>)

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 items-start">
            <div className="relative aspect-square w-full max-w-md mx-auto md:mx-0">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="아티스트 프로필"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">{content.intro.title}</h1>
              <p className="text-gray-500 md:text-xl/relaxed">{content.intro.description}</p>
              <div className="space-y-4 text-gray-500">{bioWithLineBreaks}</div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">{content.exhibitions.title}</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">{content.exhibitions.description}</p>
          </div>
          <div className="mt-8 border-t border-gray-200">
            {exhibitions.map((exhibition, index) => (
              <div key={index} className="py-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="font-medium">{exhibition.year}</div>
                  <div className="md:col-span-3">
                    <h3 className="font-bold">{exhibition.title}</h3>
                    <p className="text-gray-500">{exhibition.location}</p>
                    <p className="text-sm text-gray-500 mt-1">{exhibition.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter">작가 노트</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed italic">{content.artistStatement}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
