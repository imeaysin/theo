import { describe, expect, it } from "vitest"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"
import {
  acceptInvitationPath,
  defaultAuthenticatedRoute,
} from "@/config/routes"

describe("getSafeRedirectPath", () => {
  it("returns the fallback when redirect is missing", () => {
    expect(getSafeRedirectPath(null, defaultAuthenticatedRoute)).toBe(
      defaultAuthenticatedRoute
    )
  })

  it("allows same-app relative paths", () => {
    expect(
      getSafeRedirectPath(
        acceptInvitationPath("abc"),
        defaultAuthenticatedRoute
      )
    ).toBe(acceptInvitationPath("abc"))
    expect(getSafeRedirectPath("/app/notes", defaultAuthenticatedRoute)).toBe(
      "/app/notes"
    )
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
        redirect: acceptInvitationPath("abc"),
        fallback: defaultAuthenticatedRoute,
      })
    ).toBe("/auth/sign-in?redirect=%2Faccept-invitation%2Fabc")
  })
})
