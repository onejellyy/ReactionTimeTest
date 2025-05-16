"use server"

import { del, put } from "@vercel/blob"

/**
 * Vercel Blob에 이미지를 업로드하는 서버 액션
 */
export async function uploadImageToBlob(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "파일이 없습니다." }
    }

    // 파일 확장자 추출
    const fileExtension = file.name.split(".").pop() || "jpg"

    // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

    // 작품 이미지 폴더에 저장
    const pathname = `artwork-images/${uniqueFilename}`

    // Vercel Blob에 업로드
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false, // 이미 고유한 파일명을 생성했으므로 추가 랜덤 접미사 불필요
    })

    return {
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    }
  } catch (error) {
    console.error("이미지 업로드 오류:", error)
    return {
      success: false,
      error: "이미지 업로드 중 오류가 발생했습니다.",
    }
  }
}

/**
 * Vercel Blob에서 이미지를 삭제하는 서버 액션
 */
export async function deleteImageFromBlob(pathname: string) {
  try {
    if (!pathname || !pathname.startsWith("artwork-images/")) {
      return { success: false, error: "유효하지 않은 경로입니다." }
    }

    await del(pathname)
    return { success: true }
  } catch (error) {
    console.error("이미지 삭제 오류:", error)
    return {
      success: false,
      error: "이미지 삭제 중 오류가 발생했습니다.",
    }
  }
}
