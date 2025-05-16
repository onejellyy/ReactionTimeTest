"use client"

import { useEffect, useState } from "react"
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminAuth } from "@/lib/admin-auth"

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalVisitors: 0,
  })

  useEffect(() => {
    // 실제 구현에서는 API 호출로 통계 데이터를 가져옵니다
    // 이 예제에서는 로컬 스토리지에서 작품 데이터를 가져와 통계를 계산합니다
    const artworksData = localStorage.getItem("artworks")
    const artworks = artworksData ? JSON.parse(artworksData) : []

    // 임의의 통계 데이터 생성
    setStats({
      totalArtworks: artworks.length || 9,
      totalSales: Math.floor(Math.random() * 50) + 10,
      totalRevenue: (Math.floor(Math.random() * 5000) + 1000) * 10000,
      totalVisitors: Math.floor(Math.random() * 1000) + 500,
    })
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">로딩 중...</div>
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-gray-500">작품 관리 및 판매 현황을 확인하세요.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 작품 수</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArtworks}점</div>
            <p className="text-xs text-gray-500">전체 등록된 작품 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">판매 작품 수</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}점</div>
            <p className="text-xs text-gray-500">지금까지 판매된 작품 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수익</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}원</div>
            <p className="text-xs text-gray-500">총 판매 수익</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">방문자 수</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors}명</div>
            <p className="text-xs text-gray-500">이번 달 방문자 수</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">최근 판매</TabsTrigger>
          <TabsTrigger value="popular">인기 작품</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 판매 내역</CardTitle>
              <CardDescription>최근에 판매된 작품 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">작품 제목 {i}</p>
                      <p className="text-sm text-gray-500">구매자: 홍길동{i}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(650000 + i * 50000).toLocaleString()}원</p>
                      <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>인기 작품</CardTitle>
              <CardDescription>가장 많이 조회된 작품 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[3, 1, 5, 2, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">작품 제목 {i}</p>
                      <p className="text-sm text-gray-500">{2020 + Math.floor(i / 3)}년 작품</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{1000 - i * 100}회 조회</p>
                      <p className="text-sm text-gray-500">{i}개 판매</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AdminLogin() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">관리자 로그인</CardTitle>
          <CardDescription>계정 정보를 입력하여 관리자 페이지에 접속하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-md bg-black p-2 text-white"
              onClick={() => {
                // 실제 구현에서는 서버에 인증 요청을 보내야 합니다
                // 이 예제에서는 로컬 스토리지에 인증 상태를 저장합니다
                localStorage.setItem("admin_authenticated", "true")
                window.location.reload()
              }}
            >
              로그인
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
