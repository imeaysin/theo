import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { ProtectedRoute } from "@/routing/protected-route"
import { routes } from "@/config/routes"

const useAuthSession = vi.fn()

vi.mock("@workspace/auth/react", () => ({
  useAuthSession: () => useAuthSession(),
}))

vi.mock("@workspace/ui-shadcn/components/page-loading", () => ({
  PageLoading: () => <div>Loading session</div>,
}))

function SignInProbe() {
  const location = useLocation()
  return <div>Sign in{location.search ? ` ${location.search}` : ""}</div>
}

function RedirectProbe({ label }: { label: string }) {
  const location = useLocation()
  return (
    <div>
      {label}
      {location.search ? ` ${location.search}` : ""}
    </div>
  )
}

function renderProtectedRoute(initialPath = "/app/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/app/dashboard" element={<div>Dashboard</div>} />
        </Route>
        <Route path={routes.signIn} element={<SignInProbe />} />
        <Route
          path={routes.signOut}
          element={<RedirectProbe label="Sign out" />}
        />
        <Route
          path={routes.verifyEmail}
          element={<RedirectProbe label="Verify email" />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe("ProtectedRoute", () => {
  it("shows a loading state while the session is pending", () => {
    useAuthSession.mockReturnValue({ data: undefined, isPending: true })

    renderProtectedRoute()

    expect(screen.getByText("Loading session")).toBeInTheDocument()
  })

  it("redirects unauthenticated users to sign in with return path", () => {
    useAuthSession.mockReturnValue({ data: null, isPending: false })

    renderProtectedRoute("/app/dashboard")

    expect(
      screen.getByText(
        `Sign in ?redirect=${encodeURIComponent("/app/dashboard")}`
      )
    ).toBeInTheDocument()
  })

  it("redirects banned users to sign out", () => {
    useAuthSession.mockReturnValue({
      data: {
        user: { id: "u1", banned: true, emailVerified: true },
        session: { id: "s1" },
      },
      isPending: false,
    })

    renderProtectedRoute()

    expect(screen.getByText("Sign out")).toBeInTheDocument()
  })

  it("redirects unverified users to verify email", () => {
    useAuthSession.mockReturnValue({
      data: {
        user: {
          id: "u1",
          email: "user@example.com",
          emailVerified: false,
        },
        session: { id: "s1" },
      },
      isPending: false,
    })

    renderProtectedRoute()

    expect(
      screen.getByText(
        `Verify email ?email=${encodeURIComponent("user@example.com")}`
      )
    ).toBeInTheDocument()
  })

  it("renders protected content for authenticated users", () => {
    useAuthSession.mockReturnValue({
      data: {
        user: { id: "u1", emailVerified: true },
        session: { id: "s1" },
      },
      isPending: false,
    })

    renderProtectedRoute()

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
})
