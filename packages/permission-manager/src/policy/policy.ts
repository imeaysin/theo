export interface PolicyContext extends Record<string, unknown> {
  userId?: string
  role?: string
  email?: string
}

export interface PolicyResult {
  name: string
  allowed: boolean
  reason?: string
}

export abstract class Policy {
  constructor(
    public readonly name: string,
    public readonly description: string,
  ) {}

  abstract can(context: PolicyContext): PolicyResult | Promise<PolicyResult>

  protected allowed(): PolicyResult {
    return { allowed: true, name: this.name }
  }

  protected denied(reason?: string): PolicyResult {
    return { allowed: false, name: this.name, reason }
  }
}
