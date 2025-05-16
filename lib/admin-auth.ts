"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/contexts/admin-context"

export function useAdminAuth() {
  const { isAdmin, isLoading } = useAdmin()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 관리자 상태 확인
    if (!isLoading) {
      setIsAuthenticated(isAdmin)
    }
  }, [isAdmin, isLoading])

  return { isAuthenticated, isLoading }
}
