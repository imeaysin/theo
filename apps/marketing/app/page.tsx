import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { site } from "@/config/site"

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="font-semibold tracking-tight">{site.name}</span>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" render={<Link href={`${site.clientUrl}/sign-in`} />}>
              Sign in
            </Button>
            <Button render={<Link href={`${site.clientUrl}/sign-up`} />}>
              Get started
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8 px-6 py-24">
        <div className="max-w-2xl space-y-4">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            Full-stack template
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ship faster with {site.name}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {site.description} Clone the repo, configure one{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">.env</code>
            , and run API, web, marketing, and mobile from a single workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" render={<Link href={`${site.clientUrl}/sign-up`} />}>
            Start building
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            View on GitHub
          </Button>
        </div>

        <dl className="grid gap-6 pt-8 sm:grid-cols-3">
          {[
            { label: "API", value: "NestJS + Better Auth" },
            { label: "Web", value: "Vite + React Router" },
            { label: "Mobile", value: "Expo + Expo Router" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <dt className="text-muted-foreground text-sm">{item.label}</dt>
              <dd className="font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto max-w-5xl px-6 py-8 text-sm">
          © {new Date().getFullYear()} {site.name}. Built with the Theo monorepo
          template.
        </div>
      </footer>
    </div>
  )
}
