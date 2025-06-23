import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum ROLE {
  USER = "user",
  ADMIN = "admin",
}

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  total: 1,
  totalPages: 1,
};
