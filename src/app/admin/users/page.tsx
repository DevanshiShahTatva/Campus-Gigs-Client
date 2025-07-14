"use client";

import React, { useEffect, useState, useRef } from "react";
import { DynamicTable } from "@/components/common/DynamicTables";
import {
  CurrentSubscriptionPlan,
  SortOrder,
  User,
} from "@/utils/interface";
import { API_ROUTES, DEFAULT_PAGINATION } from "@/utils/constant";
import { Eye } from "lucide-react";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import { useRouter } from "next/navigation";

function Users() {
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(DEFAULT_PAGINATION.totalPages);

  const [queryParams, setQueryParams] = useState({
    page: DEFAULT_PAGINATION.page,
    pageSize: DEFAULT_PAGINATION.pageSize,
    search: "",
    sortKey: "name",
    sortOrder: "asc" as SortOrder,
  });

  const queryParamsRef = useRef(queryParams);
  queryParamsRef.current = queryParams;

  const fetchUsers = async () => {
    try {
      const { page, pageSize, search, sortKey, sortOrder } =
        queryParamsRef.current;

      const resp = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.USERS}?page=${page}&pageSize=${pageSize}&search=${search}&sortKey=${sortKey}&sortOrder=${sortOrder}`,
        method: "GET",
      });

      if (resp?.success) {
        setUserList(resp.data);
        setTotalPages(resp.meta.totalPages);
      } else {
        toast.error(resp?.message || "Error fetching users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [queryParams]);

  const handlePageChange = (page: number) => {
    if(page === queryParams.page) return;
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams((prev) => ({
      ...prev,
      pageSize,
      page: 1,
    }));
  };

  const handleSearchSort = (
    searchTerm: string,
    key: string,
    order: SortOrder
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      search: searchTerm,
      sortKey: key || "name",
      sortOrder: order,
      page: 1,
    }));
  };

  const getRoleFromPlan = (plan: CurrentSubscriptionPlan[]) => {
    const findActivePlan = plan.find((pl) => pl.status === "active");
    return findActivePlan?.subscription_plan.roles_allowed.join(", ");
  };

  const handleShowRole = (row: User) => {
    const getRole = getRoleFromPlan(row.subscription_plans);
    return <p className="capitalize">{getRole}</p>;
  };

  const handleView = (row: User) => {
    router.push(`/admin/users/${row.id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <DynamicTable<User>
          data={userList}
          title="Users"
          totalPages={totalPages}
          searchPlaceholder="Search user by name, email"
          currentPage={queryParams.page}
          pageSize={queryParams.pageSize}
          handlePageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchSort={handleSearchSort}
          columns={[
            { key: "name", label: "Name", sortable: true },
            { key: "email", label: "Email", sortable: true },
            {
              key: "role",
              label: "Role",
              render: (_, row) => handleShowRole(row)
            },
          ]}
          actions={(row) => (
            <div className="flex gap-3 justify-center">
              <button
                title="view"
                className="text-[var(--base)] hover:text-[var(--base-hover)]"
                onClick={() => handleView(row)}
              >
                <Eye size={16} />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default Users;
