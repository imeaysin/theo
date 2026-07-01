import { describe, expect, it } from "vitest"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"
import { defaultAuthenticatedRoute } from "@/config/routes"

describe("getSafeRedirectPath", () => {
  it("returns the fallback when redirect is missing", () => {
    expect(getSafeRedirectPath(null, defaultAuthenticatedRoute)).toBe(
      defaultAuthenticatedRoute
    )
  })

  it("allows same-app relative paths", () => {
    expect(
      getSafeRedirectPath(
        "/accept-invitation?id=abc",
        defaultAuthenticatedRoute
      )
    ).toBe("/accept-invitation?id=abc")
  })

  it("rejects open redirects", () => {
    expect(
      getSafeRedirectPath("https://evil.example", defaultAuthenticatedRoute)
    ).toBe(defaultAuthenticatedRoute)
    expect(
      getSafeRedirectPath("//evil.example", defaultAuthenticatedRoute)
    ).toBe(defaultAuthenticatedRoute)
  })

  it("adds redirect query for auth cross-links", () => {
    expect(
      withAuthRedirectQuery(
        "/auth/sign-in",
        "/accept-invitation?id=abc",
        defaultAuthenticatedRoute
      )
    ).toBe("/auth/sign-in?redirect=%2Faccept-invitation%3Fid%3Dabc")
  })
})
