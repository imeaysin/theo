import { zodResolver } from "@hookform/resolvers/zod"
import { CreateNoteSchema, type NoteResponse } from "@workspace/contracts"
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
import { Textarea } from "@workspace/ui-shadcn/components/textarea"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "@/features/notes/hooks/use-notes"

type NoteFormValues = z.input<typeof CreateNoteSchema>

type NoteFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  note?: NoteResponse | null
}

export function NoteFormDialog({
  open,
  onOpenChange,
  note,
}: NoteFormDialogProps) {
  const isEditing = Boolean(note)
  const createNote = useCreateNoteMutation()
  const updateNote = useUpdateNoteMutation()
  const isPending = createNote.isPending || updateNote.isPending

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: { title: "", body: "" },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      title: note?.title ?? "",
      body: note?.body ?? "",
    })
  }, [open, note, form])

  async function handleSubmit(values: NoteFormValues) {
    const input = CreateNoteSchema.parse(values)
    if (isEditing && note) {
      await updateNote.mutateAsync({
        noteId: note.id,
        input: {
          title: input.title,
          body: input.body,
        },
      })
    } else {
      await createNote.mutateAsync(input)
    }
    onOpenChange(false)
    form.reset({ title: "", body: "" })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) form.reset({ title: "", body: "" })
    onOpenChange(nextOpen)
  }

  const titleError = form.formState.errors.title
  const bodyError = form.formState.errors.body

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit note" : "New note"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the title or body of your note."
                : "Add a title and optional details."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={titleError ? true : undefined}>
              <FieldLabel htmlFor="note-title">Title</FieldLabel>
              <Input
                aria-invalid={Boolean(titleError)}
                disabled={isPending}
                id="note-title"
                placeholder="What is this note about?"
                {...form.register("title")}
              />
              <FieldError errors={[titleError]} />
            </Field>
            <Field data-invalid={bodyError ? true : undefined}>
              <FieldLabel htmlFor="note-body">Details (optional)</FieldLabel>
              <Textarea
                aria-invalid={Boolean(bodyError)}
                className="min-h-30"
                disabled={isPending}
                id="note-body"
                placeholder="Add some details..."
                {...form.register("body")}
              />
              <FieldError errors={[bodyError]} />
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
              {isEditing ? "Save changes" : "Create note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
