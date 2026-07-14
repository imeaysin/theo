"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"

const DEFAULT_PAGE_SIZE = 10

export type DataListColumn<T> = {
  key: string
  header: string
  className?: string
  render: (item: T) => React.ReactNode
}

export type DataListProps<T> = {
  items: T[]
  columns: DataListColumn<T>[]
  keyExtractor: (item: T) => string
  pageSize?: number

  onItemClick?: (item: T) => void

  selectable?: boolean
  selectedIds?: Set<string>
  onSelect?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean, ids: string[]) => void

  renderCard: (item: T, opts: { selected: boolean }) => React.ReactNode

  renderActions?: (item: T) => React.ReactNode

  className?: string
  emptyMessage?: string
}

function DataListPagination({
  pageIndex,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: {
  pageIndex: number
  pageCount: number
  total: number
  pageSize: number
  onPageChange: (index: number) => void
}) {
  const start = pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <p className="text-sm text-muted-foreground">
        <strong className="font-medium text-foreground">
          {start}–{end}
        </strong>{" "}
        of <strong className="font-medium text-foreground">{total}</strong>
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="sm:*:[svg]:hidden"
              render={
                <Button
                  disabled={pageIndex === 0}
                  onClick={() => onPageChange(pageIndex - 1)}
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
                  disabled={pageIndex >= pageCount - 1}
                  onClick={() => onPageChange(pageIndex + 1)}
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
  )
}

export function DataList<T>({
  items,
  columns,
  keyExtractor,
  pageSize = DEFAULT_PAGE_SIZE,
  onItemClick,
  selectable = false,
  selectedIds,
  onSelect,
  onSelectAll,
  renderCard,
  renderActions,
  className,
  emptyMessage = "No results.",
}: DataListProps<T>) {
  const isMobile = useMediaQuery("max-md")
  const [pageIndex, setPageIndex] = useState(0)

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const safePageIndex = Math.min(pageIndex, pageCount - 1)

  const pageItems = useMemo(() => {
    const start = safePageIndex * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePageIndex, pageSize])

  const visibleIds = pageItems.map(keyExtractor)
  const selectedVisibleCount = visibleIds.filter(
    (id) => selectedIds?.has(id) ?? false
  ).length
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length
  const someVisibleSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length

  const showPagination = items.length > pageSize

  const pagination = showPagination ? (
    <DataListPagination
      onPageChange={setPageIndex}
      pageCount={pageCount}
      pageIndex={safePageIndex}
      pageSize={pageSize}
      total={items.length}
    />
  ) : null

  if (isMobile) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {selectable && onSelectAll && visibleIds.length > 0 ? (
          <label className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
            <Checkbox
              aria-label="Select all on this page"
              checked={allVisibleSelected}
              indeterminate={someVisibleSelected}
              onCheckedChange={(value) =>
                onSelectAll(value === true, visibleIds)
              }
            />
            Select all
          </label>
        ) : null}

        {pageItems.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          pageItems.map((item) => {
            const id = keyExtractor(item)
            const selected = selectedIds?.has(id) ?? false
            return (
              <div key={id} className="relative">
                {selectable && onSelect ? (
                  <div className="absolute top-3 left-3 z-10">
                    <Checkbox
                      aria-label="Select item"
                      checked={selected}
                      onCheckedChange={(value) => onSelect(id, value === true)}
                    />
                  </div>
                ) : null}
                {renderCard(item, { selected })}
              </div>
            )
          })
        )}

        {pagination ? <Card className="p-0">{pagination}</Card> : null}
      </div>
    )
  }

  return (
    <Card className={cn("flex flex-col p-0", className)}>
      <div className="min-h-0 flex-1 overflow-auto">
        <Table aria-label="Data list" variant="card">
          <TableHeader>
            <TableRow>
              {selectable ? (
                <TableHead>
                  <Checkbox
                    aria-label="Select all on this page"
                    checked={allVisibleSelected}
                    disabled={pageItems.length === 0}
                    indeterminate={someVisibleSelected}
                    onCheckedChange={(value) =>
                      onSelectAll?.(value === true, visibleIds)
                    }
                  />
                </TableHead>
              ) : null}
              {columns.map((col) => (
                <TableHead className={col.className} key={col.key}>
                  {col.header}
                </TableHead>
              ))}
              {renderActions ? (
                <TableHead className="text-end">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (renderActions ? 1 : 0)
                  }
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((item) => {
                const id = keyExtractor(item)
                const selected = selectedIds?.has(id) ?? false
                return (
                  <TableRow
                    className={onItemClick ? "cursor-pointer" : undefined}
                    data-state={selected ? "selected" : undefined}
                    key={id}
                    onClick={(e) => {
                      if (!onItemClick) return
                      const target = e.target
                      if (target instanceof Element) {
                        if (target.closest("[data-no-row-click]")) return
                      }
                      onItemClick(item)
                    }}
                  >
                    {selectable && onSelect ? (
                      <TableCell
                        className="w-px"
                        data-no-row-click
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          aria-label="Select item"
                          checked={selected}
                          onCheckedChange={(value) =>
                            onSelect(id, value === true)
                          }
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((col) => (
                      <TableCell className={col.className} key={col.key}>
                        {col.render(item)}
                      </TableCell>
                    ))}
                    {renderActions ? (
                      <TableCell
                        className="w-px"
                        data-no-row-click
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end">
                          {renderActions(item)}
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination ? (
        <div className="shrink-0 border-t">{pagination}</div>
      ) : null}
    </Card>
  )
}
