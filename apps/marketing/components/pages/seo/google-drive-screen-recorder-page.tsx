"use client"

import { Button } from "@/components/product-ui"
import {
  faCheck,
  faMinus,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeftRight,
  Building2,
  FolderLock,
  Gauge,
  HardDriveUpload,
  Link2,
  MousePointerClick,
  ShieldCheck,
  Zap,
} from "lucide-react"
import Image from "next/image"
import { type JSX, useState } from "react"
import { GoogleDriveLogo } from "@/components/icons/google-drive-logo"
import { googleDriveScreenRecorderFaqs } from "./google-drive-screen-recorder-faqs"

type ComparisonStatus = "positive" | "negative" | "warning" | "neutral"
type ComparisonCell = { text: string; status?: ComparisonStatus }

const features = [
  {
    icon: MousePointerClick,
    title: "Connect Google Drive in two clicks",
    description:
      "No access keys, endpoints, or buckets to configure. Sign in with Google once, approve access, and Theo is ready to store your recordings in your own Drive.",
  },
  {
    icon: HardDriveUpload,
    title: "Every shareable link lives in your Drive",
    description:
      "Once connected, new shareable links upload straight to a private Theo folder in your Google Drive. You own the underlying video files, in the account you already trust.",
  },
  {
    icon: Building2,
    title: "For one person or your whole organization",
    description:
      "Connect Drive to your personal account from the desktop app, or have an admin connect it once for the entire organization so every member's recordings land in the same place.",
  },
  {
    icon: Link2,
    title: "Your links keep working exactly the same",
    description:
      "Share links stay on Theo with comments, viewer analytics, chapters, and password protection intact. The recording is simply streamed from your Google Drive instead of Theo Cloud.",
  },
  {
    icon: ArrowLeftRight,
    title: "Switch storage whenever you want",
    description:
      "Keep Theo Cloud and your own S3 bucket alongside Drive, then choose the active provider with one toggle. Existing recordings keep the storage they were created with.",
  },
  {
    icon: ShieldCheck,
    title: "Theo only ever touches its own folder",
    description:
      "Theo uses Google's drive.file permission, so it can only see and manage the files it creates for you. The rest of your Google Drive stays completely private to Theo.",
  },
]

const flow = [
  {
    icon: <Zap className="size-6" strokeWidth={1.75} />,
    title: "1. Record in Theo",
    description:
      "Capture your screen in Instant Mode or Studio Mode on Mac or Windows, at up to 4K and 60fps, with system audio and webcam.",
  },
  {
    icon: <GoogleDriveLogo size={26} />,
    title: "2. Store in your Drive",
    description:
      "When you share, Theo uploads the recording to a private Theo folder in your connected Google Drive, individually or for your whole organization.",
  },
  {
    icon: <Link2 className="size-6" strokeWidth={1.75} />,
    title: "3. Share from your Drive",
    description:
      "Copy your Theo link. Viewers watch through Theo's player while the video is served straight from your own Google Drive after access checks.",
  },
]

const comparisonTable: {
  headers: string[]
  rows: (string | ComparisonCell)[][]
} = {
  headers: ["Feature", "Theo + Google Drive", "Loom", "Vidyard"],
  rows: [
    [
      "Store recordings in your own Google Drive",
      { text: "Yes, native integration", status: "positive" },
      { text: "Not available", status: "negative" },
      { text: "Not available", status: "negative" },
    ],
    [
      "You own the video files",
      { text: "Yes, in your account", status: "positive" },
      { text: "Stored on Loom", status: "negative" },
      { text: "Stored on Vidyard", status: "negative" },
    ],
    [
      "Connect with one Google sign-in",
      { text: "Yes", status: "positive" },
      { text: "Not applicable", status: "neutral" },
      { text: "Not applicable", status: "neutral" },
    ],
    [
      "Organization-wide storage",
      { text: "Connect once for the team", status: "positive" },
      { text: "Platform managed", status: "neutral" },
      { text: "Platform managed", status: "neutral" },
    ],
    [
      "Also supports your own S3 bucket",
      { text: "Yes", status: "positive" },
      { text: "No", status: "negative" },
      { text: "No", status: "negative" },
    ],
    [
      "Instant shareable links",
      { text: "Yes", status: "positive" },
      { text: "Yes", status: "positive" },
      { text: "Yes", status: "positive" },
    ],
    [
      "Open source",
      { text: "Yes, MIT licensed", status: "positive" },
      { text: "No", status: "negative" },
      { text: "No", status: "negative" },
    ],
    [
      "Pricing",
      { text: "from $8.16/mo per user", status: "positive" },
      { text: "$18/mo per user", status: "warning" },
      { text: "Quote based", status: "warning" },
    ],
  ],
}

const steps = [
  {
    title: "Upgrade to Theo Pro",
    description:
      "Connecting your own Google Drive is a Theo Pro feature, available for individual creators and entire organizations.",
  },
  {
    title: "Open the storage integrations",
    description:
      "On desktop go to Settings, then Integrations, then Google Drive. For a whole team, an admin opens Dashboard, Settings, Organization, then Integrations.",
  },
  {
    title: "Connect Google Drive",
    description:
      "Click Connect Google Drive, sign in, and approve access. Theo creates a private Theo folder in your Drive for new uploads.",
  },
  {
    title: "Record and share",
    description:
      "Record in Instant or Studio Mode, then copy your share link. The recording uploads to your Drive and is served from there for every viewer.",
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
        icon={faMinus}
        className="text-xs text-primary-foreground"
      />
    </div>
  ),
  neutral: (
    <div className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-muted">
      <FontAwesomeIcon
        icon={faMinus}
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

const ConnectionDemo = () => (
  <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-muted shadow-xl">
    <div className="flex h-11 items-center gap-3 border-b border-border bg-muted px-4">
      <div className="flex gap-1.5">
        <span className="size-3 rounded-full bg-muted" />
        <span className="size-3 rounded-full bg-muted" />
        <span className="size-3 rounded-full bg-muted" />
      </div>
      <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
        <span className="font-medium text-muted-foreground">
          Settings → Integrations → Google Drive
        </span>
      </div>
      <div className="w-12" />
    </div>

    <div className="bg-muted p-6 text-left sm:p-8">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-muted p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
            <GoogleDriveLogo size={24} />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              Google Drive
            </p>
            <p className="text-xs text-muted-foreground">
              Active for new uploads
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary sm:self-auto">
          <span className="size-1.5 rounded-full bg-primary" />
          Connected
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted px-5 py-4">
        <Gauge
          className="size-4 flex-shrink-0 text-muted-foreground"
          strokeWidth={1.75}
        />
        <div className="flex-1">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>Drive storage</span>
            <span>42.6 GB of 100 GB used</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[43%] rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {flow.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 rounded-xl border border-border bg-muted p-4"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {item.icon}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const GoogleDriveScreenRecorderPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  return (
    <>
      <div className="relative overflow-hidden px-5 pt-[140px] md:pt-[200px]">
        <div className="mx-auto max-w-[820px] text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted">
              <Image
                src="/logos/logo-solo.svg"
                alt="Theo"
                width={22}
                height={22}
              />
            </span>
            <span className="text-muted-foreground">+</span>
            <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted">
              <GoogleDriveLogo size={24} />
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-4xl leading-[2.5rem] font-medium text-balance text-foreground md:text-6xl md:leading-[3.75rem]"
          >
            The screen recorder that saves straight to your Google Drive
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-muted-foreground"
          >
            Connect Google Drive to Theo and every shareable link uploads to,
            and is served from, your own Drive. Available for individual
            creators and entire organizations. Open source, privacy-first, and
            yours to keep.
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
              href="/download"
              size="lg"
              className="w-full font-medium sm:w-auto"
            >
              Download Theo Free
            </Button>
            <Button
              variant="white"
              href="/pricing"
              size="lg"
              className="w-full font-medium sm:w-auto"
            >
              View pricing
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
          <ConnectionDemo />
          <p className="mx-auto mt-4 text-center text-sm text-muted-foreground">
            This is the Google Drive integration inside Theo, available on Theo
            Pro.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto mt-32 max-w-7xl px-5 md:mt-44">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-3 text-3xl font-medium text-foreground md:text-4xl">
            Your recordings, in the Drive you already own
          </h2>
          <p className="text-xl leading-relaxed text-muted-foreground">
            Theo brings the instant sharing you expect from Loom, while every
            new recording stays in your own Google Drive.
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

      <div className="mx-auto mt-32 max-w-[1100px] px-5 md:mt-44">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-3 text-3xl font-medium text-foreground md:text-4xl">
            How Theo and Google Drive work together
          </h2>
          <p className="text-xl leading-relaxed text-muted-foreground">
            Record once and Theo handles the rest, from upload to a shareable
            link served from your Drive.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {flow.map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={index}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-muted p-8 shadow-sm"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                {item.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-muted-foreground">
          Prefer object storage instead? Theo also lets you{" "}
          <a
            href="/self-hosted-screen-recording"
            className="font-semibold text-primary transition-colors hover:text-primary"
          >
            connect your own S3-compatible bucket
          </a>{" "}
          , or see how Theo compares as a{" "}
          <a
            href="/loom-alternative"
            className="font-semibold text-primary transition-colors hover:text-primary"
          >
            Loom alternative
          </a>
          .
        </p>
      </div>

      <div className="mx-auto mt-32 max-w-4xl px-5 md:mt-44">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-3xl font-medium text-foreground md:text-4xl">
            Theo with Google Drive vs other recorders
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
            How to record to Google Drive with Theo
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
          {googleDriveScreenRecorderFaqs.map((faq, index) => (
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
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
              <FolderLock
                className="size-5 text-muted-foreground"
                strokeWidth={1.75}
              />
            </span>
            <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
              <GoogleDriveLogo size={22} />
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-medium text-foreground md:text-4xl">
            Keep every recording in your own Google Drive
          </h2>
          <p className="mb-8 max-w-xl text-xl text-muted-foreground">
            Download Theo, upgrade to Pro, and connect Google Drive for yourself
            or your whole organization in minutes.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="blue"
              href="/download"
              size="lg"
              className="w-full font-medium sm:w-auto"
            >
              Download Theo Free
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
