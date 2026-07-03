import { describe, expect, it } from "vitest"
import { site } from "@/config/site"

describe("site config", () => {
  it("has a name and description", () => {
    expect(site.name).toBeTruthy()
    expect(site.description).toBeTruthy()
  })

  it("has a client URL", () => {
    expect(site.clientUrl).toMatch(/^https?:\/\//)
  })
})
