"use client"

import type { ReactNode } from "react"
import { AuthBrandLogo } from "./auth-brand-logo"
import { AuthTermsFooter } from "./auth-terms-footer"

export type AuthLinkProps = {
  href: string
  className?: string
  children: ReactNode
}

export type AuthLinkComponent = React.ComponentType<AuthLinkProps>

export type AuthShellProps = {
  homeHref: string
  children: ReactNode
  termsHref?: string
  privacyHref?: string
  linkComponent?: AuthLinkComponent
}

const logoLinkClassName =
  "pointer-events-auto flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 active:opacity-80"

export function DefaultAuthLink({ href, className, children }: AuthLinkProps) {
  return (
    <a className={className} href={href}>
      {children}
    </a>
  )
}

export function AuthShell({
  homeHref,
  children,
  termsHref,
  privacyHref,
  linkComponent: Link = DefaultAuthLink,
}: AuthShellProps) {
  const logo = (
    <div className="size-6">
      <AuthBrandLogo className="size-full" />
    </div>
  )

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="fixed top-0 right-0 left-0 z-50 w-full">
        <nav className="pointer-events-none w-full">
          <div className="relative flex items-center px-4 py-3 md:px-6">
            <Link className={logoLinkClassName} href={homeHref}>
              {logo}
            </Link>
          </div>
        </nav>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-8 pb-2">
        <div className="flex h-full min-h-[calc(100svh-6rem)] w-full max-w-md flex-col pt-20">
          <div className="flex flex-1 flex-col justify-center gap-8">
            {children}
          </div>
          <AuthTermsFooter privacyHref={privacyHref} termsHref={termsHref} />
        </div>
      </div>
    </div>
  )
}
