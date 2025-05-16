"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HiddenAdminButton } from "@/components/hidden-admin-button"
import { useAdmin } from "@/contexts/admin-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const pathname = usePathname()
  const { isAdmin, logout } = useAdmin()

  // 관리자 페이지에서는 헤더를 표시하지 않음
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Home className="h-5 w-5 mr-2" />
          <span className="text-xl font-bold">아티스트 이름</span>
        </Link>
        <HiddenAdminButton />
      </div>
      <nav className="flex gap-4 sm:gap-6">
        <Link
          href="/"
          className={`text-sm font-medium hover:underline underline-offset-4 ${pathname === "/" ? "underline" : ""}`}
        >
          홈
        </Link>
        <Link
          href="/gallery"
          className={`text-sm font-medium hover:underline underline-offset-4 ${
            pathname === "/gallery" || pathname.startsWith("/artwork/") ? "underline" : ""
          }`}
        >
          작품
        </Link>
        <Link
          href="/about"
          className={`text-sm font-medium hover:underline underline-offset-4 ${
            pathname === "/about" ? "underline" : ""
          }`}
        >
          소개
        </Link>
        <Link
          href="/contact"
          className={`text-sm font-medium hover:underline underline-offset-4 ${
            pathname === "/contact" ? "underline" : ""
          }`}
        >
          연락처
        </Link>
      </nav>

      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">관리자 메뉴</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/admin">관리자 대시보드</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/artworks">작품 관리</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/content">콘텐츠 관리</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">프로필 관리</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">설정</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              관리자 모드 종료
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
