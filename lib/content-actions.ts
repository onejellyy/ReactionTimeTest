"use client"

import type { SiteContent } from "./content-types"

import { defaultSiteContent } from "./content-types"

// 사이트 콘텐츠 가져오기
export function getSiteContent(): SiteContent {
  if (typeof window === "undefined") {
    return defaultSiteContent
  }

  const storedContent = localStorage.getItem("site_content")
  if (!storedContent) {
    localStorage.setItem("site_content", JSON.stringify(defaultSiteContent))
    return defaultSiteContent
  }

  return JSON.parse(storedContent)
}

// 사이트 콘텐츠 저장하기
export function saveSiteContent(content: SiteContent): void {
  if (typeof window === "undefined") return
  localStorage.setItem("site_content", JSON.stringify(content))
}

// 특정 페이지 콘텐츠 가져오기
export function getPageContent<T extends keyof SiteContent>(page: T): SiteContent[T] {
  const content = getSiteContent()
  return content[page]
}

// 특정 페이지 콘텐츠 저장하기
export function savePageContent<T extends keyof SiteContent>(page: T, pageContent: SiteContent[T]): void {
  const content = getSiteContent()
  content[page] = pageContent
  saveSiteContent(content)
}
