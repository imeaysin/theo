"use client"

import { Button } from "@/components/cap-ui"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import NumberFlow from "@number-flow/react"
import Link from "next/link"
import { useRef, useState } from "react"
import { Tooltip } from "@/components/tooltip"
import { WhenVisible } from "@/components/ui/when-visible"
import { homepageCopy } from "../../data/homepage-copy"
import { BillingToggle } from "./billing-toggle"
import { CommercialArt, type CommercialArtRef } from "./commercial-art"
import { PlanFeature } from "./plan-feature"
import { Stepper } from "./stepper"

const copy = homepageCopy.pricing.commercial

export const CommercialCard = () => {
  const [licenses, setLicenses] = useState(1)
  const [isYearly, setIsYearly] = useState(true)
  const artRef = useRef<CommercialArtRef>(null)

  const perLicense = isYearly ? copy.pricing.yearly : copy.pricing.lifetime
  const total = licenses * perLicense

  const incrementLicenses = () => setLicenses((prev) => prev + 1)
  const decrementLicenses = () =>
    setLicenses((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <article
      onMouseEnter={() => artRef.current?.playHoverAnimation()}
      onMouseLeave={() => artRef.current?.playDefaultAnimation()}
      className="flex flex-col rounded-2xl border border-border bg-card p-8"
    >
      <div className="mb-4 -ml-3 size-14">
        <WhenVisible className="size-full">
          <CommercialArt ref={artRef} />
        </WhenVisible>
      </div>
      <div className="flex items-center gap-1.5">
        <h3 className="text-lg font-semibold text-foreground">{copy.title}</h3>
        <Tooltip
          position="top"
          delayDuration={150}
          className="max-w-[260px] items-start text-left leading-relaxed"
          content="A commercial license to use Cap on your desktop — unlimited local recording and editing, plus 20 cloud shareable links per month. No cloud subscription required."
        >
          <button
            type="button"
            aria-label="What's included in the Desktop License?"
            className="text-muted-foreground transition-colors hover:text-muted-foreground"
          >
            <FontAwesomeIcon icon={faCircleInfo} className="size-3.5" />
          </button>
        </Tooltip>
      </div>
      <p className="mt-1.5 min-h-[40px] text-base leading-relaxed text-muted-foreground">
        {copy.description}
      </p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          $<NumberFlow value={perLicense} />
        </span>
        <span className="text-base text-muted-foreground">/ license</span>
      </div>
      <p className="mt-1 text-base text-muted-foreground">
        {isYearly ? "billed yearly" : "one-time payment"}
      </p>

      <div className="mt-6 flex min-h-[120px] flex-col gap-3">
        <BillingToggle
          ariaLabel="Billing option for Desktop License"
          value={isYearly ? "yearly" : "lifetime"}
          onChange={(value) => setIsYearly(value === "yearly")}
          options={[
            { value: "yearly", label: "Annual" },
            { value: "lifetime", label: "Lifetime" },
          ]}
        />
        <Stepper
          label="Licenses"
          value={licenses}
          onIncrement={incrementLicenses}
          onDecrement={decrementLicenses}
          decrementLabel="Decrease license count"
          incrementLabel="Increase license count"
        />
        <p className="text-base text-muted-foreground">
          <span className="font-medium text-foreground">
            $<NumberFlow value={total} />
          </span>{" "}
          {isYearly ? "billed yearly" : "one-time"}
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        href="https://cap.so/signup"
        className="mt-6 w-full font-medium"
        aria-label="Purchase Commercial License"
      >
        {copy.cta}
      </Button>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-4 text-base font-medium text-foreground">
          What&apos;s included
        </p>
        <ul className="flex flex-col gap-3">
          {copy.features.map((feature) => (
            <PlanFeature key={feature}>{feature}</PlanFeature>
          ))}
        </ul>
        <Link
          href="/docs/commercial-license"
          className="mt-5 inline-block text-base text-muted-foreground underline transition-colors hover:text-foreground"
        >
          Learn more about the commercial license
        </Link>
      </div>
    </article>
  )
}
