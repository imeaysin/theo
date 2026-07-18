"use client"

import { productConfig } from "@workspace/config/public"
import Link from "next/link"

interface FaqItem {
  title: string
  answer: string
  link?: {
    text: string
    href: string
  }
}

const name = productConfig.name

const faqContent: FaqItem[] = [
  {
    title: `Who is ${name} for?`,
    answer: `${name} is a sample product for this landing template. Use it as a starting point for creators, educators, marketers, developers, and teams who need a clear way to create and share updates.`,
  },
  {
    title: "How much does it cost?",
    answer: `${name} offers a free tier for personal use. Upgrade to ${name} Pro for cloud storage, longer shares, team features, analytics, and priority support. See the pricing page for current numbers — replace them with yours.`,
  },
  {
    title: `Which platforms does ${name} support?`,
    answer: `${name} targets macOS (Apple Silicon and Intel) and Windows. Shareable links work in any modern browser.`,
  },
  {
    title: `What makes ${name} different?`,
    answer: `${name} is positioned as open source, privacy-focused, and flexible about storage. Customize this answer to match your real differentiators.`,
  },
  {
    title: `Can I self-host ${name}?`,
    answer: `Yes — this template assumes self-hosting is available. Update this FAQ if your product ships differently.`,
  },
  {
    title: "Is there a commercial license available?",
    answer: `Yes. Paid plans include commercial usage rights for the desktop app. Adjust this copy for your licensing model.`,
  },
  {
    title: "What happens after early adopter pricing ends?",
    answer:
      "Early adopters keep their locked-in pricing for the lifetime of their subscription. Thank early supporters — or remove this if it doesn't apply.",
  },
]

export const FaqPage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-32 sm:px-8 md:py-40">
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">FAQ</h1>
      </div>
      <div className="mb-10">
        {faqContent.map((section) => {
          return (
            <div key={section.title} className="mx-auto my-8 max-w-2xl">
              <h2 className="mb-2 text-xl">{section.title}</h2>
              <p className="text-lg">{section.answer}</p>
              {section.link && (
                <Link
                  href={section.link.href}
                  className="mt-2 inline-block text-primary hover:text-primary hover:underline"
                >
                  {section.link.text} &rarr;
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
