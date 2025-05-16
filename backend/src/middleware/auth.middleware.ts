import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model"

interface DecodedToken {
  id: string
  iat: number
  exp: number
}

// 요청 객체에 user 속성 추가
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token

    // 헤더에서 토큰 가져오기
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    // 토큰이 없는 경우
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "로그인이 필요합니다",
      })
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken

    // 사용자 정보 가져오기
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "사용자를 찾을 수 없습니다",
      })
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "인증에 실패했습니다",
    })
  }
}

// 관리자 권한 확인
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      error: "관리자 권한이 필요합니다",
    })
  }
}
