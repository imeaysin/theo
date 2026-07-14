import mongoose from "mongoose"
import { databaseEnv } from "@workspace/config/database"
import { createLogger } from "@workspace/logger"

const logger = createLogger("DB")

const RETRY_ATTEMPTS = 5
const RETRY_DELAY_MS = 3000
const SERVER_SELECTION_TIMEOUT_MS = 5000

function isConnectionReady() {
  return mongoose.connection.readyState === 1
}

export async function connectDb(uri: string = databaseEnv.MONGODB_URI) {
  if (isConnectionReady()) return mongoose

  let lastError: unknown

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const instance = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
      })
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
  if (!isConnectionReady()) return
  await mongoose.disconnect()
  logger.info("Disconnected from MongoDB")
}

export function isDbConnected(): boolean {
  return isConnectionReady()
}
