import { Global, Module } from "@nestjs/common"
import { connectDb } from "@workspace/db"
import { env } from "@workspace/config"
import { DatabaseLifecycle } from "./database.lifecycle"

export const DATABASE_READY = Symbol("DATABASE_READY")

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
  ],
  exports: [DATABASE_READY],
})
export class DatabaseModule {}
