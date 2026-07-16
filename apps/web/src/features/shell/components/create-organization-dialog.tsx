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
import { toOrganizationSlug } from "@/features/shell/organization-slug"

const CreateOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
})

type CreateOrganizationValues = z.infer<typeof CreateOrganizationSchema>

type CreateOrganizationDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

function createUniqueOrganizationSlug(name: string) {
  return `${toOrganizationSlug(name)}-${Date.now().toString(36)}`
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
}: CreateOrganizationDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const form = useForm<CreateOrganizationValues>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (!open) return
    form.reset({ name: "" })
  }, [open, form])

  async function handleSubmit(values: CreateOrganizationValues) {
    setIsPending(true)
    const slug = createUniqueOrganizationSlug(values.name)
    const created = await authClient.organization.create({
      name: values.name,
      slug,
    })

    if (created.error) {
      setIsPending(false)
      toast.error(created.error.message ?? "Could not create organization")
      return
    }

    const organizationId = created.data?.id
    if (!organizationId) {
      setIsPending(false)
      toast.error("Organization created but id was missing")
      return
    }

    const activated = await authClient.organization.setActive({
      organizationId,
    })
    setIsPending(false)

    if (activated.error) {
      toast.error(activated.error.message ?? "Could not activate organization")
      return
    }

    toast.success("Organization created")
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
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Name your organization. You can invite members after it is
              created.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={nameError ? true : undefined}>
              <FieldLabel htmlFor="organization-name">Name</FieldLabel>
              <Input
                aria-invalid={Boolean(nameError)}
                autoFocus
                disabled={isPending}
                id="organization-name"
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
              Create organization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
