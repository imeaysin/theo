import { type INestApplication } from "@nestjs/common"
import { Test, type TestingModule } from "@nestjs/testing"
import { AppModule } from "../../../src/app.module"
import { configureApp } from "../../../src/common/configure-app"
import { PUSH_PROVIDER } from "../../../src/common/push/push.module"

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
  configureApp(app)
  await app.init()

  return { app, moduleFixture }
}
