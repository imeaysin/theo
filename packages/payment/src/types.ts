export type PaymentProviderType = "bkash" | "sslcommerz"

export interface BkashConfig {
  provider: "bkash"
  appKey: string
  appSecret: string
  username: string
  password: string
  isSandbox?: boolean
}

export interface SslCommerzConfig {
  provider: "sslcommerz"
  storeId: string
  storePassword: string
  isSandbox?: boolean
}

export type PaymentConfig = BkashConfig | SslCommerzConfig

export interface PaymentInitializationOptions {
  amount: number
  currency: string
  uniqueTransactionId: string
  customerDetails?: {
    name: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postcode?: string
    country?: string
  }
  productDetails?: {
    name: string
    category: string
    profile: string
  }
  redirectionUrls: {
    successUrl: string
    failUrl: string
    cancelUrl: string
  }
}

export interface PaymentInitializationResult {
  success: boolean
  paymentId?: string
  redirectUrl?: string
  error?: string
}

export interface PaymentExecutionResult {
  success: boolean
  transactionId?: string
  amount?: number
  currency?: string
  payerReference?: string
  rawResponse?: unknown
  error?: string
}

// bKash Specific Types
export interface BkashGrantTokenResponse {
  statusCode: string
  statusMessage: string
  id_token: string
  token_type: string
  expires_in: number
}

export interface BkashCreatePaymentRequest {
  mode: string
  payerReference: string
  callbackURL: string
  amount: string
  currency: string
  intent: string
  merchantInvoiceNumber: string
}

export interface BkashCreatePaymentResponse {
  statusCode: string
  statusMessage: string
  paymentID: string
  bkashURL: string
  callbackURL: string
  successCallbackURL: string
  failureCallbackURL: string
  cancelledCallbackURL: string
  amount: string
  intent: string
  currency: string
  paymentCreateTime: string
  transactionStatus: string
  merchantInvoiceNumber: string
}

export interface BkashExecutePaymentResponse {
  statusCode: string
  statusMessage: string
  paymentID?: string
  payerReference?: string
  customerMsisdn?: string
  trxID?: string
  amount?: string
  errorMessage?: string
  transactionStatus?: string
  invoiceNumber?: string
  intent?: string
  currency?: string
  paymentExecuteTime?: string
}

// SSLCommerz Specific Types
export interface SslCommerzCreateSessionResponse {
  status: string
  failedreason?: string
  sessionkey: string
  gw: {
    visa: string
    master: string
    amex: string
    othercards: string
    internetbanking: string
    mobilebanking: string
  }
  redirectGatewayURL: string
  directPaymentURLBank: string
  directPaymentURLCard: string
  directPaymentURL: string
  storeBanner: string
  storeLogo: string
  desc: {
    name: string
    type: string
    logo: string
    gw: string
  }[]
  is_direct_pay_enable: string
  GatewayPageURL: string
}

export interface SslCommerzValidationResponse {
  status: string
  tran_date: string
  tran_id: string
  val_id: string
  amount: string
  store_amount: string
  currency: string
  bank_tran_id: string
  card_type: string
  card_no: string
  card_issuer: string
  card_brand: string
  card_issuer_country: string
  card_issuer_country_code: string
  store_id: string
  verify_sign: string
  verify_key: string
  verify_sign_sha2: string
  currency_type: string
  currency_amount: string
  currency_rate: string
  base_fair: string
  value_a: string
  value_b: string
  value_c: string
  value_d: string
  risk_level: string
  risk_title: string
}
