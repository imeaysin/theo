import type { Metadata } from "next"
import Script from "next/script"
import { AgenciesPage } from "@/components/pages/seo/agencies-page"

// Create FAQ structured data for SEO
const createFaqStructuredData = () => {
  const faqs = [
    {
      question: "Does Theo work on both macOS and Windows?",
      answer:
        "Yes. Theo supports both macOS and Windows with desktop apps, so your entire team can use the same workflow regardless of their platform preference.",
    },
    {
      question: "Can clients view videos without installing anything?",
      answer:
        "Yes. Clients can watch videos directly in their browser through a simple link. No downloads, no account creation, no friction. They can also leave comments directly on the video.",
    },
    {
      question: "What's the difference between Instant Mode and Studio Mode?",
      answer:
        "Instant Mode generates a shareable link immediately after recording—perfect for quick updates. Studio Mode records locally for the highest quality and includes precision editing tools for professional client presentations.",
    },
    {
      question: "How long can we record on the free version?",
      answer:
        "The free version supports recordings up to 5 minutes. For longer client presentations and unlimited recording time, upgrade to Theo Pro at $8.16/month (billed annually).",
    },
    {
      question: "Is Theo secure enough for confidential client work?",
      answer:
        "Yes. Theo is open-source and privacy-first. You can connect your own S3 storage, use a custom domain for share links, and password-protect sensitive videos. This gives you complete control over client data.",
    },
    {
      question: "Can we use our own branding with Theo?",
      answer:
        "Yes. Theo Pro includes custom domain support (theo.yourdomain.com) so share links reflect your agency's brand. You can also use your own S3 storage for complete data ownership.",
    },
    {
      question: "How does Theo pricing work for agency teams?",
      answer:
        "Theo Pro is $8.16/month per user (billed annually) and includes unlimited cloud storage, custom domains, team workspaces, and all collaboration features. Volume discounts are available for teams over 10 users.",
    },
  ]

  const faqStructuredData = {
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
  }

  return JSON.stringify(faqStructuredData)
}

// Create SoftwareApplication structured data
const createSoftwareStructuredData = () => {
  const softwareStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Theo — Screen Recorder",
    operatingSystem: ["macOS", "Windows"],
    applicationCategory: "BusinessApplication",
    description:
      "Open-source, privacy-first screen recorder for agencies. Instant share links and studio-quality local recording with editing.",
    publisher: {
      "@type": "Organization",
      name: "Theo",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "FreeTrial",
    },
  }

  return JSON.stringify(softwareStructuredData)
}

export const metadata: Metadata = {
  title: "Theo for Agencies — Faster Client Updates with Instant Video Links",
  description:
    "Send clearer client updates in minutes. Share instant links with comments, or craft polished walkthroughs. Theo for Agencies on macOS & Windows.",
  openGraph: {
    title: "Theo for Agencies — Faster Client Updates with Instant Video Links",
    description:
      "Send clearer client updates in minutes. Share instant links with comments, or craft polished walkthroughs. Theo for Agencies on macOS & Windows.",
    url: "https://theo.example/solutions/agencies",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo for Agencies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theo for Agencies — Faster Client Updates with Instant Video Links",
    description:
      "Send clearer client updates in minutes. Share instant links with comments, or craft polished walkthroughs. Theo for Agencies on macOS & Windows.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/solutions/agencies",
  },
}

export default function Page() {
  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: createFaqStructuredData() }}
      />
      <Script
        id="software-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: createSoftwareStructuredData() }}
      />
      <AgenciesPage />
    </>
  )
}
