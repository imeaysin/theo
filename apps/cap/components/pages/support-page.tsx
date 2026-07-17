"use client"

import {
  ArrowUpRight,
  BookOpen,
  Code as Github,
  Mail,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
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
      "Chat with the Cap team and community in real time. The fastest way to get help, share feedback, and stay up to date.",
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
    href: "mailto:support@cap.so",
    cta: "support@cap.so",
  },
  {
    title: "Read the docs",
    description:
      "Guides, tutorials, and references covering recording, sharing, self-hosting, and everything in between.",
    icon: BookOpen,
    href: "/docs",
    cta: "Browse docs",
  },
  {
    title: "Report an issue",
    description:
      "Found a bug or want to request a feature? Cap is open source, so you can open an issue directly on GitHub.",
    icon: Github,
    href: "https://github.com/CapSoftware/Cap/issues",
    cta: "Open an issue",
    isExternal: true,
  },
]

const quickLinks = [
  { label: "FAQs", href: "/faq" },
  { label: "Self-hosting guide", href: "/self-hosting" },
  {
    label: "System status",
    href: "https://cap.openstatus.dev/",
    isExternal: true,
  },
  { label: "Trust portal", href: "https://trust.cap.so", isExternal: true },
  { label: "Download Cap", href: "/download" },
]

export const SupportPage = () => {
  return (
    <div className="mt-[120px]">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="mb-16 text-center md:mb-20">
            <p className="mb-4 text-sm font-medium tracking-widest text-muted-foreground uppercase">
              Support
            </p>
            <h1 className="mb-6 text-3xl leading-[2.5rem] text-foreground md:text-5xl md:leading-[3.75rem]">
              How can we help?
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Whether you&apos;re stuck, curious, or just want to say hi,
              here&apos;s how to reach the Cap team and community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {supportChannels.map((channel) => {
              const Icon = channel.icon
              return (
                <Link
                  key={channel.title}
                  href={channel.href}
                  target={channel.isExternal ? "_blank" : undefined}
                  rel={channel.isExternal ? "noopener noreferrer" : undefined}
                  className="group flex flex-col rounded-2xl border border-border bg-muted p-6 transition-colors duration-200 hover:border-border hover:bg-muted"
                >
                  <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="mb-2 text-xl text-foreground">
                    {channel.title}
                  </h2>
                  <p className="flex-1 text-base leading-relaxed text-muted-foreground">
                    {channel.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-base font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                    {channel.cta}
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="mt-16 md:mt-20">
            <div className="h-px bg-muted" />
            <h2 className="mt-12 mb-5 text-2xl text-foreground md:text-3xl">
              More resources
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-lg text-muted-foreground transition-colors duration-200 hover:text-muted-foreground"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ReadyToGetStarted />
    </div>
  )
}
