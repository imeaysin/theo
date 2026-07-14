"use client"

import {
  useAccountInfo,
  useAuthUiConfig,
  useLinkSocial,
  useListAccounts,
  useUnlinkAccount,
} from "@workspace/auth/react"
import { Link2, Link2Off } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import {
  DefaultProviderIcon,
  getProviderName,
  providerIcons,
} from "../../utils/provider-icons"

export type LinkedAccountsProps = {
  className?: string
}

type LinkedAccountRecord = {
  id: string
  accountId: string
  providerId: string
}

function LinkedAccountRow({
  account,
  provider,
}: {
  account?: LinkedAccountRecord
  provider: string
}) {
  const config = useAuthUiConfig()
  const { data: accountInfo, isPending: isLoadingInfo } = useAccountInfo(
    account?.accountId
  )
  const { mutate: linkSocial, isPending: isLinking } = useLinkSocial()
  const { mutate: unlinkAccount, isPending: isUnlinking } = useUnlinkAccount()

  const ProviderIcon = providerIcons[provider] ?? DefaultProviderIcon
  const providerName = getProviderName(provider)

  const info = accountInfo as
    | {
        data?: { login?: string; username?: string }
        user?: { email?: string; name?: string }
      }
    | undefined

  const displayName =
    info?.data?.login ||
    info?.data?.username ||
    info?.user?.email ||
    info?.user?.name ||
    account?.accountId

  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <ProviderIcon className={cn("size-4.5", !account && "opacity-50")} />
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="text-sm leading-tight font-medium">
          {providerName}
        </span>

        {account && isLoadingInfo ? (
          <Skeleton className="my-0.5 h-3 w-24" />
        ) : (
          <span className="truncate text-xs text-muted-foreground">
            {account ? displayName : `Link ${providerName}`}
          </span>
        )}
      </div>

      {account ? (
        <Button
          aria-label={`Unlink ${providerName}`}
          className="ml-auto shrink-0"
          loading={isUnlinking}
          onClick={() =>
            unlinkAccount(
              { providerId: account.providerId },
              {
                onSuccess: () => {
                  toastManager.add({
                    title: "Account unlinked",
                    description: "Your account has been unlinked.",
                    type: "success",
                  })
                },
                onError: () => {
                  toastManager.add({
                    title: "Could not unlink account",
                    description: "Please try again.",
                    type: "error",
                  })
                },
              }
            )
          }
          size="sm"
          variant="outline"
        >
          <Link2Off />
          Unlink
        </Button>
      ) : (
        <Button
          aria-label={`Link ${providerName}`}
          className="ml-auto shrink-0"
          loading={isLinking}
          onClick={() =>
            linkSocial({
              provider,
              callbackURL:
                typeof window !== "undefined"
                  ? window.location.href
                  : config.absoluteAppUrl(config.routes.settingsSecurity),
            })
          }
          size="sm"
          variant="outline"
        >
          <Link2 />
          Link
        </Button>
      )}
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
                  <LinkedAccountRow
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
