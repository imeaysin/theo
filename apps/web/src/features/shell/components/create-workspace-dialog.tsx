import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui-shadcn/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { toOrgSlug } from "@/features/shell/organization-slug"

const CreateWorkspaceSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
})

type CreateWorkspaceValues = z.infer<typeof CreateWorkspaceSchema>

type CreateWorkspaceDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

function createUniqueOrgSlug(name: string) {
  return `${toOrgSlug(name)}-${Date.now().toString(36)}`
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const form = useForm<CreateWorkspaceValues>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (!open) return
    form.reset({ name: "" })
  }, [open, form])

  async function handleSubmit(values: CreateWorkspaceValues) {
    setIsPending(true)
    const slug = createUniqueOrgSlug(values.name)
    const created = await authClient.organization.create({
      name: values.name,
      slug,
    })

    if (created.error) {
      setIsPending(false)
      toast.error(created.error.message ?? "Could not create workspace")
      return
    }

    const organizationId = created.data?.id
    if (!organizationId) {
      setIsPending(false)
      toast.error("Workspace created but id was missing")
      return
    }

    const activated = await authClient.organization.setActive({
      organizationId,
    })
    setIsPending(false)

    if (activated.error) {
      toast.error(activated.error.message ?? "Could not activate workspace")
      return
    }

    toast.success("Workspace created")
    onOpenChange(false)
    form.reset({ name: "" })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return
    if (!nextOpen) form.reset({ name: "" })
    onOpenChange(nextOpen)
  }

  const nameError = form.formState.errors.name

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>
              Name your workspace. You can invite members after it is created.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={nameError ? true : undefined}>
              <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
              <Input
                aria-invalid={Boolean(nameError)}
                autoFocus
                disabled={isPending}
                id="workspace-name"
                placeholder="Acme Inc"
                {...form.register("name")}
              />
              <FieldError errors={[nameError]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              disabled={isPending}
              render={<Button type="button" variant="outline" />}
            >
              Cancel
            </DialogClose>
            <Button disabled={isPending} type="submit">
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              Create workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
