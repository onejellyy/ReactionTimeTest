"use client"

import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getPageContent } from "@/lib/content-actions"

export default function ContactPage() {
  const content = getPageContent("contact")

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">{content.title}</h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed">{content.description}</p>
              <div className="space-y-4 mt-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">주소</h3>
                    <p className="text-sm text-gray-500">{content.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">이메일</h3>
                    <p className="text-sm text-gray-500">{content.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">전화</h3>
                    <p className="text-sm text-gray-500">{content.phone}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-medium mb-2">운영 시간</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">월요일 - 금요일</div>
                  <div>{content.hours.weekdays}</div>
                  <div className="text-gray-500">토요일</div>
                  <div>{content.hours.saturday}</div>
                  <div className="text-gray-500">일요일</div>
                  <div>{content.hours.sunday}</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">문의하기</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input id="name" placeholder="홍길동" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" type="email" placeholder="example@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">제목</Label>
                    <select id="subject" name="subject" className="w-full rounded-md border border-gray-300 p-2">
                      <option value="general">일반 문의</option>
                      <option value="purchase">작품 구매 문의</option>
                      <option value="exhibition">전시 문의</option>
                      <option value="collaboration">협업 제안</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">메시지</Label>
                    <Textarea id="message" placeholder="문의 내용을 입력해주세요" className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full">
                    보내기
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter">{content.newsletter.title}</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed">{content.newsletter.description}</p>
            <div className="w-full max-w-md space-y-2">
              <form className="flex gap-2">
                <Input type="email" placeholder="이메일 주소를 입력하세요" className="flex-1" />
                <Button type="submit">구독하기</Button>
              </form>
              <p className="text-xs text-gray-500">{content.newsletter.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
