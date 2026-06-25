import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "@workspace/auth/nestjs"
import { AppService } from "./app.service"

@ApiTags("root")
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "API metadata" })
  getRoot() {
    return this.appService.getRoot()
  }
}
