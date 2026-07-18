import type { NoteResponse } from "@workspace/contracts"
import type { RowSelectionState } from "@tanstack/react-table"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui-shadcn/components/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui-shadcn/components/alert-dialog"
import { Button } from "@workspace/ui-shadcn/components/button"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableSkeleton } from "@workspace/ui-shadcn/components/data-table-skeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui-shadcn/components/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@workspace/ui-shadcn/components/item"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import {
  CircleAlertIcon,
  FileTextIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { authClient } from "@workspace/auth/client"
import { PageHeader } from "@/components/page-header"
import { NoteFormDialog } from "@/features/notes/components/note-form-dialog"
import { getNotesColumns } from "@/features/notes/components/notes-columns"
import { matchesNoteSearch } from "@/features/notes/lib/matches-note-search"
import {
  useBulkDeleteNotesMutation,
  useDeleteNoteMutation,
  useNotesQuery,
} from "@/features/notes/hooks/use-notes"
import { useHasOrgPermission } from "@/hooks/use-org-permission"

export function NotesPage() {
  const { data: organization } = authClient.useActiveOrganization()
  const canCreate = useHasOrgPermission(
    { project: ["create"] },
    organization?.id
  )
  const canUpdate = useHasOrgPermission(
    { project: ["update"] },
    organization?.id
  )
  const canDelete = useHasOrgPermission(
    { project: ["delete"] },
    organization?.id
  )
  const { data, isLoading, isError, error } = useNotesQuery()
  const deleteNote = useDeleteNoteMutation()
  const bulkDeleteNotes = useBulkDeleteNotesMutation()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "single"; id: string; title: string }
    | { type: "bulk"; count: number }
    | null
  >(null)

  const notes = data?.items ?? []
  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  )

  const isMutating = deleteNote.isPending || bulkDeleteNotes.isPending

  function openCreateDialog() {
    setEditingNote(null)
    setDialogOpen(true)
  }

  function openEditDialog(note: NoteResponse) {
    setEditingNote(note)
    setDialogOpen(true)
  }

  const columns = useMemo(
    () =>
      getNotesColumns({
        canUpdate: canUpdate.data === true,
        canDelete: canDelete.data === true,
        disabled: isMutating,
        onEdit: openEditDialog,
        onDelete: (note) =>
          setDeleteTarget({
            type: "single",
            id: note.id,
            title: note.title,
          }),
      }),
    [canUpdate.data, canDelete.data, isMutating]
  )

  async function confirmDelete() {
    if (!deleteTarget) return

    if (deleteTarget.type === "single") {
      await deleteNote.mutateAsync(deleteTarget.id)
      setRowSelection((current) => {
        const next = { ...current }
        delete next[deleteTarget.id]
        return next
      })
    } else {
      await bulkDeleteNotes.mutateAsync({ ids: selectedIds })
      setRowSelection({})
    }

    setDeleteTarget(null)
  }

  const hasNotes = notes.length > 0
  const showEmptyInitial = !isLoading && !isError && !hasNotes

  const deleteDialogDescription = (() => {
    if (deleteTarget?.type === "bulk") {
      return `This permanently deletes ${deleteTarget.count} selected notes. This action cannot be undone.`
    }
    if (deleteTarget?.type === "single") {
      return `"${deleteTarget.title}" will be permanently deleted. This action cannot be undone.`
    }
    return ""
  })()

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          actions={
            canCreate.data ? (
              <Button onClick={openCreateDialog}>
                <PlusIcon data-icon="inline-start" />
                New
              </Button>
            ) : null
          }
          description="Create and manage your notes."
          title="Notes"
        />

        {selectedIds.length > 0 && canDelete.data ? (
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>{selectedIds.length} selected</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button
                disabled={isMutating}
                onClick={() =>
                  setDeleteTarget({ type: "bulk", count: selectedIds.length })
                }
                size="sm"
                variant="destructive"
              >
                <Trash2Icon data-icon="inline-start" />
                Delete selected
              </Button>
              <Button
                disabled={isMutating}
                onClick={() => setRowSelection({})}
                size="sm"
                variant="ghost"
              >
                Clear selection
              </Button>
            </ItemActions>
          </Item>
        ) : null}

        {isLoading ? <DataTableSkeleton columnCount={4} /> : null}

        {isError ? (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Could not load notes</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Something went wrong."}
            </AlertDescription>
          </Alert>
        ) : null}

        {showEmptyInitial ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon />
              </EmptyMedia>
              <EmptyTitle>No notes yet</EmptyTitle>
              <EmptyDescription>
                Create your first note or seed sample data with{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  pnpm --filter api seed
                </code>
                .
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {canCreate.data ? (
                <Button onClick={openCreateDialog}>
                  <PlusIcon data-icon="inline-start" />
                  Create note
                </Button>
              ) : (
                <EmptyDescription>
                  You can view notes but do not have permission to create them.
                </EmptyDescription>
              )}
            </EmptyContent>
          </Empty>
        ) : null}

        {!isLoading && !isError && hasNotes ? (
          <DataTable
            columns={columns}
            data={notes}
            filterFn={matchesNoteSearch}
            filterPlaceholder="Filter notes..."
            getRowId={(note) => note.id}
            initialSorting={[{ id: "updatedAt", desc: true }]}
            onRowSelectionChange={setRowSelection}
            rowSelection={rowSelection}
          />
        ) : null}
      </div>

      <NoteFormDialog
        note={editingNote}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
      />

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        open={deleteTarget !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === "bulk"
                ? "Delete selected notes?"
                : "Delete note?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isMutating}
              onClick={() => void confirmDelete()}
              variant="destructive"
            >
              {isMutating ? <Spinner data-icon="inline-start" /> : null}
              {deleteTarget?.type === "bulk"
                ? `Delete ${deleteTarget.count} notes`
                : "Delete note"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
