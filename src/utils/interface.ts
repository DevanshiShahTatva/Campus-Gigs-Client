export type SortOrder = "asc" | "desc";

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
}

export interface DynamicTableProps<T extends { id: number }> {
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
  id: number;
  name: string;
  description: string;
  price: number;
  is_pro: boolean;
  most_popular: boolean;
  button_text: string;
  icon: string;
  roles_allowed: string[];
  max_gig_per_month: number;
  max_bid_per_month: number;
  features: string[];
  created_at: string;
  can_get_badge: boolean;
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
  label: string;
  id: number;
}

export interface Tire {
  id: number;
  name: string;
  description: string;
}

export interface GigCategory {
  id: number;
  name: string;
  tire_id: number;
  tire: {
    id: number;
    name: string;
  };
}

export interface ISubscriptionCurrentPlanApiResponse {
  status: number;
  message: string;
  data: {
    id: number;
    user_id: number;
    subscription_plan_id: number;
    price: number;
    status: string;
    subscription_expiry_date: string;
    transaction_id: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    subscription_plan: ISubscriptionPlan;
  };
}
