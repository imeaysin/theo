import { zodResolver } from "@hookform/resolvers/zod"
import { CreateNoteSchema, type NoteResponse } from "@workspace/contracts"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Pane } from "@workspace/ui/components/pane"
import { Textarea } from "@workspace/ui/components/textarea"
import { useEffect } from "react"
import { Controller, useForm, useFormState } from "react-hook-form"
import type { z } from "zod"
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "@/features/notes/hooks/use-notes"

type NoteFormValues = z.input<typeof CreateNoteSchema>

type NoteFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  note?: NoteResponse | null
}

export function NoteFormSheet({
  open,
  onOpenChange,
  note,
}: NoteFormSheetProps) {
  const isEditing = Boolean(note)
  const createNote = useCreateNoteMutation()
  const updateNote = useUpdateNoteMutation()
  const isPending = createNote.isPending || updateNote.isPending

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: { title: "", body: "" },
  })
  const { errors } = useFormState({ control: form.control })

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

  const formErrors: Record<string, string> = {}
  if (errors.title?.message) formErrors.title = errors.title.message
  if (errors.body?.message) formErrors.body = errors.body.message

  return (
    <Pane onOpenChange={onOpenChange} open={open}>
      <Pane.Content>
        <Pane.Header>
          <Pane.Title>{isEditing ? "Edit note" : "New note"}</Pane.Title>
          <Pane.Description>
            {isEditing
              ? "Update the title or body of your note."
              : "Add a title and optional details."}
          </Pane.Description>
        </Pane.Header>

        <Form
          className="flex min-h-0 flex-1 flex-col"
          errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Pane.Panel className="space-y-4">
            <Controller
              control={form.control}
              name="title"
              render={({ field }) => (
                <Field name="title">
                  <FieldLabel htmlFor="note-title">Title</FieldLabel>
                  <Input
                    {...field}
                    disabled={isPending}
                    id="note-title"
                    nativeInput
                    placeholder="What is this note about?"
                  />
                  <FieldError />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="body"
              render={({ field }) => (
                <Field name="body">
                  <FieldLabel htmlFor="note-body">Body</FieldLabel>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    id="note-body"
                    placeholder="Optional details…"
                    rows={8}
                  />
                  <FieldError />
                </Field>
              )}
            />
          </Pane.Panel>

          <Pane.Footer>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isEditing ? "Save changes" : "Create note"}
            </Button>
          </Pane.Footer>
        </Form>
      </Pane.Content>
    </Pane>
  )
}
