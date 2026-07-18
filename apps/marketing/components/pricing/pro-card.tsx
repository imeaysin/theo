"use client"

import { Button } from "@/components/product-ui"
import NumberFlow from "@number-flow/react"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { homeContent } from "@/content/home"
import { BillingToggle } from "./billing-toggle"
import { PlanFeature } from "./plan-feature"
import { Stepper } from "./stepper"

const plan = homeContent.pricing.pro

export const ProCard = () => {
  const [users, setUsers] = useState(1)
  const [isAnnually, setIsAnnually] = useState(false)

  const perUser = isAnnually ? plan.pricing.annual : plan.pricing.monthly
  const monthlyTotal = perUser * users
  const yearlyTotal = Math.round(plan.pricing.annual * 12) * users

  const incrementUsers = () => setUsers((prev) => prev + 1)
  const decrementUsers = () => setUsers((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <article className="relative flex flex-col rounded-2xl bg-card p-8 shadow-xl ring-2 shadow-primary/10 ring-primary">
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-sm font-medium whitespace-nowrap text-primary-foreground">
        Most popular
      </span>

      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
        <Sparkles className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-foreground">{plan.title}</h3>
      <p className="mt-1.5 min-h-[40px] text-base leading-relaxed text-muted-foreground">
        Everything in Desktop, plus unlimited cloud sharing, AI, and team
        collaboration.
      </p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-medium tracking-tight text-foreground tabular-nums">
          $<NumberFlow value={perUser} />
        </span>
        <span className="text-base text-muted-foreground">/ user / month</span>
      </div>
      <p className="mt-1 text-base text-muted-foreground">
        billed {isAnnually ? "annually" : "monthly"}
      </p>

      <div className="mt-6 flex min-h-[120px] flex-col gap-3">
        <BillingToggle
          ariaLabel="Billing cycle for Pro"
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
        href="/pricing"
        className="mt-6 w-full font-medium"
        aria-label={`Purchase ${plan.title}`}
      >
        {plan.cta}
      </Button>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-4 text-base font-medium text-foreground">
          Everything in Desktop License, plus:
        </p>
        <ul className="flex flex-col gap-3">
          {plan.features.slice(1).map((feature) => (
            <PlanFeature key={feature}>{feature}</PlanFeature>
          ))}
        </ul>
      </div>
    </article>
  )
}
