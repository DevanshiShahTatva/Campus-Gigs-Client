export type SortOrder = "asc" | "desc";
export interface SubscriptionPlan {
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
}

export interface Data {
  id: string;
  name: string;
  description: string;
  create_at: string;
  updated_at: string;
}
