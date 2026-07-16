import { describe, expect, it, vi } from "vitest"
import { MockEmailAdapter } from "../src/adapters/mock"

describe("MockEmailAdapter", () => {
  it("logs email payload to stdout in dev", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined)

    const adapter = new MockEmailAdapter()
    await adapter.sendVerificationEmail({
      to: "user@example.com",
      url: "http://localhost/verify",
    })

    expect(info).toHaveBeenCalledWith(
      expect.stringContaining("user@example.com")
    )
    expect(info).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost/verify")
    )

    info.mockRestore()
  })
})
