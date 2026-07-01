"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "./empty-state"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react"

interface Column<T> {
  header: React.ReactNode
  accessorKey: keyof T | string
  cell?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  pagination?: {
    pageIndex: number
    pageCount: number
    canPreviousPage: boolean
    canNextPage: boolean
    previousPage: () => void
    nextPage: () => void
  }
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "No results found",
  emptyDescription = "There is no data to display in this list.",
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/75 dark:bg-neutral-900/50 hover:bg-transparent">
              {columns.map((column, idx) => (
                <TableHead key={idx} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 p-0">
                  <div className="p-4">
                    <EmptyState
                      icon={Inbox}
                      title={emptyTitle}
                      description={emptyDescription}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIdx) => (
                <TableRow key={rowIdx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                  {columns.map((column, colIdx) => {
                    const value = column.cell
                      ? column.cell(item)
                      : (item[column.accessorKey as keyof T] as React.ReactNode)
                    return (
                      <TableCell key={colIdx} className={column.className}>
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-neutral-500">
            Page {pagination.pageIndex + 1} of {pagination.pageCount || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={pagination.previousPage}
              disabled={!pagination.canPreviousPage || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={pagination.nextPage}
              disabled={!pagination.canNextPage || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
