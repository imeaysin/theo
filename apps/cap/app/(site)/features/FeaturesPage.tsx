"use client"

import { Button } from "@/components/cap-ui"
import {
  faBolt,
  faCamera,
  faChartLine,
  faCheckCircle,
  faClock,
  faCloud,
  faCode,
  faCog,
  faComments,
  faDesktop,
  faDownload,
  faEdit,
  faExpand,
  faGlobe,
  faInfinity,
  faKeyboard,
  faLock,
  faMagic,
  faMobileAlt,
  faPalette,
  faRocket,
  faServer,
  faShareNodes,
  faShieldAlt,
  faUsers,
  faVideo,
  faVolumeUp,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

interface Feature {
  icon: any
  title: string
  description: string
  category: "recording" | "ai" | "sharing" | "editing" | "platform" | "privacy"
  isPro?: boolean
  isComingSoon?: boolean
  size?: "small" | "medium" | "large"
}

const features: Feature[] = [
  {
    icon: faVideo,
    title: "Instant & Studio Modes",
    description:
      "Choose between quick shareable recordings or professional local editing with Studio Mode",
    category: "recording",
    size: "medium",
  },
  {
    icon: faRocket,
    title: "4K 60fps Recording",
    description:
      "Crystal-clear recordings at up to 4K resolution and 60 frames per second",
    category: "recording",
  },
  {
    icon: faCamera,
    title: "Composite Recording",
    description:
      "Camera and screen recorded separately and rendered as one video in real-time",
    category: "recording",
  },
  {
    icon: faDesktop,
    title: "Multiple Layouts",
    description:
      "Choose from various recording layouts to best showcase your content",
    category: "recording",
  },
  {
    icon: faPalette,
    title: "Custom Branding",
    description:
      "Add your logo, colors, and custom backgrounds to match your brand",
    category: "recording",
  },
  {
    icon: faBolt,
    title: "Blazing Fast Native App",
    description:
      "Lightning-fast performance with native macOS and Windows applications",
    category: "platform",
  },
  {
    icon: faKeyboard,
    title: "Keyboard Shortcuts",
    description:
      "Efficient workflow with customizable keyboard shortcuts for all actions",
    category: "recording",
  },
  {
    icon: faExpand,
    title: "Smart Auto-Zoom",
    description: "Automatically zoom in on important content during recordings",
    category: "recording",
  },
  {
    icon: faCog,
    title: "Advanced Cursor Settings",
    description:
      "Customize cursor size, style, animations, and motion blur effects",
    category: "recording",
  },
  {
    icon: faPalette,
    title: "Background Customization",
    description:
      "Choose from colors, gradients, images, or blur effects for your background",
    category: "editing",
  },

  {
    icon: faWandMagicSparkles,
    title: "AI-Generated Titles",
    description: "Automatically generate engaging titles for your recordings",
    category: "ai",
    isPro: true,
  },
  {
    icon: faMagic,
    title: "Smart Summaries",
    description: "Get AI-powered summaries of your recording content instantly",
    category: "ai",
    isPro: true,
    size: "medium",
  },
  {
    icon: faCheckCircle,
    title: "Clickable Chapters",
    description:
      "Auto-generated chapter markers for easy navigation through long recordings",
    category: "ai",
    isPro: true,
  },
  {
    icon: faComments,
    title: "Automatic Transcriptions",
    description: "Accurate transcriptions generated for every recording",
    category: "ai",
    isPro: true,
    size: "medium",
  },
  {
    icon: faEdit,
    title: "Auto-Edit",
    description:
      "AI-powered automatic editing to remove silences and improve pacing",
    category: "ai",
    isComingSoon: true,
  },
  {
    icon: faVolumeUp,
    title: "Noise Reduction",
    description: "Advanced AI noise reduction for crystal-clear audio",
    category: "ai",
    isComingSoon: true,
  },

  {
    icon: faCloud,
    title: "Unlimited Cloud Storage",
    description:
      "Store all your recordings in the cloud with no storage limits",
    category: "sharing",
    isPro: true,
    size: "medium",
  },
  {
    icon: faShareNodes,
    title: "Instant Shareable Links",
    description:
      "Share recordings instantly with a simple link - no downloads required",
    category: "sharing",
  },
  {
    icon: faLock,
    title: "Password Protection",
    description: "Secure your sensitive recordings with password protection",
    category: "sharing",
    isPro: true,
  },
  {
    icon: faChartLine,
    title: "Viewer Analytics",
    description: "Track views, engagement, and watch time for your recordings",
    category: "sharing",
    isPro: true,
  },
  {
    icon: faUsers,
    title: "Team Workspaces",
    description: "Collaborate with your team in organized workspaces",
    category: "sharing",
    isPro: true,
  },
  {
    icon: faComments,
    title: "Thread Comments",
    description: "Contextual discussions with timestamp-linked comments",
    category: "sharing",
  },
  {
    icon: faGlobe,
    title: "Custom Domain",
    description: "Share recordings from your own domain (cap.yourdomain.com)",
    category: "sharing",
    isPro: true,
  },
  {
    icon: faCode,
    title: "Embed Support",
    description: "Embed recordings anywhere with customizable players",
    category: "sharing",
  },

  {
    icon: faServer,
    title: "Bring Your Own Storage",
    description:
      "Connect your own Google Drive or S3 bucket for complete data ownership",
    category: "privacy",
    isPro: true,
  },
  {
    icon: faShieldAlt,
    title: "Local Recording",
    description:
      "Record and store everything locally with Cap Studio Mode - your data never leaves your device",
    category: "privacy",
    size: "medium",
  },
  {
    icon: faCode,
    title: "100% Open Source",
    description:
      "Fully transparent, auditable code you can trust and contribute to",
    category: "privacy",
    size: "medium",
  },
  {
    icon: faServer,
    title: "Self-Hosting",
    description: "Deploy Cap on your own infrastructure for ultimate control",
    category: "privacy",
  },

  {
    icon: faDownload,
    title: "Loom Video Importer",
    description:
      "Switching from Loom? Import your existing Loom recordings directly into Cap and keep all your content in one place",
    category: "platform",
    size: "medium",
  },
  {
    icon: faMobileAlt,
    title: "Cross-Platform",
    description: "Native apps for macOS (Apple Silicon & Intel) and Windows",
    category: "platform",
    size: "medium",
  },

  {
    icon: faClock,
    title: "Timeline Editor",
    description: "Professional timeline editing with frame-perfect precision",
    category: "editing",
    size: "medium",
  },
  {
    icon: faEdit,
    title: "Split & Trim",
    description: "Cut, split, and trim your recordings with ease",
    category: "editing",
  },
  {
    icon: faDownload,
    title: "Export Any Format",
    description: "Export to MP4, WebM, MOV, GIF and more formats",
    category: "editing",
  },
  {
    icon: faClock,
    title: "Speed Control",
    description: "Adjust playback speed from 0.25x to 3x",
    category: "editing",
  },
  {
    icon: faInfinity,
    title: "No Watermarks",
    description: "Your recordings are yours - no Cap watermarks ever",
    category: "editing",
  },

  {
    icon: faChartLine,
    title: "Performance Insights",
    description: "Detailed analytics on recording performance and system usage",
    category: "platform",
    isComingSoon: true,
  },
  {
    icon: faServer,
    title: "Webhooks & API",
    description:
      "Integrate Cap into your workflow with webhooks and API access",
    category: "platform",
    isPro: true,
    isComingSoon: true,
    size: "medium",
  },
  {
    icon: faWandMagicSparkles,
    title: "AI Video Search",
    description: "Search through your recordings using natural language",
    category: "ai",
    isPro: true,
    isComingSoon: true,
  },
]

const categoryColors = {
  recording: "bg-muted dark:bg-muted border-border",
  ai: "bg-muted dark:bg-muted border-border",
  sharing: "bg-muted dark:bg-muted border-border",
  editing: "bg-muted dark:bg-muted border-border",
  platform: "bg-muted dark:bg-muted border-border",
  privacy: "bg-muted dark:bg-muted border-border",
}

const categoryIcons = {
  recording: { icon: faVideo, color: "text-muted-foreground" },
  ai: { icon: faWandMagicSparkles, color: "text-muted-foreground" },
  sharing: { icon: faShareNodes, color: "text-muted-foreground" },
  editing: { icon: faEdit, color: "text-muted-foreground" },
  platform: { icon: faDesktop, color: "text-muted-foreground" },
  privacy: { icon: faShieldAlt, color: "text-muted-foreground" },
}

export const FeaturesPage = () => {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 w-full px-5 pt-32 pb-20">
        <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
          <h1 className="relative z-10 mb-4 text-3xl leading-[2.5rem] font-medium md:text-6xl md:leading-[4rem]">
            The screen recorder for
            <br />
            <span className="text-muted-foreground">teams and creators</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-base text-muted-foreground sm:text-xl">
            Whether you're a solo creator or a global agency, Cap scales with
            you. Record in 4K, collaborate seamlessly, maintain brand
            consistency, and ship content faster. All while keeping full control
            of your data.
          </p>

          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-2">
            <Button
              href="/download"
              variant="primary"
              size="lg"
              className="flex w-full items-center justify-center text-base font-medium sm:w-auto"
            >
              Download Cap Free
            </Button>
            <Button
              href="/pricing"
              variant="blue"
              size="lg"
              className="flex w-full items-center justify-center text-base font-medium sm:w-auto"
            >
              Upgrade to Cap Pro
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-5 pb-32 sm:px-8 lg:px-10">
        <div className="grid grid-flow-dense auto-rows-[minmax(200px,_auto)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => {
            const sizeClasses = {
              small: "col-span-1",
              medium: "col-span-1 md:col-span-2",
              large: "col-span-1 md:col-span-2 lg:col-span-2",
            }

            return (
              <div
                key={index}
                className={` ${sizeClasses[feature.size || "small"]} group relative overflow-hidden rounded-xl border p-6 ${categoryColors[feature.category]} transition-all duration-200 hover:border-border ${feature.isComingSoon ? "opacity-75" : ""} `}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted dark:bg-muted ${categoryIcons[feature.category].color} `}
                >
                  <FontAwesomeIcon icon={feature.icon} className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                  {feature.isPro && (
                    <Link
                      href="/pricing"
                      className="ml-2 inline-flex items-center rounded-full bg-gradient-to-br from-primary/20 to-primary/20 px-2 py-1 text-xs font-medium text-primary-foreground transition-all duration-200 hover:from-primary/20 hover:to-primary/20"
                    >
                      Cap Pro
                    </Link>
                  )}
                  {feature.isComingSoon && (
                    <span className="ml-2 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      SOON
                    </span>
                  )}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <FontAwesomeIcon
                    icon={categoryIcons[feature.category].icon}
                    className={`h-4 w-4 ${
                      categoryIcons[feature.category].color
                    } opacity-50`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-muted py-32 md:py-40">
        <div className="mx-auto w-full max-w-screen-2xl px-5 text-center sm:px-8 lg:px-10">
          <h2 className="mb-4 text-3xl font-medium">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of users who are already creating better recordings
            with Cap.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              href="/download"
              variant="primary"
              size="lg"
              className="font-medium"
            >
              Download Cap Free
            </Button>
            <Button
              href="/pricing"
              variant="white"
              size="lg"
              className="font-medium"
            >
              Compare Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
