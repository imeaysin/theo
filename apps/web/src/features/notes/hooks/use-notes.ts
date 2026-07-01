import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useActiveOrganizationId } from "@workspace/auth/react"
import {
  BulkDeleteNotesSchema,
  CreateNoteSchema,
  NotesListResponseSchema,
  UpdateNoteSchema,
  type BulkDeleteNotesInput,
  type CreateNoteInput,
  type NoteResponse,
  type NotesListResponse,
  type UpdateNoteInput,
} from "@workspace/contracts"
import { toastManager } from "@workspace/ui/components/toast"
import { apiRoutes } from "@/config/api-routes"
import { apiFetch } from "@/lib/api"

export const notesQueryKey = (organizationId?: string | null) =>
  ["notes", organizationId ?? null] as const

interface PatchNotesListOptions {
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
    mutationFn: async (input: CreateNoteInput) => {
      const body = CreateNoteSchema.parse(input)
      const data = await apiFetch<unknown>(apiRoutes.notes, {
        method: "POST",
        body: JSON.stringify(body),
      })
      return data as NoteResponse
    },
    onSuccess: () => {
      toastManager.add({
        title: "Note created",
        type: "success",
      })
      queryClient.invalidateQueries({
        queryKey: notesQueryKey(organizationId),
      })
    },
    onError: () => {
      toastManager.add({
        title: "Could not create note",
        type: "error",
      })
    },
  })
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()
  const organizationId = useActiveOrganizationId()

  return useMutation({
    mutationFn: async ({
      noteId,
      input,
    }: {
      noteId: string
      input: UpdateNoteInput
    }) => {
      const body = UpdateNoteSchema.parse(input)
      const data = await apiFetch<unknown>(apiRoutes.note(noteId), {
        method: "PATCH",
        body: JSON.stringify(body),
      })
      return data as NoteResponse
    },
    onSuccess: (note) => {
      patchNotesList({
        queryClient,
        organizationId,
        updater: (items) =>
          items.map((item) => (item.id === note.id ? note : item)),
      })
      toastManager.add({
        title: "Note updated",
        type: "success",
      })
    },
    onError: () => {
      toastManager.add({
        title: "Could not update note",
        type: "error",
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
      apiFetch<void>(apiRoutes.note(noteId), { method: "DELETE" }),
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
    onSuccess: () => {
      toastManager.add({
        title: "Note deleted",
        type: "success",
      })
    },
    onError: () => {
      toastManager.add({
        title: "Could not delete note",
        type: "error",
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
    mutationFn: async (input: BulkDeleteNotesInput) => {
      const body = BulkDeleteNotesSchema.parse(input)
      return apiFetch<{ deletedCount: number }>(apiRoutes.notesBulkDelete, {
        method: "POST",
        body: JSON.stringify(body),
      })
    },
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
    onSuccess: (result) => {
      toastManager.add({
        title:
          result.deletedCount === 1
            ? "1 note deleted"
            : `${result.deletedCount} notes deleted`,
        type: "success",
      })
    },
    onError: () => {
      toastManager.add({
        title: "Could not delete notes",
        type: "error",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notesQueryKey(organizationId),
      })
    },
  })
}
