import { ObjectId } from "mongodb"
import { connectDb, isDbConnected, mongooseInstance } from "@workspace/db"
import { env } from "@workspace/config"

/** Shared MongoDB handle — same pool as business API (`@workspace/db`). */
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

export async function ensureAuthMongoConnected() {
  if (!isDbConnected()) {
    await connectDb(env.MONGODB_URI)
  }
}

/** Better Auth stores foreign keys to `id` fields as ObjectIds in MongoDB. */
export function toMongoId(value: string) {
  return ObjectId.isValid(value) ? new ObjectId(value) : value
}
