"use client"

import { ReadyToGetStarted } from "@/components/ready-to-get-started"
import Pricing from "@/components/pricing"
import { TextReveal } from "@/components/ui/text-reveal"
import { homeContent } from "@/content/home"
import Features from "./features"
import Testimonials from "./testimonials"

export function DeferredHomepageSections() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28 lg:gap-40">
      <Features />
      <Testimonials />
      <Pricing />
    </div>
  )
}

export function DeferredHomepageClosingSections() {
  return (
    <>
      <TextReveal className="mx-auto max-w-[600px] text-center leading-[1.2]">
        {homeContent.textReveal}
      </TextReveal>
      <ReadyToGetStarted />
    </>
  )
}
