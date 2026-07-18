import { productConfig } from "@workspace/config/public"
import { proPricing } from "../lib/pricing"

export interface HomeHeaderVariants {
  default: {
    title: string
    description: string
  }
}

export interface HomeHeader {
  announcement: {
    text: string
    href: string
  }
  variants: HomeHeaderVariants
  modes: {
    id: "instant" | "studio" | "screenshot"
    label: string
    title: string
  }[]
  links: {
    label: string
    href: string
  }[]
  cta: {
    primaryButton: string
    secondaryButton: string
    freeVersionText: string
    seeOtherOptionsText: string
  }
}

export interface HomeRecordingModes {
  title: string
  subtitle: string
  modes: {
    name: string
    description: string
  }[]
}

export interface HomeFeatures {
  title: string
  subtitle: string
  features: {
    title: string
    description: string
  }[]
}

export interface HomeBento {
  eyebrow: string
  title: string
  subtitle: string
  cards: {
    key: string
    title: string
    description: string
  }[]
  cta: {
    label: string
    href: string
  }
}

export interface HomeTestimonials {
  title: string
  subtitle: string
  cta: string
}

export interface HomePricing {
  title: string
  subtitle: string
  lovedBy: string
  commercial: {
    title: string
    description: string
    features: string[]
    cta: string
    pricing: {
      yearly: number
      lifetime: number
    }
    labels: {
      licenses: string
      yearly: string
      lifetime: string
    }
  }
  pro: {
    badge: string
    title: string
    description: string
    features: string[]
    cta: string
    pricing: {
      annual: number
      monthly: number
    }
    labels: {
      users: string
      monthly: string
      annually: string
    }
  }
}

export interface HomeFaq {
  title: string
  items: {
    question: string
    answer: string
  }[]
}

export interface HomeReadyToGetStarted {
  title: string
  buttons: {
    primary: string
    secondary: string
  }
}

export interface HomeContent {
  header: HomeHeader
  textReveal: string
  recordingModes: HomeRecordingModes
  features: HomeFeatures
  bento: HomeBento
  testimonials: HomeTestimonials
  pricing: HomePricing
  faq: HomeFaq
  readyToGetStarted: HomeReadyToGetStarted
}

export const homeContent: HomeContent = {
  header: {
    announcement: {
      text: "Early adopter pricing — lock in your discount",
      href: "/pricing",
    },
    variants: {
      default: {
        title: productConfig.tagline,
        description: productConfig.description,
      },
    },
    modes: [
      {
        id: "instant",
        label: "Instant",
        title: "Record and share in seconds",
      },
      {
        id: "studio",
        label: "Studio",
        title: "Record and edit locally",
      },
      {
        id: "screenshot",
        label: "Screenshot",
        title: "Capture, annotate and copy",
      },
    ],
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Support", href: "/support" },
      { label: "Open source", href: productConfig.repositoryUrl },
    ],
    cta: {
      primaryButton: `Upgrade to ${productConfig.name} Pro`,
      secondaryButton: "View on GitHub",
      freeVersionText:
        "No credit card required. Start free, upgrade when you need more.",
      seeOtherOptionsText: "More download options",
    },
  },
  textReveal: "Record. Edit. Share.",
  recordingModes: {
    title: "Three modes, zero compromise",
    subtitle:
      "Instant Mode uploads as you record, so a shareable link is ready the moment you stop. Studio Mode keeps everything local for pixel-perfect editing. Screenshot, when a single frame is enough.",
    modes: [
      {
        name: "Instant Mode",
        description:
          "Hit record, stop, share link. Your video is live in seconds with auto-generated captions, a title, summary, chapters, and more.",
      },
      {
        name: "Studio Mode",
        description:
          "Professional recordings with local editing, custom backgrounds, and export options for demos, tutorials, and presentations.",
      },
    ],
  },
  features: {
    title: "Built for how you actually work",
    subtitle:
      "Every feature is designed to save time and keep your workflow clean.",
    features: [
      {
        title: "Your storage, your rules",
        description: `Connect your own Google Drive or S3 bucket, use ${productConfig.name} Cloud, or keep everything local. You're never locked into our infrastructure.`,
      },
      {
        title: "Privacy by default, sharing by choice",
        description:
          "Instant sharing when you need it, local recording when you want it. Share publicly or privately, password-protect sensitive recordings, or keep them local only.",
      },
      {
        title: "Async collaboration that works",
        description:
          "Comments, reactions, and transcripts keep conversations moving without another meeting.",
      },
      {
        title: "Cross-platform for your team",
        description:
          "Native apps for macOS and Windows that feel at home on each platform.",
      },
      {
        title: "Quality that looks professional",
        description:
          "4K recording, 60fps capture, and intelligent compression that keeps file sizes reasonable.",
      },
      {
        title: "Truly open source",
        description: `See exactly how ${productConfig.name} works, contribute features you need, or self-host for complete control.`,
      },
      {
        title: `Speed up your workflow with ${productConfig.name} AI`,
        description:
          "Auto-generated titles, summaries, clickable chapters, and transcriptions for every recording.",
      },
    ],
  },
  bento: {
    eyebrow: `Why ${productConfig.name}`,
    title: "Built to be yours",
    subtitle:
      "Every feature respects how you actually work — your storage, your platform, your workflow.",
    cards: [
      {
        key: "storage",
        title: "Bring your own storage",
        description: `Plug in your own Google Drive or S3 bucket, route to ${productConfig.name} Cloud, or keep recordings entirely local.`,
      },
      {
        key: "ai",
        title: `${productConfig.name} AI does the busywork`,
        description:
          "Every recording gets an AI-generated title, summary, clickable chapters, and a fully searchable transcript.",
      },
      {
        key: "async",
        title: "Async conversations that move",
        description:
          "Threaded comments, emoji reactions, and viewer analytics turn one-way videos into two-way conversations.",
      },
      {
        key: "native",
        title: "Native, not an Electron tab",
        description:
          "Built for genuine native performance on macOS and Windows — fast and lightweight.",
      },
      {
        key: "oss",
        title: "Open source, end to end",
        description:
          "Inspect every line, contribute features, or self-host the entire stack.",
      },
      {
        key: "pixel",
        title: "Pixel-perfect capture",
        description:
          "Record up to 4K at 60fps with hardware-accelerated encoding.",
      },
    ],
    cta: {
      label: "Explore every feature",
      href: "/features",
    },
  },
  testimonials: {
    title: "Loved by builders, trusted by teams",
    subtitle: `Join thousands who've made ${productConfig.name} their daily driver for visual communication.`,
    cta: "Read more testimonials",
  },
  pricing: {
    title: "Simple, honest pricing",
    subtitle:
      "Start free, upgrade when you need more. Early adopter pricing locked in forever.",
    lovedBy: "Trusted by teams and creators",
    commercial: {
      title: "Desktop License",
      description: `A commercial license for the ${productConfig.name} desktop app — unlimited local recording and editing.`,
      features: [
        "Commercial usage rights",
        "Unlimited local recordings & editing",
        "Studio Mode with full editor",
        "20 cloud shareable links / month (up to 5 min each)",
        "Export to any format",
        "Community support",
      ],
      cta: "Get Desktop License",
      pricing: {
        yearly: 29,
        lifetime: 58,
      },
      labels: {
        licenses: "License type",
        yearly: "Annual",
        lifetime: "One-time",
      },
    },
    pro: {
      badge: "Best value",
      title: `${productConfig.name} Pro`,
      description:
        "Everything in Desktop plus unlimited cloud features for seamless sharing and collaboration.",
      features: [
        "Everything in Desktop License",
        "Unlimited cloud storage & bandwidth",
        "Auto-generated titles, summaries, clickable chapters, and transcriptions",
        "Custom domain (app.yourdomain.com)",
        "Password protected shares",
        "Viewer analytics & engagement",
        "Team workspaces",
        "Custom S3 bucket & Google Drive support",
        "Priority support & early features",
      ],
      cta: "Get Started",
      pricing: {
        annual: proPricing.annualMonthly,
        monthly: proPricing.monthly,
      },
      labels: {
        users: "Per user",
        monthly: "Monthly",
        annually: "Annual (save 32%)",
      },
    },
  },
  faq: {
    title: "Questions? We've got answers.",
    items: [
      {
        question: `What is the difference between ${productConfig.name} Pro and Desktop License?`,
        answer: `${productConfig.name} Pro includes everything in the Desktop License plus cloud features for sharing and collaboration. Desktop License grants commercial usage rights for a single user.`,
      },
      {
        question: "Is there a free version?",
        answer: `Yes. ${productConfig.name} is free for personal use. Studio Mode has unlimited local recording with no watermarks. Instant Mode share links on the free plan are capped at 5 minutes — upgrade to ${productConfig.name} Pro for unlimited Instant Mode and cloud collaboration.`,
      },
      {
        question: "How long can I record on the free version?",
        answer: `Studio Mode is unlimited on the free plan. Instant Mode (shareable cloud links) is capped at 5 minutes per recording until you upgrade to ${productConfig.name} Pro.`,
      },
      {
        question: `How does ${productConfig.name} AI work?`,
        answer: `${productConfig.name} AI generates titles, summaries, clickable chapters, and transcriptions. It's included with ${productConfig.name} Pro with no usage limits.`,
      },
      {
        question: `How is ${productConfig.name} different from closed SaaS recorders?`,
        answer: `${productConfig.name} is open source, supports custom storage, works offline in the desktop app, and lets you own your content.`,
      },
      {
        question: "What happens to my recordings if I cancel?",
        answer:
          "Your recordings are yours. If you cancel Pro, existing shares remain active and you can export everything. Downgrade to free to keep recording locally, or self-host to maintain all features.",
      },
      {
        question: "Do you offer team plans?",
        answer: `Yes. ${productConfig.name} Pro includes team workspaces for organizing recordings, permissions, and collaboration. Volume discounts are available for larger teams.`,
      },
      {
        question: "Which platforms do you support?",
        answer:
          "Native desktop apps for macOS (Apple Silicon & Intel) and Windows. View shareable links from anywhere.",
      },
      {
        question: `Can I use ${productConfig.name} for commercial purposes?`,
        answer: `Yes. Any paid plan (Desktop License or ${productConfig.name} Pro) includes full commercial usage rights. The free version is for personal use only.`,
      },
      {
        question: "Is my data secure?",
        answer: `Security is core to ${productConfig.name}. As an open source project, the code is auditable. Bring-your-own storage and self-hosting keep data under your control.`,
      },
      {
        question: "What about GDPR/HIPAA compliance?",
        answer: `${productConfig.name} Pro lets you bring your own storage (including regional S3 or Google Drive) for GDPR. Self-hosting gives full control for HIPAA and similar requirements.`,
      },
    ],
  },
  readyToGetStarted: {
    title: "Ready to get started?",
    buttons: {
      primary: `Upgrade to ${productConfig.name} Pro`,
      secondary: "Download for free",
    },
  },
}
