"use client"

import { Button } from "@/components/cap-ui"
import { ArrowUpRight, Code as Github } from "lucide-react"
import { ReadyToGetStarted } from "../ready-to-get-started"

export const AboutPage = () => {
  return (
    <div className="mt-[120px]">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="mb-16 md:mb-24">
            <p className="mb-4 text-sm font-medium tracking-widest text-muted-foreground uppercase">
              About Cap
            </p>
            <h1 className="mb-6 text-3xl leading-[2.5rem] text-foreground md:text-5xl md:leading-[3.75rem]">
              Why we started Cap
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Cap started as the open source alternative to Loom, but it has
              evolved into so much more. A screen recording and sharing platform
              built on privacy, transparency, and community.
            </p>
          </div>

          <div className="flex flex-col gap-16 md:gap-20">
            <section>
              <h2 className="mb-5 text-2xl text-foreground md:text-3xl">
                The problem
              </h2>
              <div className="flex flex-col gap-5 text-lg leading-[1.8] text-muted-foreground">
                <p>
                  Screen recording should be one of the simplest things you do
                  on a computer. Hit record, capture your screen, share it.
                  That&apos;s the whole workflow.
                </p>
                <p>
                  But the tools most people use are closed-source, loaded with
                  tracking, and designed to lock your content into proprietary
                  systems. Your recordings live on someone else&apos;s servers,
                  under someone else&apos;s terms. You can&apos;t self-host, you
                  can&apos;t inspect the code, and you can&apos;t export your
                  data without jumping through hoops.
                </p>
                <p>
                  Most recording tools are built by large companies optimizing
                  for revenue, not for users. They&apos;re slow to improve,
                  ignore community feedback, and add complexity where there
                  should be clarity. The result is software that feels heavy,
                  invasive, and out of your control.
                </p>
              </div>
            </section>

            <div className="h-px bg-muted" />

            <section>
              <h2 className="mb-5 text-2xl text-foreground md:text-3xl">
                The idea
              </h2>
              <div className="flex flex-col gap-5 text-lg leading-[1.8] text-muted-foreground">
                <p>
                  We didn&apos;t set out to build another screen recorder. We
                  wanted to build the one that should have always existed. One
                  that respects your privacy, works beautifully, and gives you
                  full ownership of everything you create.
                </p>
                <p>
                  Cap is built around a simple principle: your recordings are
                  yours. You should be able to record, edit, and share without
                  sacrificing privacy or flexibility. Whether you&apos;re
                  explaining a bug, walking through a design, or recording a
                  demo, the tool should get out of your way.
                </p>
                <p>
                  We built Cap as a native desktop app with a powerful web
                  companion. Record in Instant Mode for quick shares, or use
                  Studio Mode for high-fidelity captures with separate screen
                  and camera tracks. Add automatic captions, smooth zoom
                  effects, and custom backgrounds, then share with a single link
                  or export however you want.
                </p>
              </div>
            </section>

            <div className="h-px bg-muted" />

            <section>
              <h2 className="mb-5 text-2xl text-foreground md:text-3xl">
                Open source, by design
              </h2>
              <div className="flex flex-col gap-5 text-lg leading-[1.8] text-muted-foreground">
                <p>
                  Cap is fully open source under the AGPL license. Every line of
                  code, from the Rust-powered recording engine to the web
                  sharing platform, is public and auditable. This isn&apos;t a
                  marketing decision. It&apos;s a core belief about how software
                  should be built.
                </p>
                <p>
                  Open source means you can verify exactly what Cap does with
                  your data. The community can contribute improvements, report
                  issues, and shape the product&apos;s direction. And Cap will
                  never disappear behind a paywall or pivot away from what makes
                  it useful.
                </p>
                <p>
                  We&apos;ve seen what happens when closed-source tools change
                  their pricing, shut down, or get acquired. Workflows break.
                  Data gets trapped. With Cap, that won&apos;t happen. You can
                  self-host the entire platform, fork the code, or simply trust
                  that thousands of developers are watching the codebase.
                </p>
              </div>
              <a
                href="https://github.com/CapSoftware/Cap"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                <Github className="size-5" />
                View on GitHub
                <ArrowUpRight className="size-4" />
              </a>
            </section>

            <div className="h-px bg-muted" />

            <section>
              <h2 className="mb-5 text-2xl text-foreground md:text-3xl">
                Privacy as a feature
              </h2>
              <div className="flex flex-col gap-5 text-lg leading-[1.8] text-muted-foreground">
                <p>
                  Privacy isn&apos;t a checkbox on our features page. It&apos;s
                  the foundation of everything we build. Cap doesn&apos;t track
                  you, doesn&apos;t sell your data, and doesn&apos;t require you
                  to use our servers.
                </p>
                <p>
                  You can connect your own Google Drive or S3-compatible storage
                  and keep every recording on infrastructure you control. No
                  vendor lock-in, no data hostage situations, no surprises. Your
                  recordings stay yours, stored where you decide, accessible on
                  your terms.
                </p>
              </div>
            </section>

            <div className="h-px bg-muted" />

            <section>
              <h2 className="mb-5 text-2xl text-foreground md:text-3xl">
                What we&apos;re focused on
              </h2>
              <div className="mb-8 flex flex-col gap-5 text-lg leading-[1.8] text-muted-foreground">
                <p>
                  Cap is built for developers, designers, product teams,
                  creators, and anyone who wants a recording tool that respects
                  them. Here&apos;s where we put our energy:
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-foreground">
                    Speed and simplicity
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Recording and sharing should take seconds, not minutes. No
                    bloat, no unnecessary steps.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-foreground">
                    Beautiful output
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Automatic captions, smooth zoom effects, and polished
                    sharing pages that make your recordings look professional.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-foreground">
                    Full data ownership
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Self-host the platform, connect your own storage, or use our
                    cloud. The choice is always yours.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-foreground">
                    Community-driven development
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Features shaped by real users, not boardroom decisions. Open
                    roadmap, open issues, open conversations.
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px bg-muted" />

            <section>
              <div className="flex flex-col gap-5 text-lg leading-[1.8] text-muted-foreground">
                <p>
                  We&apos;re building Cap because we think the tools people use
                  every day should be open, honest, and designed to last. Not
                  built to extract value, but to create it.
                </p>
                <p>
                  If that resonates with you, we&apos;d love for you to try Cap,
                  contribute to the project, or follow along as we build in
                  public.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="/download"
                  variant="primary"
                  size="lg"
                  className="font-medium"
                >
                  Download Cap
                </Button>
                <Button
                  href="https://github.com/CapSoftware/Cap"
                  variant="white"
                  size="lg"
                  className="font-medium"
                >
                  Star on GitHub
                </Button>
              </div>
              <p className="mt-12 text-lg text-muted-foreground">
                The Cap Team
              </p>
            </section>
          </div>
        </div>
      </div>

      <ReadyToGetStarted />
    </div>
  )
}
