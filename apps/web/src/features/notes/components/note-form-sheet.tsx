import { zodResolver } from "@hookform/resolvers/zod"
import { CreateNoteSchema, type NoteResponse } from "@workspace/contracts"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Textarea } from "@workspace/ui/components/textarea"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "@/features/notes/hooks/use-notes"

const noteFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  body: z.string().max(5000),
})

type NoteFormValues = z.infer<typeof noteFormSchema>

interface NoteFormSheetProps {
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
    resolver: zodResolver(noteFormSchema),
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

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup showCloseButton side="right" variant="inset">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit note" : "New note"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the title or body of your note."
              : "Add a title and optional details."}
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <SheetPanel className="space-y-4">
            <Field>
              <FieldLabel htmlFor="note-title">Title</FieldLabel>
              <Input
                id="note-title"
                nativeInput
                placeholder="What is this note about?"
                {...form.register("title")}
                aria-invalid={Boolean(form.formState.errors.title)}
                disabled={isPending}
              />
              <FieldError match={Boolean(form.formState.errors.title?.message)}>
                {form.formState.errors.title?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="note-body">Body</FieldLabel>
              <Textarea
                id="note-body"
                placeholder="Optional details…"
                rows={8}
                {...form.register("body")}
                disabled={isPending}
              />
            </Field>
          </SheetPanel>

          <SheetFooter>
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
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  )
}
