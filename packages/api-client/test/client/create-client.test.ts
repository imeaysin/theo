import { describe, expect, it } from "vitest"
import { createApiClient } from "@src/client/create-client"

describe("createApiClient", () => {
  it("exposes users resource and resolved base URL", () => {
    const client = createApiClient({ baseUrl: "http://localhost:4000" })

    expect(client.users).toBeDefined()
    expect(client.http.baseURL).toBe("http://localhost:4000/api")
  })
})
