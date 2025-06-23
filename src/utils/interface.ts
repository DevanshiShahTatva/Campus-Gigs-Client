export type SortOrder = "asc" | "desc";

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
}

export interface DynamicTableProps<T extends { id: number | string }> {
  data: T[];
  columns: ColumnConfig<T>[];
  actions?: (row: T) => React.ReactNode;

  // Pagination
  totalPages: number;
  handlePageChange: (page: number) => void;
  currentPage: number;

  // Optional search/sort handlers
  onSearchSort?: (search: string, sortKey: keyof T, sortOrder: SortOrder, page: number) => void;
  
  // Optional overrides
  defaultSortKey?: keyof T;
  defaultSortOrder?: SortOrder;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  title: string;
  onClickCreateButton: () => void;
}
export interface ISubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  isPro: boolean;
  mostPopular: boolean;
  buttonText: string;
  icon: string;
  rolesAllowed: string[];
  maxGigsPerMonth: number;
  maxBidsPerMonth: number;
  features: string[];
  createdAt: string;
  canGetBadges: boolean;
}

export interface Data {
  id: string;
  name: string;
  description: string;
  create_at: string;
  updated_at: string;
}

export interface Tire {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
