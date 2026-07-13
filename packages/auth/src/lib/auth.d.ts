import type { Auth as BetterAuthInstance, betterAuth } from "better-auth"

export type CreateAuthOptions = {
  secondaryStorage?: Parameters<typeof betterAuth>[0]["secondaryStorage"]
  onUserDeleted?: (userId: string) => Promise<void> | void
}

export declare function createAuth(
  options?: CreateAuthOptions
): BetterAuthInstance
export declare function getAuth(options?: CreateAuthOptions): BetterAuthInstance
export type Auth = BetterAuthInstance
