import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "이름을 입력해주세요"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "이메일을 입력해주세요"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "비밀번호를 입력해주세요"],
      minlength: [6, "비밀번호는 최소 6자 이상이어야 합니다"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
)

// 비밀번호 해싱
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>("User", userSchema)
