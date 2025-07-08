import { BID_STATUS, PRIORITY } from "./constant";

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
  onSearchSort?: (
    search: string,
    sortKey: keyof T,
    sortOrder: SortOrder,
    page: number
  ) => void;

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
  id: string;
}

export interface IPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
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
  tire: Tire;
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

export interface Tire {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  profile: string;
  professional_interests: string | null;
  extracurriculars: string | null;
  certifications: string | null;
  education: string;
  skills: Skill[];
}

export interface Bid {
  id: number;
  provider_id: number;
  gig_id: number;
  status: BID_STATUS;
  description: string;
  payment_type: "hourly" | "fixed";
  bid_amount: string;
  created_at: Date;
  updated_at: Date;
}

export interface Gigs {
  id: number;
  user_id: number;
  provider_id: number | null;
  title: string;
  images: string[];
  description: string;
  gig_category_id: number;
  payment_type: "hourly" | "fixed";
  price: string;
  certifications: string[];
  profile_type: string;
  status: string;
  start_date_time: Date;
  end_date_time: Date;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  user: User;
  skills: Skill[];
  gig_category: GigCategory;
  bids: Array<Bid>;
  priority: PRIORITY;
  rating?: number;
  review?: string;
  _count?: {
    bids: number;
  }
}
