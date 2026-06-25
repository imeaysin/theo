import { Injectable, OnModuleDestroy } from "@nestjs/common"
import { disconnectDb } from "@workspace/db"

@Injectable()
export class DatabaseLifecycle implements OnModuleDestroy {
  async onModuleDestroy() {
    await disconnectDb()
  }
}
