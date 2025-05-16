"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminAuth } from "@/lib/admin-auth"

export default function SettingsPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    // 일반 설정
    siteName: "아티스트 포트폴리오",
    siteDescription: "아티스트의 작품을 소개하는 포트폴리오 웹사이트입니다.",
    language: "ko",

    // 판매 설정
    enableSales: true,
    currency: "KRW",
    taxRate: 10,
    shippingFee: 3000,
    freeShippingThreshold: 100000,

    // 알림 설정
    emailNotifications: true,
    smsNotifications: false,
    newsletterEnabled: true,
    newsletterFrequency: "monthly",

    // 보안 설정
    twoFactorAuth: false,
    sessionTimeout: 60,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // 실제 구현에서는 API 호출로 설정 데이터를 저장합니다
    // 이 예제에서는 로컬 스토리지에 저장합니다
    localStorage.setItem("site_settings", JSON.stringify(settings))

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
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-gray-500">사이트 설정을 관리하세요.</p>
      </div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="sales">판매</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
              <CardDescription>사이트의 기본 설정을 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">사이트 이름</Label>
                  <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">사이트 설명</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">언어</Label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="ko">한국어</option>
                    <option value="en">영어</option>
                    <option value="ja">일본어</option>
                    <option value="zh">중국어</option>
                  </select>
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "저장 중..." : "저장하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>판매 설정</CardTitle>
              <CardDescription>작품 판매와 관련된 설정을 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableSales">판매 활성화</Label>
                  <Switch
                    id="enableSales"
                    checked={settings.enableSales}
                    onCheckedChange={(checked) => handleSwitchChange("enableSales", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">통화</Label>
                  <select
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="KRW">한국 원 (₩)</option>
                    <option value="USD">미국 달러 ($)</option>
                    <option value="EUR">유로 (€)</option>
                    <option value="JPY">일본 엔 (¥)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">세율 (%)</Label>
                  <Input id="taxRate" name="taxRate" type="number" value={settings.taxRate} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">기본 배송비 (원)</Label>
                  <Input
                    id="shippingFee"
                    name="shippingFee"
                    type="number"
                    value={settings.shippingFee}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">무료 배송 기준 금액 (원)</Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={handleChange}
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
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 및 뉴스레터 설정을 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">이메일 알림</Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS 알림</Label>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="newsletterEnabled">뉴스레터 활성화</Label>
                  <Switch
                    id="newsletterEnabled"
                    checked={settings.newsletterEnabled}
                    onCheckedChange={(checked) => handleSwitchChange("newsletterEnabled", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newsletterFrequency">뉴스레터 발송 주기</Label>
                  <select
                    id="newsletterFrequency"
                    name="newsletterFrequency"
                    value={settings.newsletterFrequency}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="weekly">주간</option>
                    <option value="biweekly">격주</option>
                    <option value="monthly">월간</option>
                    <option value="quarterly">분기</option>
                  </select>
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "저장 중..." : "저장하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>계정 보안 설정을 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">2단계 인증</Label>
                    <p className="text-sm text-gray-500">로그인 시 추가 인증 단계를 요구합니다.</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSwitchChange("twoFactorAuth", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">세션 타임아웃 (분)</Label>
                  <Input
                    id="sessionTimeout"
                    name="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">지정된 시간 동안 활동이 없으면 자동으로 로그아웃됩니다.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
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
