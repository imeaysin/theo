/** Canonical Pro pricing for the marketing landing template. */
export const proPricing = {
  /** Effective monthly price when billed annually */
  annualMonthly: 8.16,
  /** Monthly subscription price */
  monthly: 12,
} as const

export const formatProAnnualPrice = () =>
  `$${proPricing.annualMonthly.toFixed(2)}`

export const formatProMonthlyPrice = () => `$${proPricing.monthly}`
