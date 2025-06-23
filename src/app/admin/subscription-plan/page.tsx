"use client";

import React, { useState } from "react";
import { Edit } from "lucide-react";
import dayjs from "dayjs";

import { DynamicTable } from "@/components/common/DynamicTables";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { SortOrder, ISubscriptionPlan } from "@/utils/interface";
import { useRouter } from "next/navigation";

const SubscriptionPlan = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Premium",
      description: "Most popular for active users",
      price: 10,
      isPro: false,
      mostPopular: false,
      buttonText: "Upgrade Now",
      icon: "⭐",
      rolesAllowed: ["USER", "PROVIDER"],
      maxGigsPerMonth: 3,
      maxBidsPerMonth: 10,
      features: [
        "Everything in Basic",
        "Priority listing",
        "Advanced search filters",
        "3 gig posts per month",
        "10 bids per month",
        "Priority support",
        "Analytics dashboard",
        "Custom profile badge",
      ],
      canGetBadges: true,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Basic",
      description: "Perfect for getting started",
      price: 0,
      isPro: false,
      mostPopular: true,
      buttonText: "Get Started",
      icon: "🚀",
      rolesAllowed: ["USER"],
      maxGigsPerMonth: 1,
      maxBidsPerMonth: 3,
      features: ["Create profile", "Basic search", "1 gig post per month", "3 bids per month", "Community support"],
      canGetBadges: false,
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "Pro",
      description: "For professional service providers",
      price: 25,
      isPro: true,
      mostPopular: false,
      buttonText: "Go Pro",
      icon: "💎",
      rolesAllowed: ["PROVIDER"],
      maxGigsPerMonth: 10,
      maxBidsPerMonth: 25,
      features: [
        "Everything in Premium",
        "Unlimited gig posts",
        "25 bids per month",
        "Advanced analytics",
        "Priority support",
        "Featured listings",
        "Custom branding",
        "API access",
      ],
      canGetBadges: true,
      createdAt: "2024-01-20",
    },
  ]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearchSort = (searchTerm: string, key: keyof ISubscriptionPlan, order: SortOrder, page: number) => {
    console.log("Searching:", searchTerm);
    console.log("Sort Key:", key, "Order:", order);
    console.log("Page:", page);
  };

  const handleCreatePlan = () => {
    router.push("/admin/subscription-plan/new");
  };

  return (
    <DynamicTable<ISubscriptionPlan>
      data={plans}
      title="Subscription Plan"
      totalPages={pagination.totalPages}
      currentPage={pagination.page}
      handlePageChange={handlePageChange}
      onSearchSort={handleSearchSort}
      onClickCreateButton={handleCreatePlan}
      columns={[
        {
          key: "name",
          label: "Plan Details",
          sortable: true,
          render: (_, plan) => (
            <div className="flex items-center">
              <div className="text-2xl mr-3">{plan.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-800">{plan.name}</h3>
                  {plan.mostPopular && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">Most Popular</span>}
                  {plan.isPro && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">Pro</span>}
                </div>
                <p className="text-sm text-gray-700 mt-1">{plan.description}</p>
                <p className="text-xs text-gray-600 mt-1">Created: {plan.createdAt}</p>
              </div>
            </div>
          ),
        },
        {
          key: "price",
          label: "Price",
          sortable: true,
          render: (_, plan) => (
            <div className="text-sm">
              <div className="text-lg font-bold text-gray-800">
                ${plan.price}
                <span className="text-sm font-normal text-gray-800">/month</span>
              </div>
              <div className="text-xs text-gray-800 mt-1">Button: "{plan.buttonText}"</div>
            </div>
          ),
        },
        {
          key: "maxGigsPerMonth",
          label: "Gigs/Month",
          sortable: true,
          render: (_, plan) => (plan.isPro ? "Unlimited" : plan.maxGigsPerMonth),
        },
        {
          key: "maxBidsPerMonth",
          label: "Bids/Month",
          sortable: true,
          render: (_, plan) => (plan.isPro ? "Unlimited" : plan.maxBidsPerMonth),
        },
        {
          key: "features",
          label: "Features",
          render: (_, plan) => (
            <div className="text-sm">
              <div className="text-gray-900 font-medium mb-1">{plan.features.length} features</div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="text-xs text-gray-600 flex items-center gap-1 whitespace-nowrap">
                    <div className="w-1 min-w-1 h-1 bg-gray-400 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          key: "canGetBadges",
          label: "Badges",
          sortable: true,
          textAlign: "center",
          render: (_, plan) => (
            <div className="flex items-center justify-center gap-1">
              <span className={`text-xs ${plan.canGetBadges ? "text-green-600" : "text-gray-400"}`}>{plan.canGetBadges ? "✓" : "✗"}</span>
            </div>
          ),
        },
        {
          key: "rolesAllowed",
          label: "Roles",
          render: (_, plan) => (
            <div className="flex flex-wrap gap-1">
              {plan.rolesAllowed.map((role) => (
                <span key={role} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {role}
                </span>
              ))}
            </div>
          ),
        },
      ]}
      actions={(row) => (
        <div className="flex items-center justify-center gap-x-3">
          <button className="text-blue-500 hover:text-blue-700" onClick={() => console.log("Edit", row.id)}>
            <Edit size={16} />
          </button>
          {/* <button className="text-red-500 hover:text-red-700" onClick={() => console.log("Delete", row.id)}>
            <Trash size={16} />
          </button> */}
        </div>
      )}
    />
  );
};

export default SubscriptionPlan;
