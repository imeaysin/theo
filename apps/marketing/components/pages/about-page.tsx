"use client"

import { Button } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"
import { ArrowUpRight, Code as Github } from "lucide-react"
import { ReadyToGetStarted } from "../ready-to-get-started"

export const AboutPage = () => {
  const name = productConfig.name

  return (
    <div className="mt-[120px]">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="mb-16 md:mb-24">
            <p className="mb-4 text-sm font-medium tracking-widest text-muted-foreground uppercase">
              About {name}
            </p>
            <h1 className="mb-6 text-3xl leading-10 text-foreground md:text-5xl md:leading-16">
              Why we built {name}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              {productConfig.description} Customize this page for your brand —
              it&apos;s sample copy for the landing template.
            </p>
          </div>

          <div className="flex flex-col gap-16 md:gap-20">
            <section>
              <h2 className="mb-5 text-2xl text-foreground md:text-3xl">
                The problem
              </h2>
              <div className="flex flex-col gap-5 text-lg leading-[1.8] text-muted-foreground">
                <p>
                  Shipping product updates, demos, and walkthroughs should be
                  simple. Create something clear, share it with your team, and
                  move on.
                </p>
                <p>
                  Too many tools are closed, hard to customize, and lock your
                  content into someone else&apos;s stack. You can&apos;t
                  self-host, inspect the code, or take your data with you when
                  you leave.
                </p>
                <p>
                  This template is a starting point for a product that puts
                  ownership, clarity, and community first — swap the story for
                  yours.
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
                  {name} is sample branding for this monorepo. The idea is a
                  lightweight product surface: capture, polish, and share —
                  without sacrificing privacy or control.
                </p>
                <p>
                  Use the desktop app for local work, share when you need a
                  link, and keep storage flexible. Replace this story with your
                  own product language as you fork the template.
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
                  The template assumes an open codebase you can audit, fork, and
                  self-host. That&apos;s a product choice you can keep or change
                  — update this section to match your license and roadmap.
                </p>
                <p>
                  Contributors and customers should be able to see how the
                  product works and shape what ships next.
                </p>
              </div>
              <a
                href={productConfig.repositoryUrl}
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
                  Privacy should be foundational: no surprise tracking, no
                  selling customer data, and the option to keep content on
                  infrastructure you control.
                </p>
                <p>
                  Offer cloud when it helps, local-first when it matters, and
                  bring-your-own storage for teams that need it.
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
                  {name} is aimed at builders, designers, product teams, and
                  anyone who wants clear visual communication. Customize this
                  list for your audience:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Fast path from idea to shareable update</li>
                  <li>Polished editing when quality matters</li>
                  <li>Team workspaces and permissions</li>
                  <li>Open source and self-host options</li>
                </ul>
              </div>
              <Button href="/download" variant="dark" size="lg">
                Download {name}
              </Button>
            </section>
          </div>
        </div>
      </div>
      <ReadyToGetStarted />
    </div>
  )
}
