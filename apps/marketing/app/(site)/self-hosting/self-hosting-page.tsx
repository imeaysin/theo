// million-ignore

"use client"

import { Button } from "@/components/product-ui"
import { CommercialGetStarted } from "@/components/commercial-get-started"
import Image from "next/image"
import { FeatureCard } from "./_components/feature-card"
import { LogoSection } from "./_components/logo-section"

export const SelfHostingPage = () => {
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
    <div className="mt-[120px]">
      <div className="relative z-10 w-full px-5 pt-24 pb-36">
        <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
          <h1 className="relative z-10 mb-4 animate-in text-3xl leading-[2.5rem] font-medium text-foreground fade-in slide-in-from-bottom-4 md:text-6xl md:leading-[4rem]">
            Self-host Theo
          </h1>
          <p className="mx-auto mb-8 max-w-3xl animate-in text-base text-muted-foreground delay-300 fade-in slide-in-from-bottom-4 sm:text-xl">
            Deploy Theo on your own infrastructure with full control over your
            data. Ideal for enterprises and organizations with specific security
            requirements or those wanting to white label the platform.
          </p>
        </div>
        <div className="mb-5 flex animate-in flex-col items-center justify-center gap-2 delay-500 fade-in slide-in-from-bottom-4 sm:flex-row sm:gap-2">
          <Button
            variant="blue"
            href="#features"
            size="lg"
            className="flex w-full items-center justify-center text-base font-medium sm:w-auto"
            onClick={(e) => handleSmoothScroll(e, "features")}
          >
            Learn More
          </Button>
        </div>
        <Image
          src="/illustrations/mask-big-recorder.webp"
          alt="Self-hosting Background"
          width={1920}
          height={1080}
          className="pointer-events-none absolute top-0 left-0 z-0 -mt-40 h-auto w-full"
        />
      </div>
      <LogoSection />
      <div
        className="mx-auto w-full max-w-screen-2xl px-5 pb-32 sm:px-8 md:pb-40 lg:px-10"
        id="features"
      >
        <div className="flex flex-col gap-3">
          {/* Section 1: 35% / 65% split */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <FeatureCard
                title="Privacy-first"
                description="Host Theo on your own servers with complete data sovereignty. Maintain full control over your sensitive information and ensure compliance with your organization's security policies and regulatory requirements."
                imagePath="/illustrations/privacy.webp"
                imageAlt="Complete Control"
                imageHeight="h-[280px]"
              />
            </div>
            <div className="md:col-span-7">
              <FeatureCard
                title="Multi-Platform Support"
                description="Self-hosted Theo works seamlessly across macOS and Windows, giving your team the flexibility to collaborate regardless of their device preference. Deploy once and enable your entire organization to capture, share, and collaborate from any device."
                imagePath="/illustrations/multiplatmain.png"
                bg="/illustrations/multiplatbg.webp"
                imageAlt="Enterprise-Ready"
                className="bg-cover bg-[center_top_-90px] bg-no-repeat lg:bg-[center_top_-60px]"
                imageHeight="h-[280px]"
              />
            </div>
          </div>

          {/* Section 2: 65% / 35% split */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-8">
              <FeatureCard
                title="Unlimited Recording and Cloud Storage"
                bg="/illustrations/multiplatbg.webp"
                description="Configure storage limits based on your infrastructure capacity. Self-hosting eliminates cloud storage fees and gives you complete control over retention policies, ideal for teams with high-volume recording needs or long-term archival requirements."
                imagePath="/illustrations/cloud-feature.webp"
                imageAlt="White Labeling"
                imageHeight="h-[215px]"
                className="bg-cover bg-[center_top_-120px] bg-no-repeat lg:bg-[center_top_-150px]"
              />
            </div>
            <div className="md:col-span-4">
              <FeatureCard
                title="High-Quality Video Capture"
                description="Deliver crystal-clear recordings to your team with self-hosted infrastructure optimized for your network. Eliminate quality degradation from third-party services and ensure consistent performance across your organization."
                imagePath="/illustrations/video-capture.webp"
                imageAlt="Data Sovereignty"
                imageHeight="h-[224px]"
              />
            </div>
          </div>

          {/* Section 3: Full width */}
          <div className="grid grid-cols-1">
            <FeatureCard
              title="Advanced Team Collaboration"
              description="Enable seamless knowledge sharing across departments with customizable access controls and team workspaces. Self-hosted Theo provides enterprise-grade collaboration features that integrate with your existing authentication systems and team structure."
              imagePath="/illustrations/collaboration.webp"
              imageAlt="Dedicated Support"
              imageHeight="h-[285px]"
            />
          </div>
        </div>
      </div>
      <div className="mb-32 px-5 md:mb-40">
        <CommercialGetStarted />
      </div>
    </div>
  )
}
