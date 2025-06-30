"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Edit } from "lucide-react";

import { DynamicTable } from "@/components/common/DynamicTables";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { SortOrder, ISubscriptionPlan, ISubscriptionPlanApiResponse } from "@/utils/interface";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/apiCall";
import { toast } from "react-toastify";
import { CentralLoader } from "@/components/common/Loader";

const SubscriptionPlan = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(false);

  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);

  useEffect(() => {
    fetchSubscriptionPlan("", "", "", pagination.page);
  }, []);

  const fetchSubscriptionPlan = useCallback(
    async (searchTerm: string, sortKey = "", sortOrder = "", page = 1) => {
      setIsLoading(true);
      const { pageSize } = pagination;
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(sortKey && { sortBy: sortKey }),
        ...(sortKey && sortOrder && { sortOrder }),
      });

      const res: ISubscriptionPlanApiResponse = await apiCall({
        endPoint: `/subscription/plan?${params.toString()}`,
        method: "GET",
      });

      if (res.status === 200) {
        const { data, meta } = res;
        setPlans(data);
        setPagination(meta);
      } else {
        toast.error("Something went wrong, please try again later.");
      }
      setIsLoading(false);
    },
    [pagination.page]
  );

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearchSort = (searchTerm: string, key: keyof ISubscriptionPlan, order: SortOrder, page: number) => {
    fetchSubscriptionPlan(searchTerm, key, order, page);
  };

  const handleCreatePlan = () => {
    router.push("/admin/subscription-plan/new");
  };

  return (
    <>
      <CentralLoader loading={isLoading} />

      <DynamicTable<ISubscriptionPlan>
        data={plans}
        title="Subscription Plan"
        totalPages={pagination.totalPages}
        currentPage={pagination.page}
        handlePageChange={handlePageChange}
        onSearchSort={handleSearchSort}
        onClickCreateButton={handleCreatePlan}
        isCreateButtonDisabled={plans.length >= 3}
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
                    {plan.most_popular && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">Most Popular</span>
                    )}
                    {plan.is_pro && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">Pro</span>}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{plan.description}</p>
                  <p className="text-xs text-gray-600 mt-1">Created: {plan.created_at}</p>
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
                <div className="text-xs text-gray-800 mt-1">Button: "{plan.button_text}"</div>
              </div>
            ),
          },
          {
            key: "max_gig_per_month",
            label: "Gigs/Month",
            sortable: true,
            render: (_, plan) => (plan.is_pro ? "Unlimited" : plan.max_gig_per_month),
          },
          {
            key: "max_bid_per_month",
            label: "Bids/Month",
            sortable: true,
            render: (_, plan) => (plan.is_pro ? "Unlimited" : plan.max_bid_per_month),
          },
          {
            key: "features",
            label: "Features",
            render: (_, plan) => (
              <div className="text-sm">
                <div className="text-gray-900 font-medium mb-1">{plan.features.length} features</div>
                <div className="space-y-1">
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
            key: "can_get_badge",
            label: "Badges",
            sortable: true,
            textAlign: "center",
            render: (_, plan) => (
              <div className="flex items-center justify-center gap-1">
                <span className={`text-xs ${plan.can_get_badge ? "text-green-600" : "text-gray-400"}`}>{plan.can_get_badge ? "✓" : "✗"}</span>
              </div>
            ),
          },
          {
            key: "roles_allowed",
            label: "Roles",
            render: (_, plan) => (
              <div className="flex flex-wrap gap-1">
                {plan.roles_allowed.map((role) => (
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
            <button className="text-blue-500 hover:text-blue-700" onClick={() => router.push(`/admin/subscription-plan/${row.id}`)}>
              <Edit size={16} />
            </button>
            {/* <button className="text-red-500 hover:text-red-700" onClick={() => console.log("Delete", row.id)}>
            <Trash size={16} />
          </button> */}
          </div>
        )}
      />
    </>
  );
};

export default SubscriptionPlan;
