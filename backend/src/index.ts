import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import mongoose from "mongoose"

// 라우트 임포트
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import artworkRoutes from "./routes/artwork.routes"
import orderRoutes from "./routes/order.routes"

// 환경 변수 로드
dotenv.config()

// Express 앱 생성
const app = express()

// 미들웨어
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// 데이터베이스 연결
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err))

// 라우트
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/artworks", artworkRoutes)
app.use("/api/orders", orderRoutes)

// 기본 라우트
app.get("/", (req, res) => {
  res.send("아티스트 포트폴리오 API 서버")
})

// 서버 시작
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`)
})
