import { Policy, PolicyContext, PolicyResult } from "../policy"

interface TrialStore {
  getTrialEnd(userId: string): Date | null
}

export class FreeTrialPolicy extends Policy {
  constructor(private readonly trials?: TrialStore) {
    super("FreeTrialPolicy", "Check if the user's free trial has expired")
  }

  async can(context: PolicyContext): Promise<PolicyResult> {
    const { userId } = context
    if (!userId) return this.denied("No user ID provided")

    const trialEnd = this.trials?.getTrialEnd(userId)

    if (!trialEnd) {
      return this.allowed()
    }

    if (trialEnd < new Date()) {
      const days = Math.floor(
        (Date.now() - trialEnd.getTime()) / (1000 * 60 * 60 * 24),
      )
      return this.denied(`Free trial expired ${days} days ago`)
    }

    return this.allowed()
  }
}
