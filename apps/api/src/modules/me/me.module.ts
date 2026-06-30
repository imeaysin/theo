import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { MeController } from "./me.controller"
import { GetMeHandler } from "./queries/get-me.handler"

@Module({
  imports: [CqrsModule],
  controllers: [MeController],
  providers: [GetMeHandler],
})
export class MeModule {}
