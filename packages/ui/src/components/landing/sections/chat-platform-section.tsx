"use client"

import type { ChatPlatformPageConfig } from "@workspace/ui/components/landing/types"
import { Icons } from "@workspace/ui/components/icons"

export function ChatPlatformSection({ config }: { config: ChatPlatformPageConfig }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background">
        <div className="px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-20 md:pt-48">
          <div className="mx-auto max-w-2xl">
            <a
              href="/chat"
              className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.ArrowBack size={16} />
              All platforms
            </a>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-14 items-center justify-center text-muted-foreground">
                {config.icon}
              </div>
              <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
                {config.name}
              </h1>
            </div>

            <p className="mb-12 font-sans text-base leading-relaxed text-muted-foreground">
              {config.description}
            </p>

            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                  Getting started
                </h2>
                <ol className="space-y-6">
                  {config.steps.map((step, index) => (
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
                          {step.href ? (
                            <>
                              {" "}
                              <a
                                href={step.href}
                                className="text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
                              >
                                Open in {config.productName}
                              </a>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                  Notifications
                </h2>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  Once connected, you&apos;ll receive notifications for:
                </p>
                <ul className="space-y-2">
                  {config.notifications.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 font-sans text-sm text-muted-foreground"
                    >
                      <Icons.Check className="mt-0.5 size-3.5 text-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  All notifications are on by default. To manage them, go to{" "}
                  <span className="text-foreground">{config.settingsPath}</span>{" "}
                  in {config.productName}.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                  What you can do
                </h2>
                <ul className="space-y-2">
                  {config.capabilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 font-sans text-sm text-muted-foreground"
                    >
                      <Icons.Check className="mt-0.5 size-3.5 text-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
