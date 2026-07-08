import { PaymentProvider } from "../payment-provider"
import type {
  SslCommerzConfig,
  PaymentInitializationOptions,
  PaymentInitializationResult,
  PaymentExecutionResult,
  SslCommerzCreateSessionResponse,
  SslCommerzValidationResponse,
} from "../types"

export class SslCommerzPaymentAdapter extends PaymentProvider {
  private readonly baseUrl: string

  constructor(private readonly config: SslCommerzConfig) {
    super()
    this.baseUrl = config.isSandbox
      ? "https://sandbox.sslcommerz.com"
      : "https://securepay.sslcommerz.com"
  }

  async initiatePayment(
    options: PaymentInitializationOptions
  ): Promise<PaymentInitializationResult> {
    try {
      const payload = new URLSearchParams()
      payload.append("store_id", this.config.storeId)
      payload.append("store_passwd", this.config.storePassword)
      payload.append("total_amount", options.amount.toString())
      payload.append("currency", options.currency)
      payload.append("tran_id", options.uniqueTransactionId)
      payload.append("success_url", options.redirectionUrls.successUrl)
      payload.append("fail_url", options.redirectionUrls.failUrl)
      payload.append("cancel_url", options.redirectionUrls.cancelUrl)

      // Customer info
      payload.append("cus_name", options.customerDetails?.name || "John Doe")
      payload.append(
        "cus_email",
        options.customerDetails?.email || "john.doe@example.com"
      )
      payload.append("cus_add1", options.customerDetails?.address || "Dhaka")
      payload.append("cus_city", options.customerDetails?.city || "Dhaka")
      payload.append(
        "cus_postcode",
        options.customerDetails?.postcode || "1000"
      )
      payload.append(
        "cus_country",
        options.customerDetails?.country || "Bangladesh"
      )
      payload.append(
        "cus_phone",
        options.customerDetails?.phone || "01700000000"
      )

      // Shipping & Product info
      payload.append("shipping_method", "NO")
      payload.append("num_of_item", "1")
      payload.append("product_name", options.productDetails?.name || "Service")
      payload.append(
        "product_category",
        options.productDetails?.category || "General"
      )
      payload.append(
        "product_profile",
        options.productDetails?.profile || "general"
      )

      const response = await fetch(`${this.baseUrl}/gwprocess/v3/api.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      })

      if (!response.ok) {
        return {
          success: false,
          error: `SSLCommerz create session HTTP error: ${response.statusText}`,
        }
      }

      const data = (await response.json()) as SslCommerzCreateSessionResponse

      if (data.status !== "SUCCESS") {
        return {
          success: false,
          error: data.failedreason || "Failed to create SSLCommerz session",
        }
      }

      return {
        success: true,
        paymentId: data.sessionkey, // Not exactly paymentID, but session key
        redirectUrl: data.GatewayPageURL,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error in SSLCommerz initiatePayment",
      }
    }
  }

  async verifyPayment(val_id: string): Promise<PaymentExecutionResult> {
    try {
      const url = new URL(
        `${this.baseUrl}/validator/api/validationserverAPI.php`
      )
      url.searchParams.append("val_id", val_id)
      url.searchParams.append("store_id", this.config.storeId)
      url.searchParams.append("store_passwd", this.config.storePassword)
      url.searchParams.append("format", "json")

      const response = await fetch(url.toString(), {
        method: "GET",
      })

      if (!response.ok) {
        return {
          success: false,
          error: `SSLCommerz validate HTTP error: ${response.statusText}`,
        }
      }

      const data = (await response.json()) as SslCommerzValidationResponse

      if (data.status !== "VALID" && data.status !== "VALIDATED") {
        return {
          success: false,
          error: `SSLCommerz validation failed with status: ${data.status}`,
          rawResponse: data,
        }
      }

      return {
        success: true,
        transactionId: data.bank_tran_id,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        currency: data.currency,
        rawResponse: data,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error in SSLCommerz verifyPayment",
      }
    }
  }

  async handleWebhook(
    payload: Record<string, unknown>
  ): Promise<PaymentExecutionResult> {
    // SSLCommerz uses IPN (Instant Payment Notification). The payload contains val_id.
    const val_id = payload.val_id as string
    if (val_id) {
      return this.verifyPayment(val_id)
    }
    return { success: false, error: "Invalid IPN payload" }
  }
}
