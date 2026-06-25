import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import request from "supertest"
import { App } from "supertest/types"
import { AppModule } from "./../src/app.module"
import { configureApp } from "./../src/common/configure-app"

describe("AppController (e2e)", () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication({ bodyParser: false })
    configureApp(app)
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          status: "ok",
          auth: "/api/auth",
          health: "/v1/health",
        })
      })
  })

  it("/v1/health (GET)", () => {
    return request(app.getHttpServer())
      .get("/v1/health")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty("status")
        expect(res.body).toHaveProperty("db")
      })
  })
})
