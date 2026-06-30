import { MongoClient } from "mongodb"
import { env } from "@workspace/config"

const client = new MongoClient(env.MONGODB_URI)

/** Shared MongoDB handle for auth (Better Auth adapter + permission lookups). */
export const authDb = client.db()

export { client as authMongoClient }
