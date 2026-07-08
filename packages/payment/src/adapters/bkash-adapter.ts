import { PaymentProvider } from "../payment-provider"
import type {
  BkashConfig,
  PaymentInitializationOptions,
  PaymentInitializationResult,
  PaymentExecutionResult,
  BkashGrantTokenResponse,
  BkashCreatePaymentResponse,
  BkashExecutePaymentResponse,
} from "../types"

export class BkashPaymentAdapter extends PaymentProvider {
  private readonly baseUrl: string
  private idToken: string | null = null

  constructor(private readonly config: BkashConfig) {
    super()
    this.baseUrl = config.isSandbox
      ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta"
      : "https://tokenized.pay.bka.sh/v1.2.0-beta"
  }

  private async getHeaders(requireToken = true) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: this.config.username,
      password: this.config.password,
    }

    if (requireToken) {
      if (!this.idToken) {
        await this.grantToken()
      }
      headers.Authorization = this.idToken as string
      headers["X-APP-Key"] = this.config.appKey
    }

    return headers
  }

  private async grantToken(): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: this.config.username,
          password: this.config.password,
        },
        body: JSON.stringify({
          app_key: this.config.appKey,
          app_secret: this.config.appSecret,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`bKash grant token failed: ${response.statusText}`)
    }

    const data = (await response.json()) as BkashGrantTokenResponse

    if (data.statusCode !== "0000") {
      throw new Error(`bKash token error: ${data.statusMessage}`)
    }

    this.idToken = data.id_token
  }

  async initiatePayment(
    options: PaymentInitializationOptions
  ): Promise<PaymentInitializationResult> {
    try {
      const headers = await this.getHeaders(true)

      const payload = {
        mode: "0011",
        payerReference: options.customerDetails?.phone || "01700000000",
        callbackURL: options.redirectionUrls.successUrl, // bKash uses a single callback URL
        amount: options.amount.toString(),
        currency: options.currency,
        intent: "sale",
        merchantInvoiceNumber: options.uniqueTransactionId,
      }

      const response = await fetch(
        `${this.baseUrl}/tokenized/checkout/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        return {
          success: false,
          error: `bKash create payment HTTP error: ${response.statusText}`,
        }
      }

      const data = (await response.json()) as BkashCreatePaymentResponse

      if (data.statusCode !== "0000") {
        return { success: false, error: data.statusMessage }
      }

      return {
        success: true,
        paymentId: data.paymentID,
        redirectUrl: data.bkashURL,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error in bKash initiatePayment",
      }
    }
  }

  async verifyPayment(paymentID: string): Promise<PaymentExecutionResult> {
    try {
      const headers = await this.getHeaders(true)

      const response = await fetch(
        `${this.baseUrl}/tokenized/checkout/execute`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ paymentID }),
        }
      )

      if (!response.ok) {
        return {
          success: false,
          error: `bKash execute payment HTTP error: ${response.statusText}`,
        }
      }

      const data = (await response.json()) as BkashExecutePaymentResponse

      if (data.statusCode && data.statusCode !== "0000") {
        return {
          success: false,
          error: data.statusMessage || data.errorMessage,
          rawResponse: data,
        }
      }

      return {
        success: true,
        transactionId: data.trxID,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        currency: data.currency,
        payerReference: data.payerReference,
        rawResponse: data,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error in bKash verifyPayment",
      }
    }
  }

  async handleWebhook(
    payload: Record<string, unknown>
  ): Promise<PaymentExecutionResult> {
    // bKash webhooks (if enabled) can be processed here.
    // Usually, server-to-server callbacks include paymentID and status.
    const paymentID = payload.paymentID as string
    if (paymentID) {
      return this.verifyPayment(paymentID)
    }
    return { success: false, error: "Invalid webhook payload" }
  }
}
