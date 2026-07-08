import { createEnv } from "../validate"
import {
  paymentEnvSchema,
  pickServerDefaults,
  type PaymentEnv,
} from "../schemas/server"

export const paymentEnv = createEnv(
  paymentEnvSchema,
  pickServerDefaults([
    "PAYMENT_PROVIDER",
    "BKASH_APP_KEY",
    "BKASH_APP_SECRET",
    "BKASH_USERNAME",
    "BKASH_PASSWORD",
    "SSLCOMMERZ_STORE_ID",
    "SSLCOMMERZ_STORE_PASSWORD",
  ])
)

export type { PaymentEnv }
