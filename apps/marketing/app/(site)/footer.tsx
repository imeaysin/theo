"use client"

import { Logo } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faDiscord, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useState } from "react"

type FooterLink = {
  label: string
  href: string
  isExternal?: boolean
}

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Download", href: "/download" },
    { label: "Blog", href: "/blog" },
    {
      label: "GitHub",
      href: productConfig.repositoryUrl,
      isExternal: true,
    },
  ] as FooterLink[],
  company: [
    { label: "About", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "FAQs", href: "/faq" },
    { label: "Support", href: "/support" },
    {
      label: "Email",
      href: `mailto:${productConfig.supportEmail}`,
    },
  ] as FooterLink[],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ] as FooterLink[],
}

const socialLinks: { label: string; href: string; icon: IconDefinition }[] = [
  {
    label: `X (@${productConfig.shortName})`,
    href: "https://x.com/theo",
    icon: faXTwitter,
  },
  {
    label: "Discord",
    href: "https://discord.gg/y8gdQ3WRN3",
    icon: faDiscord,
  },
]

const FooterColumn = ({
  title,
  links,
}: {
  title: string
  links: FooterLink[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border lg:border-none">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-foreground lg:hidden"
      >
        {title}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <h3 className="hidden pb-2 text-lg font-medium text-foreground lg:block">
        {title}
      </h3>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out lg:grid-rows-[1fr] ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="grid grid-cols-1 gap-2 pb-4 lg:pb-0">
            {links.map((link) => (
              <li key={`${link.href}:${link.label}`}>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/20">
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-20 pb-10 sm:px-8 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 w-[700px] -translate-x-1/2 translate-y-2/3 opacity-[0.05] select-none sm:w-[1000px] lg:w-[1300px]"
        >
          <Logo hideLogoName className="h-auto w-full" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <div className="lg:w-64 lg:shrink-0">
              <Logo className="h-auto w-[104px]" />
              <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
                {productConfig.tagline}
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                  >
                    <FontAwesomeIcon icon={social.icon} className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-1 border-t border-border lg:grid-cols-3 lg:gap-x-10 lg:border-none">
              <FooterColumn title="Product" links={footerLinks.product} />
              <FooterColumn title="Company" links={footerLinks.company} />
              <FooterColumn title="Legal" links={footerLinks.legal} />
            </div>
          </div>

          <div className="mt-20 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              © {productConfig.legalName} {new Date().getFullYear()}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
