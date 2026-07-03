import { describe, expect, it, vi } from "vitest"
import { logDevEmail } from "../src/dev-log"

describe("logDevEmail", () => {
  it("logs email payload to stdout in dev", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined)

    logDevEmail({
      to: "user@example.com",
      subject: "Verify your email",
      lines: ["Verification link: http://localhost/verify"],
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
