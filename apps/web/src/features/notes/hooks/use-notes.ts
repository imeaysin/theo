import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useActiveOrganizationId } from "@workspace/auth/react"
import {
  BulkDeleteNotesSchema,
  CreateNoteSchema,
  NoteResponseSchema,
  NotesListResponseSchema,
  UpdateNoteSchema,
  type BulkDeleteNotesInput,
  type CreateNoteInput,
  type NoteResponse,
  type NotesListResponse,
  type UpdateNoteInput,
} from "@workspace/contracts"
import { toastManager } from "@workspace/ui-shadcn/components/toast"
import { apiRoutes } from "@/config/api-routes"
import { apiFetch } from "@/lib/api"

export const notesQueryKey = (organizationId?: string | null) =>
  ["notes", organizationId ?? null] as const

type PatchNotesListOptions = {
  queryClient: ReturnType<typeof useQueryClient>
  organizationId: string | null | undefined
  updater: (items: NoteResponse[]) => NoteResponse[]
}

function patchNotesList({
  queryClient,
  organizationId,
  updater,
}: PatchNotesListOptions) {
  queryClient.setQueryData<NotesListResponse>(
    notesQueryKey(organizationId),
    (current) => {
      if (!current) return current
      return { items: updater(current.items) }
    }
  )
}

const notesErrorToast = {
  description: "Please try again.",
  type: "error" as const,
}

export function useNotesQuery() {
  const organizationId = useActiveOrganizationId()

  return useQuery({
    queryKey: notesQueryKey(organizationId),
    queryFn: async () => {
      const data = await apiFetch<unknown>(apiRoutes.notes)
      return NotesListResponseSchema.parse(data)
    },
    enabled: !!organizationId,
  })
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()
  const organizationId = useActiveOrganizationId()

  return useMutation({
    mutationFn: (input: CreateNoteInput) =>
      toastManager.promise(
        (async () => {
          const body = CreateNoteSchema.parse(input)
          const data = await apiFetch<unknown>(apiRoutes.notes, {
            method: "POST",
            body: JSON.stringify(body),
          })
          return NoteResponseSchema.parse(data)
        })(),
        {
          error: {
            ...notesErrorToast,
            title: "Could not create note",
            description: "Please try again.",
          },
          loading: {
            description: "Saving your note.",
            title: "Creating note…",
            type: "loading",
          },
          success: {
            title: "Note created",
            description: "Your note has been created.",
            type: "success",
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesQueryKey(organizationId),
      })
    },
  })
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()
  const organizationId = useActiveOrganizationId()

  return useMutation({
    mutationFn: ({
      noteId,
      input,
    }: {
      noteId: string
      input: UpdateNoteInput
    }) =>
      toastManager.promise(
        (async () => {
          const body = UpdateNoteSchema.parse(input)
          const data = await apiFetch<unknown>(apiRoutes.note(noteId), {
            method: "PATCH",
            body: JSON.stringify(body),
          })
          return NoteResponseSchema.parse(data)
        })(),
        {
          error: {
            ...notesErrorToast,
            title: "Could not update note",
          },
          loading: {
            description: "Saving your changes.",
            title: "Updating note…",
            type: "loading",
          },
          success: {
            title: "Note updated",
            type: "success",
          },
        }
      ),
    onSuccess: (note) => {
      patchNotesList({
        queryClient,
        organizationId,
        updater: (items) =>
          items.map((item) => (item.id === note.id ? note : item)),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notesQueryKey(organizationId),
      })
    },
  })
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()
  const organizationId = useActiveOrganizationId()

  return useMutation({
    mutationFn: (noteId: string) =>
      toastManager.promise(
        apiFetch<void>(apiRoutes.note(noteId), { method: "DELETE" }),
        {
          error: {
            ...notesErrorToast,
            title: "Could not delete note",
          },
          loading: {
            title: "Deleting note…",
            type: "loading",
          },
          success: {
            title: "Note deleted",
            type: "success",
          },
        }
      ),
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({
        queryKey: notesQueryKey(organizationId),
      })
      patchNotesList({
        queryClient,
        organizationId,
        updater: (items) => items.filter((item) => item.id !== noteId),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notesQueryKey(organizationId),
      })
    },
  })
}

export function useBulkDeleteNotesMutation() {
  const queryClient = useQueryClient()
  const organizationId = useActiveOrganizationId()

  return useMutation({
    mutationFn: (input: BulkDeleteNotesInput) =>
      toastManager.promise(
        (async () => {
          const body = BulkDeleteNotesSchema.parse(input)
          return apiFetch<{ deletedCount: number }>(apiRoutes.notesBulkDelete, {
            method: "POST",
            body: JSON.stringify(body),
          })
        })(),
        {
          error: {
            ...notesErrorToast,
            title: "Could not delete notes",
          },
          loading: {
            title: "Deleting notes…",
            type: "loading",
          },
          success: (result) => ({
            title:
              result.deletedCount === 1
                ? "1 note deleted"
                : `${result.deletedCount} notes deleted`,
            type: "success",
          }),
        }
      ),
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: notesQueryKey(organizationId),
      })
      const ids = new Set(input.ids)
      patchNotesList({
        queryClient,
        organizationId,
        updater: (items) => items.filter((item) => !ids.has(item.id)),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notesQueryKey(organizationId),
      })
    },
  })
}
