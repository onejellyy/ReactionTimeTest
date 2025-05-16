"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// 관리자 비밀번호 - 실제 구현에서는 환경 변수나 서버에서 관리해야 합니다
const ADMIN_PASSWORD = "artist123"

interface AdminContextType {
  isAdmin: boolean
  isLoading: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 페이지 로드 시 로컬 스토리지에서 관리자 상태 확인
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    if (adminStatus === "true") {
      setIsAdmin(true)
    }
    setIsLoading(false)
  }, [])

  // 관리자 로그인
  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      return true
    }
    return false
  }

  // 관리자 로그아웃
  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
    router.push("/")
  }

  return <AdminContext.Provider value={{ isAdmin, isLoading, login, logout }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
