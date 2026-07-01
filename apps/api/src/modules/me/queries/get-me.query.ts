import type { JwtClaims } from "@workspace/auth/types"

export class GetMeQuery {
  constructor(public readonly user: JwtClaims) {}
}
