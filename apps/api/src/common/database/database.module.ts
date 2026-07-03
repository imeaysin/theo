import { Global, Module } from "@nestjs/common"
import { connectDb, getDb } from "@workspace/db"
import { env } from "@workspace/config"
import type { Db } from "mongodb"
import { DatabaseLifecycle } from "./database.lifecycle"

export const DATABASE_READY = Symbol("DATABASE_READY")
export const MONGO_DB = Symbol("MONGO_DB")

@Global()
@Module({
  providers: [
    DatabaseLifecycle,
    {
      provide: DATABASE_READY,
      useFactory: async () => {
        await connectDb(env.MONGODB_URI)
        return true
      },
    },
    {
      provide: MONGO_DB,
      inject: [DATABASE_READY],
      useFactory: (): Db => getDb(),
    },
  ],
  exports: [DATABASE_READY, MONGO_DB],
})
export class DatabaseModule {}
