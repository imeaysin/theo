import { connectDb, isDbConnected, mongooseInstance } from "@workspace/db"
import { env } from "@workspace/config"

const DB_READY_POLL_MS = 100
const DB_READY_MAX_ATTEMPTS = 50

export function getAuthDb() {
  const db = mongooseInstance.connection.db
  if (!db) {
    throw new Error("MongoDB connection not established")
  }
  return db
}

export function getAuthMongoClient() {
  const client = mongooseInstance.connection.getClient()
  if (!client) {
    throw new Error("MongoDB client not available")
  }
  return client
}

async function waitForAuthDb() {
  for (let attempt = 0; attempt < DB_READY_MAX_ATTEMPTS; attempt += 1) {
    if (mongooseInstance.connection.db) return
    await new Promise((resolve) => setTimeout(resolve, DB_READY_POLL_MS))
  }
  throw new Error("MongoDB connection not established")
}

export async function ensureAuthMongoConnected() {
  if (!isDbConnected()) {
    await connectDb(env.MONGODB_URI)
  }
  await waitForAuthDb()
}
