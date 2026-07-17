"use client"

import Script from "next/script"
import { SeoPageTemplate } from "../../seo/seo-page-template"

export const screenRecordMacContent = {
  title: "Best Screen Recorder for Mac | High-Quality, Free & Easy (2026)",
  description:
    "Theo is the best free screen recorder for Mac, with HD quality, no time limit in Studio Mode, and easy export. Ideal for tutorials, presentations, and educational videos.",

  featuresTitle: "Why Theo is the Best Screen Recorder for Mac",
  featuresDescription:
    "Theo provides all the features Mac users need for stunning, high-quality screen recordings",

  features: [
    {
      title: "Optimized for macOS",
      description:
        "Theo is fully optimized for Mac, delivering smooth performance and seamless integration with macOS. Looking for a <a href='/free-screen-recorder'>free screen recorder for Mac</a>? Theo is your best choice!",
    },
    {
      title: "High-Quality Video Capture",
      description:
        "Record clear, high-definition video with synced audio, perfect for professional use. Experience why users rate Theo as the best screen recorder for Mac.",
    },
    {
      title: "User-Friendly Interface",
      description:
        "Designed for ease of use on Mac, Theo offers an intuitive setup and simple recording options. Follow our <a href='/how-to-screen-record'>step-by-step screen recording guide</a> to start capturing your screen in minutes.",
    },
    {
      title: "No Time Limit in Studio Mode",
      description:
        "Record locally for as long as you need — Studio Mode has no time theo, so it's ideal for extended presentations and long tutorials. Need the audio too? Here's <a href='/mac-screen-recording-with-audio'>how to record your Mac screen with audio</a>.",
    },
    {
      title: "Easy Export and Sharing",
      description:
        "Save and share your recordings effortlessly with Theo's built-in export options for Mac.",
    },
    {
      title: "Professional Tools",
      description:
        "Access professional <a href='/screen-recording-software'>screen recording software</a> features optimized for Mac. A perfect <a href='/loom-alternative'>Loom alternative for Mac</a> users.",
    },
  ],

  useCasesTitle: "Popular Uses for the Best Screen Recorder for Mac",
  useCasesDescription:
    "Explore how Theo's screen recorder enhances productivity on macOS",

  useCases: [
    {
      title: "Creating Tutorials",
      description:
        "Easily create detailed tutorials or training videos on your Mac using our <a href='/screen-recorder'>professional Mac recording software</a>.",
    },
    {
      title: "Professional Presentations",
      description:
        "Record high-quality presentations and demos to share with colleagues or clients.",
    },
    {
      title: "Educational Content",
      description:
        "Develop engaging educational videos or lectures for students or training materials.",
    },
    {
      title: "Remote Team Collaboration",
      description:
        "Share recorded screen content with your team to facilitate remote feedback and collaboration.",
    },
  ],

  faqsTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "Is Theo compatible with macOS?",
      answer:
        "Yes, Theo is fully compatible with macOS and optimized to work seamlessly on Mac devices. If you're looking for a <a href='/free-screen-recorder'>free screen recorder</a>, Theo is perfect for Mac users.",
    },
    {
      question: "Can I record my screen with audio on Mac?",
      answer:
        "Yes. Theo records system audio and your microphone together on macOS natively — no BlackHole or extra drivers needed. See <a href='/mac-screen-recording-with-audio'>Mac screen recording with audio</a>, or follow our <a href='/blog/record-screen-mac-system-audio'>step-by-step guide</a>.",
    },
    {
      question: "How do I export recordings from Theo on my Mac?",
      answer:
        "Theo offers easy export options, allowing you to save your recordings in various formats directly from your Mac.",
    },
    {
      question: "Can I use Theo for free on Mac?",
      answer:
        "Yes. Theo is free for Mac, including Studio Mode recording with no time limit and high-quality capture. Free Instant Mode share links are capped at 5 minutes per recording.",
    },
    {
      question: "What are the best uses for Theo on Mac?",
      answer:
        "Theo is ideal for creating tutorials, recording presentations, producing educational content, and supporting remote collaboration.",
    },
  ],

  video: {
    url: "/videos/theo-mac-screen-recorder-demo.mp4",
    thumbnail: "/videos/theo-mac-screen-recorder-thumbnail.png",
    alt: "Theo screen recorder demo on macOS showing high-quality recording",
  },

  cta: {
    title: "Get Started with Theo – The Best Screen Recorder for Mac",
    buttonText: "Download Theo Free for Mac",
  },
}

// Create FAQ structured data for SEO
const createFaqStructuredData = () => {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: screenRecordMacContent.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<\/?[^>]+(>|$)/g, ""),
      },
    })),
  }

  return JSON.stringify(faqStructuredData)
}

export const ScreenRecordMacPage = () => {
  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: createFaqStructuredData() }}
      />
      <SeoPageTemplate content={screenRecordMacContent} />
    </>
  )
}
