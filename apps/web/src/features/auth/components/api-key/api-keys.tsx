"use client"

import {
  type ApiKeyAuthClient,
  type ListedApiKey,
  useAuth,
  useAuthPlugin,
  useListApiKeys,
} from "@better-auth-ui/react"
import type { ColumnDef } from "@tanstack/react-table"
import { X } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import { DataTableSkeleton } from "@workspace/ui-shadcn/components/data-table-skeleton"
import { apiKeyPlugin } from "@/lib/auth/api-key-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { SectionHeader } from "@/components/page-header"
import { ApiKeysEmpty } from "@/features/auth/components/api-key/api-keys-empty"
import { CreateApiKeyDialog } from "@/features/auth/components/api-key/create-api-key-dialog"
import { DeleteApiKeyDialog } from "@/features/auth/components/api-key/delete-api-key-dialog"

export type ApiKeysProps = {
  className?: string
  /** Scope the list and create payload to an organization. */
  organizationId?: string
  /** Force the loading skeleton and disable the list query. */
  isPending?: boolean
  /** Hide the "Create API key" button (header + empty state). */
  hideCreate?: boolean
  /** Hide the per-row delete button on listed keys. */
  hideDelete?: boolean
}

function ApiKeyDeleteAction({
  apiKey,
  organizationId,
}: {
  apiKey: ListedApiKey
  organizationId?: string
}) {
  const { localization } = useAuth()
  const { localization: apiKeyLocalization } = useAuthPlugin(apiKeyPlugin)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDeleteOpen(true)}
        aria-label={apiKeyLocalization.deleteApiKey}
      >
        <X data-icon="inline-start" />
        {localization.settings.delete}
      </Button>
      <DeleteApiKeyDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        apiKey={apiKey}
        organizationId={organizationId}
      />
    </>
  )
}

function getApiKeysColumns({
  hideDelete,
  organizationId,
  nameFallback,
}: {
  hideDelete?: boolean
  organizationId?: string
  nameFallback: string
}): ColumnDef<ListedApiKey>[] {
  const columns: ColumnDef<ListedApiKey>[] = [
    {
      id: "name",
      accessorFn: (row) => row.name || nameFallback,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name || nameFallback}</div>
      ),
    },
    {
      id: "preview",
      accessorFn: (row) => row.start,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground">
          {row.original.start}
          {"*".repeat(16)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <time className="whitespace-nowrap text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </time>
      ),
    },
  ]

  if (!hideDelete) {
    columns.push({
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <ApiKeyDeleteAction
          apiKey={row.original}
          organizationId={organizationId}
        />
      ),
    })
  }

  return columns
}

export function ApiKeys({
  className,
  organizationId,
  isPending: isPendingProp,
  hideCreate,
  hideDelete,
}: ApiKeysProps) {
  const { authClient } = useAuth()
  const { localization: apiKeyLocalization } = useAuthPlugin(apiKeyPlugin)

  const { data: listData, isPending: isListPending } = useListApiKeys(
    authClient as ApiKeyAuthClient,
    {
      enabled: !isPendingProp,
      ...(organizationId
        ? { query: { organizationId, configId: "organization" } }
        : {}),
    }
  )

  const isPending = isPendingProp || isListPending
  const [createOpen, setCreateOpen] = useState(false)
  const apiKeys = listData?.apiKeys ?? []

  const columns = useMemo(
    () =>
      getApiKeysColumns({
        hideDelete,
        organizationId,
        nameFallback: apiKeyLocalization.apiKey,
      }),
    [hideDelete, organizationId, apiKeyLocalization.apiKey]
  )

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <SectionHeader
        actions={
          !hideCreate ? (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => setCreateOpen(true)}
            >
              {apiKeyLocalization.createApiKey}
            </Button>
          ) : null
        }
        title={apiKeyLocalization.apiKeys}
      />

      {isPending ? (
        <DataTableSkeleton columnCount={hideDelete ? 3 : 4} />
      ) : null}

      {!isPending && apiKeys.length === 0 ? <ApiKeysEmpty /> : null}

      {!isPending && apiKeys.length > 0 ? (
        <DataTable
          columns={columns}
          data={apiKeys}
          filterColumn="name"
          filterPlaceholder="Filter API keys..."
          getRowId={(apiKey) => apiKey.id}
          initialSorting={[{ id: "createdAt", desc: true }]}
        />
      ) : null}

      {!hideCreate ? (
        <CreateApiKeyDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          organizationId={organizationId}
        />
      ) : null}
    </div>
  )
}
