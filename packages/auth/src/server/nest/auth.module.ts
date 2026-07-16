import { Module } from "@nestjs/common"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { createAuth } from "../auth"
import { ensureAuthMongoConnected } from "../db"

@Module({
  imports: [
    AuthModule.forRootAsync({
      isGlobal: true,
      useFactory: async () => {
        await ensureAuthMongoConnected()
        return {
          auth: createAuth(),
          bodyParser: {
            rawBody: true,
          },
        }
      },
    }),
  ],
})
export class NestBetterAuthModule {}
