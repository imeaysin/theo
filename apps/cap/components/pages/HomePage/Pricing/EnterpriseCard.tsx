"use client"

import { Button } from "@/components/cap-ui"
import { useRef } from "react"
import { EnterpriseArt, type EnterpriseArtRef } from "./EnterpriseArt"
import { PlanFeature } from "./PlanFeature"

const enterpriseFeatures = [
  "SLAs & priority support",
  "SAML SSO & SCIM provisioning",
  "Managed self-hosting",
  "Volume discounts",
  "Advanced security controls",
  "Dedicated onboarding",
]

export const EnterpriseCard = () => {
  const artRef = useRef<EnterpriseArtRef>(null)

  const handleBookCall = () => {
    window.open("https://cal.com/cap.so/15min", "_blank")
  }

  return (
    <article
      onMouseEnter={() => artRef.current?.playHoverAnimation()}
      onMouseLeave={() => artRef.current?.playDefaultAnimation()}
      className="flex flex-col rounded-2xl border border-border bg-muted p-8"
    >
      <div className="mb-4 -ml-3 size-14">
        <EnterpriseArt ref={artRef} />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Enterprise</h3>
      <p className="mt-1.5 min-h-[40px] text-sm leading-relaxed text-muted-foreground">
        For organizations that need security, control, and dedicated support at
        scale.
      </p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight text-muted-foreground">
          Custom
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        tailored to your team
      </p>

      <div className="mt-6 min-h-[120px]">
        <div className="rounded-lg border border-border bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
          Custom annual billing with volume discounts, onboarding, and a
          dedicated success manager.
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={handleBookCall}
        className="mt-6 w-full font-medium"
        aria-label="Talk to sales about Enterprise"
      >
        Talk to sales
      </Button>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Everything in Cap Pro, plus:
        </p>
        <ul className="flex flex-col gap-3">
          {enterpriseFeatures.map((feature) => (
            <PlanFeature key={feature}>{feature}</PlanFeature>
          ))}
        </ul>
      </div>
    </article>
  )
}
