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
        label: "Launch",
        title: "Ship your product story",
      },
      {
        id: "studio",
        label: "Build",
        title: "Customize every detail",
      },
      {
        id: "screenshot",
        label: "Grow",
        title: "Scale with your team",
      },
    ],
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Support", href: "/support" },
      { label: "Open source", href: productConfig.repositoryUrl },
    ],
    cta: {
      primaryButton: `Get ${productConfig.name} Pro`,
      secondaryButton: "View on GitHub",
      freeVersionText: "Free to start. No credit card required.",
      seeOtherOptionsText: "More download options",
    },
  },
  textReveal: "Build. Launch. Grow.",
  recordingModes: {
    title: "One product, three ways to start",
    subtitle:
      "Pick the path that fits your workflow — ship quickly, refine locally, or capture a single moment.",
    modes: [
      {
        name: "Quick share",
        description:
          "Create something useful, get a link, and share it with your team in minutes.",
      },
      {
        name: "Full editor",
        description:
          "Take your time polishing demos, tutorials, and presentations before you publish.",
      },
    ],
  },
  features: {
    title: "Built for how you actually work",
    subtitle:
      "Every feature is designed to save time and keep your workflow clean.",
    features: [
      {
        title: "Your data, your rules",
        description: `Keep content local, use ${productConfig.name} Cloud, or connect your own storage. You're never locked in.`,
      },
      {
        title: "Privacy by default",
        description:
          "Share when you need to, stay private when you don't. Password-protect sensitive links or keep everything offline.",
      },
      {
        title: "Collaboration that moves",
        description:
          "Comments, reactions, and searchable transcripts keep conversations going without another meeting.",
      },
      {
        title: "Cross-platform for your team",
        description:
          "Native apps for macOS and Windows that feel at home on each platform.",
      },
      {
        title: "Quality that looks professional",
        description:
          "High-resolution capture and smart compression so files stay sharp without being huge.",
      },
      {
        title: "Open and customizable",
        description: `Fork ${productConfig.name}, contribute features you need, or self-host for complete control.`,
      },
      {
        title: `Speed up with ${productConfig.name} AI`,
        description:
          "Auto-generated titles, summaries, chapters, and transcriptions for every share.",
      },
    ],
  },
  bento: {
    eyebrow: `Why ${productConfig.name}`,
    title: "Built to be yours",
    subtitle:
      "Every feature respects how you work — your storage, your platform, your workflow.",
    cards: [
      {
        key: "storage",
        title: "Bring your own storage",
        description: `Use ${productConfig.name} Cloud, keep files local, or plug in storage you already trust.`,
      },
      {
        key: "ai",
        title: `${productConfig.name} AI does the busywork`,
        description:
          "Every share gets an AI-generated title, summary, chapters, and a searchable transcript.",
      },
      {
        key: "async",
        title: "Async conversations that move",
        description:
          "Threaded comments, reactions, and viewer analytics turn one-way updates into two-way conversations.",
      },
      {
        key: "native",
        title: "Native performance",
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
          "Record in high resolution with hardware-accelerated encoding.",
      },
    ],
    cta: {
      label: "Explore every feature",
      href: "/features",
    },
  },
  testimonials: {
    title: "Loved by builders, trusted by teams",
    subtitle: `Join teams who use ${productConfig.name} for clear, visual communication.`,
    cta: "Read more testimonials",
  },
  pricing: {
    title: "Simple, honest pricing",
    subtitle:
      "Start free, upgrade when you need more. Early adopter pricing locked in forever.",
    lovedBy: "Trusted by teams and creators",
    commercial: {
      title: "Desktop License",
      description: `A commercial license for the ${productConfig.name} desktop app — unlimited local capture and editing.`,
      features: [
        "Commercial usage rights",
        "Unlimited local recordings & editing",
        "Full desktop editor",
        "Limited cloud shareable links / month",
        "Export to common formats",
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
        "Everything in Desktop plus unlimited cloud features for sharing and collaboration.",
      features: [
        "Everything in Desktop License",
        "Unlimited cloud storage & bandwidth",
        "Auto-generated titles, summaries, chapters, and transcriptions",
        "Custom domain (app.yourdomain.com)",
        "Password protected shares",
        "Viewer analytics & engagement",
        "Team workspaces",
        "Bring-your-own storage",
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
        answer: `Yes. ${productConfig.name} is free for personal use. Upgrade to ${productConfig.name} Pro when you need unlimited cloud sharing and team features.`,
      },
      {
        question: "How long can I record on the free version?",
        answer: `Local recording on the free plan is unlimited. Cloud share links have a length limit until you upgrade to ${productConfig.name} Pro.`,
      },
      {
        question: `How does ${productConfig.name} AI work?`,
        answer: `${productConfig.name} AI generates titles, summaries, chapters, and transcriptions. It's included with ${productConfig.name} Pro with no usage limits.`,
      },
      {
        question: `How is ${productConfig.name} different from closed SaaS tools?`,
        answer: `${productConfig.name} is open source, supports custom storage, works offline in the desktop app, and lets you own your content.`,
      },
      {
        question: "What happens to my content if I cancel?",
        answer:
          "Your content is yours. If you cancel Pro, existing shares remain active and you can export everything. Downgrade to free to keep working locally, or self-host to maintain all features.",
      },
      {
        question: "Do you offer team plans?",
        answer: `Yes. ${productConfig.name} Pro includes team workspaces for organizing content, permissions, and collaboration. Volume discounts are available for larger teams.`,
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
        question: "What about compliance?",
        answer: `${productConfig.name} Pro lets you bring your own storage for regional requirements. Self-hosting gives full control for stricter compliance needs.`,
      },
    ],
  },
  readyToGetStarted: {
    title: "Ready when you are",
    buttons: {
      primary: `Get ${productConfig.name} Pro`,
      secondary: "Download for free",
    },
  },
}
