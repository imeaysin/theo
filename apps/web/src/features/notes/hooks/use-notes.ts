import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  CreateNoteSchema,
  NotesListResponseSchema,
  type CreateNoteInput,
  type NoteResponse,
} from "@workspace/contracts"
import { apiFetch } from "@/lib/api"

export const notesQueryKey = ["notes"] as const

export function useNotesQuery() {
  return useQuery({
    queryKey: notesQueryKey,
    queryFn: async () => {
      const data = await apiFetch<unknown>("/v1/notes")
      return NotesListResponseSchema.parse(data)
    },
  })
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const body = CreateNoteSchema.parse(input)
      const data = await apiFetch<unknown>("/v1/notes", {
        method: "POST",
        body: JSON.stringify(body),
      })
      return data as NoteResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey })
    },
  })
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: string) =>
      apiFetch<void>(`/v1/notes/${noteId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey })
    },
  })
}
