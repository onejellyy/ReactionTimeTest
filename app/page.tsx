"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getPageContent } from "@/lib/content-actions"

export default function Home() {
  const content = getPageContent("home")

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{content.hero.title}</h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {content.hero.description}
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/gallery">
                  <Button>
                    작품 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">연락하기</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-square relative">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="대표 작품"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{content.featuredWorks.title}</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {content.featuredWorks.description}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Link href={`/artwork/${item}`} key={item} className="group relative overflow-hidden rounded-lg">
                <Image
                  src={`/placeholder.svg?height=400&width=300`}
                  alt={`작품 ${item}`}
                  width={300}
                  height={400}
                  className="aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-medium">작품 제목 {item}</h3>
                    <p className="text-sm opacity-80">2023</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/gallery">
              <Button variant="outline">모든 작품 보기</Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{content.artistIntro.title}</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {content.artistIntro.description}
              </p>
              <Link href="/about">
                <Button variant="outline">더 알아보기</Button>
              </Link>
            </div>
            <div className="mx-auto w-full max-w-[400px] aspect-square relative">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="아티스트 프로필"
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
