"use client"

import type { NoteResponse } from "@workspace/contracts"
import { relativeTime } from "@workspace/dates"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import type { MouseEvent, SyntheticEvent } from "react"

type NotesTableRowProps = {
  note: NoteResponse
  selected: boolean
  disabled?: boolean
  onDelete: (note: NoteResponse) => void
  onEdit: (note: NoteResponse) => void
  onSelect: (checked: boolean) => void
}

function stopRowClick(event: SyntheticEvent) {
  event.stopPropagation()
}

export function NotesTableRow({
  note,
  selected,
  disabled,
  onDelete,
  onEdit,
  onSelect,
}: NotesTableRowProps) {
  function handleRowClick(event: MouseEvent<HTMLTableRowElement>) {
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest("[data-no-row-click]")) return
    onEdit(note)
  }

  return (
    <TableRow
      className="cursor-pointer"
      data-state={selected ? "selected" : undefined}
      onClick={handleRowClick}
    >
      <TableCell
        className="w-px"
        data-no-row-click
        onClick={stopRowClick}
        onPointerDown={stopRowClick}
      >
        <Checkbox
          aria-label={`Select ${note.title}`}
          checked={selected}
          disabled={disabled}
          onCheckedChange={(value) => onSelect(value === true)}
        />
      </TableCell>

      <TableCell className="font-medium">
        <span className="block truncate">{note.title}</span>
      </TableCell>

      <TableCell className="align-top whitespace-normal">
        {note.body ? (
          <span className="line-clamp-2 text-muted-foreground">
            {note.body}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground tabular-nums">
        {relativeTime(note.updatedAt)}
      </TableCell>

      <TableCell
        className="w-px"
        data-no-row-click
        onClick={stopRowClick}
        onPointerDown={stopRowClick}
      >
        <div className="flex justify-end">
          <Menu>
            <MenuTrigger
              aria-label={`Actions for ${note.title}`}
              disabled={disabled}
              render={<Button size="icon-sm" type="button" variant="ghost" />}
            >
              <MoreHorizontalIcon className="size-4" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem onClick={() => onEdit(note)}>
                <PencilIcon className="size-4" />
                Edit
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={() => onDelete(note)}>
                <Trash2Icon className="size-4 text-destructive" />
                <span className="text-destructive">Delete</span>
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>
      </TableCell>
    </TableRow>
  )
}
