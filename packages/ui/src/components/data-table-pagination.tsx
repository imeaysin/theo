"use client"

import type { Table } from "@tanstack/react-table"
import type { ComponentProps } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 40, 50] as const

type DataTablePaginationProps<TData> = ComponentProps<"div"> & {
  table: Table<TData>
  pageSizeOptions?: readonly number[]
}

function getPageItems(pageIndex: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i)
  }

  const current = pageIndex
  const items: (number | "ellipsis-start" | "ellipsis-end")[] = [0]

  if (current > 2) {
    items.push("ellipsis-start")
  }

  const start = Math.max(1, current - 1)
  const end = Math.min(pageCount - 2, current + 1)

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (current < pageCount - 3) {
    items.push("ellipsis-end")
  }

  items.push(pageCount - 1)
  return items
}

function DataTablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount()
  const { pageIndex, pageSize } = table.getState().pagination
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const filteredCount = table.getFilteredRowModel().rows.length
  const pageItems = getPageItems(pageIndex, pageCount)

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 px-2 sm:flex-row",
        className
      )}
      data-slot="data-table-pagination"
      {...props}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount} of {filteredCount} row(s) selected.
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            items={pageSizeOptions.map((size) => ({
              label: String(size),
              value: String(size),
            }))}
            value={String(pageSize)}
            onValueChange={(value) => {
              if (value) table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger
              aria-label="Rows per page"
              className="w-18"
              size="sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={!table.getCanPreviousPage()}
                className={cn(
                  !table.getCanPreviousPage() &&
                    "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  table.previousPage()
                }}
              />
            </PaginationItem>
            {pageItems.map((item) =>
              item === "ellipsis-start" || item === "ellipsis-end" ? (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === pageIndex}
                    onClick={(event) => {
                      event.preventDefault()
                      table.setPageIndex(item)
                    }}
                  >
                    {item + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={!table.getCanNextPage()}
                className={cn(
                  !table.getCanNextPage() && "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  table.nextPage()
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export { DataTablePagination }
