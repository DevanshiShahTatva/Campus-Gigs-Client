import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum ROLE {
  USER = "user",
  PROVIDER = "provider",
}

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  total: 1,
  totalPages: 1,
};
export const ROUTES = {
    LOGIN: "/login",
    ADMIN:{
        DASHBOARD: "/admin/dashboard",
        SUBSCRIPTION: "/admin/subscription-plan",
        TIRE: "/admin/tire",
        SUPPORT_REQUESTS: "/admin/support-requests",
        FAQS: "/admin/faqs",
        CREATE_FAQs: "/admin/faqs/create",
        PRIVACY_POLICY: "/admin/privacy-policy",
        TERMS_CONDITIONS: "/admin/terms-and-conditions",
    }
}

export const API_ROUTES ={
    LOGIN: "/api/login",
    ADMIN: {
        TERMS_CONDITIONS: "/terms-conditions",
        FAQS:"/faqs",
        BULK_FAQS:"/faqs/bulk",
    },
}
export enum ROLE {
    Admin = "admin",
    User = "user",
    Organizer = "provider"
}

export const USER_SIDEBAR_ITEMS = [
    { id: 1, title: "Dashboard", route: ROUTES.ADMIN.DASHBOARD, icon: "/assets/DashboardIcon.svg" },
    { id: 5, title: "Subscription Plan", route: ROUTES.ADMIN.SUBSCRIPTION, icon: "/assets/DashboardIcon.svg" },
    { id: 6, title: "Service Tire", route: ROUTES.ADMIN.TIRE, icon: "/assets/services.svg" },
    { id: 2, title: "Support Requests", route: ROUTES.ADMIN.SUPPORT_REQUESTS, icon: "/assets/support.svg" },
    { id: 5, title: "Terms & Conditions", route: ROUTES.ADMIN.TERMS_CONDITIONS, icon:  "/assets/terms.svg"},
    { id: 3, title: "Privacy Policy", route: ROUTES.ADMIN.PRIVACY_POLICY, icon:  "/assets/policy.svg"},
    { id: 4, title: "FAQs", route: ROUTES.ADMIN.FAQS, icon:  "/assets/faqs.svg"},
]

export const MESSAGES = {
    SUCCESS: "Success",
    ERROR: "Something went wrong!",
    INITIAL_TERMS_CONDITIONS:"<p>Initial Terms and Conditions</p>",
    TERMS_CONDITIONS_SUCCESS: "Terms and Conditions updated successfully",
    TERMS_CONDITIONS_ERROR: "Failed to update Terms and Conditions",
    TERMS_CONDITIONS_RESET_SUCCESS: "Terms and Conditions reset successfully",
    TERMS_CONDITIONS_RESET_ERROR: "Failed to reset Terms and Conditions",
    FAQ_CREATE_SUCCESS: "FAQs created successfully",
    FAQ_CREATE_ERROR: "Failed to create FAQs. Please try again",
    FAQ_DELETE_CONFIRMATION: "Are you sure you want to delete this FAQ?",
    FAQ_DELETE_SUCCESS: "FAQ deleted successfully",
}
