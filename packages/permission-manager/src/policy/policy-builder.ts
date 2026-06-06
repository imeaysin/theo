import type { Policy } from "./policy"
import { PolicyGroup } from "./policy-group"

export class PolicyBuilder {
  private readonly policies: Policy[] = []

  private constructor(private readonly name: string) {}

  static create(name: string) {
    return new PolicyBuilder(name)
  }

  add(policy: Policy) {
    this.policies.push(policy)
    return this
  }

  addAll(policies: Policy[]) {
    this.policies.push(...policies)
    return this
  }

  build() {
    return new PolicyGroup(this.name, this.policies)
  }
}
