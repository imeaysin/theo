"use client"

import { useState } from "react"
import {
  Kbd,
  Link,
  TextField,
  InputGroup,
  SearchIcon,
  TwitterIcon,
  DiscordIcon,
  GithubIcon,
  AppLogo,
} from "@workspace/hero-ui"
import { appConfig } from "@repo/config/app"
import clsx from "clsx"

import { siteConfig } from "@/config/site"
import { ThemeSwitch } from "@/components/theme-switch"
import {
  NavbarAuth,
  NavbarAuthMobile,
  MobileMenuAuth,
} from "@/features/auth/components"

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const searchInput = (
    <TextField aria-label="Search" type="search">
      <InputGroup>
        <InputGroup.Prefix>
          <SearchIcon className="pointer-events-none shrink-0 text-base text-muted" />
        </InputGroup.Prefix>
        <InputGroup.Input className="text-sm" placeholder="Search..." />
        <InputGroup.Suffix>
          <Kbd className="hidden lg:inline-flex">
            <Kbd.Abbr keyValue="command" />
            <Kbd.Content>K</Kbd.Content>
          </Kbd>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )

  return (
    <nav className="border-separator sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <AppLogo />
          <ul className="ml-2 hidden gap-4 lg:flex">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <a
                  className={clsx(
                    "text-foreground transition-colors hover:text-accent",
                    "data-[active=true]:font-medium data-[active=true]:text-accent"
                  )}
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            aria-label="Twitter"
            href={appConfig.links.twitter}
            rel="noopener noreferrer"
            target="_blank"
          >
            <TwitterIcon className="text-muted" />
          </Link>
          <Link
            aria-label="Discord"
            href={appConfig.links.discord}
            rel="noopener noreferrer"
            target="_blank"
          >
            <DiscordIcon className="text-muted" />
          </Link>
          <Link
            aria-label="Github"
            href={appConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="text-muted" />
          </Link>
          <ThemeSwitch />
          <div className="hidden lg:flex">{searchInput}</div>

          {/* Auth UI */}
          <NavbarAuth />
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <Link
            aria-label="Github"
            href={appConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="text-muted" />
          </Link>
          <ThemeSwitch />

          {/* Mobile Auth UI */}
          <NavbarAuthMobile />

          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-separator border-t sm:hidden">
          <div className="p-4">{searchInput}</div>
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  className={clsx(
                    "block py-2 text-lg no-underline",
                    index === 2
                      ? "text-accent"
                      : index === siteConfig.navMenuItems.length - 1
                        ? "text-danger"
                        : "text-foreground"
                  )}
                  href="#"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Mobile Auth Links */}
            <li>
              <MobileMenuAuth />
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
