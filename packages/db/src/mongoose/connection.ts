import mongoose from "mongoose"
import { databaseEnv } from "@workspace/config/database"
import { createLogger } from "@workspace/logger"

const logger = createLogger("DB")

let isConnected = false

const RETRY_ATTEMPTS = 5
const RETRY_DELAY_MS = 3000

export function getDb() {
  const db = mongoose.connection.db
  if (!db) {
    throw new Error("MongoDB not connected. Call connectDb() first.")
  }
  return db
}

export async function connectDb(uri: string = databaseEnv.MONGODB_URI) {
  if (isConnected) return mongoose

  let lastError: unknown

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const instance = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      isConnected = true
      logger.info({ attempt }, "Connected to MongoDB")
      return instance
    } catch (error) {
      lastError = error
      logger.warn(
        {
          attempt,
          maxAttempts: RETRY_ATTEMPTS,
          retryInMs: RETRY_DELAY_MS,
          err: error instanceof Error ? error : { message: String(error) },
        },
        "MongoDB connection attempt failed"
      )
      if (attempt < RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      }
    }
  }

  throw lastError
}

export async function disconnectDb() {
  if (!isConnected) return
  await mongoose.disconnect()
  isConnected = false
  logger.info("Disconnected from MongoDB")
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1
}
