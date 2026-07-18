import { HttpStatus } from "@nestjs/common"
import type { INestApplication } from "@nestjs/common"
import { isDbConnected, RateLimitModel } from "@workspace/db"
import { createLogger } from "@workspace/logger"
import type { NextFunction, Request, Response } from "express"
import { HttpErrorCode } from "@workspace/contracts"
import { createErrorEnvelope } from "../filters/error-envelope.util"

const logger = createLogger("RateLimit")

export type RateLimitOptions = {
  enabled: boolean
  windowMs: number
  max: number
}

async function isAllowed(
  key: string,
  windowMs: number,
  max: number
): Promise<boolean> {
  const now = new Date()
  const existing = await RateLimitModel.findById(key).lean()

  if (!existing || existing.resetAt <= now) {
    await RateLimitModel.updateOne(
      { _id: key },
      { $set: { count: 1, resetAt: new Date(now.getTime() + windowMs) } },
      { upsert: true }
    )
    return true
  }

  if (existing.count >= max) return false

  await RateLimitModel.updateOne({ _id: key }, { $inc: { count: 1 } })
  return true
}

function shouldSkip(path: string): boolean {
  // Better Auth owns /api/auth abuse protection via rateLimit in createAuth().
  return (
    path.startsWith("/api/auth") ||
    path.startsWith("/docs") ||
    path.includes("/health")
  )
}

function clientKey(request: Request): string {
  const ip = request.ip || request.socket.remoteAddress || "unknown"
  return `ip:${ip}`
}

export function applyRateLimit(
  app: INestApplication,
  options: RateLimitOptions
) {
  if (!options.enabled) return

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (shouldSkip(req.path)) {
      next()
      return
    }

    if (!isDbConnected()) {
      next()
      return
    }

    try {
      const allowed = await isAllowed(
        clientKey(req),
        options.windowMs,
        options.max
      )

      if (!allowed) {
        const envelope = createErrorEnvelope({
          status: HttpStatus.TOO_MANY_REQUESTS,
          code: HttpErrorCode.TOO_MANY_REQUESTS,
          message: "Too many requests. Please try again later.",
          path: req.url,
        })
        res.status(HttpStatus.TOO_MANY_REQUESTS).json(envelope)
        return
      }

      next()
    } catch (err) {
      logger.warn({ err }, "rate limit check failed — allowing request")
      next()
    }
  })
}
