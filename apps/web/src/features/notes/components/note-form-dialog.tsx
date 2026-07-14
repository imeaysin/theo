import { zodResolver } from "@hookform/resolvers/zod"
import { CreateNoteSchema, type NoteResponse } from "@workspace/contracts"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Textarea } from "@workspace/ui-shadcn/components/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui-shadcn/components/dialog"
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

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit note" : "New note"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the title or body of your note."
                  : "Add a title and optional details."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="What is this note about?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px]"
                        disabled={isPending}
                        placeholder="Add some details..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                {isEditing ? "Save changes" : "Create note"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
