export type SortOrder = "asc" | "desc";

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
}

export interface DynamicTableProps<T extends { _id: string }> {
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
  isCreateButtonDisabled?: boolean;
  hasDeleteButton?: boolean;
  loading?: boolean;
}
export interface ISubscriptionPlan {
  _id: string;
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

export interface ISubscriptionPlanApiResponse {
  status: number;
  message: string;
  data: ISubscriptionPlan[];
  meta: IPagination;
}

export interface IPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface IPlanApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: ISubscriptionPlan[];
}

export interface IDropdownOption {
  label: string,
  id: string
}

export interface Tire {
  _id: string;
  name: string;
  categories: { _id: string, name: string}[];
}

export interface GigCategory {
  _id: string;
  name: string;
  description: string;
  isUsed: boolean;
}
