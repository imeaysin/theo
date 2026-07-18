"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizations,
  useSetActiveOrganization,
} from "@better-auth-ui/react"
import type { Organization } from "better-auth/client"
import type { ColumnDef } from "@tanstack/react-table"
import { Settings as SettingsIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import { DataTableSkeleton } from "@workspace/ui-shadcn/components/data-table-skeleton"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { SectionHeader } from "@/components/page-header"
import { CreateOrganizationDialog } from "@/features/auth/components/organization/create-organization-dialog"
import { OrganizationView } from "@/features/auth/components/organization/organization-view"
import { OrganizationsEmpty } from "@/features/auth/components/organization/organizations-empty"

function OrganizationManageAction({
  organization,
}: {
  organization: Organization
}) {
  const { authClient, basePaths, navigate } = useAuth()
  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths,
    slug,
    slugPrefix,
  } = useAuthPlugin(organizationPlugin)

  const { mutate: setActiveOrganization, isPending: setActivePending } =
    useSetActiveOrganization(authClient as OrganizationAuthClient, {
      onSuccess: () => {
        navigate({
          to: `${basePaths.organization}/${organizationViewPaths.organization.settings}`,
        })
      },
    })

  function manageOrganization() {
    if (slug !== undefined) {
      navigate({
        to: `${basePaths.organization}/${slugPrefix}${organization.slug}/${organizationViewPaths.organization.settings}`,
      })
    } else {
      setActiveOrganization({ organizationId: organization.id })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={setActivePending}
      onClick={manageOrganization}
      aria-label={organizationLocalization.manage}
    >
      {setActivePending ? <Spinner data-icon="inline-start" /> : null}
      {!setActivePending ? <SettingsIcon data-icon="inline-start" /> : null}
      {organizationLocalization.manage}
    </Button>
  )
}

function getOrganizationsColumns(): ColumnDef<Organization>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Organization" />
      ),
      cell: ({ row }) => <OrganizationView organization={row.original} />,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.slug}</span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <OrganizationManageAction organization={row.original} />
      ),
    },
  ]
}

export type OrganizationsProps = {
  className?: string
  /** When true, omit the section header (page already provides PageHeader). */
  hideHeader?: boolean
  createOpen?: boolean
  onCreateOpenChange?: (open: boolean) => void
}

/**
 * Lists organizations the user belongs to.
 */
export function Organizations({
  className,
  hideHeader,
  createOpen: createOpenProp,
  onCreateOpenChange,
}: OrganizationsProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const [uncontrolledCreateOpen, setUncontrolledCreateOpen] = useState(false)
  const createOpen = createOpenProp ?? uncontrolledCreateOpen
  const setCreateOpen = onCreateOpenChange ?? setUncontrolledCreateOpen

  const { data: organizations, isPending: organizationsPending } =
    useListOrganizations(authClient as OrganizationAuthClient)

  const columns = useMemo(() => getOrganizationsColumns(), [])
  const hasOrganizations = (organizations?.length ?? 0) > 0

  return (
    <>
      <div className={className}>
        <div className="flex flex-col gap-3">
          {!hideHeader ? (
            <SectionHeader
              actions={
                <Button
                  size="sm"
                  disabled={organizationsPending}
                  onClick={() => setCreateOpen(true)}
                >
                  {organizationLocalization.createOrganization}
                </Button>
              }
              title={organizationLocalization.organizations}
            />
          ) : null}

          {organizationsPending ? (
            <DataTableSkeleton columnCount={3} withToolbar={false} />
          ) : null}

          {!organizationsPending && !hasOrganizations ? (
            <OrganizationsEmpty onCreatePress={() => setCreateOpen(true)} />
          ) : null}

          {!organizationsPending && hasOrganizations ? (
            <DataTable
              columns={columns}
              data={organizations ?? []}
              filterColumn="name"
              filterPlaceholder="Filter organizations..."
              getRowId={(organization) => organization.id}
              initialSorting={[{ id: "name", desc: false }]}
            />
          ) : null}
        </div>
      </div>

      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  )
}
