import { authClient } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

const RenameSchema = z.object({
  name: z.string().trim().min(2).max(80),
})

type WorkspaceOverviewProps = {
  readonly organizationId: string
  readonly name: string
  readonly slug: string
  readonly memberCount: number
  readonly invitationCount: number
  readonly canUpdate: boolean
  readonly onUpdated: () => void
}

export function WorkspaceOverview({
  organizationId,
  name,
  slug,
  memberCount,
  invitationCount,
  canUpdate,
  onUpdated,
}: WorkspaceOverviewProps) {
  const [draftName, setDraftName] = useState(name)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function saveName() {
    setError(null)
    const parsed = RenameSchema.safeParse({ name: draftName })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid name")
      return
    }
    setIsPending(true)
    const result = await authClient.organization.update({
      data: { name: parsed.data.name },
      organizationId,
    })
    setIsPending(false)
    if (result.error) {
      toast.error(result.error.message ?? "Could not update workspace")
      return
    }
    toast.success("Workspace updated")
    onUpdated()
  }

  return (
    <div className="grid max-w-xl gap-6">
      <div className="grid gap-1">
        <p className="text-sm text-muted-foreground">Slug</p>
        <p className="font-mono text-sm">{slug}</p>
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <p className="text-muted-foreground">Members</p>
          <p className="text-lg font-medium">{memberCount}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Pending invites</p>
          <p className="text-lg font-medium">{invitationCount}</p>
        </div>
      </div>
      {canUpdate ? (
        <FieldGroup>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="workspace-rename">Display name</FieldLabel>
            <Input
              disabled={isPending}
              id="workspace-rename"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
            <FieldError>{error}</FieldError>
          </Field>
          <Button
            className="w-fit"
            disabled={isPending || draftName.trim() === name}
            onClick={() => void saveName()}
            type="button"
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Save changes
          </Button>
        </FieldGroup>
      ) : (
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">Display name</p>
          <p className="font-medium">{name}</p>
        </div>
      )}
    </div>
  )
}
