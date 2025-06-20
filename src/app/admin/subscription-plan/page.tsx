"use client";

import React, { useState } from "react";
import { Trash, Edit } from "lucide-react";
import dayjs from "dayjs";

import { DynamicTable } from "@/components/common/DynamicTables";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { Data, SortOrder } from "@/utils/interface";
import Button from "@/components/common/Button";

const SubscriptionPlan = () => {
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Searching:", searchTerm);
  };

  const handleSortChange = (key: keyof Data, order: SortOrder) => {
    console.log("Sort Key:", key, "Order:", order);
  };

  return (
    <DynamicTable<Data>
      data={[
        { id: "1", name: "Plan 1", description: "Description 1", create_at: "2022-01-01", updated_at: "2022-01-01" },
        { id: "2", name: "Plan 2", description: "Description 2", create_at: "2022-01-01", updated_at: "2022-01-01" },
      ]}
      title="Subscription Plan"
      totalPages={pagination.totalPages}
      currentPage={pagination.page}
      handlePageChange={handlePageChange}
      onSearch={handleSearch}
      onSortChange={handleSortChange}
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "description", label: "Description", sortable: true },
        {
          key: "create_at",
          label: "Created",
          sortable: true,
          render: (val) => dayjs(val).format("MMM DD, YYYY"),
        },
        {
          key: "updated_at",
          label: "Updated",
          sortable: true,
          render: (val) => dayjs(val).format("MMM DD, YYYY"),
        },
      ]}
      actions={(row) => (
        <div className="flex items-center justify-end gap-x-3">
          <button className="text-blue-500 hover:text-blue-700" onClick={() => console.log("Edit", row.id)}>
            <Edit size={16} />
          </button>
          <button className="text-red-500 hover:text-red-700" onClick={() => console.log("Delete", row.id)}>
            <Trash size={16} />
          </button>
        </div>
      )}
    >
      <Button variant="green" className="whitespace-nowrap">
        Add New Plan
      </Button>
    </DynamicTable>
  );
};

export default SubscriptionPlan;
