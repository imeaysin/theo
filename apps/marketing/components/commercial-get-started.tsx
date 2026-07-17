"use client"

import { Button } from "@/components/product-ui"
import Image from "next/image"

export function CommercialGetStarted() {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLButtonElement>,
    targetId: string
  ) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <div
      className="custom-bg relative mx-auto flex max-w-[1000px] flex-col justify-center overflow-hidden rounded-[20px] p-8"
      style={{
        minHeight: "264px",
        background: "linear-gradient(135deg, var(--primary), var(--accent))",
      }}
    >
      <div
        id="cloud-4"
        className="pointer-events-none absolute top-0 -right-20 z-0 opacity-50"
      >
        <Image
          className="h-auto max-w-[40vw]"
          src="/illustrations/cloud-1.png"
          alt="Footer Cloud One"
          width={640}
          height={360}
        />
      </div>
      <div
        id="cloud-5"
        className="pointer-events-none absolute bottom-0 left-0 z-0 opacity-50"
      >
        <Image
          className="h-auto max-w-[40vw]"
          src="/illustrations/cloud-2.png"
          alt="Footer Cloud Two"
          width={640}
          height={360}
        />
      </div>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl flex-col items-center justify-center px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mb-8 max-w-[800px] text-center">
          <h2 className="mb-3 text-xl text-primary-foreground sm:text-3xl">
            Enterprise-grade screen recording, on your infrastructure.
          </h2>
          <p className="text-base text-primary-foreground sm:text-lg">
            Deploy Theo on your own servers with complete data sovereignty.
            Maintain full control over your sensitive information while enabling
            seamless team collaboration.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="white"
            href="#features"
            size="lg"
            className="w-full sm:w-auto"
            onClick={(e) => handleSmoothScroll(e, "features")}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}
