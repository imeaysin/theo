import { MongoClient, ObjectId } from "mongodb"
import { env } from "@workspace/config"

const client = new MongoClient(env.MONGODB_URI)

/** Shared MongoDB handle for auth (Better Auth adapter + permission lookups). */
export const authDb = client.db()

export const authMongoClient = client

let connectPromise: Promise<MongoClient> | null = null

export function ensureAuthMongoConnected() {
  if (!connectPromise) {
    connectPromise = client.connect()
  }
  return connectPromise
}

/** Better Auth stores foreign keys to `id` fields as ObjectIds in MongoDB. */
export function toMongoId(value: string) {
  return ObjectId.isValid(value) ? new ObjectId(value) : value
}
