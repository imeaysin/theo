"use client"

import { Button } from "@/components/product-ui"
import NumberFlow from "@number-flow/react"
import { useRef, useState } from "react"
import { WhenVisible } from "@/components/ui/when-visible"
import { homepageCopy } from "../../data/homepage-copy"
import { BillingToggle } from "./billing-toggle"
import { PlanFeature } from "./plan-feature"
import { ProArt, type ProArtRef } from "./pro-art"
import { Stepper } from "./stepper"

const copy = homepageCopy.pricing.pro

export const ProCard = () => {
  const [users, setUsers] = useState(1)
  const [isAnnually, setIsAnnually] = useState(false)
  const artRef = useRef<ProArtRef>(null)

  const perUser = isAnnually ? copy.pricing.annual : copy.pricing.monthly
  const monthlyTotal = perUser * users
  const yearlyTotal = Math.round(copy.pricing.annual * 12) * users

  const incrementUsers = () => setUsers((prev) => prev + 1)
  const decrementUsers = () => setUsers((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <article
      onMouseEnter={() => artRef.current?.playHoverAnimation()}
      onMouseLeave={() => artRef.current?.playDefaultAnimation()}
      className="relative flex flex-col rounded-2xl bg-card p-8 shadow-xl ring-2 shadow-primary/10 ring-primary"
    >
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-base font-semibold whitespace-nowrap text-primary-foreground">
        Most popular
      </span>

      <div className="mb-4 -ml-3 size-14">
        <WhenVisible className="size-full">
          <ProArt ref={artRef} />
        </WhenVisible>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{copy.title}</h3>
      <p className="mt-1.5 min-h-[40px] text-base leading-relaxed text-muted-foreground">
        Everything in Desktop, plus unlimited cloud sharing, AI, and team
        collaboration.
      </p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          $<NumberFlow value={perUser} />
        </span>
        <span className="text-base text-muted-foreground">/ user / month</span>
      </div>
      <p className="mt-1 text-base text-muted-foreground">
        billed {isAnnually ? "annually" : "monthly"}
      </p>

      <div className="mt-6 flex min-h-[120px] flex-col gap-3">
        <BillingToggle
          ariaLabel="Billing cycle for Theo Pro"
          value={isAnnually ? "annual" : "monthly"}
          onChange={(value) => setIsAnnually(value === "annual")}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "annual", label: "Annual", badge: "Save 32%" },
          ]}
        />
        <Stepper
          label="Users"
          value={users}
          onIncrement={incrementUsers}
          onDecrement={decrementUsers}
          decrementLabel="Decrease user count"
          incrementLabel="Increase user count"
        />
        <p className="text-base text-muted-foreground">
          Total:{" "}
          <span className="font-medium text-foreground">
            $<NumberFlow value={isAnnually ? yearlyTotal : monthlyTotal} />
          </span>{" "}
          {isAnnually ? "/ year" : "/ month"}
        </p>
      </div>

      <Button
        variant="blue"
        size="lg"
        href="https://theo.example/signup"
        className="mt-6 w-full font-medium"
        aria-label="Purchase Theo Pro License"
      >
        {copy.cta}
      </Button>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-4 text-base font-medium text-foreground">
          Everything in Desktop License, plus:
        </p>
        <ul className="flex flex-col gap-3">
          {copy.features.slice(1).map((feature) => (
            <PlanFeature key={feature}>{feature}</PlanFeature>
          ))}
        </ul>
      </div>
    </article>
  )
}
