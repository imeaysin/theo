export interface ToolPageContent {
  slug?: string
  title: string
  description: string
  publishedAt?: string
  category?: string
  author?: string
  tags?: string[]

  cta: {
    title: string
    description: string
    buttonText: string
    buttonHref?: string
    secondaryButtonText?: string
    secondaryButtonHref?: string
  }

  featuresTitle: string
  featuresDescription: string
  features: {
    title: string
    description: string
  }[]

  faqs?: {
    question: string
    answer: string
  }[]
}
