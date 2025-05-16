import mongoose from "mongoose"

export interface IArtwork extends mongoose.Document {
  title: string
  year: number
  category: string
  medium: string
  dimensions: string
  price: number
  description: string
  image: string
  imagePath: string
  available: boolean
  createdAt: Date
  updatedAt: Date
}

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "작품 제목을 입력해주세요"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "제작 연도를 입력해주세요"],
    },
    category: {
      type: String,
      required: [true, "카테고리를 입력해주세요"],
      trim: true,
    },
    medium: {
      type: String,
      trim: true,
    },
    dimensions: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "가격을 입력해주세요"],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    imagePath: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IArtwork>("Artwork", artworkSchema)
