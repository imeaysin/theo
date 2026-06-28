"use client"

import type { ReactNode } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Icons } from "@workspace/ui/components/icons"
import { LandingLink } from "../primitives/landing-link"

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
            <Button
              className="mb-8 h-auto gap-2 p-0 text-sm text-muted-foreground hover:text-foreground"
              render={<a href={page.backLink.href} />}
              variant="link"
            >
              <Icons.ArrowBack size={16} />
              {page.backLink.label}
            </Button>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-14 items-center justify-center text-muted-foreground">
                {page.icon}
              </div>
              <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
                {page.title}
              </h1>
            </div>

            <p className="mb-12 text-base leading-relaxed text-muted-foreground">
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
                      <Badge
                        className="size-7 shrink-0 rounded-full"
                        variant="outline"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                          {step.linkHref ? (
                            <>
                              {" "}
                              <LandingLink
                                className="inline h-auto p-0 text-foreground"
                                href={step.linkHref}
                                size="sm"
                                variant="link"
                              >
                                {step.linkLabel ?? "Learn more"}
                              </LandingLink>
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
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {section.intro}
                    </p>
                  ) : null}
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Icons.Check className="mt-0.5 size-3.5 text-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {section.footer ? (
                    <div className="text-sm leading-relaxed text-muted-foreground">
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
