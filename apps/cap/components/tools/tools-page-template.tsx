"use client"

import { Button } from "@/components/cap-ui"
import Link from "next/link"
import { type ReactNode, useEffect } from "react"
import type { ToolPageContent } from "@/components/tools/types"

const renderHTML = (content: string) => {
  const styledContent = content.replace(
    /<a\s/g,
    '<a class="font-semibold text-primary transition-colors hover:text-primary" '
  )

  return <span dangerouslySetInnerHTML={{ __html: styledContent }} />
}

const _LeftBlueHue = () => {
  return (
    <svg
      className="pointer-events-none absolute top-0 -left-24 z-0 opacity-20 md:opacity-40"
      width="1000"
      height="500"
      viewBox="0 0 1276 690"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#blue-hue-filter)">
        <ellipse
          cx="592"
          cy="339"
          rx="584"
          ry="251"
          transform="rotate(180 592 339)"
          fill="url(#blue-hue-gradient)"
        />
      </g>
      <defs>
        <filter
          id="blue-hue-filter"
          x="-92"
          y="-12"
          width="1368"
          height="702"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="50" result="blur-effect" />
        </filter>
        <linearGradient
          id="blue-hue-gradient"
          x1="1102.5"
          y1="339"
          x2="157.5"
          y2="375.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary)" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const ToolsPageTemplate = ({
  content,
  toolComponent,
}: {
  content: ToolPageContent
  toolComponent: ReactNode
}) => {
  useEffect(() => {
    const animateClouds = () => {
      const cloud4 = document.getElementById("cloud-4")
      const cloud5 = document.getElementById("cloud-5")

      if (cloud4 && cloud5) {
        cloud4.animate(
          [
            { transform: "translateX(0) translateY(0)" },
            { transform: "translateX(-10px) translateY(5px)" },
            { transform: "translateX(10px) translateY(-5px)" },
            { transform: "translateX(0) translateY(0)" },
          ],
          {
            duration: 15000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        )

        cloud5.animate(
          [
            { transform: "translateX(0) translateY(0)" },
            { transform: "translateX(10px) translateY(-5px)" },
            { transform: "translateX(-10px) translateY(5px)" },
            { transform: "translateX(0) translateY(0)" },
          ],
          {
            duration: 18000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        )
      }
    }

    animateClouds()
  }, [])

  return (
    <>
      <div className="relative overflow-hidden pt-24 pb-8 md:py-40">
        <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-4 pt-4 text-center sm:px-5 lg:px-10">
          <div className="flex items-center justify-center text-sm">
            <Link
              className="text-sm font-semibold text-muted-foreground hover:underline"
              href="/tools"
            >
              Tools
            </Link>
            <span className="mx-2 text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">
              {content.title}
            </span>
          </div>
        </div>

        <div className="relative z-10 w-full px-4 pt-6 pb-4 sm:px-5 md:pt-12 md:pb-8">
          <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
            <h1 className="relative z-10 mb-3 animate-in text-3xl leading-8 text-foreground fade-in slide-in-from-bottom-4 sm:text-3xl sm:leading-9 md:mb-4 md:text-5xl md:leading-12">
              {content.title}
            </h1>
            <p className="mx-auto mb-4 max-w-2xl animate-in text-sm text-muted-foreground delay-300 fade-in slide-in-from-bottom-4 sm:text-base md:mb-6 md:text-lg">
              {content.description}
            </p>
          </div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-5 py-4 sm:px-8 md:py-10 lg:px-10">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-background p-4 shadow-lg sm:p-6 md:p-8">
            {toolComponent}
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-5 py-10 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-12 md:mb-20">
            <div className="mx-auto mb-8 max-w-4xl px-2 text-center md:mb-12">
              <h2 className="relative mb-5 inline-block text-2xl font-medium text-foreground sm:text-3xl">
                {content.featuresTitle}
                <span className="absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 transform rounded-full bg-primary"></span>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {renderHTML(content.featuresDescription)}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
              {content.features.map(
                (
                  feature: { title: string; description: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md sm:p-6"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                      <span className="text-lg font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground sm:mb-3 sm:text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {renderHTML(feature.description)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {content.faqs && (
            <div className="mb-12 md:mb-20">
              <div className="mx-auto mb-8 max-w-4xl px-2 text-center md:mb-12">
                <h2 className="relative mb-5 inline-block text-2xl font-medium text-foreground sm:text-3xl">
                  Frequently Asked Questions
                  <span className="absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 transform rounded-full bg-primary"></span>
                </h2>
              </div>
              <div className="mx-auto mb-10 max-w-3xl">
                {content.faqs.map(
                  (
                    faq: { question: string; answer: string },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="my-3 rounded-xl border border-border bg-background p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:my-4 sm:p-5"
                    >
                      <h2 className="mb-2 text-base font-semibold text-foreground sm:text-lg">
                        {faq.question}
                      </h2>
                      <div className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        {renderHTML(faq.answer)}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div
            className="relative mx-auto flex max-w-5xl flex-col justify-center overflow-hidden rounded-2xl bg-background p-5 sm:p-8 md:p-10"
            style={{
              backgroundImage: "url('/illustrations/ctabg.svg')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl flex-col items-center justify-center px-5 sm:px-8 lg:px-10">
              <div className="mx-auto mb-5 max-w-[700px] text-center md:mb-6">
                <h2 className="mb-3 text-xl font-medium text-foreground sm:text-2xl md:text-3xl">
                  {content.cta.title}
                </h2>
                <p className="mb-4 text-base text-muted-foreground sm:text-lg md:mb-5">
                  {content.cta.description}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button
                  variant={content.cta.secondaryButtonText ? "blue" : "gray"}
                  href={content.cta.buttonHref ?? "/download"}
                  size="lg"
                  className="w-full px-8 font-medium transition-all duration-200 sm:w-auto"
                >
                  {content.cta.buttonText}
                </Button>
                {content.cta.secondaryButtonText &&
                  content.cta.secondaryButtonHref && (
                    <Button
                      variant="gray"
                      href={content.cta.secondaryButtonHref}
                      size="lg"
                      className="w-full px-8 font-medium transition-all duration-200 sm:w-auto"
                    >
                      {content.cta.secondaryButtonText}
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
