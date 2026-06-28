import type { Metadata } from "next"
import { Geist_Mono, Hedvig_Letters_Serif, Inter } from "next/font/google"
import "@/styles/globals.css"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
// import { SunsetBanner } from "@/components/layout/sunset-banner"
import { siteConfig } from "@/config/site"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const hedvigSerif = Hedvig_Letters_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "optional",
  variable: "--font-serif",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — The business stack for modern founders`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.midday.ai" />
        <link rel="dns-prefetch" href="https://cdn.midday.ai" />
      </head>
      <body
        className={cn(
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable,
          hedvigSerif.variable,
          "relative overflow-x-hidden bg-background font-sans antialiased"
        )}
      >
        <div className="relative isolate flex min-h-svh flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            {/* <SunsetBanner /> */}
            <Header />
            <main className="container mx-auto overflow-hidden px-4 pt-9 md:overflow-visible">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
