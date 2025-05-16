"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, Twitter } from "lucide-react"

import { getSiteContent } from "@/lib/content-actions"

export function SiteFooter() {
  const pathname = usePathname()
  const content = getSiteContent()

  // 관리자 페이지에서는 푸터를 표시하지 않음
  if (pathname.startsWith("/admin")) {
    return null
  }

  // 저작권 텍스트에서 연도 대체
  const copyrightText = content.footer.copyright.replace("{year}", new Date().getFullYear().toString())

  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500">{copyrightText}</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4">
          <Instagram className="h-4 w-4" />
          <span>{content.footer.socialLinks.instagram}</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4">
          <Twitter className="h-4 w-4" />
          <span>{content.footer.socialLinks.twitter}</span>
        </Link>
      </nav>
    </footer>
  )
}
