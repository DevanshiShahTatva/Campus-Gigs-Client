"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Edit } from "lucide-react";
import dayjs from "dayjs";

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
      try {
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
          endPoint: `/subscription-plan?${params.toString()}`,
          method: "GET",
        });

        console.log(res);

        if (res.status === 200) {
          const { data, meta } = res;
          console.log(data);
          setPlans(data);
          setPagination(meta);
        }
      } catch (error: any) {
        if (!error?.response?.data?.success) {
          toast.error(error.response?.data?.message);
          return;
        }
        toast.error("Something went wrong, please try again later.");
      } finally {
        setIsLoading(false);
      }
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
        isCreateButtonDisabled={true}
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
                    {plan.mostPopular && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">Most Popular</span>
                    )}
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
            <button className="text-blue-500 hover:text-blue-700" onClick={() => router.push(`/admin/subscription-plan/${row._id}`)}>
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
