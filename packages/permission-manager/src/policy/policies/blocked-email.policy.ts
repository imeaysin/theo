import { Policy, PolicyContext, PolicyResult } from "../policy.js"

export class BlockedEmailPolicy extends Policy {
  constructor() {
    super("BlockedEmailPolicy", "Deny registration from blocked emails or domains")
  }

  async can(context: PolicyContext): Promise<PolicyResult> {
    const email = context.email

    if (!email) return this.allowed()

    const blockedDomains = ["spam.com", "malicious.com", "tempmail.org"]
    const domain = email.split("@")[1]
    if (domain && blockedDomains.includes(domain)) {
      return this.denied(`Email domain ${domain} is blocked`)
    }

    const blockedEmails = ["test@test.com", "admin@spam.com"]
    if (blockedEmails.includes(email)) {
      return this.denied(`Email ${email} is blocked`)
    }

    return this.allowed()
  }
}
