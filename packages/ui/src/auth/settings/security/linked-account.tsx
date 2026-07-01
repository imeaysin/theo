"use client"

import {
  useAccountInfo,
  useAuthUiConfig,
  useLinkSocial,
  useUnlinkAccount,
} from "@workspace/auth/react"
import { Link2, Link2Off } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import {
  DefaultProviderIcon,
  getProviderName,
  providerIcons,
} from "../../utils/provider-icons"

interface LinkedAccountRecord {
  id: string
  accountId: string
  providerId: string
}

export interface LinkedAccountProps {
  account?: LinkedAccountRecord
  provider: string
}

export function LinkedAccount({ account, provider }: LinkedAccountProps) {
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
                    type: "success",
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
