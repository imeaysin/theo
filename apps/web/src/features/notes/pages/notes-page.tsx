import type { NoteResponse } from "@workspace/contracts"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Filter } from "@workspace/ui/components/filter"
import {
  ShellMain,
  shellPageStackClassName,
} from "@workspace/ui/components/shell"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useDebouncedValue } from "@workspace/ui/hooks/use-debounced-value"
import {
  CircleAlertIcon,
  FileTextIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { NoteFormSheet } from "@/features/notes/components/note-form-sheet"
import { NotesTable } from "@/features/notes/components/notes-table"
import {
  useBulkDeleteNotesMutation,
  useDeleteNoteMutation,
  useNotesQuery,
} from "@/features/notes/hooks/use-notes"

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
]

function sortNotes(items: NoteResponse[], sort: SortOption) {
  const sorted = [...items]
  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      )
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
  }
}

export function NotesPage() {
  const { data, isLoading, isError, error } = useNotesQuery()
  const deleteNote = useDeleteNoteMutation()
  const bulkDeleteNotes = useBulkDeleteNotesMutation()

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search)
  const [sort, setSort] = useState<SortOption>("newest")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "single"; id: string; title: string }
    | { type: "bulk"; count: number }
    | null
  >(null)

  const filteredNotes = useMemo(() => {
    const items = data?.items ?? []
    const query = debouncedSearch.trim().toLowerCase()
    const filtered = query
      ? items.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.body.toLowerCase().includes(query)
        )
      : items
    return sortNotes(filtered, sort)
  }, [data?.items, debouncedSearch, sort])

  const isMutating = deleteNote.isPending || bulkDeleteNotes.isPending

  function openCreateSheet() {
    setEditingNote(null)
    setSheetOpen(true)
  }

  function openEditSheet(note: NoteResponse) {
    setEditingNote(note)
    setSheetOpen(true)
  }

  function toggleSelection(noteId: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) next.add(noteId)
      else next.delete(noteId)
      return next
    })
  }

  function toggleSelectAll(checked: boolean, noteIds: string[]) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) {
        for (const id of noteIds) next.add(id)
      } else {
        for (const id of noteIds) next.delete(id)
      }
      return next
    })
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    if (deleteTarget.type === "single") {
      await deleteNote.mutateAsync(deleteTarget.id)
    } else {
      await bulkDeleteNotes.mutateAsync({ ids: [...selectedIds] })
      setSelectedIds(new Set())
    }

    setDeleteTarget(null)
  }

  const hasNotes = (data?.items.length ?? 0) > 0
  const showEmptySearch =
    !isLoading && !isError && hasNotes && filteredNotes.length === 0
  const showEmptyInitial = !isLoading && !isError && !hasNotes

  const deleteDialogDescription = (() => {
    if (deleteTarget?.type === "bulk") {
      return `This permanently deletes ${deleteTarget.count} selected notes. This action cannot be undone.`
    }
    if (deleteTarget?.type === "single") {
      return `“${deleteTarget.title}” will be permanently deleted. This action cannot be undone.`
    }
    return ""
  })()

  return (
    <>
      <ShellMain
        header={{
          heading: "Notes",
          subtitle:
            "Create, search, edit, and manage notes synced with the NestJS API.",
          cta: (
            <Button onClick={openCreateSheet}>
              <PlusIcon className="size-4" />
              New note
            </Button>
          ),
        }}
      >
        <div className={shellPageStackClassName}>
          <Filter>
            <Filter.Search
              aria-label="Search notes"
              onValueChange={setSearch}
              placeholder="Search notes…"
              value={search}
            />
            <Filter.Select
              aria-label="Sort notes"
              onValueChange={setSort}
              options={sortOptions}
              value={sort}
            />
          </Filter>

          {selectedIds.size > 0 ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
              <p className="text-sm font-medium">{selectedIds.size} selected</p>
              <Button
                disabled={isMutating}
                onClick={() =>
                  setDeleteTarget({ type: "bulk", count: selectedIds.size })
                }
                size="sm"
                variant="destructive"
              >
                <Trash2Icon className="size-4" />
                Delete selected
              </Button>
              <Button
                disabled={isMutating}
                onClick={() => setSelectedIds(new Set())}
                size="sm"
                variant="ghost"
              >
                Clear selection
              </Button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="overflow-hidden rounded-lg border">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="flex items-center gap-3 border-b px-4 py-4 last:border-b-0"
                  key={index}
                >
                  <Skeleton className="size-4 rounded-sm" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full max-w-md" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {isError ? (
            <Alert variant="error">
              <CircleAlertIcon />
              <AlertTitle>Could not load notes</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Something went wrong."}
              </AlertDescription>
            </Alert>
          ) : null}

          {showEmptyInitial ? (
            <Empty className="rounded-lg border border-dashed">
              <EmptyContent>
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
                <Button onClick={openCreateSheet}>
                  <PlusIcon className="size-4" />
                  Create note
                </Button>
              </EmptyContent>
            </Empty>
          ) : null}

          {showEmptySearch ? (
            <Empty className="rounded-lg border border-dashed">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <SearchIcon />
                </EmptyMedia>
                <EmptyTitle>No matching notes</EmptyTitle>
                <EmptyDescription>
                  Nothing matches &ldquo;{debouncedSearch.trim()}&rdquo;. Try a
                  different search term.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : null}

          {!isLoading && !isError && filteredNotes.length > 0 ? (
            <NotesTable
              disabled={isMutating}
              notes={filteredNotes}
              onDelete={(note) =>
                setDeleteTarget({
                  type: "single",
                  id: note.id,
                  title: note.title,
                })
              }
              onEdit={openEditSheet}
              onSelect={toggleSelection}
              onSelectAll={toggleSelectAll}
              selectedIds={selectedIds}
            />
          ) : null}
        </div>
      </ShellMain>

      <NoteFormSheet
        note={editingNote}
        onOpenChange={setSheetOpen}
        open={sheetOpen}
      />

      <ConfirmDialog
        confirmLabel={
          deleteTarget?.type === "bulk"
            ? `Delete ${deleteTarget.count} notes`
            : "Delete note"
        }
        description={deleteDialogDescription}
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        open={deleteTarget !== null}
        pending={isMutating}
        title={
          deleteTarget?.type === "bulk"
            ? "Delete selected notes?"
            : "Delete note?"
        }
        variant="destructive"
      />
    </>
  )
}
