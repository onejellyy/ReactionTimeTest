import type React from "react"
import Link from "next/link"
import { FileText, GalleryThumbnailsIcon as Gallery, Home, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/contexts/admin-context"

// 클라이언트 컴포넌트로 분리
function AdminHeader() {
  "use client"

  const { logout } = useAdmin()

  return (
    <div className="flex items-center gap-4">
      <div className="hidden items-center gap-4 md:flex">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          사이트로 이동
        </Link>
        <span className="text-sm text-gray-500">|</span>
        <span className="text-sm">관리자</span>
      </div>
      <Button variant="ghost" size="icon" onClick={logout}>
        <LogOut className="h-5 w-5" />
        <span className="sr-only">로그아웃</span>
      </Button>
    </div>
  )
}

// 클라이언트 컴포넌트로 분리
function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  "use client"

  const { isAdmin } = useAdmin()

  if (!isAdmin) {
    // 클라이언트 사이드에서 리다이렉트
    window.location.href = "/"
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="font-bold">
              아티스트 관리자
            </Link>
          </div>
          <AdminHeader />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-gray-50 md:flex">
          <nav className="grid gap-2 p-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Home className="h-4 w-4" />
              대시보드
            </Link>
            <Link
              href="/admin/artworks"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Gallery className="h-4 w-4" />
              작품 관리
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <FileText className="h-4 w-4" />
              콘텐츠 관리
            </Link>
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <User className="h-4 w-4" />
              프로필 관리
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
              설정
            </Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
