import type { NoteResponse } from "@workspace/contracts"
import { relativeTime } from "@workspace/dates"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import {
  DataList,
  type DataListColumn,
} from "@workspace/ui/components/data-list"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/ui/components/menu"
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

const columns: DataListColumn<NoteResponse>[] = [
  {
    key: "title",
    header: "Title",
    className: "font-medium",
    render: (note) => <span className="block truncate">{note.title}</span>,
  },
  {
    key: "body",
    header: "Preview",
    className: "whitespace-normal",
    render: (note) =>
      note.body ? (
        <span className="line-clamp-2 text-muted-foreground">{note.body}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "updatedAt",
    header: "Updated",
    className: "text-muted-foreground tabular-nums",
    render: (note) => relativeTime(note.updatedAt),
  },
]

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
  )
}

function NoteCard({
  note,
  selected,
  disabled,
  onEdit,
  onDelete,
}: {
  note: NoteResponse
  selected: boolean
  disabled?: boolean
  onEdit: (note: NoteResponse) => void
  onDelete: (note: NoteResponse) => void
}) {
  return (
    <Card
      className={["gap-0 p-0 transition-colors", selected && "ring-2 ring-ring"]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        className="flex min-w-0 flex-1 flex-col gap-1 p-4 ps-10 text-left"
        onClick={() => onEdit(note)}
        type="button"
      >
        <span className="truncate text-sm font-medium">{note.title}</span>
        {note.body ? (
          <span className="line-clamp-2 text-xs text-muted-foreground">
            {note.body}
          </span>
        ) : null}
      </button>
      <div className="flex items-center justify-between border-t px-4 py-2">
        <span className="text-xs text-muted-foreground tabular-nums">
          {relativeTime(note.updatedAt)}
        </span>
        <NoteActions
          disabled={disabled}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </Card>
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
  return (
    <DataList
      columns={columns}
      items={notes}
      keyExtractor={(note) => note.id}
      onItemClick={onEdit}
      onSelect={onSelect}
      onSelectAll={onSelectAll}
      renderActions={(note) => (
        <NoteActions
          disabled={disabled}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      renderCard={(note, { selected }) => (
        <NoteCard
          disabled={disabled}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
          selected={selected}
        />
      )}
      selectable
      selectedIds={selectedIds}
    />
  )
}
