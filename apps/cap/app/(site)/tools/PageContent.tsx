"use client"

import { Button } from "@/components/cap-ui"
import Link from "next/link"

interface ToolCategory {
  title: string
  description: string
  href: string
  icon: string
}

const toolCategories: ToolCategory[] = [
  {
    title: "Loom Video Importer",
    description:
      "Import your existing Loom recordings directly into Cap — seamless migration",
    href: "/loom-alternative",
    icon: "M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15",
  },
  {
    title: "Loom Video Downloader",
    description:
      "Download any public Loom video as an MP4 file — free and instant",
    href: "/tools/loom-downloader",
    icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
  },
  {
    title: "File Conversion",
    description:
      "Convert between different file formats directly in your browser",
    href: "/tools/convert",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    title: "Video Speed Controller",
    description: "Speed up or slow down your videos without losing quality",
    href: "/tools/video-speed-controller",
    icon: "M15.75 5.25a3 3 0 013 3m-3-3a3 3 0 00-3 3m3-3v1.5m0 9.75a3 3 0 01-3-3m3 3a3 3 0 003-3m-3 3v-1.5m-6-1.5h.008v.008H7.5v-.008zm1.5-9h.375c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-.375m1.5-4.5A1.125 1.125 0 0110.375 7.5h-1.5A1.125 1.125 0 017.75 8.625M10.5 12a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  },
  {
    title: "Video Trimmer",
    description: "Cut unwanted sections from videos with precision",
    href: "/tools/trim",
    icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244",
  },
]

export function PageContent() {
  return (
    <>
      <div className="relative overflow-hidden pt-24 md:pt-[180px]">
        <div className="relative z-10 flex h-full w-full flex-col justify-center px-4 sm:px-5">
          <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
            <h1 className="relative z-10 mb-4 animate-in text-3xl leading-[2.25rem] font-medium text-foreground fade-in slide-in-from-bottom-4 sm:text-3xl sm:leading-[2.5rem] md:mb-6 md:text-5xl md:leading-[3.25rem]">
              Try our free tools
            </h1>
            <p className="mx-auto mb-8 max-w-2xl animate-in text-sm text-muted-foreground delay-300 fade-in slide-in-from-bottom-4 sm:text-base md:mb-10 md:text-xl">
              Powerful browser-based utilities that run directly on your device.
              No uploads, no installations, maximum privacy.
            </p>
          </div>
          <div className="flex animate-in flex-col items-center justify-center gap-2 delay-500 fade-in slide-in-from-bottom-4 sm:flex-row sm:gap-4"></div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-screen-2xl px-5 sm:px-8 lg:px-10">
        <div className="mt-10 grid grid-cols-1 gap-4 px-0 sm:grid-cols-2 sm:gap-6 sm:px-4 md:mt-16 lg:grid-cols-3 lg:gap-8 lg:px-12">
          {toolCategories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group block rounded-xl border border-border bg-muted p-6 transition-all hover:border-primary hover:shadow-md sm:p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex-shrink-0 rounded-xl bg-primary p-3 sm:mb-5">
                  <svg
                    className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={category.icon}
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary sm:mb-3 sm:text-2xl">
                  {category.title}
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div
          className="relative mx-auto mt-10 mb-8 flex w-full max-w-screen-2xl flex-col justify-center overflow-hidden rounded-2xl bg-background p-6 px-5 sm:rounded-3xl sm:p-8 sm:px-8 md:mt-16 md:p-12 lg:px-10"
          style={{
            minHeight: "250px",
            backgroundImage: "url('/illustrations/ctabg.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 mx-auto flex h-full flex-col items-center justify-center">
            <div className="mx-auto mb-6 max-w-4xl text-center md:mb-8">
              <h2 className="mb-3 text-2xl font-medium text-foreground drop-shadow-md sm:text-3xl md:mb-4 md:text-4xl">
                The open source Loom alternative
              </h2>
              <p className="mb-5 text-base text-muted-foreground sm:text-lg md:mb-6 md:text-xl">
                Cap is lightweight, powerful, and cross-platform. Record and
                share securely in seconds. Import your Loom videos and get
                started instantly.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="gray"
                href="/download"
                size="lg"
                className="w-full px-8 py-3 font-medium transition-all duration-300 sm:w-auto"
              >
                Download Cap Free
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
