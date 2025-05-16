"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAdminAuth } from "@/lib/admin-auth"

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "아티스트 이름",
    email: "artist@example.com",
    phone: "02-123-4567",
    address: "서울특별시 강남구 예술로 123, 아트 스튜디오 501호",
    bio: "2010년부터 활동을 시작한 현대 미술 작가로, 자연과 도시의 조화를 주제로 작업하고 있습니다. 서울대학교 미술대학 서양화과를 졸업하고, 파리 국립 고등 미술학교에서 석사 학위를 취득했습니다.",
    artistStatement:
      "예술은 우리의 일상을 새롭게 바라보는 창문이 되어야 한다는 철학을 바탕으로, 관람객들이 작품을 통해 자신의 삶과 주변 환경을 다시 생각해볼 수 있는 기회를 제공하고자 합니다.",
    instagram: "instagram.com/artist",
    twitter: "twitter.com/artist",
    website: "www.artist-portfolio.com",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // 실제 구현에서는 API 호출로 프로필 데이터를 저장합니다
    // 이 예제에서는 로컬 스토리지에 저장합니다
    localStorage.setItem("artist_profile", JSON.stringify(profileData))

    setTimeout(() => {
      setIsSaving(false)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">프로필 관리</h1>
        <p className="text-gray-500">개인 정보와 작가 소개를 관리하세요.</p>
      </div>
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">개인 정보</TabsTrigger>
          <TabsTrigger value="bio">작가 소개</TabsTrigger>
          <TabsTrigger value="social">소셜 미디어</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>개인 정보</CardTitle>
              <CardDescription>기본 정보를 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" name="email" type="email" value={profileData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input id="address" name="address" value={profileData.address} onChange={handleChange} />
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "저장 중..." : "저장하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>작가 소개</CardTitle>
              <CardDescription>작가 소개와 작가 노트를 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">작가 소개</Label>
                  <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleChange} rows={5} />
                  <p className="text-xs text-gray-500">작가의 경력, 학력, 작업 방향 등을 소개하는 내용을 작성하세요.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artistStatement">작가 노트</Label>
                  <Textarea
                    id="artistStatement"
                    name="artistStatement"
                    value={profileData.artistStatement}
                    onChange={handleChange}
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">작가로서의 철학, 작업 의도, 예술적 방향성 등을 작성하세요.</p>
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "저장 중..." : "저장하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>소셜 미디어</CardTitle>
              <CardDescription>소셜 미디어 계정 정보를 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">인스타그램</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={profileData.instagram}
                    onChange={handleChange}
                    placeholder="instagram.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">트위터</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleChange}
                    placeholder="twitter.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    name="website"
                    value={profileData.website}
                    onChange={handleChange}
                    placeholder="www.yourwebsite.com"
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "저장 중..." : "저장하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
