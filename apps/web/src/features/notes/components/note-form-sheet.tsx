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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui-shadcn/components/sheet"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit note" : "New note"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the title or body of your note."
              : "Add a title and optional details."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto py-6"
          >
            <div className="flex-1 space-y-4 px-1">
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
            <SheetFooter>
              <Button disabled={isPending} type="submit" className="w-full">
                {isEditing ? "Save changes" : "Create note"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
