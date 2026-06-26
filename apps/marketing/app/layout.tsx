import type { Metadata } from "next"
import { Hedvig_Letters_Sans, Hedvig_Letters_Serif } from "next/font/google"
import "@/styles/globals.css"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { SunsetBanner } from "@/components/layout/sunset-banner"
import { siteConfig } from "@/config/site"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const hedvigSans = Hedvig_Letters_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "optional",
  variable: "--font-hedvig-sans",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "arial"],
})

const hedvigSerif = Hedvig_Letters_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "optional",
  variable: "--font-hedvig-serif",
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
          `${hedvigSans.variable} ${hedvigSerif.variable} font-sans`,
          "overflow-x-hidden bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <SunsetBanner />
          <Header />
          <main className="container mx-auto overflow-hidden px-4 pt-9 md:overflow-visible">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
