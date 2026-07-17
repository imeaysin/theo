import { Clapperboard, Zap } from "lucide-react"
import { SeoPageTemplate } from "../../seo/seo-page-template"
import type { SeoPageContent } from "../../seo/types"

export const videoRecordingSoftwareContent: SeoPageContent = {
  title: "Video Recording Software — Free, HD Quality, Instant Sharing | Theo",
  description:
    "Theo is free video recording software for Mac and Windows. Record your screen, webcam, and audio in HD, then share instantly with a link. Open-source, no watermarks, no time limits in Studio Mode.",

  featuresTitle: "Why Theo is the Best Video Recording Software",
  featuresDescription:
    "Everything you need to capture, share, and collaborate on video recordings — completely free and open-source",

  features: [
    {
      title: "HD Video Capture Up to 4K at 60fps",
      description:
        "Record crystal-clear video at up to 4K resolution and 60 frames per second. Theo captures every detail of your screen with smooth motion and sharp text, delivering professional output without professional pricing.",
    },
    {
      title: "Screen, Webcam, and Audio Together",
      description:
        "Capture your full screen or a specific window alongside your webcam in a picture-in-picture overlay. Record system audio and microphone simultaneously so your video recordings are complete and ready to share without any post-production.",
    },
    {
      title: "Instant Shareable Links",
      description:
        "Stop recording and Theo generates a shareable link in seconds. No uploading, no waiting, no file transfers. Paste the link in Slack, email, or Notion and your viewers get instant access. <a href='/screen-recording'>Learn more about screen recording with Theo</a>.",
    },
    {
      title: "Completely Free, No Watermarks",
      description:
        "Theo's Studio Mode is 100% free for personal use with no watermarks, no time limits, and no hidden fees. Unlike most video recording software, Theo never adds branding overlays to your recordings. <a href='/free-screen-recorder'>Download Theo's free recorder</a> today.",
    },
    {
      title: "Open Source and Auditable",
      description:
        "Theo is fully open-source on GitHub and MIT-licensed. Inspect every line of code, verify how your recordings are handled, and contribute features back to the community. No black boxes, no vendor lock-in. <a href='/open-source-screen-recorder'>Learn more about Theo as open-source software</a>.",
    },
    {
      title: "Separate Screen and Webcam Tracks",
      description:
        "In Studio Mode, screen and webcam video are saved as independent tracks. Edit them separately in your video editor for full post-production control — ideal for tutorials, product demos, and professional training content.",
    },
    {
      title: "AI-Powered Captions",
      description:
        "Automatically generate accurate captions from your video recordings with zero manual effort. Theo's built-in transcription makes content accessible, searchable, and more engaging without requiring a separate transcription service.",
    },
    {
      title: "Built-In Thread Commenting",
      description:
        "Viewers can leave timestamped comments directly on your video recordings. Collect structured feedback without long email threads or follow-up calls — collaboration is built into every recording Theo shares.",
    },
  ],

  recordingModes: {
    title: "Two Video Recording Modes for Every Workflow",
    description:
      "Theo adapts to whether you need a quick share or a polished professional video",
    modes: [
      {
        icon: <Zap fill="yellow" className="mb-4 size-8" strokeWidth={1.5} />,
        title: "Instant Mode",
        description:
          "Record and get a shareable link the moment you stop. Perfect for quick demos, bug reports, and async team updates. Free plan includes video recordings up to 5 minutes with built-in thread commenting.",
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
          "Completely free for personal use with no time limits. Records at full quality up to 4K with separate screen and webcam tracks. Ideal for tutorials, polished product demos, and professional training videos — no subscription required.",
      },
    ],
  },

  comparisonTable: {
    title: "Video Recording Software Compared",
    headers: ["Feature", "Theo", "Loom", "Camtasia", "OBS Studio"],
    rows: [
      [
        "Price",
        { text: "Free / $9.99/mo", status: "positive" },
        { text: "Free / $18/mo", status: "warning" },
        { text: "$299.99 one-time", status: "negative" },
        { text: "Free", status: "positive" },
      ],
      [
        "No watermark",
        { text: "Yes", status: "positive" },
        { text: "Free plan adds watermark", status: "negative" },
        { text: "Yes (paid only)", status: "warning" },
        { text: "Yes", status: "positive" },
      ],
      [
        "Instant share link",
        { text: "Yes", status: "positive" },
        { text: "Yes", status: "positive" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
      ],
      [
        "4K recording",
        { text: "Yes", status: "positive" },
        { text: "No", status: "negative" },
        { text: "Yes (paid)", status: "warning" },
        { text: "Yes", status: "positive" },
      ],
      [
        "Open source",
        { text: "Yes", status: "positive" },
        { text: "No", status: "negative" },
        { text: "No", status: "negative" },
        { text: "Yes", status: "positive" },
      ],
      [
        "Mac and Windows",
        { text: "Yes", status: "positive" },
        { text: "Browser only", status: "warning" },
        { text: "Yes", status: "positive" },
        { text: "Yes", status: "positive" },
      ],
      [
        "Webcam + screen",
        { text: "Yes", status: "positive" },
        { text: "Yes", status: "positive" },
        { text: "Yes (paid)", status: "warning" },
        { text: "Yes", status: "positive" },
      ],
      [
        "AI captions",
        { text: "Yes", status: "positive" },
        { text: "Yes (paid)", status: "warning" },
        { text: "Yes (paid)", status: "warning" },
        { text: "No", status: "negative" },
      ],
    ],
  },

  comparisonTitle: "How Theo Compares to Other Video Recording Software",
  comparisonDescription:
    "The best video recording software for your workflow depends on what you need — here's how Theo stacks up",

  comparison: [
    {
      title: "Theo vs Loom",
      description:
        "Theo starts at $9.99/month versus Loom's $18/month, and Theo's Studio Mode is completely free with no watermarks. Theo records at up to 4K, is open-source, and supports custom S3 storage — quality and flexibility that Loom's free and paid plans don't match. <a href='/loom-alternative'>See the full Theo vs Loom comparison</a>.",
    },
    {
      title: "Theo vs Camtasia",
      description:
        "Camtasia costs $299.99 and is built around editing rather than instant sharing. Theo is free and covers the full workflow from video recording to sharing — making it the better choice for users who want professional results without enterprise pricing.",
    },
    {
      title: "Theo vs OBS Studio",
      description:
        "OBS is also open-source and free, but it requires significant configuration and is designed for live streaming rather than async video sharing. Theo delivers instant shareable links, built-in commenting, and a clean interface with no setup overhead. <a href='/screen-recording-software'>Compare screen recording software in detail</a>.",
    },
    {
      title: "Theo vs Built-in OS Recorders",
      description:
        "macOS and Windows built-in recorders lack system audio, webcam overlay, and instant sharing. Theo adds all of these natively with no extra plugins required. <a href='/screen-recorder-mac'>Learn more about video recording on Mac</a> or <a href='/screen-recorder-windows'>Windows</a>.",
    },
  ],

  useCasesTitle: "Who Uses Theo as Their Video Recording Software",
  useCasesDescription:
    "From solo developers to enterprise teams — Theo fits every workflow that needs fast, professional video recordings",

  useCases: [
    {
      title: "Software Tutorials and Documentation",
      description:
        "Developers and product teams record step-by-step tutorials and feature walkthroughs with Theo. HD quality and instant shareable links make it easy to publish documentation or share onboarding guides without any video hosting setup.",
    },
    {
      title: "Async Team Communication",
      description:
        "Replace synchronous meetings with short video recordings. Record a walkthrough, share the link in Slack, and let your team watch asynchronously. <a href='/solutions/remote-team-collaboration'>Learn how Theo supports remote teams</a>.",
    },
    {
      title: "Bug Reports and QA",
      description:
        "Recording a bug is faster and clearer than writing a description. Theo's Instant Mode captures exactly what went wrong and delivers a shareable link in seconds so engineers can reproduce and fix issues immediately.",
    },
    {
      title: "Client Demos and Presentations",
      description:
        "Record polished product demos and share them as links without scheduling a live call. Theo's built-in thread commenting lets clients leave structured feedback directly on the recording.",
    },
    {
      title: "Employee Training and Onboarding",
      description:
        "Build a library of training videos that new hires can access on-demand. AI-powered captions make every recording searchable and accessible. <a href='/solutions/employee-onboarding-platform'>Learn how Theo supports employee onboarding</a>.",
    },
    {
      title: "Education and Course Content",
      description:
        "Educators record lectures, screen walkthroughs, and instructional content with Studio Mode at no cost. <a href='/solutions/online-classroom-tools'>Learn how Theo supports online classrooms</a>.",
    },
  ],

  faqsTitle: "Frequently Asked Questions About Video Recording Software",
  faqs: [
    {
      question: "What is video recording software?",
      answer:
        "Video recording software captures the visual and audio output from your computer as a video file. This includes screen recording software that records your display, as well as tools that capture webcam footage, system audio, and microphone input simultaneously. Theo is video recording software that records your screen and webcam in up to 4K, generates instant shareable links, and stores recordings in the cloud.",
    },
    {
      question: "What is the best free video recording software?",
      answer:
        "Theo is the best free video recording software for most users. Studio Mode is 100% free for personal use with no watermarks, no time limits, and up to 4K recording quality. Instant Mode supports recordings up to 5 minutes on the free plan with instant shareable links. <a href='/free-screen-recorder'>Download Theo's free recorder</a> to get started.",
    },
    {
      question: "Is Theo video recording software free?",
      answer:
        "Yes. Theo's Studio Mode is completely free for personal use with no time limits, no watermarks, and no hidden fees. Instant Mode is free for recordings up to 5 minutes. Theo Pro at $9.99/month removes Instant Mode limits and adds team features — but the core video recording software is free to use forever.",
    },
    {
      question: "Does Theo video recording software work on Mac and Windows?",
      answer:
        "Yes. Theo is available as a native desktop app for both macOS and Windows. Both versions support up to 4K recording, system audio capture, webcam overlay, and instant sharing. <a href='/screen-recorder-mac'>Learn more about video recording on Mac</a> or <a href='/screen-recorder-windows'>video recording on Windows</a>.",
    },
    {
      question: "Can video recording software capture system audio?",
      answer:
        "Yes. Theo captures both system audio and microphone input simultaneously in every recording. You can narrate live while application sounds and system audio play through, creating a complete and synchronized video recording without any additional setup.",
    },
    {
      question: "What video recording software has no watermark?",
      answer:
        "Theo has no watermark on any recording, including the free plan. Every video recording produced by Theo is completely clean with no branding overlays or watermarks. This makes Theo the best free video recording software without watermarks on Mac and Windows.",
    },
    {
      question: "Can I self-host my video recordings with Theo?",
      answer:
        "Yes. Theo supports any S3-compatible storage provider including AWS S3, Cloudflare R2, and self-hosted MinIO. Configure your own storage bucket and your video recordings are stored entirely within your own infrastructure. Theo's servers never see your content unless you choose the default cloud storage option.",
    },
    {
      question: "Is Theo open-source video recording software?",
      answer:
        "Yes. Theo is fully open-source and MIT-licensed. The complete codebase — desktop app, web app, and media processing pipeline — is publicly available on GitHub. You can audit every line of code, fork the project, and contribute back to the community. <a href='/open-source-screen-recorder'>Learn more about Theo as open-source software</a>.",
    },
  ],

  video: {
    url: "/videos/theo-demo.mp4",
    thumbnail: "/videos/theo-demo-thumbnail.png",
    alt: "Theo video recording software demo showing HD screen capture, webcam overlay, and instant sharing",
  },

  cta: {
    title: "Start Recording Video for Free with Theo",
    buttonText: "Download Theo Free",
    secondaryButtonText: "Try Instant Mode in Browser",
  },
}

export const VideoRecordingSoftwarePage = () => {
  return <SeoPageTemplate content={videoRecordingSoftwareContent} />
}
