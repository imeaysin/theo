"use client"

import type { ComponentProps } from "react"

import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import { cn } from "@workspace/ui-shadcn/lib/utils"

type DataTableSkeletonProps = ComponentProps<"div"> & {
  columnCount: number
  rowCount?: number
  withToolbar?: boolean
}

function DataTableSkeleton({
  columnCount,
  rowCount = 5,
  withToolbar = true,
  className,
  ...props
}: DataTableSkeletonProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-4", className)}
      data-slot="data-table-skeleton"
      {...props}
    >
      {withToolbar ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="ml-auto hidden h-8 w-20 lg:block" />
        </div>
      ) : null}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { DataTableSkeleton }
