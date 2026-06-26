"use client"

import { useState } from "react"
import {
  LandingContainer,
  LandingSection,
} from "@workspace/ui/components/landing/layout/page-container"
import { SectionHeading } from "@workspace/ui/components/landing/layout/section-heading"
import type { LandingFaqItem } from "@workspace/ui/components/landing/types"

interface FaqSectionProps {
  title?: string
  subtitle?: string
  items: LandingFaqItem[]
}

export function FaqSection({
  title = "Frequently asked questions",
  subtitle = "Everything you need to know before getting started.",
  items,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <LandingSection>
      <LandingContainer>
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="mx-auto max-w-3xl space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={item.question}
                className="border border-border bg-background"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-muted/50 sm:p-4"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <span className="pr-6 font-sans text-sm text-foreground">
                    {item.question}
                  </span>
                  <span className="shrink-0 text-base text-muted-foreground">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
