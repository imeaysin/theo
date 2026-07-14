import mongoose, { Schema, type Document } from "mongoose"

export interface IRateLimit extends Document<string> {
  _id: string
  count: number
  resetAt: Date
}

export const RateLimitSchema: Schema<IRateLimit> = new Schema<IRateLimit>({
  _id: { type: String, required: true },
  count: { type: Number, required: true, default: 1 },
  resetAt: { type: Date, required: true },
})

RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 })

export const RateLimitModel = mongoose.models.RateLimit
  ? mongoose.model<IRateLimit>("RateLimit")
  : mongoose.model<IRateLimit>("RateLimit", RateLimitSchema, "api_rate_limits")
