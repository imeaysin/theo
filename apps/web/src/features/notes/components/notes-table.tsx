import type { NoteResponse } from "@workspace/contracts"
import { dates } from "@/lib/dates"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Checkbox } from "@workspace/ui-shadcn/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"

type NotesTableProps = {
  notes: NoteResponse[]
  disabled?: boolean
  selectedIds: Set<string>
  onDelete: (note: NoteResponse) => void
  onEdit: (note: NoteResponse) => void
  onSelect: (noteId: string, checked: boolean) => void
  onSelectAll: (checked: boolean, noteIds: string[]) => void
}

function NoteActions({
  note,
  disabled,
  onEdit,
  onDelete,
}: {
  note: NoteResponse
  disabled?: boolean
  onEdit: (note: NoteResponse) => void
  onDelete: (note: NoteResponse) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`Actions for ${note.title}`}
            disabled={disabled}
            size="icon-sm"
            type="button"
            variant="ghost"
          />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(note)}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onDelete(note)}
            variant="destructive"
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
  const allSelected = notes.length > 0 && selectedIds.size === notes.length
  const someSelected = selectedIds.size > 0 && !allSelected

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select all"
                checked={allSelected}
                disabled={notes.length === 0}
                indeterminate={someSelected}
                onCheckedChange={(checked) =>
                  onSelectAll(
                    checked === true,
                    notes.map((note) => note.id)
                  )
                }
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => (
            <TableRow
              data-state={selectedIds.has(note.id) ? "selected" : undefined}
              key={note.id}
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${note.title}`}
                  checked={selectedIds.has(note.id)}
                  onCheckedChange={(checked) =>
                    onSelect(note.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">
                <span className="block max-w-56 truncate">{note.title}</span>
              </TableCell>
              <TableCell>
                {note.body ? (
                  <span className="line-clamp-2 max-w-md whitespace-normal text-muted-foreground">
                    {note.body}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {dates.relativeTime(note.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <NoteActions
                    disabled={disabled}
                    note={note}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
