import mongoose from "mongoose"

export interface IOrder extends mongoose.Document {
  user: mongoose.Types.ObjectId
  items: Array<{
    artwork: mongoose.Types.ObjectId
    title: string
    price: number
    image: string
    quantity: number
  }>
  shippingAddress: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  paymentKey?: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        artwork: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artwork",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentKey: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IOrder>("Order", orderSchema)
