import type {
  PaymentInitializationOptions,
  PaymentInitializationResult,
  PaymentExecutionResult,
} from "./types"

export abstract class PaymentProvider {
  /**
   * Initializes a payment session with the provider and returns a URL to redirect the user to.
   */
  abstract initiatePayment(
    options: PaymentInitializationOptions
  ): Promise<PaymentInitializationResult>

  /**
   * Executes or validates a payment after the user returns from the provider's gateway.
   */
  abstract verifyPayment(
    paymentIdOrValId: string
  ): Promise<PaymentExecutionResult>

  /**
   * Handle async webhooks (if supported by the provider)
   */
  abstract handleWebhook(
    payload: Record<string, unknown>
  ): Promise<PaymentExecutionResult>
}
