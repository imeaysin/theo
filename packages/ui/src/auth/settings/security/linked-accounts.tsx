"use client"

import { useAuthUiConfig, useListAccounts } from "@workspace/auth/react"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { LinkedAccount } from "./linked-account"

export interface LinkedAccountsProps {
  className?: string
}

export function LinkedAccounts({ className }: LinkedAccountsProps) {
  const { socialProviders } = useAuthUiConfig()
  const { data: accounts, isPending } = useListAccounts()

  if (!socialProviders.length) return null

  const linkedAccounts = accounts?.filter(
    (account) => account.providerId !== "credential"
  )

  const linkedProviderIds = new Set(linkedAccounts?.map((a) => a.providerId))

  const availableProviders = socialProviders.filter(
    (provider) => !linkedProviderIds.has(provider)
  )

  const allRows = [
    ...(linkedAccounts?.map((account) => ({
      key: account.id,
      account,
      provider: account.providerId,
    })) ?? []),
    ...availableProviders.map((provider) => ({
      key: provider,
      account: undefined,
      provider,
    })),
  ]

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Linked accounts</h2>

      <Card className={cn("p-0", className)}>
        <CardPanel className="p-0">
          {isPending
            ? socialProviders.map((provider, index) => (
                <div key={provider}>
                  {index > 0 ? <Separator /> : null}
                  <AccountRowSkeleton />
                </div>
              ))
            : allRows.map((row, index) => (
                <div key={row.key}>
                  {index > 0 ? <Separator /> : null}
                  <LinkedAccount
                    account={row.account}
                    provider={row.provider}
                  />
                </div>
              ))}
        </CardPanel>
      </Card>
    </div>
  )
}

function AccountRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="size-10 rounded-md" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}
