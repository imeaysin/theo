import type { NoteResponse } from "@workspace/contracts"
import { dates } from "@/lib/dates"
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui-shadcn/components/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui-shadcn/components/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui-shadcn/components/select"
import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import {
  CircleAlertIcon,
  FileTextIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { NoteFormDialog } from "@/features/notes/components/note-form-dialog"
import { NotesTable } from "@/features/notes/components/notes-table"
import {
  useBulkDeleteNotesMutation,
  useDeleteNoteMutation,
  useNotesQuery,
} from "@/features/notes/hooks/use-notes"

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

const sortItems = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Title A–Z", value: "title-asc" },
  { label: "Title Z–A", value: "title-desc" },
] as const satisfies readonly { label: string; value: SortOption }[]

function sortNotes(items: NoteResponse[], sort: SortOption) {
  const sorted = [...items]
  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          dates.parseISO(a.updatedAt).getTime() -
          dates.parseISO(b.updatedAt).getTime()
      )
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          dates.parseISO(b.updatedAt).getTime() -
          dates.parseISO(a.updatedAt).getTime()
      )
  }
}

export function NotesPage() {
  const { data, isLoading, isError, error } = useNotesQuery()
  const deleteNote = useDeleteNoteMutation()
  const bulkDeleteNotes = useBulkDeleteNotesMutation()

  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("newest")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "single"; id: string; title: string }
    | { type: "bulk"; count: number }
    | null
  >(null)

  const filteredNotes = useMemo(() => {
    const items = data?.items ?? []
    const query = search.trim().toLowerCase()
    const filtered = query
      ? items.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.body.toLowerCase().includes(query)
        )
      : items
    return sortNotes(filtered, sort)
  }, [data?.items, search, sort])

  const isMutating = deleteNote.isPending || bulkDeleteNotes.isPending

  function openCreateDialog() {
    setEditingNote(null)
    setDialogOpen(true)
  }

  function openEditDialog(note: NoteResponse) {
    setEditingNote(note)
    setDialogOpen(true)
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
      return `"${deleteTarget.title}" will be permanently deleted. This action cannot be undone.`
    }
    return ""
  })()

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
            <p className="text-muted-foreground">
              Create and manage your notes.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <PlusIcon data-icon="inline-start" />
            New note
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search notes"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              value={search}
            />
          </InputGroup>
          <Select
            items={[...sortItems]}
            onValueChange={(value) => {
              if (value) setSort(value as SortOption)
            }}
            value={sort}
          >
            <SelectTrigger aria-label="Sort notes" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sortItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

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
              <Trash2Icon data-icon="inline-start" />
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
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full max-w-md" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

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
              <Button onClick={openCreateDialog}>
                <PlusIcon data-icon="inline-start" />
                Create note
              </Button>
            </EmptyContent>
          </Empty>
        ) : null}

        {showEmptySearch ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchIcon />
              </EmptyMedia>
              <EmptyTitle>No matching notes</EmptyTitle>
              <EmptyDescription>
                Nothing matches &ldquo;{search.trim()}&rdquo;. Try a different
                search term.
              </EmptyDescription>
            </EmptyHeader>
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
            onEdit={openEditDialog}
            onSelect={toggleSelection}
            onSelectAll={toggleSelectAll}
            selectedIds={selectedIds}
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
