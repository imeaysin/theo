import { describe, expect, it } from "vitest"
import { ApiError } from "@src/lib/errors"

describe("ApiError", () => {
  it("parses Nest-style error body", () => {
    const error = new ApiError(401, "Unauthorized", {
      statusCode: 401,
      message: "No valid session",
      error: "Unauthorized",
    })

    expect(error.status).toBe(401)
    expect(error.message).toBe("No valid session")
    expect(error.isUnauthorized).toBe(true)
    expect(error.isForbidden).toBe(false)
  })

  it("formats field validation errors", () => {
    const error = new ApiError(400, "Bad Request", {
      statusCode: 400,
      message: { email: ["Invalid email"] },
    })

    expect(error.isValidationError).toBe(true)
    expect(error.message).toContain("email")
  })
})
