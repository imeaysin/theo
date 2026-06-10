import type { Policy, PolicyContext, PolicyResult } from "./policy"

export class PolicyGroup {
  constructor(
    private readonly name: string,
    private readonly policies: Policy[]
  ) {}

  async can(context: PolicyContext): Promise<PolicyResult> {
    for (const policy of this.policies) {
      const result = await policy.can(context)
      if (!result.allowed) return result
    }
    return { allowed: true, name: this.name }
  }

  async canAny(context: PolicyContext): Promise<PolicyResult> {
    for (const policy of this.policies) {
      const result = await policy.can(context)
      if (result.allowed) return result
    }
    return { allowed: false, name: this.name, reason: "No policy allowed" }
  }
}
