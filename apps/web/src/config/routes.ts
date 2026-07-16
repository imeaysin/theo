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
  acceptInvitation: {
    root: "accept-invitation",
    invitationId: ":invitationId",
  },
  app: {
    root: "app",
    dashboard: "dashboard",
    notes: "notes",
    uploads: "uploads",
    notifications: "notifications",
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
  acceptInvitation: toPath(routeSegments.acceptInvitation.root),
  dashboard: toPath(routeSegments.app.root, routeSegments.app.dashboard),
  notes: toPath(routeSegments.app.root, routeSegments.app.notes),
  uploads: toPath(routeSegments.app.root, routeSegments.app.uploads),
  notifications: toPath(
    routeSegments.app.root,
    routeSegments.app.notifications
  ),
  organizationSettings: "/organization/settings",
  organizationPeople: "/organization/people",
  organizationRoles: "/organization/roles",
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
  settingsOrganizations: toPath(
    routeSegments.app.root,
    routeSegments.app.settings,
    "organizations"
  ),
} as const

export const defaultAuthenticatedRoute = routes.dashboard

export function acceptInvitationPath(invitationId: string): string {
  return toPath(routeSegments.acceptInvitation.root, invitationId)
}

export function absoluteAppUrl(path: string): string {
  if (typeof window === "undefined") return path
  return new URL(path, window.location.origin).href
}
