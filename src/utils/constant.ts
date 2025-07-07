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
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  GIGS: "/gigs",
  MY_GIGS: "/my-gigs",
  GIGS_PIPELINE: "/gig-pipeline",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SUBSCRIPTION: "/admin/subscription-plan",
    SUPPORT_REQUESTS: "/admin/support-requests",
    FAQS: "/admin/faqs",
    GIGCATEGORY: "/admin/gig-category",
    CREATE_FAQs: "/admin/faqs/create",
    PRIVACY_POLICY: "/admin/privacy-policy",
    TERMS_CONDITIONS: "/admin/terms-and-conditions",
    TIRE: "/admin/tire",
  },
  USER: {
    DASHBOARD: "/user/dashboard",
    BUY_SUBSCRIPTION: "/user/buy-subscription",
    BUY_SUBSCRIPTION_CHECKOUT: "/user/buy-subscription/:id/checkout",
    PROFILE: "/profile",
    GIGS: "/gigs",
    GIGS_CREATE: "/gigs/create",
    PROVIDER: "/provider",
  },
};

export const API_ROUTES = {
  LOGIN: "/api/login",
  CONTACT_US: "/contact-us",
  GIGS: "/gigs",
  MY_GIGS: "/gigs/my-gigs",
  GIG_CATEGORY: "/gig-category",
  GIG_PIPELINE: "/gigs/gig-pipeline",
  ADMIN: {
    TERMS_CONDITIONS: "/terms-conditions",
    AI_GENERATE_TERMS_CONDITIONS: "/terms-conditions/generate",
    PRIVACY_POLICY: "/privacy-policy",
    AI_GENERATE_PRIVACY_POLICY: "/privacy-policy/generate",
    FAQS: "/faqs",
    BULK_FAQS: "/faqs/bulk",
    AI_GENERATE_FAQ_ANSWER: "/faqs/generate-answer",
    AI_GENERATE_MAIL: "/contact-us/generate-response",
    CONTACT_US_BULK: "/contact-us/bulk-delete",
    TIRE: "/tire",
    GIG_CATEGORY: "/gig-category",
  },
};

export enum ROLE {
  Admin = "admin",
  User = "user",
  Organizer = "provider",
}

export enum PROFILE_TYPE {
  USER = "user",
  PROVIDER = "provider",
}

export enum PAYMENT_TYPE {
  HOURLY = "hourly",
  FIXED = "fixed",
}

export enum GIG_STATUS {
  UNSTARTED = "un_started",
  INPROGRESS = "in_progress",
  COMPLETED = "completed",
  REJECTED = "rejected"
}

export enum BID_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export const USER_SIDEBAR_ITEMS = [
  {
    id: 1,
    title: "Dashboard",
    route: ROUTES.ADMIN.DASHBOARD,
    icon: "/assets/DashboardIcon.svg",
  },
  {
    id: 2,
    title: "Subscription Plan",
    route: ROUTES.ADMIN.SUBSCRIPTION,
    icon: "/assets/subscription.svg",
  },
  {
    id: 3,
    title: "Service Tire",
    route: ROUTES.ADMIN.TIRE,
    icon: "/assets/services.svg",
  },
  {
    id: 4,
    title: "Gig Category",
    route: ROUTES.ADMIN.GIGCATEGORY,
    icon: "/assets/gigcategory.svg",
  },
  {
    id: 5,
    title: "Support Requests",
    route: ROUTES.ADMIN.SUPPORT_REQUESTS,
    icon: "/assets/support.svg",
  },
  {
    id: 6,
    title: "Terms & Conditions",
    route: ROUTES.ADMIN.TERMS_CONDITIONS,
    icon: "/assets/terms.svg",
  },
  {
    id: 7,
    title: "Privacy Policy",
    route: ROUTES.ADMIN.PRIVACY_POLICY,
    icon: "/assets/policy.svg",
  },
  { id: 8, title: "FAQs", route: ROUTES.ADMIN.FAQS, icon: "/assets/faqs.svg" },
];

export const MESSAGES = {
  SUCCESS: "Success",
  ERROR: "Something went wrong!",
  INITIAL_TERMS_CONDITIONS: "<p>Initial Terms and Conditions</p>",
  TERMS_CONDITIONS_SUCCESS: "Terms and Conditions updated successfully",
  TERMS_CONDITIONS_ERROR: "Failed to update Terms and Conditions",
  TERMS_CONDITIONS_RESET_SUCCESS: "Terms and Conditions reset successfully",
  TERMS_CONDITIONS_RESET_ERROR: "Failed to reset Terms and Conditions",
  FAQ_CREATE_SUCCESS: "FAQs created successfully",
  FAQ_CREATE_ERROR: "Failed to create FAQs. Please try again",
  FAQ_DELETE_CONFIRMATION: "Are you sure you want to delete this FAQ?",
  FAQ_DELETE_SUCCESS: "FAQ deleted successfully",
};

export const GIGS_PIPELINE_TABS = [
  { id: "pending", label: "Requested"},
  { id: "accepted", label: "Accepted" },
  { id: "in-progress", label: "In Progress"},
  { id: "completed", label: "Completed"},
  { id: "rejected", label: "Rejected" },
];

export const MY_GIGS_TABS = [
  { id: "un_started", label: "Open Gigs" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

// Landing page texts

export const LANDING_PAGE_TEXTS = {
  SEARCH_SUGGESTIONS: [
    "Search for gigs, services, or skills...",
    "Find tutoring help...",
    "Looking for campus delivery...",
    "Need help with assignments...",
    "Find study partners...",
    "Campus errands and tasks...",
  ],
  TAGLINE: "Connecting UMich Students",
  GET_HELP: "Get Help or Earn on Campus",
  FIND_OR_OFFER: "Find or offer gigs — from tutoring to food pickup, right within the UMich student network.",
  HOW_IT_WORKS: {
    TITLE: "How It Works",
    DESCRIPTION:
      "CampusGig makes it easy to find help or earn money on campus. Our platform connects UMich students for various services and opportunities.",
    STEPS: [
      {
        title: "Post or Browse Gigs",
        description: "Create your own gig or find opportunities that match your skills",
        details: [
          "Create a detailed profile highlighting your skills",
          "Browse through available gigs in your area",
          "Filter by category, tier, or location",
          "Set your own rates and availability",
        ],
        icon: "search",
      },
      {
        title: "Chat and Confirm",
        description: "Discuss details and agree on terms with other students",
        details: [
          "Use our secure messaging system",
          "Share files and documents safely",
          "Set clear expectations and deadlines",
          "Agree on payment terms",
        ],
        icon: "chat",
      },
      {
        title: "Secure Payment",
        description: "Get paid safely after completing the gig",
        details: [
          "Funds held securely in escrow",
          "Multiple payment methods available",
          "Automatic payment release on completion",
          "Dispute resolution support",
        ],
        icon: "payment",
      },
    ],
  },
  CALL_TO_ACTION: {
    TITLE: "Ready to Get Started?",
    SUBTITLE: " Join thousands of UMich students who are already using CampusGig to find help or earn money on campus.",
  },
};

export const CAMP_GIG_BENEFITS = [
  {
    title: "Verified UMich Community",
    description: "Every user is verified through their UMich email, ensuring a safe and trusted environment for all transactions.",
    icon: "verified_umich",
  },
  {
    title: "Flexible Work and Help",
    description: "Set your own schedule, choose your services, and work at your own pace. Perfect for balancing academics and earning.",
    icon: "flexible_work",
  },
  {
    title: "Secure Payment System",
    description: "Our escrow system ensures safe transactions. Funds are only released when both parties are satisfied with the service.",
    icon: "secure_payment_system",
  },
  {
    title: "Reviews and Tier-based Ratings",
    description: "Build your reputation through our review system. Higher tiers unlock more opportunities and premium services.",
    icon: "reviews_tiers",
  },
];

export const CAMP_GIG_STUDENT_BENEFITS = [
  "Find help with coursework and assignments",
  "Get advice from experienced students",
  "Access campus services and resources",
  "Flexible scheduling around your classes",
];

export const CAMP_GIG_PROVIDER_BENEFITS = [
  "Earn money using your skills and knowledge",
  "Build your professional reputation",
  "Flexible work around your schedule",
  "Access to a large student network",
];

export const SERVICE_TIERS = [
  {
    id: "tier1",
    label: "Tier 1",
    services: ["Campus delivery", "Laundry pickup", "Basic errands", "Simple tasks"],
  },
  {
    id: "tier2",
    label: "Tier 2",
    services: ["Study tips", "Course selection", "Job search help", "Campus navigation", "Tutoring"],
  },
  {
    id: "tier3",
    label: "Tier 3",
    services: ["Subject tutoring", "Resume review", "Interview prep", "Project help"],
  },
];

export const SERVICE_TIER_CONTENT = [
  {
    id: "tier1",
    tier: "Tier 1",
    title: "Basic Tasks",
    description: "Laundry, delivery, and other simple services",
    examples: ["Campus delivery", "Laundry pickup", "Basic errands", "Simple tasks"],
    price: "Starting at $10",
    image: "/tier1.jpg",
  },
  {
    id: "tier2",
    tier: "Tier 2",
    title: "Advice",
    description: "Class help, job search assistance, and guidance",
    examples: ["Study tips", "Course selection", "Job search help", "Campus navigation", "Tutoring"],
    price: "Starting at $20",
    image: "/tier2.jpg",
  },
  {
    id: "tier3",
    tier: "Tier 3",
    title: "Expert Help",
    description: "Tutoring, resume review, and specialized services",
    examples: ["Subject tutoring", "Resume review", "Interview prep", "Project help"],
    price: "Starting at $30",
    image: "/tier3.jpg",
  },
];

export const FEATURED_GIGS_PROVIDERS = [
  {
    id: 1,
    name: "Sarah Johnson",
    tier: "Tier 3",
    rating: 5,
    reviews: 50,
    image: "/profile1.jpg",
    specialty: "Computer Science",
  },
  {
    id: 2,
    name: "Michael Chen",
    tier: "Tier 2",
    rating: 4,
    reviews: 35,
    image: "/profile2.jpg",
    specialty: "Business",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    tier: "Tier 3",
    rating: 5,
    reviews: 42,
    image: "/profile3.jpg",
    specialty: "Engineering",
  },
  {
    id: 4,
    name: "David Kim",
    tier: "Tier 1",
    rating: 4,
    reviews: 28,
    image: "/profile1.jpg",
    specialty: "General Services",
  },
];

export const FEATURED_GIGS = [
  {
    id: 1,
    title: "Advanced Algorithms Tutoring",
    provider: "Sarah Johnson",
    price: "$45/hour",
    category: "Tutoring",
    rating: 5,
    reviews: 12,
    image: "/tier3.jpg",
    description: "Expert help with advanced algorithms and data structures",
  },
  {
    id: 2,
    title: "Resume Review & Optimization",
    provider: "Michael Chen",
    price: "$30",
    category: "Career",
    rating: 4,
    reviews: 8,
    image: "/tier2.jpg",
    description: "Professional resume review with optimization tips",
  },
  {
    id: 3,
    title: "Campus Food Delivery",
    provider: "David Kim",
    price: "$8",
    category: "Delivery",
    rating: 4,
    reviews: 25,
    image: "/tier1.jpg",
    description: "Quick and reliable food delivery across campus",
  },
];

export const SUBSCRIPTION_PLAN_CATEGORIES = [
  {
    title: "Security & Support",
    features: ["Secure payment processing", "24/7 customer support", "UMich student verification"],
    icon: "🛡️",
  },
  {
    title: "Platform Features",
    features: ["Review system", "Dispute resolution", "Safety guidelines"],
    icon: "⚙️",
  },
  {
    title: "Community Benefits",
    features: ["Access to student network", "Campus events", "Resource sharing"],
    icon: "🤝",
  },
];

export const FOOTER_SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Twitter", href: "#", icon: "twitter" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];

export const FOOTER_CONTACT_INFO = [
  {
    label: "Email",
    value: "support@campusgig.com",
    icon: "email",
  },
  {
    label: "Phone",
    value: "(734) 123-4567",
    icon: "phone",
  },
  {
    label: "Address",
    value: "University of Michigan\nAnn Arbor, MI 48109",
    icon: "address",
  },
];

export const FOOTER_BOTTOM_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQs", href: "/faqs" },
];

export const FOOTER_COPYRIGHT = "© 2025 CampusGig. All rights reserved.";

export const FOOTER_BRAND = {
  title: "CampusGig",
  description: "Connecting UMich students for campus services, tutoring, and more. Join our community to find help or earn money on campus.",
};

export const FOOTER_QUICK_LINKS = [
  { label: "Browse Gigs", href: "#" },
  { label: "Post a Gig", href: "#" },
  { label: "How it Works", href: "#" },
  { label: "Safety Tips", href: "#" },
  { label: "Student Resources", href: "#" },
];

export const FAQ_TEXT = {
  TITLE: "Frequently Asked Questions",
  SUBTITLE: "Find answers to common questions about using CampusGig. Can't find what you're looking for? Contact our support team.",
  HELP: "Can't find the answer you're looking for? Our support team is here to help.",
  NO_FAQ: "No FAQs available at the moment.",
};
export const CONTACT_US_TEXT = {
  TITLE: "Contact Us",
  SUBTITLE: "Have a question, feedback, or need support? Fill out the form below and our team will get back to you as soon as possible.",
  PHONE: "(734) 123-4567",
  ADDRESS: "University of Michigan Ann Arbor, MI 48109",
  THANK_YOU: "Thank you!",
  GET_BACK_SOON: "Your message has been sent. We'll get back to you soon.",
  OTHER_WAYS: "Other ways to reach us",
  EMAIL: " support@campusgig.com",
  NOTE: 'For urgent issues, please mention "URGENT" in your subject line.',
};

export const USER_PROFILE = {
  GIGS: [
    {
      id: 1,
      title: "Campus Ambassador",
      status: "Active",
      date: "2024-05-01",
    },
    {
      id: 2,
      title: "Event Volunteer",
      status: "Completed",
      date: "2024-04-15",
    },
    {
      id: 3,
      title: "Content Writer",
      status: "Active",
      date: "2024-03-20",
    },
  ],
  HISTORY: [
    {
      id: 1,
      title: "Campus Ambassador",
      status: "Completed",
      date: "2024-04-10",
    },
    {
      id: 2,
      title: "Event Volunteer",
      status: "Cancelled",
      date: "2024-03-15",
    },
  ],
  SUPPORT: [
    {
      id: 1,
      subject: "Payment Issue",
      status: "Resolved",
      date: "2024-04-01",
    },
    {
      id: 2,
      subject: "Gig Approval",
      status: "Pending",
      date: "2024-04-20",
    },
  ],
};
