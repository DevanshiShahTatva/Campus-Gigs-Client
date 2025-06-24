"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, SearchIcon } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/ui/Table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/ui/Pagination";
import { DynamicTableProps, SortOrder } from "@/utils/interface";
import Button from "./Button";
import useDebounce from "@/hooks/useDebounce";

export function DynamicTable<T extends { _id: string }>({
  data,
  columns,
  actions,
  totalPages,
  handlePageChange,
  currentPage,
  onSearchSort,
  defaultSortKey,
  defaultSortOrder = "asc",
  searchPlaceholder = "Search",
  children,
  title,
  onClickCreateButton,
  isCreateButtonDisabled,
}: DynamicTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [sortKey, setSortKey] = useState<keyof T | string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

  useEffect(() => {
    onSearchSort?.(debouncedSearch, sortKey as keyof T, sortOrder, 1);
  }, [debouncedSearch]);

  const handleSort = (key: keyof T) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);
    onSearchSort?.(searchTerm, key, newOrder, currentPage);
  };

  const visiblePages = useMemo((): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [totalPages, currentPage]);

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  return (
    <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-1">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[26px] mb-4 font-semibold leading-[30px] text-[var(--base)] whitespace-nowrap">{title}</h2>
      </div>

      <div className="flex w-full items-center gap-2 mb-4">
        <div className="relative w-full">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[var(--base)] text-[var(--text-dark)]"
          />
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {children}
        <Button
          variant="green"
          className="flex items-center h-[46px] disabled:opacity-50"
          onClick={onClickCreateButton}
          disabled={isCreateButtonDisabled}
        >
          <Plus size={20} />
          Add
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={col.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => col.sortable && handleSort(col.key)}
                  textAlign={col.textAlign ?? "left"}
                >
                  <span className="flex items-center gap-1">
                    {col.label} {col.sortable && getSortIcon(col.key)}
                  </span>
                </TableHead>
              ))}
              {actions && <TableHead textAlign="center">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="py-6 text-center text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={row._id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row, rowIndex) : String(row[col.key]) || "---"}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {data.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} size="sm" />
              </PaginationItem>

              {visiblePages.map((page, index) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink href="#" isActive={page === currentPage} onClick={() => handlePageChange(page)} size="sm">
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext href="#" onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} size="sm" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </main>
  );
}
