"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAdmin } from "@/contexts/admin-context"

export function HiddenAdminButton() {
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAdmin()
  const { toast } = useToast()

  // 클릭 카운터 리셋 타이머
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0)
      }, 2000) // 2초 동안 클릭이 없으면 카운터 리셋
      return () => clearTimeout(timer)
    }
  }, [clickCount, lastClickTime])

  const handleClick = () => {
    const now = Date.now()

    // 마지막 클릭으로부터 500ms 이내에 클릭된 경우에만 카운트
    if (now - lastClickTime < 500 || clickCount === 0) {
      const newCount = clickCount + 1
      setClickCount(newCount)

      // 5번 클릭하면 다이얼로그 열기
      if (newCount >= 5) {
        setIsDialogOpen(true)
        setClickCount(0)
      }
    } else {
      // 시간이 너무 지났으면 카운터 리셋
      setClickCount(1)
    }

    setLastClickTime(now)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = login(password)

    if (success) {
      toast({
        title: "관리자 모드 활성화",
        description: "관리자 모드가 활성화되었습니다.",
      })
      setIsDialogOpen(false)
    } else {
      toast({
        title: "인증 실패",
        description: "비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      })
    }

    setPassword("")
    setIsSubmitting(false)
  }

  return (
    <>
      <div className="w-4 h-4 mx-1" onClick={handleClick}></div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관리자 인증</DialogTitle>
            <DialogDescription>관리자 기능을 사용하려면 비밀번호를 입력하세요.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "인증 중..." : "확인"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
