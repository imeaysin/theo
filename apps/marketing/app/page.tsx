import { productConfig } from "@workspace/config/public"
import { Button } from "@workspace/ui/components/button"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

const stack = [
  { name: "API", detail: "NestJS + Light-CQRS" },
  { name: "Web", detail: "Vite + React" },
  { name: "Marketing", detail: "Next.js landing" },
  { name: "Mobile", detail: "Expo" },
  { name: "Auth", detail: "Better Auth" },
  { name: "Shared", detail: "UI, DB, contracts" },
] as const

export default function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-medium tracking-tight text-foreground">
          {productConfig.name}
        </span>
        <Button
          nativeButton={false}
          render={
            <a
              href={productConfig.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          variant="outline"
          size="sm"
        >
          GitHub
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pt-10 pb-24 sm:pt-16">
        <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Open-source monorepo
        </p>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          {productConfig.name}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          A full-stack template for shipping products — NestJS API, Vite web
          app, Next.js marketing site, Expo mobile, and shared packages. Fork
          it, rename it, make it yours.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button
            nativeButton={false}
            render={
              <a
                href={productConfig.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            size="lg"
          >
            Use this template
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="#stack" />}
            variant="ghost"
            size="lg"
          >
            What&apos;s included
          </Button>
        </div>

        <section id="stack" className="mt-24 scroll-mt-24">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            What&apos;s included
          </h2>
          <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
            {stack.map((item) => (
              <li key={item.name} className="border-t border-border pt-4">
                <p className="text-base font-medium text-foreground">
                  {item.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-5xl border-t border-border px-6 py-8">
        <p className="text-sm text-muted-foreground">
          {productConfig.name} — monorepo template for everyone.
        </p>
      </footer>
    </div>
  )
}
