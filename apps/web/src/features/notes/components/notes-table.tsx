import { useMemo } from "react"
import type { NoteResponse } from "@workspace/contracts"
import { dates } from "@/lib/dates"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Checkbox } from "@workspace/ui-shadcn/components/checkbox"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { type ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
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
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Actions for ${note.title}`}
          disabled={disabled}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(note)}>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(note)}>
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
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
  const columns = useMemo<ColumnDef<NoteResponse>[]>(
    () => [
      {
        id: "select",
        header: () => {
          let checkedState: boolean | "indeterminate" = false
          if (notes.length > 0 && selectedIds.size === notes.length) {
            checkedState = true
          } else if (selectedIds.size > 0) {
            checkedState = "indeterminate"
          }

          return (
            <Checkbox
              checked={checkedState}
              onCheckedChange={(value) =>
                onSelectAll(
                  value === true,
                  notes.map((n) => n.id)
                )
              }
              aria-label="Select all"
              disabled={notes.length === 0}
            />
          )
        },
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.has(row.original.id)}
            onCheckedChange={(value) =>
              onSelect(row.original.id, value === true)
            }
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="block truncate font-medium">
            {row.original.title}
          </span>
        ),
      },
      {
        accessorKey: "body",
        header: "Preview",
        cell: ({ row }) =>
          row.original.body ? (
            <span className="line-clamp-2 whitespace-normal text-muted-foreground">
              {row.original.body}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {dates.relativeTime(row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <NoteActions
              disabled={disabled}
              note={row.original}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        ),
      },
    ],
    [notes, selectedIds, disabled, onSelect, onSelectAll, onEdit, onDelete]
  )

  return <DataTable columns={columns} data={notes} />
}
