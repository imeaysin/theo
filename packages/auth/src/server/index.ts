import { toNodeHandler } from "better-auth/node"
import { auth } from "./create-auth"

export { auth } from "./create-auth"
export type {
  AuthInstance,
  Session,
  SessionData,
  SessionUser,
} from "./create-auth"
export type { AuthenticatedUser, AccessTokenClaims } from "../verify/claims"
export {
  getAuthFromHeaders,
  type AuthContext,
} from "./get-auth-from-headers"

export { toNodeHandler }

/** Express/Nest route handler for `/api/auth/*`. */
export const authHandler = toNodeHandler(auth)

/** Platform-agnostic handler (Workers, Vercel, Hono, etc.). */
export const authFetchHandler = auth.handler
