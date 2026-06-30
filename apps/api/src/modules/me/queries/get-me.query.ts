import type { JWTClaims } from "@workspace/auth/types"

export class GetMeQuery {
  constructor(public readonly user: JWTClaims) {}
}
