"use client"

import type * as React from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@workspace/ui/components/card"

export interface LinkedAccount {
  id: string
  providerId: string
  accountId: string
  createdAt: Date
}

export interface AvailableProvider<T extends string = string> {
  id: T
  name: string
  icon: React.ReactNode
}

export interface LinkedAccountsListProps<T extends string = string> {
  linkedAccounts: LinkedAccount[]
  availableProviders: AvailableProvider<T>[]
  onLinkAccount: (providerId: T) => Promise<void>
  onUnlinkAccount: (providerId: T) => Promise<void>
  isPendingId?: string | null
}

export function LinkedAccountsList<T extends string = string>({
  linkedAccounts,
  availableProviders,
  onLinkAccount,
  onUnlinkAccount,
  isPendingId,
}: LinkedAccountsListProps<T>) {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>
          Manage your connected social accounts for quick sign in
        </CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="flex flex-col divide-y">
          {availableProviders.map((provider) => {
            const isLinked = linkedAccounts.some(
              (acc) => acc.providerId === provider.id
            )
            const isPending = isPendingId === provider.id

            return (
              <div
                key={provider.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    {provider.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{provider.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {isLinked ? "Connected" : "Not connected"}
                    </span>
                  </div>
                </div>

                <Button
                  variant={isLinked ? "outline" : "default"}
                  size="sm"
                  loading={isPending}
                  onClick={() =>
                    isLinked
                      ? onUnlinkAccount(provider.id)
                      : onLinkAccount(provider.id)
                  }
                  className="w-full sm:w-auto"
                >
                  {isLinked ? "Disconnect" : "Connect"}
                </Button>
              </div>
            )
          })}

          {availableProviders.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No providers configured.
            </div>
          )}
        </div>
      </CardPanel>
    </Card>
  )
}
