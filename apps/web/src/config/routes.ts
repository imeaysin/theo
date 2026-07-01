/** Layout + page segments — single source for React Router and URL building. */
export const routeSegments = {
  auth: {
    root: "auth",
    signIn: "sign-in",
    signUp: "sign-up",
    signOut: "sign-out",
    forgotPassword: "forgot-password",
    resetPassword: "reset-password",
    verifyEmail: "verify-email",
    twoFactor: "two-factor",
  },
  app: {
    root: "app",
    dashboard: "dashboard",
    notes: "notes",
    settings: "settings",
  },
} as const

function toPath(...parts: string[]) {
  return `/${parts.join("/")}`
}

/** Full app URLs — for `<Link>`, `navigate()`, and auth callbacks. */
export const routes = {
  home: "/",
  signIn: toPath(routeSegments.auth.root, routeSegments.auth.signIn),
  signUp: toPath(routeSegments.auth.root, routeSegments.auth.signUp),
  signOut: toPath(routeSegments.auth.root, routeSegments.auth.signOut),
  forgotPassword: toPath(
    routeSegments.auth.root,
    routeSegments.auth.forgotPassword
  ),
  resetPassword: toPath(
    routeSegments.auth.root,
    routeSegments.auth.resetPassword
  ),
  verifyEmail: toPath(routeSegments.auth.root, routeSegments.auth.verifyEmail),
  twoFactor: toPath(routeSegments.auth.root, routeSegments.auth.twoFactor),
  dashboard: toPath(routeSegments.app.root, routeSegments.app.dashboard),
  notes: toPath(routeSegments.app.root, routeSegments.app.notes),
  settings: toPath(routeSegments.app.root, routeSegments.app.settings),
  settingsAccount: toPath(
    routeSegments.app.root,
    routeSegments.app.settings,
    "account"
  ),
  settingsSecurity: toPath(
    routeSegments.app.root,
    routeSegments.app.settings,
    "security"
  ),
  organizationSettings: toPath(
    routeSegments.app.root,
    "organization",
    "settings"
  ),
  organizationPeople: toPath(routeSegments.app.root, "organization", "people"),
} as const

export const defaultAuthenticatedRoute = routes.dashboard

export function absoluteAppUrl(path: string): string {
  if (typeof window === "undefined") return path
  return new URL(path, window.location.origin).href
}
