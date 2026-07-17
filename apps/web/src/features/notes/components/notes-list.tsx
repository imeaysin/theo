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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui-shadcn/components/item"
import {
  ClockIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

type NotesListProps = {
  notes: NoteResponse[]
  disabled?: boolean
  canUpdate?: boolean
  canDelete?: boolean
  selectedIds: Set<string>
  onDelete: (note: NoteResponse) => void
  onEdit: (note: NoteResponse) => void
  onSelect: (noteId: string, checked: boolean) => void
  onSelectAll: (checked: boolean, noteIds: string[]) => void
}

function NoteActions({
  note,
  disabled,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: {
  note: NoteResponse
  disabled?: boolean
  canUpdate: boolean
  canDelete: boolean
  onEdit: (note: NoteResponse) => void
  onDelete: (note: NoteResponse) => void
}) {
  if (!canUpdate && !canDelete) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`Actions for ${note.title}`}
            disabled={disabled}
            size="icon-sm"
            type="button"
            variant="outline"
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
}

export function NotesList({
  notes,
  disabled,
  canUpdate = true,
  canDelete = true,
  selectedIds,
  onDelete,
  onEdit,
  onSelect,
  onSelectAll,
}: NotesListProps) {
  const allSelected = notes.length > 0 && selectedIds.size === notes.length
  const someSelected = selectedIds.size > 0 && !allSelected
  const showSelection = canDelete

  return (
    <div className="flex flex-col gap-3">
      {showSelection ? (
        <Item size="sm" variant="muted">
          <ItemMedia>
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
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Select all</ItemTitle>
          </ItemContent>
        </Item>
      ) : null}

      <ItemGroup>
        {notes.map((note) => (
          <Item
            key={note.id}
            role="listitem"
            variant={selectedIds.has(note.id) ? "muted" : "outline"}
          >
            {showSelection ? (
              <ItemMedia>
                <Checkbox
                  aria-label={`Select ${note.title}`}
                  checked={selectedIds.has(note.id)}
                  onCheckedChange={(checked) =>
                    onSelect(note.id, checked === true)
                  }
                />
              </ItemMedia>
            ) : null}
            <ItemContent>
              <ItemTitle>{note.title}</ItemTitle>
              {note.body ? (
                <ItemDescription>{note.body}</ItemDescription>
              ) : null}
              <ItemFooter>
                <ItemDescription className="flex items-center gap-1.5 [&_svg]:size-3.5">
                  <ClockIcon />
                  <time>{dates.relativeTime(note.updatedAt)}</time>
                </ItemDescription>
              </ItemFooter>
            </ItemContent>
            <ItemActions>
              {canUpdate ? (
                <Button
                  aria-label={`Edit ${note.title}`}
                  disabled={disabled}
                  onClick={() => onEdit(note)}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <PencilIcon />
                </Button>
              ) : null}
              <NoteActions
                canDelete={canDelete}
                canUpdate={canUpdate}
                disabled={disabled}
                note={note}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
