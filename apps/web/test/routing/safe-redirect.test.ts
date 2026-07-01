import { describe, expect, it } from "vitest"
import {
  getSafeRedirectPath,
  resolvePostAuthRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"
import { defaultAuthenticatedRoute, routes } from "@/config/routes"

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
      withAuthRedirectQuery("/auth/sign-in", {
        redirect: "/accept-invitation?id=abc",
        fallback: defaultAuthenticatedRoute,
      })
    ).toBe("/auth/sign-in?redirect=%2Faccept-invitation%3Fid%3Dabc")
  })

  it("sends post-auth users to dashboard except invitation links", () => {
    expect(
      resolvePostAuthRedirectPath({
        redirect: "/app/organization/settings",
        fallback: defaultAuthenticatedRoute,
        invitationPath: routes.acceptInvitation,
      })
    ).toBe(defaultAuthenticatedRoute)
    expect(
      resolvePostAuthRedirectPath({
        redirect: "/accept-invitation?id=abc",
        fallback: defaultAuthenticatedRoute,
        invitationPath: routes.acceptInvitation,
      })
    ).toBe("/accept-invitation?id=abc")
  })
})
