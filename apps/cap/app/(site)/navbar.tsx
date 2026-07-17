import { Button, Logo } from "@/components/cap-ui"
import Image from "next/image"
import Link from "next/link"
import MobileMenu from "@/components/ui/mobile-menu"
import { DesktopNavLinks } from "./desktop-nav-links"

export const Navbar = ({ stars }: { stars?: string }) => {
  return (
    <header className="fixed top-4 right-0 left-0 z-51 lg:top-6">
      <nav className="relative mx-auto h-fit w-full max-w-[calc(100%-20px)] rounded-full border border-border bg-background p-2 lg:max-w-fit">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-12 transition-all">
          <div className="flex items-center">
            <Link passHref href="/home">
              <Logo
                className="h-10 w-24 transition-all duration-200 ease-out"
                viewBoxDimensions="0 0 120 40"
              />
            </Link>
            <div className="hidden lg:flex">
              <DesktopNavLinks />
            </div>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="outline"
              icon={
                <Image src="/github.svg" alt="Github" width={16} height={16} />
              }
              target="_blank"
              href="https://github.com/CapSoftware/Cap"
              size="sm"
              className="w-full font-medium sm:w-auto"
            >
              {`GitHub${stars ? ` (${stars})` : ""}`}
            </Button>
            <Button
              variant="gray"
              href="https://cap.so/login"
              size="sm"
              className="w-full font-medium sm:w-auto"
            >
              Login
            </Button>
            <Button
              variant="dark"
              href="https://cap.so/signup"
              size="sm"
              className="w-full font-medium sm:w-auto"
            >
              Sign Up
            </Button>
          </div>
          <div className="lg:hidden">
            <MobileMenu stars={stars} />
          </div>
        </div>
      </nav>
    </header>
  )
}
