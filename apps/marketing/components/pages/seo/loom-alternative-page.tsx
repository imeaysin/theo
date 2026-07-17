"use client"

import { Clapperboard, Zap } from "lucide-react"
import Script from "next/script"
import { SeoPageTemplate } from "../../seo/seo-page-template"
import type { SeoPageContent } from "../../seo/types"

export const loomAlternativeContent: SeoPageContent = {
  title:
    "The Ultimate Loom Alternative: Why Theo is the Best Open-Source Screen Recorder for Mac & Windows",
  description:
    "Looking for the best Loom alternative? Discover Theo, the open-source, privacy-focused screen recorder for Mac & Windows with a built-in Loom video importer. See why users are switching today!",

  featuresTitle: "Why Theo is the Best Loom Alternative",
  featuresDescription:
    "Theo offers everything you need in a privacy-focused, open-source screen recording solution",

  features: [
    {
      title: "Open-Source Transparency",
      description:
        "Theo is fully open-source, giving you complete transparency and community-driven development. We believe in building in public and letting users help shape our roadmap. Looking for an <a href='/free-screen-recorder'>open-source screen recorder</a>? Theo is your best choice!",
    },
    {
      title: "Enhanced Privacy & Security",
      description:
        "Theo prioritizes your privacy with GDPR compliance and the option to use your own Google Drive or S3 storage, ensuring your data remains under your control. Connect your own custom domain for a branded experience while maintaining 100% ownership of your data.",
    },
    {
      title: "Half the Price of Loom",
      description:
        "Theo starts from just $8.16/month per user, compared to Loom's $18/month per user. Plus, Theo offers a generous free plan that includes Studio mode for personal use.",
    },
    {
      title: "High-Quality Recordings",
      description:
        "Record smooth, high-definition videos at 60fps with synchronized audio up to 4K resolution, perfect for professional use.",
    },
    {
      title: "Collaborative Features",
      description:
        "Theo includes built-in thread commenting on shareable links, making it easy to collaborate with teammates and collect feedback on your recordings without switching platforms.",
    },
    {
      title: "Cross-Platform Support",
      description:
        "Available for both Mac and Windows, Theo delivers consistent performance across platforms. A perfect <a href='/screen-recording-software'>screen recording software</a> for all users.",
    },
    {
      title: "Built-In Loom Video Importer",
      description:
        "Already using Loom? Theo's built-in video importer lets you seamlessly transfer your existing Loom recordings into Theo. No need to start from scratch — bring all your content with you when you switch. Just need the raw files? Our <a href='/tools/loom-downloader'>free Loom video downloader</a> saves any public Loom as an MP4 in one click.",
    },
  ],

  recordingModes: {
    title: "Two Ways to Record with Theo",
    description:
      "Theo gives you flexible recording options to match your workflow needs, with both modes available in the free plan",
    modes: [
      {
        icon: <Zap fill="yellow" className="mb-4 size-8" strokeWidth={1.5} />,
        title: "Instant Mode",
        description:
          "Share your screen right away with a simple link—no waiting, just record and share in seconds. Record up to 5-minute shareable links for free, perfect for quick demos and explanations. Includes built-in thread commenting for easy collaboration.",
      },
      {
        icon: (
          <Clapperboard
            fill="var(--primary)"
            className="mb-4 size-8"
            strokeWidth={1.5}
          />
        ),
        title: "Studio Mode",
        description:
          "Available completely free for personal use! Records at top quality up to 4K. Captures both your screen and webcam separately so you can edit them later, giving you professional-level production control.",
      },
    ],
  },

  useCasesTitle: "Why Users Choose Theo for Screen Recording",
  useCasesDescription:
    "Discover the features that make Theo a compelling option for screen recording",

  useCases: [
    {
      title: "Budget-Friendly Options",
      description:
        "Many screen recording tools have complex pricing structures. Theo offers similar functionality with clear, affordable pricing options.",
    },
    {
      title: "Complete Data Ownership",
      description:
        "Theo lets you connect your own Google Drive or S3 storage and custom domain, giving you 100% ownership and control over your content. No more being locked into proprietary platforms.",
    },
    {
      title: "Community-Driven Development",
      description:
        "As an <a href='/screen-recorder'>open-source screen recorder</a>, Theo is built in the open with community input. User feedback directly shapes our roadmap and features.",
    },
    {
      title: "Collaborative Feedback",
      description:
        "Theo's built-in thread commenting on shareable links makes it easy to collect feedback and collaborate without switching between different tools.",
    },
    {
      title: "Effortless Migration from Loom",
      description:
        "Theo's built-in Loom video importer makes switching painless. Import your existing Loom recordings directly into Theo and keep all your content organized in one place — no downloads or re-uploads required.",
    },
  ],

  faqsTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "Is there a free Loom alternative?",
      answer:
        "Yes, Theo offers a generous free tier that includes all essential screen recording features. You can use Studio mode completely free for personal use, record up to 5-minute shareable links, and record in up to 4K resolution. Theo's free plan offers more than Loom's free tier.",
    },
    {
      question: "Why choose an open-source screen recorder?",
      answer:
        "Open-source screen recorders like Theo provide transparency, security, and community-driven development. You can verify the code, contribute improvements, and trust that your data isn't being misused. Theo's community focus means features are developed based on real user needs.",
    },
    {
      question: "How does Theo compare in pricing with Loom?",
      answer:
        "Theo is significantly more affordable at just $8.16/month per user when billed annually, compared to Loom's $18/month per user. Theo also has a more generous free plan that includes Studio mode for personal use and the ability to record shareable links up to 5 minutes in 4K quality.",
    },
    {
      question: "Can I keep full ownership of my recordings with Theo?",
      answer:
        "Absolutely! Theo allows you to connect your own Google Drive or S3 storage and custom domain, giving you 100% ownership and control of your content. Your data remains yours, and you're never locked into our platform.",
    },
    {
      question: "Does Theo support collaboration features?",
      answer:
        "Yes, Theo includes built-in thread commenting on shareable links, making it easy to collaborate with teammates and collect feedback directly on your recordings. This keeps all your communication in one place.",
    },
    {
      question: "Can I import my existing Loom videos into Theo?",
      answer:
        "Yes! Theo Pro includes a built-in Loom video importer. Simply paste your Loom video links and Theo will import them directly into your library. It's the easiest way to migrate from Loom without losing any of your existing content. If you'd rather keep local copies, our <a href='/tools/loom-downloader'>Loom video downloader</a> exports any public Loom to MP4, and our <a href='/migrate-from-loom'>migrate from Loom</a> guide covers the full switch.",
    },
  ],

  comparisonTable: {
    title: "Feature Comparison: Theo vs. Loom",
    headers: ["Feature", "Theo", "Loom"],
    rows: [
      [
        "Open Source",
        { text: "Yes", status: "positive" },
        { text: "No", status: "negative" },
      ],
      [
        "Pricing",
        { text: "from $8.16/month per user", status: "positive" },
        { text: "$18/month per user", status: "warning" },
      ],
      [
        "Free Plan",
        { text: "Studio mode + 5 min shareable links", status: "positive" },
        { text: "Limited features & recording time", status: "warning" },
      ],
      [
        "4K Recording",
        { text: "Available in free & paid plans", status: "positive" },
        { text: "Only in paid plans", status: "warning" },
      ],
      [
        "Thread Commenting",
        { text: "Built-in on shareable links", status: "positive" },
        { text: "Available", status: "neutral" },
      ],
      [
        "Custom Domain",
        { text: "Yes", status: "positive" },
        { text: "Enterprise plan only", status: "neutral" },
      ],
      [
        "Own Storage Integration",
        { text: "Connect your own S3 or Google Drive", status: "positive" },
        { text: "Not available", status: "negative" },
      ],
      [
        "Community Input",
        { text: "Direct via open source", status: "positive" },
        { text: "Limited", status: "neutral" },
      ],
      [
        "Loom Video Import",
        { text: "Built-in importer", status: "positive" },
        { text: "Not available", status: "negative" },
      ],
      [
        "Data Ownership",
        { text: "100% with own storage", status: "positive" },
        { text: "Platform dependent", status: "neutral" },
      ],
    ],
  },
  migrationGuide: {
    title: "How to Get Started with Theo (Easy Guide)",
    steps: [
      "Download Theo for your operating system (Mac or Windows)",
      "Launch the application and sign in to your Theo account",
      "Import your existing Loom videos using Theo's built-in Loom video importer",
      "Start recording using either Instant Mode or Studio Mode",
      "Share your recordings easily with Theo's built-in sharing features",
      "Optional: Connect your own Google Drive or S3 storage and custom domain for complete data ownership",
    ],
  },

  video: {
    url: "/videos/theo-vs-loom-comparison.mp4",
    thumbnail: "/videos/theo-vs-loom-thumbnail.png",
    alt: "Theo screen recorder demo showing privacy features and interface",
  },

  cta: {
    title: "Ready to Try Theo for Your Screen Recording Needs?",
    buttonText: "Download Theo Free",
  },
}

// Create FAQ structured data for SEO
const createFaqStructuredData = () => {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: loomAlternativeContent.faqs.map((faq) => ({
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

export const LoomAlternativePage = () => {
  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: createFaqStructuredData() }}
      />
      <SeoPageTemplate
        showLogosInHeader
        showLoomComparisonSlider
        content={loomAlternativeContent}
      />
    </>
  )
}
