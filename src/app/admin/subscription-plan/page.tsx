"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

import { DynamicTable } from "@/components/common/DynamicTables";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { apiCall } from "@/utils/apiCall";

import { SortOrder, ISubscriptionPlan, ISubscriptionPlanApiResponse } from "@/utils/interface";
import { Button } from "@/components/ui/button";

const SubscriptionPlan = () => {
  const router = useRouter();

  const [queryParams, setQueryParams] = useState({
    page: DEFAULT_PAGINATION.page,
    pageSize: DEFAULT_PAGINATION.pageSize,
    search: "",
    sortKey: "name",
    sortOrder: "asc" as SortOrder,
  });

  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [totalPages, setTotalPages] = useState(DEFAULT_PAGINATION.totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubscriptionPlans = useCallback(async () => {
    setIsLoading(true);

    try {
      const { page, pageSize, search, sortKey, sortOrder } = queryParams;

      const res: ISubscriptionPlanApiResponse = await apiCall({
        endPoint: `/subscription/plan?page=${page}&pageSize=${pageSize}&search=${search}&sortKey=${sortKey}&sortOrder=${sortOrder}`,
        method: "GET",
      });

      if (res.status === 200) {
        const { data, meta } = res;
        setPlans(data);
        setTotalPages(meta.totalPages);
      } else {
        throw new Error("Failed to fetch subscription plans.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [fetchSubscriptionPlans]);

  const handlePageSizeChange = (pageSize: number) => setQueryParams((prev) => ({ ...prev, pageSize, page: 1 }));

  const handlePageChange = (page: number) => setQueryParams((prev) => ({ ...prev, page }));

  const handleSearchSort = (searchTerm: string, key: string, order: SortOrder, page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      search: searchTerm,
      sortKey: key || "name",
      sortOrder: order,
      page,
    }));
  };

  const handleDeleteClick = (planId: number) => {
    setSelectedPlanId(planId);
    setDeleteDialogOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!selectedPlanId) return;

    setIsDeleting(true);

    try {
      const res: ISubscriptionPlanApiResponse = await apiCall({
        endPoint: `/subscription/plan/${selectedPlanId}`,
        method: "DELETE",
      });

      if (res.status === 200) {
        toast.success("Subscription plan deleted successfully.");
        fetchSubscriptionPlans();
        setDeleteDialogOpen(false);
      } else {
        toast.error(res?.message || "Something went wrong. Please try again later.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedPlanId(null);
    }
  };

  const handleCreatePlan = () => router.push("/admin/subscription-plan/new");

  return (
    <>
      <DynamicTable<ISubscriptionPlan>
        title="Subscription Plan"
        data={plans}
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
        totalPages={totalPages}
        currentPage={queryParams.page}
        pageSize={queryParams.pageSize}
        handlePageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchSort={handleSearchSort}
        loading={isLoading}
        onClickCreateButton={handleCreatePlan}
        isCreateButtonDisabled={plans.length >= 3}
        actions={(plan) => (
          <div className="flex items-center justify-center gap-x-3">
            <Button size={"icon"} onClick={() => router.push(`/admin/subscription-plan/${plan.id}`)}>
              <Edit size={16} />
            </Button>
            <Button className="bg-red-500 hover:bg-red-500" size={"icon"} onClick={() => handleDeleteClick(plan.id)}>
              <Trash size={16} />
            </Button>
          </div>
        )}
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeletePlan}
        title="Delete Subscription Plan"
        description="Are you sure you want to delete this subscription plan?"
        confirmText="Delete Plan"
        isDeleting={isDeleting}
      />
    </>
  );
};

export default SubscriptionPlan;
