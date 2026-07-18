"use client"

import { Button } from "@/components/product-ui"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import NumberFlow from "@number-flow/react"
import { Monitor } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Tooltip } from "@/components/tooltip"
import { homeContent } from "@/content/home"
import { BillingToggle } from "./billing-toggle"
import { PlanFeature } from "./plan-feature"
import { Stepper } from "./stepper"

const plan = homeContent.pricing.commercial

export const CommercialCard = () => {
  const [licenses, setLicenses] = useState(1)
  const [isYearly, setIsYearly] = useState(true)

  const perLicense = isYearly ? plan.pricing.yearly : plan.pricing.lifetime
  const total = licenses * perLicense

  const incrementLicenses = () => setLicenses((prev) => prev + 1)
  const decrementLicenses = () =>
    setLicenses((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-8">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
        <Monitor className="size-5" strokeWidth={1.5} />
      </div>
      <div className="flex items-center gap-1.5">
        <h3 className="text-lg font-medium text-foreground">{plan.title}</h3>
        <Tooltip
          position="top"
          delayDuration={150}
          className="max-w-[260px] items-start text-left leading-relaxed"
          content={plan.description}
        >
          <button
            type="button"
            aria-label="What's included in the Desktop License?"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <FontAwesomeIcon icon={faCircleInfo} className="size-3.5" />
          </button>
        </Tooltip>
      </div>
      <p className="mt-1.5 min-h-[40px] text-base leading-relaxed text-muted-foreground">
        {plan.description}
      </p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-medium tracking-tight text-foreground tabular-nums">
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
        href="/pricing"
        className="mt-6 w-full font-medium"
        aria-label="Purchase Commercial License"
      >
        {plan.cta}
      </Button>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-4 text-base font-medium text-foreground">
          What&apos;s included
        </p>
        <ul className="flex flex-col gap-3">
          {plan.features.map((feature) => (
            <PlanFeature key={feature}>{feature}</PlanFeature>
          ))}
        </ul>
        <Link
          href="/pricing"
          className="mt-5 inline-block text-base text-muted-foreground underline transition-colors hover:text-foreground"
        >
          Learn more about pricing
        </Link>
      </div>
    </article>
  )
}
