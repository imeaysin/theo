"use client"

import { Button } from "@/components/product-ui"
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faExclamation,
  faFileCsv,
  faInfo,
  faLink,
  faMinus,
  faPlus,
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import {
  BadgeDollarSign,
  Database,
  FileDown,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { type JSX, useId, useState } from "react"
import { LoomMark } from "@/components/icons/loom-mark"

const IMPORT_HREF = "/dashboard/import/loom"

type ImportTab = "single" | "csv"

type ComparisonStatus = "positive" | "negative" | "warning" | "neutral"
type ComparisonCell = { text: string; status?: ComparisonStatus }

const comparisonTable: {
  headers: string[]
  rows: (string | ComparisonCell)[][]
} = {
  headers: ["Feature", "Theo", "Loom"],
  rows: [
    [
      "Pricing",
      { text: "from $8.16/mo per user", status: "positive" },
      { text: "$18/mo per user", status: "warning" },
    ],
    [
      "Open source",
      { text: "Yes", status: "positive" },
      { text: "No", status: "negative" },
    ],
    [
      "Free plan",
      { text: "Unlimited Studio Mode", status: "positive" },
      { text: "Limited features & time", status: "warning" },
    ],
    [
      "4K recording",
      { text: "Free & paid plans", status: "positive" },
      { text: "Paid plans only", status: "warning" },
    ],
    [
      "Bring your own storage",
      { text: "Connect your own S3 or Google Drive", status: "positive" },
      { text: "Not available", status: "negative" },
    ],
    [
      "Team members",
      {
        text: "Invite people to your organization for free",
        status: "positive",
      },
      { text: "Paid per seat", status: "warning" },
    ],
    [
      "Custom domain",
      { text: "Yes", status: "positive" },
      { text: "Enterprise plan only", status: "neutral" },
    ],
    [
      "Data ownership",
      { text: "100% with own storage", status: "positive" },
      { text: "Platform dependent", status: "neutral" },
    ],
  ],
}

const features = [
  {
    icon: FileDown,
    title: "Built-in Loom importer",
    description:
      "Paste a Loom share link or upload a CSV of your whole library. Theo downloads and re-hosts every recording for you, with no manual downloads or re-uploads.",
  },
  {
    icon: BadgeDollarSign,
    title: "Half the price of Loom",
    description:
      "Theo Pro starts at just $8.16/month per user versus Loom's $18. A genuinely generous free plan is included, with Studio mode free for personal use.",
  },
  {
    icon: ShieldCheck,
    title: "Open source & private",
    description:
      "Theo is fully open source and privacy-first. Audit the code, self-host the whole stack, or password-protect sensitive shares. Your call.",
  },
  {
    icon: Database,
    title: "Your storage, your rules",
    description:
      "Connect your own S3 bucket or Google Drive, plus a custom domain, for 100% ownership of every recording. No vendor lock-in, ever.",
  },
  {
    icon: Zap,
    title: "Instant, Studio & Screenshot Modes",
    description:
      "Share in seconds with Instant Mode, edit pixel-perfect locally with Studio Mode, or grab and annotate a single frame, all in one native app.",
  },
  {
    icon: Sparkles,
    title: "Theo AI does the busywork",
    description:
      "Every recording gets an AI-generated title, summary, clickable chapters, and a searchable transcript, so the work after recording is already done.",
  },
]

const steps = [
  {
    title: "Create your free Theo account",
    description: "Sign up in seconds. No credit card required to get started.",
  },
  {
    title: "Open Dashboard → Import → Loom",
    description:
      "Head to the import hub and choose Loom to bring your recordings across.",
  },
  {
    title: "Paste a link or upload a CSV",
    description:
      "Migrate a single share link, or bulk import your entire library from a CSV, assigning videos to members and spaces.",
  },
  {
    title: "We import everything in the background",
    description:
      "Theo re-hosts your videos and they appear in your recordings, ready to share with links, comments and analytics.",
  },
]

const faqs = [
  {
    question: "Can I import my existing Loom videos into Theo?",
    answer:
      "Yes. Theo Pro includes a built-in Loom video importer. Paste a Loom share link to bring a single video across, or upload a CSV to bulk import your whole library directly into Theo.",
  },
  {
    question: "How does bulk migrating from Loom work?",
    answer:
      "Download our CSV template, add a row per video with the Loom URL, the user's email, and an optional space name, then upload it. Theo imports each recording for the matching organization member and places it in the right space, up to 500 videos at a time.",
  },
  {
    question: "Do I need to download my Loom videos first?",
    answer:
      "No. Theo fetches each Loom recording directly from the share link and re-hosts it for you. There's no manual downloading or re-uploading involved.",
  },
  {
    question: "Is migrating from Loom free?",
    answer:
      "Creating a Theo account is free, and you can try Theo with no credit card. The built-in Loom importer is a Theo Pro feature, which starts at just $8.16/month per user, less than half the price of Loom.",
  },
  {
    question: "Will I keep ownership of my recordings?",
    answer:
      "Absolutely. Theo is open source, and you can connect your own S3 storage and custom domain for 100% ownership and control of your content. You're never locked into our platform.",
  },
  {
    question: "How is Theo different from Loom?",
    answer:
      "Theo gives you the simplicity of Loom with the power of professional tools: open source, bring-your-own-storage, better pricing, and a native desktop app that works offline. Plus you actually own your content, and our importer makes switching effortless.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.08, duration: 0.5, ease: "easeOut" },
  }),
}

const statusIcons: Record<ComparisonStatus, JSX.Element> = {
  positive: (
    <div className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
      <FontAwesomeIcon
        icon={faCheck}
        className="text-xs text-primary-foreground"
      />
    </div>
  ),
  negative: (
    <div className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-destructive">
      <FontAwesomeIcon
        icon={faTimes}
        className="text-xs text-primary-foreground"
      />
    </div>
  ),
  warning: (
    <div className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500">
      <FontAwesomeIcon
        icon={faExclamation}
        className="text-xs text-primary-foreground"
      />
    </div>
  ),
  neutral: (
    <div className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-muted">
      <FontAwesomeIcon
        icon={faInfo}
        className="text-xs text-primary-foreground"
      />
    </div>
  ),
}

const renderComparisonCell = (cell: string | ComparisonCell) => {
  if (typeof cell === "string") {
    return <span className="font-medium text-muted-foreground">{cell}</span>
  }
  return (
    <div className="flex items-center gap-3">
      {cell.status && statusIcons[cell.status]}
      <span>{cell.text}</span>
    </div>
  )
}

const ImportDemoTab = ({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: typeof faLink
  label: string
  onClick: () => void
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={clsx(
      "relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
      active
        ? "text-muted-foreground"
        : "cursor-pointer text-muted-foreground hover:text-muted-foreground"
    )}
  >
    {active && (
      <motion.span
        layoutId="migrate-loom-mode-indicator"
        className="absolute inset-0 rounded-full border border-border bg-muted shadow-sm"
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    )}
    <FontAwesomeIcon icon={icon} className="relative size-3.5" />
    <span className="relative">{label}</span>
  </button>
)

const ImportDemo = () => {
  const router = useRouter()
  const [tab, setTab] = useState<ImportTab>("single")

  const goToImport = () => router.push(IMPORT_HREF)

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-muted shadow-xl">
      <div className="flex h-11 items-center gap-3 border-b border-border bg-muted px-4">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-muted" />
          <span className="size-3 rounded-full bg-muted" />
          <span className="size-3 rounded-full bg-muted" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Dashboard</span>
          <FontAwesomeIcon
            className="hidden size-2 text-muted-foreground sm:inline"
            icon={faArrowRight}
          />
          <span className="hidden sm:inline">Import</span>
          <FontAwesomeIcon
            className="hidden size-2 text-muted-foreground sm:inline"
            icon={faArrowRight}
          />
          <span className="font-medium text-muted-foreground">Loom</span>
        </div>
        <div className="w-12" />
      </div>

      <div className="bg-muted p-6 text-left sm:p-8">
        <button
          type="button"
          onClick={goToImport}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-muted-foreground"
        >
          <FontAwesomeIcon className="size-3" icon={faArrowLeft} />
          Back to Import
        </button>

        <div className="mb-8 flex items-start gap-4">
          <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            <LoomMark size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-foreground">
              Import from Loom
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Bring a single Loom video into Theo, or bulk import your whole
              library for organization members from a CSV.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div
            role="tablist"
            aria-label="Loom import mode"
            className="flex w-fit gap-1 rounded-full border border-border bg-muted p-1"
          >
            <ImportDemoTab
              active={tab === "single"}
              icon={faLink}
              label="Single Video"
              onClick={() => setTab("single")}
            />
            <ImportDemoTab
              active={tab === "csv"}
              icon={faFileCsv}
              label="Bulk Import"
              onClick={() => setTab("csv")}
            />
          </div>

          {tab === "single" ? (
            <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-muted">
              <div className="flex flex-col gap-1 border-b border-border px-6 py-5">
                <p className="text-sm font-medium text-muted-foreground">
                  Loom video URL
                </p>
                <p className="text-xs text-muted-foreground">
                  Paste any Loom share link. The video downloads and processes
                  in the background.
                </p>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <button
                  type="button"
                  onClick={goToImport}
                  className="flex h-11 w-full cursor-pointer items-center rounded-xl border border-border bg-muted px-3 text-left text-sm text-muted-foreground transition-colors hover:border-border"
                >
                  https://www.loom.com/share/...
                </button>
                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                  <Button
                    type="button"
                    size="sm"
                    variant="gray"
                    onClick={goToImport}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="dark"
                    onClick={goToImport}
                  >
                    Import Loom
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-muted p-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4 sm:items-center">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FontAwesomeIcon className="size-4" icon={faFileCsv} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-muted-foreground">
                      First time? Start with our template
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Two columns required:{" "}
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        loom_video_url
                      </code>{" "}
                      and{" "}
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        user_email
                      </code>
                      . Add{" "}
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        space_name
                      </code>{" "}
                      to place videos in spaces.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={goToImport}
                  className="flex-shrink-0"
                >
                  <FontAwesomeIcon className="size-3.5" icon={faFileCsv} />
                  Download Template
                </Button>
              </div>

              <button
                type="button"
                onClick={goToImport}
                aria-label="Upload a CSV"
                className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted px-8 py-14 transition-all duration-200 hover:border-border hover:bg-muted"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <FontAwesomeIcon className="size-6" icon={faUpload} />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      Drag and drop your CSV here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Or browse your computer to upload a file.
                    </p>
                  </div>
                  <span className="mt-2 flex h-9 items-center justify-center rounded-full bg-muted px-5 text-sm font-medium text-muted-foreground">
                    Browse CSV
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const createFaqStructuredData = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  })

export const MigrateFromLoomPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const faqScriptId = useId()

  return (
    <>
      <Script id={faqScriptId} type="application/ld+json">
        {createFaqStructuredData()}
      </Script>

      <div className="relative overflow-hidden px-5 pt-[140px] md:pt-[200px]">
        <div className="mx-auto max-w-[820px] text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="mb-5 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <LoomMark size={14} />
              Loom → Theo migration
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-4xl leading-[2.5rem] font-medium text-balance text-foreground md:text-6xl md:leading-[3.75rem]"
          >
            Migrate from Loom to Theo in minutes
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-muted-foreground"
          >
            Bring your existing Loom videos into Theo with the built-in
            importer. Paste a single share link or bulk import your entire
            library from a CSV. Open source, privacy-first, and half the price
            of Loom.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Button
              variant="blue"
              href={IMPORT_HREF}
              size="lg"
              className="w-full font-medium sm:w-auto"
            >
              Import your Loom videos
            </Button>
            <Button
              variant="white"
              href="/loom-alternative"
              size="lg"
              className="w-full font-medium sm:w-auto"
            >
              Compare Theo vs Loom
            </Button>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUp}
            className="mt-4 text-sm text-muted-foreground"
          >
            No credit card required. Free to get started.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="mt-16 md:mt-20"
        >
          <ImportDemo />
          <p className="mx-auto mt-4 text-center text-sm text-muted-foreground">
            This is the Loom importer inside Theo.{" "}
            <a
              href={IMPORT_HREF}
              className="font-medium text-primary transition-colors hover:text-primary"
            >
              Open it in your dashboard to import your first video.
            </a>
          </p>
          <p className="mx-auto mt-2 text-center text-sm text-muted-foreground">
            Prefer to keep the original files? Use our{" "}
            <a
              href="/tools/loom-downloader"
              className="font-medium text-primary transition-colors hover:text-primary"
            >
              free Loom video downloader
            </a>
            .
          </p>
        </motion.div>
      </div>

      <div className="mx-auto mt-32 max-w-7xl px-5 md:mt-44">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-3 text-3xl font-medium text-foreground md:text-4xl">
            Everything you loved about Loom, without the lock-in
          </h2>
          <p className="text-xl leading-relaxed text-muted-foreground">
            Theo is the open-source screen recorder built to be yours: your
            storage, your platform, your workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                custom={index % 3}
                variants={fadeUp}
                className="rounded-2xl border border-border bg-muted p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-4xl px-5 md:mt-44">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-3xl font-medium text-foreground md:text-4xl">
            Theo vs Loom at a glance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="mx-auto w-full overflow-hidden rounded-2xl bg-muted">
            <thead className="bg-muted">
              <tr>
                {comparisonTable.headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-border px-6 py-4 text-left text-lg font-semibold text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonTable.rows.map((row, rowIndex) => (
                <tr
                  key={row[0] as string}
                  className={rowIndex % 2 === 0 ? "bg-muted" : "bg-muted"}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex.toString()}
                      className={clsx(
                        "px-6 py-4 text-base text-muted-foreground",
                        rowIndex === comparisonTable.rows.length - 1
                          ? ""
                          : "border-b border-border"
                      )}
                    >
                      {renderComparisonCell(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-3xl px-5 md:mt-44">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-3xl font-medium text-foreground md:text-4xl">
            How migrating from Loom works
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-muted px-6 shadow-sm sm:px-8">
          <ol className="list-none">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-4 border-border py-6 [&:not(:last-child)]:border-b"
              >
                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    {step.title}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-3xl px-5 md:mt-44">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-3xl font-medium text-foreground md:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={clsx(
                "overflow-hidden rounded-xl border border-border transition-colors duration-200",
                openFaqIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted"
              )}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() =>
                  setOpenFaqIndex(openFaqIndex === index ? null : index)
                }
              >
                <p
                  className={clsx(
                    "text-lg font-medium",
                    openFaqIndex === index
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {faq.question}
                </p>
                <FontAwesomeIcon
                  icon={openFaqIndex === index ? faMinus : faPlus}
                  className={clsx(
                    "size-5 flex-shrink-0",
                    openFaqIndex === index
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </button>
              <AnimatePresence>
                {openFaqIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-32 mb-32 max-w-5xl px-5 md:mt-44 md:mb-44">
        <div
          className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-background p-12 text-center"
          style={{
            backgroundImage: "url('/illustrations/ctabg.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h2 className="mb-4 text-3xl font-medium text-foreground md:text-4xl">
            Ready to leave Loom behind?
          </h2>
          <p className="mb-8 max-w-xl text-xl text-muted-foreground">
            Create your free account and bring your Loom library with you. It
            takes minutes.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="blue"
              href={IMPORT_HREF}
              size="lg"
              className="w-full font-medium sm:w-auto"
            >
              Import your Loom videos
            </Button>
            <Button
              variant="white"
              href="/pricing"
              size="lg"
              className="w-full font-medium sm:w-auto"
            >
              View pricing
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
