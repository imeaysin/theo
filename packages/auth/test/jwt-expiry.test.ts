import { describe, expect, it } from "vitest"
import { isJwtExpired } from "../src/react/utils/jwt-expiry"

function buildJwt(payload: Record<string, unknown>) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.sig`
}

describe("isJwtExpired", () => {
  it("returns false for a token that expires in the future", () => {
    const token = buildJwt({
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    expect(isJwtExpired(token)).toBe(false)
  })

  it("returns true for an expired token", () => {
    const token = buildJwt({
      exp: Math.floor(Date.now() / 1000) - 60,
    })
    expect(isJwtExpired(token)).toBe(true)
  })

  it("returns true for malformed tokens", () => {
    expect(isJwtExpired("not-a-jwt")).toBe(true)
  })
})
