"use client"

import { useEffect, useState } from "react"
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminAuth } from "@/lib/admin-auth"
import { getDashboardData } from "@/lib/dashboard-service"

// 판매 내역 타입 정의
interface Sale {
  _id: string
  title: string
  buyer: string
  price: number
  date: string
}

// 인기 작품 타입 정의
interface PopularArtwork {
  _id: string
  title: string
  year: string
  views: number
  sales: number
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalVisitors: 0,
  })
  const [recentSales, setRecentSales] = useState<Sale[]>([])
  const [popularArtworks, setPopularArtworks] = useState<PopularArtwork[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return

      setIsDataLoading(true)
      try {
        const result = await getDashboardData()

        if (result.success) {
          setStats(result.stats)
          setRecentSales(result.recentSales)
          setPopularArtworks(result.popularArtworks)
          setError(null)
        } else {
          setError(result.error)
        }
      } catch (err) {
        console.error("대시보드 데이터 로딩 중 오류:", err)
        setError("데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated])

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

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {isDataLoading ? (
        <div className="text-center py-10">데이터를 불러오는 중...</div>
      ) : (
        <>
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
                  {recentSales.length > 0 ? (
                    <div className="space-y-2">
                      {recentSales.map((sale) => (
                        <div key={sale._id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{sale.title}</p>
                            <p className="text-sm text-gray-500">구매자: {sale.buyer}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{sale.price.toLocaleString()}원</p>
                            <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">최근 판매 내역이 없습니다.</div>
                  )}
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
                  {popularArtworks.length > 0 ? (
                    <div className="space-y-2">
                      {popularArtworks.map((artwork) => (
                        <div key={artwork._id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{artwork.title}</p>
                            <p className="text-sm text-gray-500">{artwork.year} 작품</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{artwork.views.toLocaleString()}회 조회</p>
                            <p className="text-sm text-gray-500">{artwork.sales}개 판매</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">인기 작품 데이터가 없습니다.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
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
