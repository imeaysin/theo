jest.mock("@workspace/auth", () => ({
  auth: {},
}))

jest.mock("@thallesp/nestjs-better-auth", () => ({
  AuthModule: {
    forRootAsync: () => ({
      module: class AuthModuleStub {},
    }),
  },
}))

jest.mock("@workspace/auth/nestjs", () => ({
  Public: () => () => undefined,
  CurrentUser: () => () => undefined,
  RequirePermission: () => () => undefined,
  JwksGuard: class JwksGuard {
    canActivate() {
      return true
    }
  },
  RbacGuard: class RbacGuard {
    canActivate() {
      return true
    }
  },
  OrgRbacGuard: class OrgRbacGuard {
    async canActivate() {
      return true
    }
  },
  RolesGuard: class RolesGuard {
    canActivate() {
      return true
    }
  },
}))

import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"
import { App } from "supertest/types"
import { AppModule } from "../src/app.module"
import { configureApp } from "../src/common/configure-app"

describe("AppController (e2e)", () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication({ bodyParser: false })
    configureApp(app)
    await app.init()
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
          data: {
            status: "ok",
            auth: "/api/auth",
            health: "/v1/health",
          },
        })
      })
  })

  it("GET /v1/health", () => {
    return request(app.getHttpServer())
      .get("/v1/health")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          data: { status: "ok", db: "up" },
        })
      })
  })
})
