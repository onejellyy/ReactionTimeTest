"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/contexts/admin-context"

export function useAdminAuth() {
  const { isAdmin } = useAdmin()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 관리자 상태 확인
    setIsAuthenticated(isAdmin)
    setIsLoading(false)
  }, [isAdmin])

  return { isAuthenticated, isLoading }
}
