"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../common/ui/Table"

interface TableSkeletonProps {
  columnCount?: number
  rowCount?: number
  actionButtonCount?: number // Number of buttons in "Actions" column
  showSearch?: boolean
  showTopButton?: boolean
}

export default function TableSkeleton({
  columnCount = 4,
  rowCount = 5,
  actionButtonCount = 0,
  showSearch = false,
  showTopButton = false,
}: TableSkeletonProps) {
  const columns = Array.from({ length: columnCount })
  const rows = Array.from({ length: rowCount })

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-4">
      {/* Search & Add Button Skeleton */}
      {(showSearch || showTopButton) && (
        <div className="flex w-full items-center gap-2 mb-4">
          {showSearch && <Skeleton className="h-10 w-full rounded-md" />}
          {showTopButton && (
            <Skeleton className="h-10 w-24 rounded-md" />
          )}
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {columns.map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
            {actionButtonCount > 0 && <TableHead><Skeleton className="h-4 w-20" /></TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                </TableCell>
              ))}
              {actionButtonCount > 0 && (
                <TableCell>
                  <div className="flex gap-2">
                    {Array.from({ length: actionButtonCount }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-6 rounded-md" />
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
