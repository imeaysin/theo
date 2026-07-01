import { type INestApplication } from "@nestjs/common"
import request from "supertest"
import { type App } from "supertest/types"
import { createE2eApp } from "./support/create-e2e-app"

describe("AppController (e2e)", () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    ;({ app } = await createE2eApp())
  })

  afterAll(async () => {
    await app.close()
  })

  it("GET /", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          success: true,
          statusCode: 200,
          message: "Operation completed successfully",
          data: {
            status: "ok",
            auth: "/api/auth",
            health: "/v1/health",
          },
        })
        expect(res.body.timestamp).toEqual(expect.any(String))
      })
  })

  it("GET /v1/health", () => {
    return request(app.getHttpServer())
      .get("/v1/health")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          success: true,
          statusCode: 200,
          data: { status: "ok", db: "up" },
        })
      })
  })
})
