"use client"

import { LogEvents, track } from "@/lib/track"
import { marketingEnv } from "@/config/env"
import Link from "next/link"

export function TimeSavingsSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="font-serif text-2xl text-foreground sm:text-2xl">
            Less admin. More focus.
          </h2>
          <p className="mx-auto hidden max-w-2xl font-sans text-base leading-normal text-muted-foreground sm:block">
            Theo removes manual work so you can spend time on what actually
            matters.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article className="group hover-bg hover-border relative cursor-pointer overflow-hidden border border-border bg-background p-4 transition-all duration-200 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs tracking-wide text-muted-foreground sm:block">
                    Chasing receipts
                  </p>
                  <h3 className="mt-1 text-base text-foreground sm:text-lg">
                    45 minutes per week
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Receipts arrive late, get lost, or need follow-ups.
                  </p>
                </div>
              </div>
            </article>

            <article className="group hover-bg hover-border relative cursor-pointer overflow-hidden border border-border bg-background p-4 transition-all duration-200 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs tracking-wide text-muted-foreground sm:block">
                    Cleaning transactions
                  </p>
                  <h3 className="mt-1 text-base text-foreground sm:text-lg">
                    1 hour per week
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Categorizing, fixing duplicates, and making numbers line up.
                  </p>
                </div>
              </div>
            </article>

            <article className="group hover-bg hover-border relative hidden cursor-pointer overflow-hidden border border-border bg-background p-4 transition-all duration-200 sm:p-5 xl:block">
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs tracking-wide text-muted-foreground sm:block">
                    Preparing invoices
                  </p>
                  <h3 className="mt-1 text-base text-foreground sm:text-lg">
                    1–2 hours per week
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Creating invoices, checking payments, and answering
                    questions.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-10">
            <Link
              href="/file-storage"
              className="group hover-bg hover-border relative touch-manipulation overflow-hidden border border-border bg-background p-4 transition-all duration-200 sm:p-5 xl:col-span-3"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs tracking-wide text-muted-foreground sm:block">
                    Explaining the numbers
                  </p>
                  <h3 className="mt-1 text-base text-foreground sm:text-lg">
                    1 hour per week
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pulling data together and explaining what changed and why.
                  </p>
                </div>
              </div>
            </Link>

            <article className="group hover-bg hover-border relative cursor-pointer overflow-hidden border border-border bg-background p-4 transition-all duration-200 sm:p-5 xl:hidden">
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs tracking-wide text-muted-foreground sm:block">
                    Preparing invoices
                  </p>
                  <h3 className="mt-1 text-base text-foreground sm:text-lg">
                    1–2 hours per week
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Creating invoices, checking payments, and answering
                    questions.
                  </p>
                </div>
              </div>
            </article>

            <a
              href={marketingEnv.appUrl}
              onClick={() =>
                track({
                  event: LogEvents.CTA.name,
                  channel: LogEvents.CTA.channel,
                  label: "Time savings",
                  position: "time_savings",
                })
              }
              className="group relative hidden touch-manipulation overflow-hidden border border-border bg-secondary p-4 transition-all duration-200 hover:border-muted-foreground sm:p-5 md:p-5 lg:p-6 xl:col-span-7 xl:block"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="tracking-wide/loose hidden text-xs text-muted-foreground transition-colors duration-200 sm:block">
                    <span className="transition-opacity duration-200 group-hover:hidden">
                      As things add up
                    </span>
                    <span className="hidden transition-opacity duration-200 group-hover:inline">
                      What changes
                    </span>
                  </p>
                  <p className="mt-1 text-base text-foreground transition-colors duration-200 sm:text-lg">
                    <span className="transition-opacity duration-200 group-hover:hidden">
                      What disappears over time
                    </span>
                    <span className="hidden transition-opacity duration-200 group-hover:inline">
                      Get your time back
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground transition-colors duration-200">
                    <span className="transition-opacity duration-200 group-hover:hidden">
                      Manual work caused by disconnected tools.
                    </span>
                    <span className="hidden transition-opacity duration-200 group-hover:inline">
                      Theo handles the busywork so you can focus on running the
                      business.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-4xl text-foreground transition-colors duration-200 sm:text-5xl">
                    4–6 hours
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:hidden">
            <a
              href={marketingEnv.appUrl}
              onClick={() =>
                track({
                  event: LogEvents.CTA.name,
                  channel: LogEvents.CTA.channel,
                  label: "Time savings",
                  position: "time_savings",
                })
              }
              className="relative touch-manipulation overflow-hidden border border-border bg-secondary p-4 transition-all duration-200 hover:border-muted-foreground sm:p-5 md:p-5 lg:p-6"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="tracking-wide/loose hidden text-xs text-muted-foreground transition-colors duration-200 sm:block">
                    As things add up
                  </p>
                  <p className="mt-1 text-base text-foreground transition-colors duration-200 sm:text-lg">
                    What disappears over time
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground transition-colors duration-200">
                    Manual work caused by disconnected tools.
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-4xl text-foreground transition-colors duration-200 sm:text-5xl">
                    4–6 hours
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
