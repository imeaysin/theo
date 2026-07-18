import Image from "next/image"
import type React from "react"

interface LogoMarqueeProps {
  className?: string
}

export const LogoMarquee: React.FC<LogoMarqueeProps> = ({ className = "" }) => {
  const logos = [
    {
      src: "/logos/microsoft.svg",
      alt: "Microsoft Logo",
      width: 98,
      height: 24,
    },
    {
      src: "/logos/amazon.svg",
      alt: "Amazon Logo",
      width: 100,
      height: 30,
    },
    {
      src: "/logos/berkeley.svg",
      alt: "Berkeley Logo",
      width: 100,
      height: 30,
    },
    {
      src: "/logos/figma.svg",
      alt: "Figma Logo",
      width: 30,
      height: 10,
    },
    {
      src: "/logos/coinbase.svg",
      alt: "Coinbase Logo",
      width: 139,
      height: 32,
    },
    { src: "/logos/ibm.svg", alt: "IBM Logo", width: 80, height: 20 },
    { src: "/logos/dropbox.svg", alt: "Dropbox Logo", width: 115, height: 50 },
    { src: "/logos/tesla.svg", alt: "Tesla Logo", width: 100, height: 30 },
  ]

  const track = (keyPrefix: string) =>
    logos.map((logo, index) => (
      <div
        key={`${keyPrefix}-${index}`}
        className="mx-4 flex h-10 shrink-0 items-center justify-center sm:mx-5"
      >
        <Image
          alt={logo.alt}
          loading="lazy"
          width={logo.width}
          height={logo.height}
          className="h-auto max-h-8 w-auto opacity-50"
          src={logo.src}
        />
      </div>
    ))

  return (
    <div className={`relative w-full min-w-0 overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background to-transparent sm:w-12" />

      <div className="animate-marquee flex w-max">
        <div className="flex shrink-0 items-center">{track("a")}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {track("b")}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent sm:w-12" />
    </div>
  )
}
