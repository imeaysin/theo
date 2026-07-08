import { Global, Module } from "@nestjs/common"
import { createPaymentProvider, type PaymentProvider } from "@workspace/payment"
import { paymentEnv } from "@workspace/config/payment"
import { createLogger } from "@workspace/logger"

export const PAYMENT_PROVIDER = Symbol("PAYMENT_PROVIDER")

function getPaymentProvider(): PaymentProvider {
  if (paymentEnv.PAYMENT_PROVIDER === "sslcommerz") {
    return createPaymentProvider({
      provider: "sslcommerz",
      storeId: paymentEnv.SSLCOMMERZ_STORE_ID,
      storePassword: paymentEnv.SSLCOMMERZ_STORE_PASSWORD,
      isSandbox: paymentEnv.PAYMENT_IS_SANDBOX,
    })
  }

  // Default to bkash
  return createPaymentProvider({
    provider: "bkash",
    appKey: paymentEnv.BKASH_APP_KEY,
    appSecret: paymentEnv.BKASH_APP_SECRET,
    username: paymentEnv.BKASH_USERNAME,
    password: paymentEnv.BKASH_PASSWORD,
    isSandbox: paymentEnv.PAYMENT_IS_SANDBOX,
  })
}

@Global()
@Module({
  providers: [{ provide: PAYMENT_PROVIDER, useFactory: getPaymentProvider }],
  exports: [PAYMENT_PROVIDER],
})
export class PaymentModule {
  onModuleInit() {
    createLogger("Payment").info(
      {
        provider: paymentEnv.PAYMENT_PROVIDER,
        sandbox: paymentEnv.PAYMENT_IS_SANDBOX,
      },
      "payment ready"
    )
  }
}
