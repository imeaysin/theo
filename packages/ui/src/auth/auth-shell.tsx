"use client"

import type { ReactNode } from "react"
import { Icons } from "@workspace/ui/components/icons"
import { AuthVideoPanel } from "./auth-video-panel"
import { AuthTermsFooter } from "./auth-terms-footer"
import { SunsetBanner } from "./sunset-banner"

export interface AuthShellProps {
  homeHref: string
  children: ReactNode
  showSunsetBanner?: boolean
  sunsetBanner?: ReactNode
  termsHref?: string
  privacyHref?: string
  renderHomeLink?: (props: {
    href: string
    children: ReactNode
    className: string
  }) => ReactNode
  renderTermsLink?: (href: string, label: string) => ReactNode
}

export function AuthShell({
  homeHref,
  children,
  showSunsetBanner = true,
  sunsetBanner,
  termsHref,
  privacyHref,
  renderHomeLink,
  renderTermsLink,
}: AuthShellProps) {
  const logoLinkClassName =
    "pointer-events-auto flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 active:opacity-80"

  const logo = (
    <div className="size-6">
      <Icons.LogoSmall className="size-full text-foreground lg:text-white" />
    </div>
  )

  const homeLink = renderHomeLink ? (
    renderHomeLink({
      href: homeHref,
      className: logoLinkClassName,
      children: logo,
    })
  ) : (
    <a className={logoLinkClassName} href={homeHref}>
      {logo}
    </a>
  )

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="fixed top-0 right-0 left-0 z-50 w-full">
        {showSunsetBanner ? (sunsetBanner ?? <SunsetBanner />) : null}
        <nav className="pointer-events-none w-full">
          <div className="relative flex items-center px-4 py-3 md:px-4 lg:px-4 xl:px-6 xl:py-4 2xl:px-8">
            {homeLink}
          </div>
        </nav>
      </div>

      <AuthVideoPanel />

      <div className="flex w-full flex-col items-center justify-center p-8 pb-2 lg:w-1/2 lg:p-12">
        <div className="flex h-full min-h-[calc(100svh-6rem)] w-full max-w-md flex-col pt-20 lg:pt-24">
          <div className="flex flex-1 flex-col justify-center space-y-8">
            {children}
          </div>
          <AuthTermsFooter
            privacyHref={privacyHref}
            renderTermsLink={renderTermsLink}
            termsHref={termsHref}
          />
        </div>
      </div>
    </div>
  )
}
