"use client"

import { useEffect, useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getSiteContent, saveSiteContent } from "@/lib/content-actions"
import type { SiteContent } from "@/lib/content-types"
import { defaultSiteContent } from "@/lib/content-types"
import { useAdminAuth } from "@/lib/admin-auth"

export default function ContentManagementPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const { toast } = useToast()
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 콘텐츠 데이터 가져오기
    const siteContent = getSiteContent()
    setContent(siteContent)
  }, [])

  const handleChange = (page: keyof SiteContent, section: string, field: string, value: string) => {
    setContent((prev) => {
      const newContent = { ...prev }

      if (section === "") {
        // 직접 필드 접근 (예: footer.copyright)
        newContent[page][field] = value
      } else if (field === "") {
        // 섹션 자체가 문자열인 경우 (예: about.bio)
        newContent[page][section] = value
      } else {
        // 중첩된 객체 접근 (예: home.hero.title)
        newContent[page][section][field] = value
      }

      return newContent
    })
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: {
          ...prev.footer.socialLinks,
          [platform]: value,
        },
      },
    }))
  }

  const handleHoursChange = (day: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        hours: {
          ...prev.contact.hours,
          [day]: value,
        },
      },
    }))
  }

  const handleSave = () => {
    setIsSaving(true)

    // 콘텐츠 저장
    saveSiteContent(content)

    // 저장 완료 알림
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "콘텐츠 저장 완료",
        description: "웹사이트 콘텐츠가 성공적으로 저장되었습니다.",
      })
    }, 500)
  }

  const handleReset = () => {
    if (window.confirm("모든 콘텐츠를 기본값으로 초기화하시겠습니까?")) {
      setContent(defaultSiteContent)
      saveSiteContent(defaultSiteContent)
      toast({
        title: "콘텐츠 초기화 완료",
        description: "모든 콘텐츠가 기본값으로 초기화되었습니다.",
      })
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">콘텐츠 관리</h1>
          <p className="text-gray-500">웹사이트의 모든 텍스트 콘텐츠를 관리하세요.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            기본값으로 초기화
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "저장 중..." : "모든 변경사항 저장"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="home">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="home">홈페이지</TabsTrigger>
          <TabsTrigger value="about">소개</TabsTrigger>
          <TabsTrigger value="gallery">갤러리</TabsTrigger>
          <TabsTrigger value="contact">연락처</TabsTrigger>
          <TabsTrigger value="footer">푸터</TabsTrigger>
        </TabsList>

        {/* 홈페이지 콘텐츠 */}
        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>히어로 섹션</CardTitle>
              <CardDescription>홈페이지 상단에 표시되는 주요 메시지입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home-hero-title">제목</Label>
                <Input
                  id="home-hero-title"
                  value={content.home.hero.title}
                  onChange={(e) => handleChange("home", "hero", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="home-hero-description">설명</Label>
                <Textarea
                  id="home-hero-description"
                  value={content.home.hero.description}
                  onChange={(e) => handleChange("home", "hero", "description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>대표 작품 섹션</CardTitle>
              <CardDescription>홈페이지에 표시되는 대표 작품 섹션입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home-featured-title">제목</Label>
                <Input
                  id="home-featured-title"
                  value={content.home.featuredWorks.title}
                  onChange={(e) => handleChange("home", "featuredWorks", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="home-featured-description">설명</Label>
                <Textarea
                  id="home-featured-description"
                  value={content.home.featuredWorks.description}
                  onChange={(e) => handleChange("home", "featuredWorks", "description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>아티스트 소개 섹션</CardTitle>
              <CardDescription>홈페이지에 표시되는 아티스트 소개 섹션입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home-artist-title">제목</Label>
                <Input
                  id="home-artist-title"
                  value={content.home.artistIntro.title}
                  onChange={(e) => handleChange("home", "artistIntro", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="home-artist-description">설명</Label>
                <Textarea
                  id="home-artist-description"
                  value={content.home.artistIntro.description}
                  onChange={(e) => handleChange("home", "artistIntro", "description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 소개 페이지 콘텐츠 */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>아티스트 소개</CardTitle>
              <CardDescription>소개 페이지 상단에 표시되는 내용입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-intro-title">제목</Label>
                <Input
                  id="about-intro-title"
                  value={content.about.intro.title}
                  onChange={(e) => handleChange("about", "intro", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-intro-description">간략 소개</Label>
                <Textarea
                  id="about-intro-description"
                  value={content.about.intro.description}
                  onChange={(e) => handleChange("about", "intro", "description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>상세 소개</CardTitle>
              <CardDescription>아티스트의 상세 소개 내용입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="about-bio">상세 소개 내용</Label>
                <Textarea
                  id="about-bio"
                  value={content.about.bio}
                  onChange={(e) => handleChange("about", "bio", "", e.target.value)}
                  rows={10}
                />
                <p className="text-xs text-gray-500">줄바꿈은 \n으로 입력하세요.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>전시 이력</CardTitle>
              <CardDescription>전시 이력 섹션의 제목과 설명입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-exhibitions-title">제목</Label>
                <Input
                  id="about-exhibitions-title"
                  value={content.about.exhibitions.title}
                  onChange={(e) => handleChange("about", "exhibitions", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-exhibitions-description">설명</Label>
                <Textarea
                  id="about-exhibitions-description"
                  value={content.about.exhibitions.description}
                  onChange={(e) => handleChange("about", "exhibitions", "description", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>작가 노트</CardTitle>
              <CardDescription>작가의 예술 철학과 작업 방향에 대한 설명입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="about-statement">작가 노트</Label>
                <Textarea
                  id="about-statement"
                  value={content.about.artistStatement}
                  onChange={(e) => handleChange("about", "artistStatement", "", e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 갤러리 페이지 콘텐츠 */}
        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>갤러리 페이지</CardTitle>
              <CardDescription>갤러리 페이지 상단에 표시되는 내용입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gallery-title">제목</Label>
                <Input
                  id="gallery-title"
                  value={content.gallery.title}
                  onChange={(e) => handleChange("gallery", "title", "", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery-description">설명</Label>
                <Textarea
                  id="gallery-description"
                  value={content.gallery.description}
                  onChange={(e) => handleChange("gallery", "description", "", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 연락처 페이지 콘텐츠 */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>연락처 페이지</CardTitle>
              <CardDescription>연락처 페이지 상단에 표시되는 내용입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-title">제목</Label>
                <Input
                  id="contact-title"
                  value={content.contact.title}
                  onChange={(e) => handleChange("contact", "title", "", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-description">설명</Label>
                <Textarea
                  id="contact-description"
                  value={content.contact.description}
                  onChange={(e) => handleChange("contact", "description", "", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>연락처 정보</CardTitle>
              <CardDescription>연락처 페이지에 표시되는 연락처 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-address">주소</Label>
                <Input
                  id="contact-address"
                  value={content.contact.address}
                  onChange={(e) => handleChange("contact", "address", "", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">이메일</Label>
                <Input
                  id="contact-email"
                  value={content.contact.email}
                  onChange={(e) => handleChange("contact", "email", "", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">전화번호</Label>
                <Input
                  id="contact-phone"
                  value={content.contact.phone}
                  onChange={(e) => handleChange("contact", "phone", "", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 시간</CardTitle>
              <CardDescription>연락처 페이지에 표시되는 운영 시간 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hours-weekdays">월요일 - 금요일</Label>
                <Input
                  id="hours-weekdays"
                  value={content.contact.hours.weekdays}
                  onChange={(e) => handleHoursChange("weekdays", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-saturday">토요일</Label>
                <Input
                  id="hours-saturday"
                  value={content.contact.hours.saturday}
                  onChange={(e) => handleHoursChange("saturday", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-sunday">일요일</Label>
                <Input
                  id="hours-sunday"
                  value={content.contact.hours.sunday}
                  onChange={(e) => handleHoursChange("sunday", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>뉴스레터</CardTitle>
              <CardDescription>연락처 페이지에 표시되는 뉴스레터 섹션입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newsletter-title">제목</Label>
                <Input
                  id="newsletter-title"
                  value={content.contact.newsletter.title}
                  onChange={(e) => handleChange("contact", "newsletter", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-description">설명</Label>
                <Textarea
                  id="newsletter-description"
                  value={content.contact.newsletter.description}
                  onChange={(e) => handleChange("contact", "newsletter", "description", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-disclaimer">면책 조항</Label>
                <Input
                  id="newsletter-disclaimer"
                  value={content.contact.newsletter.disclaimer}
                  onChange={(e) => handleChange("contact", "newsletter", "disclaimer", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 푸터 콘텐츠 */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>푸터 정보</CardTitle>
              <CardDescription>모든 페이지 하단에 표시되는 푸터 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer-copyright">저작권 텍스트</Label>
                <Input
                  id="footer-copyright"
                  value={content.footer.copyright}
                  onChange={(e) => handleChange("footer", "copyright", "", e.target.value)}
                />
                <p className="text-xs text-gray-500">{"{year}"}는 현재 연도로 자동 대체됩니다.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>소셜 미디어 링크</CardTitle>
              <CardDescription>푸터에 표시되는 소셜 미디어 링크 텍스트입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-instagram">인스타그램</Label>
                <Input
                  id="social-instagram"
                  value={content.footer.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-twitter">트위터</Label>
                <Input
                  id="social-twitter"
                  value={content.footer.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "저장 중..." : "모든 변경사항 저장"}
        </Button>
      </div>
    </div>
  )
}
