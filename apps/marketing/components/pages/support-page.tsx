"use client"

import { ArrowUpRight, Code as Github, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import { productConfig } from "@workspace/config/public"
import { ReadyToGetStarted } from "../ready-to-get-started"

type SupportChannel = {
  title: string
  description: string
  icon: typeof Mail
  href: string
  cta: string
  isExternal?: boolean
}

const supportChannels: SupportChannel[] = [
  {
    title: "Join our Discord",
    description:
      "Chat with the team and community in real time. The fastest way to get help, share feedback, and stay up to date.",
    icon: MessageCircle,
    href: "https://discord.gg/y8gdQ3WRN3",
    cta: "Open Discord",
    isExternal: true,
  },
  {
    title: "Email support",
    description:
      "Have a question, billing issue, or something you'd rather keep private? Send us an email and we'll get back to you.",
    icon: Mail,
    href: `mailto:${productConfig.supportEmail}`,
    cta: productConfig.supportEmail,
  },
  {
    title: "Report an issue",
    description: `${productConfig.name} is open source — open an issue directly on GitHub for bugs or feature requests.`,
    icon: Github,
    href: `${productConfig.repositoryUrl}/issues`,
    cta: "Open an issue",
    isExternal: true,
  },
]

const quickLinks = [
  { label: "FAQs", href: "/faq" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
]

export function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-32 pb-20 sm:px-8">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-medium text-foreground md:text-5xl">
          Support
        </h1>
        <p className="text-lg text-muted-foreground">
          We&apos;re here to help. Reach out through whichever channel works
          best for you.
        </p>
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supportChannels.map((channel) => {
          const Icon = channel.icon
          return (
            <Link
              key={channel.title}
              href={channel.href}
              target={channel.isExternal ? "_blank" : undefined}
              rel={channel.isExternal ? "noopener noreferrer" : undefined}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/40"
            >
              <Icon className="mb-4 size-6 text-foreground" strokeWidth={1.5} />
              <h2 className="mb-2 text-lg font-medium text-foreground">
                {channel.title}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-6 text-muted-foreground">
                {channel.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                {channel.cta}
                <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          )
        })}
      </div>

      <div className="mb-20">
        <h2 className="mb-4 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Quick links
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {quickLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ReadyToGetStarted />
    </div>
  )
}
