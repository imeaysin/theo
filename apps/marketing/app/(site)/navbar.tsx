import { Button, Logo } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"
import Image from "next/image"
import Link from "next/link"
import MobileMenu from "@/components/ui/mobile-menu"
import { DesktopNavLinks } from "./desktop-nav-links"

export const Navbar = ({ stars }: { stars?: string }) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 rounded-2xl border border-border/80 bg-background/80 px-3 shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-background/70 sm:px-4">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            href="/"
            className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo className="h-8" />
          </Link>
          <div className="hidden lg:flex">
            <DesktopNavLinks />
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            icon={<Image src="/github.svg" alt="" width={16} height={16} />}
            target="_blank"
            href={productConfig.repositoryUrl}
            size="sm"
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            {stars ? `GitHub ${stars}` : "GitHub"}
          </Button>
          <Button
            variant="ghost"
            href={`${productConfig.siteUrl}/login`}
            size="sm"
            className="font-medium"
          >
            Login
          </Button>
          <Button
            variant="dark"
            href={`${productConfig.siteUrl}/signup`}
            size="sm"
            className="font-medium"
          >
            Sign up
          </Button>
        </div>

        <div className="lg:hidden">
          <MobileMenu stars={stars} />
        </div>
      </nav>
    </header>
  )
}
