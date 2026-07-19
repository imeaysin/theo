import { type INestApplication } from "@nestjs/common"
import { Test, type TestingModule } from "@nestjs/testing"
import { AppModule } from "@/app.module"
import { configureApp } from "@/common/configure-app"
import { PUSH_PROVIDER } from "@/common/push/push.module"

export async function createE2eApp(): Promise<{
  app: INestApplication
  moduleFixture: TestingModule
}> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PUSH_PROVIDER)
    .useValue({
      send: jest.fn().mockResolvedValue([]),
      getReceipts: jest.fn().mockResolvedValue({}),
      close: jest.fn().mockResolvedValue(undefined),
    })
    .compile()

  const app = moduleFixture.createNestApplication({ bodyParser: false })
  app.enableShutdownHooks()
  configureApp(app)
  await app.init()

  return { app, moduleFixture }
}
