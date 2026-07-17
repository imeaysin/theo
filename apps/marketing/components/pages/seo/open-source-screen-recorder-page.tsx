import { Clapperboard, Zap } from "lucide-react"
import { SeoPageTemplate } from "../../seo/seo-page-template"
import type { SeoPageContent } from "../../seo/types"

export const openSourceScreenRecorderContent: SeoPageContent = {
  title: "Open Source Screen Recorder — Free, Private, and Community-Built",
  description:
    "Theo is the leading open-source screen recorder for Mac and Windows. Audit the code, self-host your recordings, and stay in full control of your data. Free forever with no vendor lock-in.",

  featuresTitle: "Why Choose an Open Source Screen Recorder",
  featuresDescription:
    "Open source means full transparency, real privacy, and the freedom to use Theo exactly how you want — without compromise",

  features: [
    {
      title: "Fully Open Source on GitHub",
      description:
        "Theo's entire codebase is publicly available and MIT-licensed on GitHub. Inspect every line of code, understand exactly what happens to your recordings, and contribute features or fixes back to the community.",
    },
    {
      title: "Self-Host Your Recordings",
      description:
        "Connect Theo to any S3-compatible storage — AWS S3, Cloudflare R2, Backblaze, or your own MinIO instance. Your recordings never touch Theo's servers unless you want them to. True data ownership.",
    },
    {
      title: "No Vendor Lock-In",
      description:
        "With a closed-source tool, you're dependent on a company's pricing, policies, and survival. Theo is open source — fork it, modify it, or self-host the entire platform. Your workflow is never held hostage.",
    },
    {
      title: "Community-Driven Development",
      description:
        "Theo is built in the open with contributions from developers around the world. Features are shaped by real user needs, not quarterly revenue targets. File an issue, submit a PR, or join the discussion on GitHub.",
    },
    {
      title: "Privacy-First Architecture",
      description:
        "Because Theo is open source, privacy isn't a marketing claim — it's verifiable. Review the data handling code yourself, run the app locally, and configure storage to keep recordings entirely within your infrastructure.",
    },
    {
      title: "4K Recording at 60fps",
      description:
        "Open source doesn't mean underpowered. Theo captures your screen at up to 4K resolution and 60 frames per second with system audio and webcam overlay. Professional-grade output at zero cost.",
    },
    {
      title: "Instant Shareable Links",
      description:
        "Stop recording and Theo generates a shareable link immediately. No manual uploading, no processing queue. Paste the link in Slack, email, or any tool and viewers get instant access.",
    },
    {
      title: "AI Captions Without Compromise",
      description:
        "Automatically generate accurate captions from your screen recordings. The AI pipeline is part of the open-source codebase — you can see exactly how transcription works and run it on your own infrastructure.",
    },
  ],

  recordingModes: {
    title: "Two Open Source Recording Modes",
    description:
      "Theo gives you two distinct modes so you can choose the right workflow for every recording",
    modes: [
      {
        icon: <Zap fill="yellow" className="mb-4 size-8" strokeWidth={1.5} />,
        title: "Instant Mode",
        description:
          "Record and share instantly with a link ready the moment you stop. Perfect for bug reports, async updates, and quick team communication. Free plan includes recordings up to 5 minutes with built-in thread commenting.",
      },
      {
        icon: (
          <Clapperboard
            fill="var(--primary)"
            className="mb-4 size-8"
            strokeWidth={1.5}
          />
        ),
        title: "Studio Mode",
        description:
          "Completely free for personal use with no time limits. Records at full quality up to 4K with separate screen and webcam tracks. Ideal for tutorials, product demos, and training content — no subscription required.",
      },
    ],
  },

  comparisonTable: {
    title: "Open Source vs Closed Source Screen Recorders",
    headers: ["Feature", "Theo (Open Source)", "Loom", "Vidyard", "Camtasia"],
    rows: [
      [
        "Open source",
        { text: "Yes — MIT licensed", status: "positive" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
      ],
      [
        "Self-hostable",
        { text: "Yes — any S3 storage", status: "positive" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
      ],
      [
        "Auditable code",
        { text: "Yes — full codebase", status: "positive" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
      ],
      [
        "Free to use",
        { text: "Yes — free plan + Studio Mode", status: "positive" },
        { text: "Limited", status: "warning" },
        { text: "Limited", status: "warning" },
        { text: "$299.99 one-time", status: "negative" },
      ],
      [
        "No watermark",
        { text: "Yes", status: "positive" },
        { text: "Paid only", status: "warning" },
        { text: "Paid only", status: "warning" },
        { text: "Yes (paid)", status: "warning" },
      ],
      [
        "4K recording",
        { text: "Yes", status: "positive" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
        { text: "Yes (paid)", status: "warning" },
      ],
      [
        "Instant share link",
        { text: "Yes", status: "positive" },
        { text: "Yes", status: "positive" },
        { text: "Yes", status: "positive" },
        { text: "No", status: "negative" },
      ],
      [
        "AI captions",
        { text: "Yes", status: "positive" },
        { text: "Paid only", status: "warning" },
        { text: "Paid only", status: "warning" },
        { text: "Paid only", status: "warning" },
      ],
    ],
  },

  comparisonTitle: "How Theo Stands Apart as an Open Source Screen Recorder",
  comparisonDescription:
    "The open-source difference goes beyond price — it's about trust, control, and long-term sustainability",

  comparison: [
    {
      title: "Theo vs Loom",
      description:
        "Loom is a closed-source SaaS that owns your recording data and can change pricing at any time. Theo is open source with custom storage support, starting at $9.99/month versus Loom's $18/month — and Theo's Studio Mode is completely free. <a href='/loom-alternative'>See the full Theo vs Loom comparison</a>.",
    },
    {
      title: "Theo vs OBS Studio",
      description:
        "OBS is also open source but built for live streaming, not async screen sharing. Theo brings the open-source ethos to everyday recording with instant shareable links, cloud storage, and built-in commenting — features OBS doesn't offer.",
    },
    {
      title: "Theo vs Vidyard",
      description:
        "Vidyard is a closed-source enterprise video platform with pricing to match. Theo gives teams the same async video capabilities with full transparency, no vendor lock-in, and a free tier that covers most use cases.",
    },
    {
      title: "Theo vs Camtasia",
      description:
        "Camtasia is a powerful but closed-source editor costing $299.99. Theo is open source and covers the full recording-to-sharing workflow for free. If you need advanced editing, combine Theo's free recording with your editor of choice.",
    },
  ],

  useCasesTitle: "Who Uses Theo as Their Open Source Screen Recorder",
  useCasesDescription:
    "From privacy-conscious developers to enterprises with compliance requirements — Theo fits every team that values transparency",

  useCases: [
    {
      title: "Privacy-Conscious Developers",
      description:
        "Developers who want to verify what software does with their data choose Theo because the code is public. Self-host recordings on your own S3 bucket for complete data sovereignty with zero third-party access.",
    },
    {
      title: "Open Source Projects and Communities",
      description:
        "Open source teams use Theo to record demos, walkthroughs, and contributor onboarding videos. The shared ethos of transparency and community ownership makes Theo a natural fit for open source workflows.",
    },
    {
      title: "Enterprise Compliance Teams",
      description:
        "Organizations with strict data residency or compliance requirements deploy Theo with self-hosted storage. Keep every recording within your own infrastructure and satisfy GDPR, HIPAA, or internal security policies.",
    },
    {
      title: "Remote Development Teams",
      description:
        "Engineering teams use Theo to record bug reports, code reviews, and architecture walkthroughs. Instant shareable links drop into GitHub issues, Jira tickets, and Slack without any file transfer overhead.",
    },
    {
      title: "Educational Institutions",
      description:
        "Schools and universities choose Theo because open-source software is auditable, trustworthy, and free from unexpected pricing changes. <a href='/solutions/online-classroom-tools'>Learn how Theo supports online teaching</a>.",
    },
    {
      title: "Startups and Indie Developers",
      description:
        "Small teams get enterprise-quality async video without SaaS pricing. Theo's free Studio Mode and open-source codebase mean you can grow without worrying about per-seat costs or licensing terms.",
    },
  ],

  faqsTitle: "Frequently Asked Questions About Open Source Screen Recording",
  faqs: [
    {
      question: "Is Theo really open source?",
      answer:
        "Yes. Theo is fully open source and MIT-licensed. The complete codebase — desktop app, web app, Rust media processing pipeline, and all backend services — is publicly available on GitHub. You can inspect every line, fork the project, and contribute back to the community.",
    },
    {
      question: "Can I self-host Theo's screen recordings?",
      answer:
        "Yes. Theo supports any S3-compatible storage provider, including AWS S3, Cloudflare R2, Backblaze B2, and self-hosted MinIO. Configure your own bucket in Theo's settings and your recordings are stored entirely within your infrastructure — Theo's servers never see your content.",
    },
    {
      question: "What is the best open source screen recorder?",
      answer:
        "Theo is the best open source screen recorder for most users because it combines full transparency with practical features: 4K recording, instant shareable links, webcam overlay, AI captions, and built-in thread commenting. OBS Studio is also open source but designed for streaming rather than async screen sharing and instant link generation.",
    },
    {
      question: "Is Theo's open source version free?",
      answer:
        "Yes. Theo's Studio Mode is completely free for personal use with no time limits and no watermarks. Instant Mode on the free plan supports recordings up to 5 minutes. Theo Pro ($9.99/month) removes Instant Mode time limits and adds team features. The core software will always be open source and free to use.",
    },
    {
      question:
        "How does Theo compare to OBS Studio as an open source recorder?",
      answer:
        "Both Theo and OBS Studio are open source, but they serve different workflows. OBS requires significant setup and is built for live streaming. Theo is designed for async screen sharing — you record, get a shareable link in seconds, and viewers can leave timestamped comments. Theo is the better open source screen recorder for teams and everyday recording.",
    },
    {
      question: "Can I contribute to Theo's development?",
      answer:
        "Absolutely. Theo welcomes contributions of all kinds — bug reports, feature requests, code contributions, and documentation improvements. Visit Theo's GitHub repository to file issues, browse open tasks, or submit a pull request. The roadmap is public and shaped by community feedback.",
    },
    {
      question: "Does Theo work on Mac and Windows?",
      answer:
        "Yes. Theo is available as a native desktop app for macOS and Windows. Both versions are included in the same open-source repository. <a href='/screen-recorder-mac'>Learn more about screen recording on Mac</a> or <a href='/screen-recorder-windows'>learn more about screen recording on Windows</a>.",
    },
    {
      question: "What license does Theo use?",
      answer:
        "Theo is released under the MIT License, one of the most permissive open-source licenses available. You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software. Commercial use is permitted. Attribution is required.",
    },
  ],

  video: {
    url: "/videos/theo-demo.mp4",
    thumbnail: "/videos/theo-demo-thumbnail.png",
    alt: "Theo open source screen recorder demo showing recording, sharing, and self-hosting",
  },

  cta: {
    title: "Start Recording with the Best Open Source Screen Recorder",
    buttonText: "Download Theo Free",
    secondaryButtonText: "View on GitHub",
  },
}

export const OpenSourceScreenRecorderPage = () => {
  return <SeoPageTemplate content={openSourceScreenRecorderContent} />
}
