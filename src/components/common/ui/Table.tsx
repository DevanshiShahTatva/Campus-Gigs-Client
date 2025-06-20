import { cn } from "@/utils/constant";
import * as React from "react";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b border-gray-200", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn("border-t border-gray-200 bg-neutral-100/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-gray-200 transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 ", className)}
      {...props}
    />
  );
}

type TextAlign = "left" | "center" | "right";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  textAlign?: TextAlign;
}

export function TableHead({ className, children, textAlign = "left", ...props }: TableHeadProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[textAlign];

  const justifyClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[textAlign];

  return (
    <th className={cn("h-12 whitespace-nowrap px-4 align-middle [&:has([role=checkbox])]:pr-0", alignmentClass, className)} {...props}>
      <div className={cn("flex items-center gap-1 font-medium text-neutral-700", justifyClass)}>{children}</div>
    </th>
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle text-neutral-700 [&:has([role=checkbox])]:pr-0", className)} {...props} />;
}
