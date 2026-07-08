import type { PaymentConfig } from "./types"
import type { PaymentProvider } from "./payment-provider"
import { BkashPaymentAdapter } from "./adapters/bkash-adapter"
import { SslCommerzPaymentAdapter } from "./adapters/sslcommerz-adapter"

export function createPaymentProvider(config: PaymentConfig): PaymentProvider {
  switch (config.provider) {
    case "bkash":
      return new BkashPaymentAdapter(config)
    case "sslcommerz":
      return new SslCommerzPaymentAdapter(config)
    default: {
      const _exhaustive: never = config
      throw new Error(`Unknown payment provider: ${_exhaustive}`)
    }
  }
}
