import { Button } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Migrate — ${productConfig.name}`,
  description: `Switch to ${productConfig.name} from another tool and bring your library with you.`,
}

export default function MigratePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-5 py-24 text-center">
      <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        Coming from another tool?
      </h1>
      <p className="text-lg text-muted-foreground">
        Bring your library with you. Download {productConfig.name} and migrate
        your existing recordings — keep your content organized in one place.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href="/download" variant="dark" size="lg">
          Download for free
        </Button>
        <Button href="/pricing" variant="outline" size="lg">
          Get {productConfig.name} Pro
        </Button>
      </div>
      <Link
        href="/"
        className="text-sm text-muted-foreground underline hover:text-foreground"
      >
        Back to home
      </Link>
    </main>
  )
}
