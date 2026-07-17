"use client"

import { Button } from "@/components/cap-ui"
import { cn as classNames } from "@workspace/ui-shadcn/lib/utils"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Fragment } from "react"

type PlanKey = "free" | "desktop" | "pro"

type Plan = {
  key: PlanKey
  name: string
  short: string
  price: string
  href?: string
}

type FeatureValue = boolean | string

type FeatureRow = {
  label: string
  free: FeatureValue
  desktop: FeatureValue
  pro: FeatureValue
}

type FeatureSection = {
  title: string
  rows: FeatureRow[]
}

const sections: FeatureSection[] = [
  {
    title: "Recording & editing",
    rows: [
      {
        label: "Studio Mode with full editor",
        free: true,
        desktop: true,
        pro: true,
      },
      {
        label: "Unlimited local recordings & editing",
        free: false,
        desktop: true,
        pro: true,
      },
      { label: "4K / 60fps export", free: true, desktop: true, pro: true },
      { label: "Export to any format", free: true, desktop: true, pro: true },
      { label: "Commercial usage", free: false, desktop: true, pro: true },
    ],
  },
  {
    title: "Cloud & sharing",
    rows: [
      {
        label: "Shareable links",
        free: "Up to 5 min",
        desktop: "Up to 5 min",
        pro: "Unlimited",
      },
      {
        label: "Unlimited cloud storage & bandwidth",
        free: false,
        desktop: false,
        pro: true,
      },
      {
        label: "Custom domain (cap.yourdomain.com)",
        free: false,
        desktop: false,
        pro: true,
      },
      {
        label: "Password protected shares",
        free: false,
        desktop: false,
        pro: true,
      },
      {
        label: "Custom S3 bucket & Google Drive support",
        free: false,
        desktop: false,
        pro: true,
      },
      { label: "Loom video importer", free: false, desktop: false, pro: true },
    ],
  },
  {
    title: "AI & collaboration",
    rows: [
      {
        label: "Auto titles, summaries & chapters",
        free: false,
        desktop: false,
        pro: true,
      },
      { label: "Transcriptions", free: false, desktop: false, pro: true },
      {
        label: "Viewer analytics & engagement",
        free: false,
        desktop: false,
        pro: true,
      },
      { label: "Team workspaces", free: true, desktop: true, pro: true },
    ],
  },
  {
    title: "Support & licensing",
    rows: [
      { label: "Community support", free: true, desktop: true, pro: true },
      {
        label: "Priority support & early features",
        free: false,
        desktop: false,
        pro: true,
      },
      {
        label: "License",
        free: "Personal use",
        desktop: "Perpetual",
        pro: "Subscription",
      },
    ],
  },
]

const getButtonVariant = (key: PlanKey) => {
  switch (key) {
    case "pro":
      return "blue" as const
    default:
      return "outline" as const
  }
}

const getButtonText = (key: PlanKey): string => {
  switch (key) {
    case "free":
      return "Download"
    case "desktop":
      return "Get license"
    default:
      return "Get started"
  }
}

export const ComparePlans = () => {
  const plans: Plan[] = [
    {
      key: "free",
      name: "Free",
      short: "Free",
      price: "Free forever",
      href: "/download",
    },
    {
      key: "desktop",
      name: "Desktop License",
      short: "Desktop",
      price: "$29/yr",
      href: "/signup",
    },
    {
      key: "pro",
      name: "Cap Pro",
      short: "Pro",
      price: "$8.16/user/mo",
      href: "/signup",
    },
  ]

  const renderCell = (value: FeatureValue) => {
    if (typeof value === "boolean") {
      return value ? (
        <>
          <FontAwesomeIcon
            className="size-3.5 text-primary"
            icon={faCheck}
            aria-hidden="true"
          />
          <span className="sr-only">Included</span>
        </>
      ) : (
        <>
          <span className="text-muted-foreground" aria-hidden="true">
            —
          </span>
          <span className="sr-only">Not included</span>
        </>
      )
    }
    return <span className="text-sm text-muted-foreground">{value}</span>
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h2 className="mb-3 text-center text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        Compare plans
      </h2>
      <p className="mx-auto mb-12 max-w-md text-center text-muted-foreground">
        Everything you get with Free, Desktop License, and Cap Pro.
      </p>

      <div className="hidden rounded-2xl border border-border bg-muted p-4 shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-0">
            <thead>
              <tr className="align-bottom">
                <th className="w-[40%] border-b border-border px-5 pb-6" />
                {plans.map((plan) => {
                  const isPro = plan.key === "pro"
                  return (
                    <th
                      key={plan.key}
                      className={classNames(
                        "w-[20%] px-3 pt-6 pb-6 text-center align-bottom font-normal",
                        isPro
                          ? "rounded-t-2xl border-x-2 border-t-2 border-primary"
                          : "border-b border-border"
                      )}
                    >
                      <p className="text-base font-semibold text-muted-foreground">
                        {plan.name}
                      </p>
                      <p className="mt-1 mb-4 text-sm text-muted-foreground">
                        {plan.price}
                      </p>
                      <Button
                        href={plan.href}
                        size="sm"
                        variant={getButtonVariant(plan.key)}
                        className="w-full"
                      >
                        {getButtonText(plan.key)}
                      </Button>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <Fragment key={section.title}>
                  <tr>
                    <td className="px-5 pt-8 pb-3 text-sm font-semibold text-muted-foreground">
                      {section.title}
                    </td>
                    <td className="pt-8 pb-3" />
                    <td className="pt-8 pb-3" />
                    <td className="border-x-2 border-primary px-3 pt-8 pb-3" />
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={row.label}>
                      <td className="border-t border-border px-5 py-3.5 text-sm text-muted-foreground">
                        {row.label}
                      </td>
                      <td className="border-t border-border px-3 py-3.5 text-center">
                        {renderCell(row.free)}
                      </td>
                      <td className="border-t border-border px-3 py-3.5 text-center">
                        {renderCell(row.desktop)}
                      </td>
                      <td className="border-x-2 border-t border-primary border-t-blue-500/10 px-3 py-3.5 text-center">
                        {renderCell(row.pro)}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
              <tr>
                <td />
                <td />
                <td />
                <td className="h-4 rounded-b-2xl border-x-2 border-b-2 border-primary" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {plans.map((plan) => {
            const isPro = plan.key === "pro"
            return (
              <div
                key={plan.key}
                className={classNames(
                  "flex flex-col rounded-xl bg-muted p-3 text-center",
                  isPro ? "ring-2 ring-primary" : "border border-border"
                )}
              >
                <p className="text-sm font-semibold text-muted-foreground">
                  {plan.short}
                </p>
                <p className="mt-0.5 mb-3 text-xs text-muted-foreground">
                  {plan.price}
                </p>
                <Button
                  href={plan.href}
                  size="xs"
                  variant={getButtonVariant(plan.key)}
                  className="mt-auto w-full px-2 text-xs"
                >
                  {getButtonText(plan.key)}
                </Button>
              </div>
            )
          })}
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {section.title}
            </p>
            <div className="flex flex-col gap-3">
              {section.rows.map((row) => (
                <div key={row.label}>
                  <p className="mb-1.5 text-sm text-muted-foreground">
                    {row.label}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {plans.map((plan) => {
                      const isPro = plan.key === "pro"
                      return (
                        <div
                          key={plan.key}
                          className={classNames(
                            "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-center",
                            isPro ? "bg-primary" : "bg-muted"
                          )}
                        >
                          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {plan.short}
                          </span>
                          <span className="flex items-center justify-center text-sm">
                            {renderCell(row[plan.key])}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComparePlans
