import { describe, expect, it } from "vitest"
import { normalizeApiBaseUrl, resolveApiBaseUrl } from "@src/lib/config"

describe("normalizeApiBaseUrl", () => {
  it("appends /api to origin", () => {
    expect(normalizeApiBaseUrl("http://localhost:4000")).toBe(
      "http://localhost:4000/api",
    )
  })

  it("does not duplicate /api", () => {
    expect(normalizeApiBaseUrl("http://localhost:4000/api")).toBe(
      "http://localhost:4000/api",
    )
  })

  it("strips trailing slashes before appending", () => {
    expect(normalizeApiBaseUrl("http://localhost:4000/")).toBe(
      "http://localhost:4000/api",
    )
  })
})

describe("resolveApiBaseUrl", () => {
  it("normalizes an explicit base URL", () => {
    expect(resolveApiBaseUrl("https://api.example.com")).toBe(
      "https://api.example.com/api",
    )
  })
})
