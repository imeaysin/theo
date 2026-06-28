"use client"

import type { ReactNode } from "react"
import { Icons } from "@workspace/ui/components/icons"

export interface GuideStep {
  title: string
  description: string
  linkHref?: string
  linkLabel?: string
}

export interface GuideListSection {
  title: string
  intro?: string
  items: string[]
  footer?: string
}

export interface GuidePageData {
  backLink: { href: string; label: string }
  icon: ReactNode
  title: string
  description: string
  stepsTitle?: string
  steps: GuideStep[]
  lists: GuideListSection[]
}

export function GuideSection({ page }: { page: GuidePageData }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background">
        <div className="px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-20 md:pt-48">
          <div className="mx-auto max-w-2xl">
            <a
              href={page.backLink.href}
              className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.ArrowBack size={16} />
              {page.backLink.label}
            </a>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-14 items-center justify-center text-muted-foreground">
                {page.icon}
              </div>
              <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
                {page.title}
              </h1>
            </div>

            <p className="mb-12 font-sans text-base leading-relaxed text-muted-foreground">
              {page.description}
            </p>

            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                  {page.stepsTitle ?? "Getting started"}
                </h2>
                <ol className="space-y-6">
                  {page.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border font-sans text-xs text-muted-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-sans text-sm font-medium text-foreground">
                          {step.title}
                        </p>
                        <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                          {step.linkHref ? (
                            <>
                              {" "}
                              <a
                                href={step.linkHref}
                                className="text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
                              >
                                {step.linkLabel ?? "Learn more"}
                              </a>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {page.lists.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                    {section.title}
                  </h2>
                  {section.intro ? (
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {section.intro}
                    </p>
                  ) : null}
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 font-sans text-sm text-muted-foreground"
                      >
                        <Icons.Check className="mt-0.5 size-3.5 text-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {section.footer ? (
                    <div className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {section.footer}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
