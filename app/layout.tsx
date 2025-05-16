import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { AdminProvider } from "@/contexts/admin-context"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "아티스트 포트폴리오",
  description: "아티스트의 작품을 소개하는 포트폴리오 웹사이트입니다.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AdminProvider>
          <div className="flex flex-col min-h-screen">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
          <Toaster />
        </AdminProvider>
      </body>
    </html>
  )
}
