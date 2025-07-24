import { BID_STATUS, PAYMENT_HISTORY_TYPE, PRIORITY } from "./constant";

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
  onClickCreateButton?: () => void;
  isCreateButtonDisabled?: boolean;
  hasDeleteButton?: boolean;
  loading?: boolean;
}
export interface ISubscriptionPlan {
  id: number;
  name: string;
  base_plan_id: number;
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

export interface CurrentSubscriptionPlan {
  id: number;
  user_id: number;
  subscription_plan_id: number;
  price: number;
  status: string;
  subscription_expiry_date: Date;
  transaction_id: string;
  created_at: Date;
  updated_at: string;
  is_deleted: boolean;
  subscription_plan: ISubscriptionPlan;
}

export interface ISubscriptionCurrentPlanApiResponse {
  status: number;
  message: string;
  data: CurrentSubscriptionPlan;
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
  [x: string]: any;
  id: number;
  email: string;
  name: string;
  role: string;
  profile: string;
  profile_type: string;
  is_banned: boolean;
  professional_interests: string | null;
  extracurriculars: string | null;
  certifications: string | null;
  education: string;
  skills: Skill[];
  created_at: Date;
  updated_at: Date;
  strike_number: number;
  is_agreed: boolean;
  location: string;
  headline: string;
  bio: string;
  subscription: CurrentSubscriptionPlan;
  subscription_plans: CurrentSubscriptionPlan[];

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

export interface GigPayment {
  id: number;
  gig_id: number;
  transaction_id: string;
  payment_status: any;
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
  };
  gig_payment: GigPayment | null;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
  file_size: number;
  created_at: string;
  filename: string;
  message_id: number;
  mimetype: string;
}

export interface Chat {
  id: number;
  name: string;
  last_message: string;
  other_user_id: number;
  time: string;
  unread: number;
  avatar: string;
  status: string;
  last_seen?: string;
  is_deleted?: boolean;
  attachments?: Attachment[];
}

export interface OnlineUser {
  user_id: number;
  last_seen?: string;
}

export interface Message {
  id: number;
  message: string;
  sender: "me" | "them";
  time: string;
  timestamp: Date;
  attachments: Attachment[];
  is_deleted: boolean;
}

export interface PaymentTransaction {
  id: number;
  user_id: number;
  transaction_id: string;
  amount: number;
  type: PAYMENT_HISTORY_TYPE;
  paid_at: string;
  description: string;
  created_at: string;
  is_deleted: boolean;
}