import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model"

// JWT 토큰 생성
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

// 회원가입
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "이미 사용 중인 이메일입니다",
      })
    }

    // 새 사용자 생성
    const user = await User.create({
      name,
      email,
      password,
    })

    // 토큰 생성
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 로그인
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // 이메일과 비밀번호 확인
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "이메일과 비밀번호를 입력해주세요",
      })
    }

    // 사용자 찾기
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "이메일 또는 비밀번호가 올바르지 않습니다",
      })
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "이메일 또는 비밀번호가 올바르지 않습니다",
      })
    }

    // 토큰 생성
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// 현재 사용자 정보
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)

    res.status(200).json({
      success: true,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
