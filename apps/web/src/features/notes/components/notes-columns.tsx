"use client"

import type { NoteResponse } from "@workspace/contracts"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { dates } from "@/lib/dates"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Checkbox } from "@workspace/ui-shadcn/components/checkbox"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"

type NotesColumnsOptions = {
  canUpdate: boolean
  canDelete: boolean
  disabled?: boolean
  onEdit: (note: NoteResponse) => void
  onDelete: (note: NoteResponse) => void
}

export function getNotesColumns({
  canUpdate,
  canDelete,
  disabled,
  onEdit,
  onDelete,
}: NotesColumnsOptions): ColumnDef<NoteResponse>[] {
  const columns: ColumnDef<NoteResponse>[] = []

  if (canDelete) {
    columns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(value === true)
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select ${row.original.title}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect() || disabled}
          onCheckedChange={(value) => row.toggleSelected(value === true)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    })
  }

  columns.push(
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <div className="max-w-56 truncate font-medium">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "body",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Body" />
      ),
      cell: ({ row }) => {
        const body = row.getValue("body") as string
        return (
          <div className="max-w-md truncate text-muted-foreground">
            {body || "—"}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated" />
      ),
      cell: ({ row }) => (
        <time className="whitespace-nowrap text-muted-foreground">
          {dates.relativeTime(row.getValue("updatedAt"))}
        </time>
      ),
    }
  )

  if (canUpdate || canDelete) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const note = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label={`Actions for ${note.title}`}
                  disabled={disabled}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate ? (
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onEdit(note)}>
                    <PencilIcon />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : null}
              {canUpdate && canDelete ? <DropdownMenuSeparator /> : null}
              {canDelete ? (
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => onDelete(note)}
                    variant="destructive"
                  >
                    <Trash2Icon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}
