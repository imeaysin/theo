import { execFileSync } from "node:child_process"
import { join } from "node:path"
import { env } from "@workspace/config"
import request, { type Agent, type Response } from "supertest"

export const AUTH_ORIGIN = "http://localhost:5173"

const apiRoot = join(__dirname, "../../..")
const verifyTokenScript = join(apiRoot, "scripts/create-verify-token.mjs")

export async function mintEmailVerificationToken(email: string) {
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error(
      "BETTER_AUTH_SECRET is required to mint verification tokens"
    )
  }

  return execFileSync(process.execPath, [verifyTokenScript, email], {
    cwd: apiRoot,
    encoding: "utf8",
    env: process.env,
  }).trim()
}

export function withAuthOrigin(req: request.Test) {
  return req.set("Origin", AUTH_ORIGIN)
}

export async function signUpEmail(
  agent: Agent,
  input: { email: string; password: string; name: string }
): Promise<Response> {
  return agent
    .post("/api/auth/sign-up/email")
    .set("Content-Type", "application/json")
    .send(input)
}

export async function verifyEmail(
  agent: Agent,
  email: string
): Promise<Response> {
  const token = await mintEmailVerificationToken(email)
  return agent.get(`/api/auth/verify-email?token=${token}`)
}

export async function signInEmail(
  agent: Agent,
  input: { email: string; password: string }
): Promise<Response> {
  return withAuthOrigin(
    agent
      .post("/api/auth/sign-in/email")
      .set("Content-Type", "application/json")
      .send(input)
  )
}

export async function createOrganization(
  agent: Agent,
  input: { name: string; slug: string }
): Promise<Response> {
  return withAuthOrigin(
    agent
      .post("/api/auth/organization/create")
      .set("Content-Type", "application/json")
      .send(input)
  )
}

export async function setActiveOrganization(
  agent: Agent,
  organizationId: string
): Promise<Response> {
  return withAuthOrigin(
    agent
      .post("/api/auth/organization/set-active")
      .set("Content-Type", "application/json")
      .send({ organizationId })
  )
}

export async function registerVerifiedUser(
  server: Parameters<typeof request.agent>[0],
  input: { email: string; password: string; name: string }
) {
  const agent = request.agent(server)
  await signUpEmail(agent, input)
  await verifyEmail(agent, input.email)
  await signInEmail(agent, {
    email: input.email,
    password: input.password,
  })
  return { agent }
}

export async function onboardOrganization(
  agent: Agent,
  input: { name: string; slug: string }
) {
  const createRes = await createOrganization(agent, input)
  const organizationId = createRes.body?.id
  if (typeof organizationId !== "string") {
    throw new Error("Failed to create organization")
  }

  await setActiveOrganization(agent, organizationId)
  return { organizationId }
}
