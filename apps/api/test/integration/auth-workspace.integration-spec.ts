/**
 * Integration: real Better Auth session cookies + workspace-scoped notes.
 * Requires a running API (`pnpm dev:api`) and MongoDB.
 */
import { env } from "@workspace/config"
import request, { type Agent } from "supertest"
import {
  AUTH_ORIGIN,
  onboardOrganization,
  registerVerifiedUser,
  setActiveOrganization,
} from "../e2e/helpers/auth-http.helper"

const BASE = env.BETTER_AUTH_URL
const password = "TestPass123!"

describe("Auth workspace (integration)", () => {
  let agent: Agent
  let orgA: string
  let orgB: string
  let noteId: string

  beforeAll(async () => {
    const health = await request(BASE).get("/v1/health")
    if (health.status !== 200) {
      throw new Error("API not reachable. Start with: pnpm dev:api")
    }
  })

  it("rejects unauthenticated notes", () => {
    return request(BASE).get("/v1/notes").expect(401)
  })

  it("returns 400 when listing notes without an active organization", async () => {
    const email = `integration-${Date.now()}@example.com`
    ;({ agent } = await registerVerifiedUser(BASE, {
      email,
      password,
      name: "Integration User",
    }))

    await agent.get("/v1/notes").set("Origin", AUTH_ORIGIN).expect(400)
  })

  it("creates a note in workspace A", async () => {
    ;({ organizationId: orgA } = await onboardOrganization(agent, {
      name: "Integration A",
      slug: `int-a-${Date.now()}`,
    }))

    const createRes = await agent
      .post("/v1/notes")
      .set("Origin", AUTH_ORIGIN)
      .set("Content-Type", "application/json")
      .send({ title: "Isolated", body: "workspace A" })
      .expect(201)

    noteId = createRes.body.data.id
    expect(createRes.body.data.organizationId).toBe(orgA)
  })

  it("hides workspace A notes from workspace B", async () => {
    ;({ organizationId: orgB } = await onboardOrganization(agent, {
      name: "Integration B",
      slug: `int-b-${Date.now()}`,
    }))
    expect(orgB).not.toBe(orgA)

    const listB = await agent
      .get("/v1/notes")
      .set("Origin", AUTH_ORIGIN)
      .expect(200)

    expect(listB.body.data.items).toEqual([])
  })

  it("returns 404 for cross-workspace note updates", async () => {
    await agent
      .patch(`/v1/notes/${noteId}`)
      .set("Origin", AUTH_ORIGIN)
      .set("Content-Type", "application/json")
      .send({ title: "Hacked" })
      .expect(404)
  })

  it("shows notes again after switching back to workspace A", async () => {
    await setActiveOrganization(agent, orgA)
    const listA = await agent
      .get("/v1/notes")
      .set("Origin", AUTH_ORIGIN)
      .expect(200)

    expect(listA.body.data.items).toHaveLength(1)

    const me = await agent
      .get("/v1/users/me")
      .set("Origin", AUTH_ORIGIN)
      .expect(200)

    expect(me.body.data).toMatchObject({
      activeOrganizationId: orgA,
      organizationRole: "owner",
    })
  })
})
