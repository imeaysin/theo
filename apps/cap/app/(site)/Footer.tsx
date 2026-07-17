"use client"

import { Logo } from "@/components/cap-ui"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faDiscord,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import type { ReactNode } from "react"
import { useState } from "react"

type FooterLink = {
  label: string
  href: string
  isExternal?: boolean
}

const footerLinks = {
  product: [
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "/docs" },
    { label: "Pricing", href: "/pricing" },
    { label: "Download", href: "/download" },
    {
      label: "Open Source",
      href: "https://github.com/CapSoftware/Cap",
      isExternal: true,
    },
    {
      label: "Join the community",
      href: "https://discord.gg/y8gdQ3WRN3",
      isExternal: true,
    },
    {
      label: "OSS Friends",
      href: "/oss-friends",
    },
  ] as FooterLink[],
  help: [
    { label: "About", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "FAQs", href: "/faq" },
    { label: "Self-hosting", href: "/self-hosting" },
    { label: "Support", href: "/support" },
    { label: "Email Support", href: "mailto:hello@cap.so" },
    { label: "Trust Portal", href: "https://trust.cap.so" },
    {
      label: "Chat Support",
      href: "https://discord.gg/y8gdQ3WRN3",
      isExternal: true,
    },
    {
      label: "System Status",
      href: "https://cap.openstatus.dev/",
      isExternal: true,
    },
  ] as FooterLink[],
  tools: [
    { label: "WebM to MP4", href: "/tools/convert/webm-to-mp4" },
    { label: "MOV to MP4", href: "/tools/convert/mov-to-mp4" },
    { label: "AVI to MP4", href: "/tools/convert/avi-to-mp4" },
    { label: "MP4 to GIF", href: "/tools/convert/mp4-to-gif" },
    { label: "MP4 to MP3", href: "/tools/convert/mp4-to-mp3" },
    { label: "MP4 to WebM", href: "/tools/convert/mp4-to-webm" },
    { label: "Video Speed Controller", href: "/tools/video-speed-controller" },
    { label: "Trim Video", href: "/tools/trim" },
  ] as FooterLink[],
  useCases: [
    {
      label: "Remote Team Collaboration",
      href: "/solutions/remote-team-collaboration",
    },
    {
      label: "Employee Onboarding Platform",
      href: "/solutions/employee-onboarding-platform",
    },
    {
      label: "Daily Standup Software",
      href: "/solutions/daily-standup-software",
    },
    {
      label: "Online Classroom Tools",
      href: "/solutions/online-classroom-tools",
    },
    {
      label: "Agencies",
      href: "/solutions/agencies",
    },
  ] as FooterLink[],
  additional: [
    { label: "Loom Video Importer", href: "/loom-alternative" },
    { label: "Migrate from Loom", href: "/migrate-from-loom" },
    { label: "Loom Video Downloader", href: "/tools/loom-downloader" },
    { label: "Screen Recorder", href: "/screen-recorder" },
    { label: "Free Screen Recorder", href: "/free-screen-recorder" },
    { label: "Screen Recorder for Mac", href: "/screen-recorder-mac" },
    { label: "Screen Recorder for Windows", href: "/screen-recorder-windows" },
    { label: "Screen Recording Software", href: "/screen-recording-software" },
    {
      label: "Chrome Screen Recorder",
      href: "/google-chrome-screen-recorder",
    },
    {
      label: "Google Drive Screen Recorder",
      href: "/google-drive-screen-recorder",
    },
    { label: "Cap vs Loom", href: "/loom-alternative" },
    { label: "Student Discount", href: "/student-discount" },
  ] as FooterLink[],
}

const socialLinks: { label: string; href: string; icon: IconDefinition }[] = [
  { label: "X (@Cap)", href: "https://x.com/cap", icon: faXTwitter },
  { label: "Discord", href: "https://discord.gg/y8gdQ3WRN3", icon: faDiscord },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/caprecorder/",
    icon: faLinkedinIn,
  },
]

const complianceBadges: { label: string; content: ReactNode }[] = [
  {
    label: "SOC 2",
    content: (
      <text
        x="22"
        y="25.5"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.2"
        className="fill-current"
      >
        SOC 2
      </text>
    ),
  },
  {
    label: "HIPAA",
    content: (
      <text
        x="22"
        y="25.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.1"
        className="fill-current"
      >
        HIPAA
      </text>
    ),
  },
  {
    label: "ISO 27001",
    content: (
      <>
        <text
          x="22"
          y="21"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          className="fill-current"
        >
          ISO
        </text>
        <text
          x="22"
          y="29.5"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="600"
          letterSpacing="0.4"
          className="fill-current"
        >
          27001
        </text>
      </>
    ),
  },
]

const ComplianceBadges = () => (
  <div>
    <div className="flex flex-wrap items-center gap-2.5 text-muted-foreground">
      {complianceBadges.map(({ label, content }) => (
        <Link
          key={label}
          href="https://trust.cap.so"
          target="_blank"
          rel="noopener noreferrer"
          title={`${label} — in progress`}
          aria-label={`${label} compliance in progress. View Cap's Trust Portal`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            viewBox="0 0 44 44"
            fill="none"
            aria-hidden="true"
            className="size-9"
          >
            <circle cx="22" cy="22" r="21" stroke="currentColor" />
            <circle
              cx="22"
              cy="22"
              r="17.5"
              stroke="currentColor"
              strokeDasharray="1 2.5"
            />
            {content}
          </svg>
        </Link>
      ))}
    </div>
    <p className="mt-2 text-sm text-muted-foreground">
      Certifications in progress
    </p>
  </div>
)

const FooterColumn = ({
  title,
  titleHref,
  links,
}: {
  title: string
  titleHref?: string
  links: FooterLink[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border lg:border-none">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-foreground lg:hidden"
      >
        {title}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {titleHref ? (
        <Link
          href={titleHref}
          className="hidden pb-2 text-lg font-semibold text-foreground transition-colors hover:text-muted-foreground lg:block"
        >
          {title}
        </Link>
      ) : (
        <h3 className="hidden pb-2 text-lg font-semibold text-foreground lg:block">
          {title}
        </h3>
      )}

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
          <Logo
            hideLogoName
            viewBoxDimensions="0 0 40 40"
            className="h-auto w-full"
          />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col gap-12 2xl:flex-row 2xl:gap-16">
            <div className="2xl:w-64 2xl:shrink-0">
              <Logo className="h-auto w-[104px]" />
              <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
                The open source alternative to Loom. Lightweight, powerful, and
                cross-platform — record and share in seconds.
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

            <div className="grid min-w-0 flex-1 grid-cols-1 border-t border-border lg:grid-cols-3 lg:gap-x-10 lg:gap-y-10 lg:border-none xl:grid-cols-5 xl:gap-x-8">
              <FooterColumn title="Product" links={footerLinks.product} />
              <FooterColumn
                title="Additional Links"
                links={footerLinks.additional}
              />
              <FooterColumn title="Cap" links={footerLinks.help} />
              <FooterColumn title="Use Cases" links={footerLinks.useCases} />
              <FooterColumn
                title="Tools"
                titleHref="/tools"
                links={footerLinks.tools}
              />
            </div>
          </div>

          <div className="mt-20 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
              <ComplianceBadges />
              <p className="text-sm text-muted-foreground">
                © Cap Software, Inc. {new Date().getFullYear()}.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href="/terms"
              >
                Terms of Service
              </Link>
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href="/dpa"
              >
                Data Processing Agreement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
