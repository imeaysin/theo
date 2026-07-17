"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "@workspace/ui-shadcn/components/data-table-pagination"
import { DataTableViewOptions } from "@workspace/ui-shadcn/components/data-table-view-options"
import { Input } from "@workspace/ui-shadcn/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import { cn } from "@workspace/ui-shadcn/lib/utils"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Filters a single column with TanStack's default includes match. */
  filterColumn?: string
  /**
   * Domain-friendly row filter. Prefer this over column `filterFn`s when
   * search spans multiple fields.
   */
  filterFn?: (row: TData, query: string) => boolean
  filterPlaceholder?: string
  className?: string
  getRowId?: (originalRow: TData, index: number, parent?: unknown) => string
  initialSorting?: SortingState
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  enableRowSelection?: boolean | ((row: { original: TData }) => boolean)
}

function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterFn,
  filterPlaceholder = "Filter...",
  className,
  getRowId,
  initialSorting = [],
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  enableRowSelection = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [uncontrolledRowSelection, setUncontrolledRowSelection] =
    React.useState<RowSelectionState>({})

  const rowSelection = rowSelectionProp ?? uncontrolledRowSelection
  const handleRowSelectionChange =
    onRowSelectionChange ?? setUncontrolledRowSelection

  const globalFilterFn = React.useMemo(() => {
    if (!filterFn) return undefined

    const matches: FilterFn<TData> = (...args) =>
      filterFn(args[0].original, String(args[2] ?? ""))

    return matches
  }, [filterFn])

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table
  const table = useReactTable({
    data,
    columns,
    getRowId,
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  })

  const showFilter = Boolean(filterFn || filterColumn)
  const filterValue = filterFn
    ? globalFilter
    : filterColumn
      ? ((table.getColumn(filterColumn)?.getFilterValue() as string) ?? "")
      : ""

  function handleFilterChange(value: string) {
    if (filterFn) {
      setGlobalFilter(value)
      return
    }
    if (filterColumn) {
      table.getColumn(filterColumn)?.setFilterValue(value)
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        {showFilter ? (
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(event) => handleFilterChange(event.target.value)}
            className="max-w-sm"
          />
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

export { DataTable }
export type { DataTableProps }
