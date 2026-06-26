import type { LandingFaqItem } from "@workspace/ui/components/landing"
import { siteConfig } from "@/config/site"

export const defaultFaqItems: LandingFaqItem[] = [
  {
    question: `What is ${siteConfig.name}?`,
    answer:
      "Theo is a business workspace for founders. It brings transactions, receipts, invoices, time tracking, and files into one connected system so you always know what's going on in your business.",
  },
  {
    question: `Who is ${siteConfig.name} for?`,
    answer:
      "Theo is built for founders running their company who want clarity and control without spending time on manual admin or spreadsheets.",
  },
  {
    question: "Do I need accounting knowledge?",
    answer:
      "No. Theo is designed for day-to-day use by non-financial users. It helps you stay organized and informed without requiring accounting expertise.",
  },
  {
    question: "How does bank connection work?",
    answer:
      "Theo connects to thousands of banks worldwide. Once connected, transactions are imported automatically and kept up to date.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. Your data is always yours. Export transactions, receipts, invoices, and reports whenever you need.",
  },
  {
    question: "Is there a free trial?",
    answer: siteConfig.trialNote,
  },
]
