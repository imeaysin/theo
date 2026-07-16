import { Module } from "@nestjs/common"
import { CaslModule } from "nest-casl"
import { Roles } from "../../access"
import { getUserFromRequest } from "./get-user-from-request"

@Module({
  imports: [
    CaslModule.forRoot<Roles>({
      superuserRole: Roles.admin,
      getUserFromRequest,
    }),
  ],
})
export class NestCaslModule {}
