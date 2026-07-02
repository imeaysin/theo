import type { NoteResponse } from "@workspace/contracts"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useMemo, useState } from "react"
import { NotesTableRow } from "@/features/notes/components/notes-table-row"

const PAGE_SIZE = 10

type NotesTableProps = {
  notes: NoteResponse[]
  disabled?: boolean
  selectedIds: Set<string>
  onDelete: (note: NoteResponse) => void
  onEdit: (note: NoteResponse) => void
  onSelect: (noteId: string, checked: boolean) => void
  onSelectAll: (checked: boolean, noteIds: string[]) => void
}

export function NotesTable({
  notes,
  disabled,
  selectedIds,
  onDelete,
  onEdit,
  onSelect,
  onSelectAll,
}: NotesTableProps) {
  const [pageIndex, setPageIndex] = useState(0)

  const pageCount = Math.max(1, Math.ceil(notes.length / PAGE_SIZE))
  const safePageIndex = Math.min(pageIndex, pageCount - 1)

  const pageNotes = useMemo(() => {
    const start = safePageIndex * PAGE_SIZE
    return notes.slice(start, start + PAGE_SIZE)
  }, [notes, safePageIndex])

  const visibleIds = pageNotes.map((note) => note.id)
  const selectedVisibleCount = visibleIds.filter((id) =>
    selectedIds.has(id)
  ).length
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length
  const someVisibleSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length

  return (
    <Card className="p-0">
      <Table aria-label="Notes" variant="card">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select all notes on this page"
                checked={allVisibleSelected}
                disabled={disabled || pageNotes.length === 0}
                indeterminate={someVisibleSelected}
                onCheckedChange={(value) =>
                  onSelectAll(value === true, visibleIds)
                }
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageNotes.length > 0 ? (
            pageNotes.map((note) => (
              <NotesTableRow
                disabled={disabled}
                key={note.id}
                note={note}
                onDelete={onDelete}
                onEdit={onEdit}
                onSelect={(checked) => onSelect(note.id, checked)}
                selected={selectedIds.has(note.id)}
              />
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={5}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {notes.length > PAGE_SIZE ? (
          <TableFooter>
            <TableRow>
              <TableCell className="py-3" colSpan={5}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <strong className="font-medium text-foreground">
                      {safePageIndex * PAGE_SIZE + 1}–
                      {Math.min((safePageIndex + 1) * PAGE_SIZE, notes.length)}
                    </strong>{" "}
                    of{" "}
                    <strong className="font-medium text-foreground">
                      {notes.length}
                    </strong>{" "}
                    notes
                  </p>

                  <Pagination className="mx-0 w-auto justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className="sm:*:[svg]:hidden"
                          render={
                            <Button
                              disabled={safePageIndex === 0}
                              onClick={() =>
                                setPageIndex((current) => current - 1)
                              }
                              size="sm"
                              type="button"
                              variant="outline"
                            />
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          className="sm:*:[svg]:hidden"
                          render={
                            <Button
                              disabled={safePageIndex >= pageCount - 1}
                              onClick={() =>
                                setPageIndex((current) => current + 1)
                              }
                              size="sm"
                              type="button"
                              variant="outline"
                            />
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </Card>
  )
}
