import { productConfig } from "@workspace/config/public"

import type { Testimonial } from "@/content/testimonials"
import { testimonials as allTestimonials } from "@/content/testimonials"

const productUrl = (path = "") => `${productConfig.siteUrl}${path}`

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": productUrl("/#organization"),
  name: productConfig.legalName,
  url: productConfig.siteUrl,
  description: productConfig.description,
  sameAs: [productConfig.repositoryUrl],
  contactPoint: {
    "@type": "ContactPoint",
    email: productConfig.supportEmail,
    contactType: "customer service",
  },
})

export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": productUrl("/#website"),
  url: productConfig.siteUrl,
  name: productConfig.name,
  description: productConfig.description,
  publisher: {
    "@id": productUrl("/#organization"),
  },
})

export const createSoftwareApplicationSchema = (
  testimonials?: readonly Testimonial[]
) => {
  const testimonialsToUse = testimonials || allTestimonials

  const rogerTestimonial = allTestimonials.find(
    (t) => t.handle === "@_rogermattos"
  )
  const selectedTestimonials = rogerTestimonial
    ? [
        rogerTestimonial,
        ...testimonialsToUse
          .filter((t) => t.handle !== "@_rogermattos")
          .slice(0, 4),
      ]
    : testimonialsToUse.slice(0, 5)

  const reviews = selectedTestimonials.map((testimonial) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
    },
    author: {
      "@type": "Person",
      name: testimonial.name,
      ...(testimonial.handle && { alternateName: testimonial.handle }),
    },
    reviewBody: testimonial.content,
    url: testimonial.url,
  }))

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": productUrl("/#software"),
    name: productConfig.name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: ["macOS", "Windows"],
    description: productConfig.description,
    url: productConfig.siteUrl,
    downloadUrl: productUrl("/download"),
    featureList: [
      "Screen recording up to 4K resolution",
      "60fps recording",
      "Instant sharing with links",
      "Studio mode for professional editing",
      "Built-in thread commenting",
      "Custom domain support",
      "Bring your own storage (Google Drive & S3)",
      "Cross-platform (Mac & Windows)",
      "Open source",
      "Privacy-focused",
    ],
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free Plan",
        description: "Studio mode for personal use, 5-minute shareable links",
      },
      {
        "@type": "Offer",
        price: "8.16",
        priceCurrency: "USD",
        name: "Pro Plan",
        priceValidUntil: "2025-12-31",
        description: "Full features for professional use",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          unitText: "month",
        },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: allTestimonials.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews,
    creator: {
      "@id": productUrl("/#organization"),
    },
  }
}

export const createBreadcrumbSchema = (
  items: { name: string; url?: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.url && { item: item.url }),
  })),
})

export const createVideoObjectSchema = (video: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate?: string
  duration?: string
  embedUrl?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl,
  uploadDate: video.uploadDate || new Date().toISOString(),
  duration: video.duration || "PT2M",
  embedUrl: video.embedUrl,
  publisher: {
    "@id": productUrl("/#organization"),
  },
})

export const createFAQSchema = (
  faqs: { question: string; answer: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer.replace(/<\/?[^>]+(>|$)/g, ""),
    },
  })),
})

export const createProductSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: `${productConfig.name} Screen Recorder`,
  description: productConfig.description,
  brand: {
    "@type": "Brand",
    name: productConfig.name,
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    highPrice: "8.16",
    offerCount: "2",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "250",
  },
})

export const createHowToSchema = (params: {
  name: string
  description: string
  totalTime?: string
  steps: { name: string; text: string }[]
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: params.name,
  description: params.description,
  totalTime: params.totalTime || "PT2M",
  step: params.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
})

export const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: productConfig.legalName,
  "@id": productConfig.siteUrl,
  url: productConfig.siteUrl,
  priceRange: "$0-$8.16",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
})
