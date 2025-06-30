"use client";

import React, { useEffect, useState, useRef } from "react";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import {
  gigCategoryFields,
  GigCategoryFormVal,
} from "@/config/gigcategory.config";
import { DynamicTable } from "@/components/common/DynamicTables";
import { GigCategory, IDropdownOption, SortOrder } from "@/utils/interface";
import { API_ROUTES, DEFAULT_PAGINATION } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/common/ui/Button";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";

function GigsCategory() {
  const [open, setOpen] = useState(false);
  const [gigCategories, setGigCategories] = useState<GigCategory[]>([]);
  const [editGigCategory, setEditGigCategory] = useState<GigCategory | null>(
    null
  );
  const [servicesDropdown, setServicesDropdown] = useState<IDropdownOption[]>(
    []
  );
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

  const handleApi = async (
    config: any,
    successMsg?: string,
    callback?: (data: any) => void,
    closeOnError: boolean = false
  ) => {
    try {
      const resp = await apiCall(config);
      if (resp?.success) {
        successMsg && toast.success(successMsg);
        callback?.(resp.data);
        setOpen(false);
      } else {
        toast.error(resp?.message || "Something went wrong");
        closeOnError && setOpen(false);
      }
    } catch {
      toast.error("Something went wrong");
      closeOnError && setOpen(false);
    }
  };

  const fetchGigCategories = async () => {
    try {
      const { page, pageSize, search, sortKey, sortOrder } =
        queryParamsRef.current;

      const resp = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.GIG_CATEGORY}?page=${page}&pageSize=${pageSize}&search=${search}&sortKey=${sortKey}&sortOrder=${sortOrder}`,
        method: "GET",
      });

      if (resp?.success) {
        setGigCategories(resp.data);
        setTotalPages(resp.meta.totalPages);
      } else {
        toast.error(resp?.message || "Error fetching categories");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchServicesDropdown = async () => {
    handleApi(
      { endPoint: API_ROUTES.ADMIN.TIRE + "/dropdown", method: "GET" },
      "",
      (data) => setServicesDropdown(data)
    );
  };

  useEffect(() => {
    fetchGigCategories();
  }, [queryParams]);

  useEffect(() => {
    fetchServicesDropdown();
  }, []);

  const handleAdd = () => {
    setEditGigCategory(null);
    setOpen(true);
  };

  const handleAddGigCategory = (values: GigCategoryFormVal) => {
    handleApi(
      { endPoint: API_ROUTES.ADMIN.GIG_CATEGORY, method: "POST", body: values },
      "Gig category added successfully",
      fetchGigCategories
    );
  };

  const handleEdit = (values: GigCategoryFormVal) => {
    if (!editGigCategory) return;

    handleApi(
      {
        endPoint: `${API_ROUTES.ADMIN.GIG_CATEGORY}/${editGigCategory.id}`,
        method: "PUT",
        body: values,
      },
      "Gig category updated successfully",
      fetchGigCategories
    );
  };

  const handleDeleteGigCategory = (id: number) => {
    handleApi(
      { endPoint: `${API_ROUTES.ADMIN.GIG_CATEGORY}/${id}`, method: "DELETE" },
      "Gig category deleted successfully",
      fetchGigCategories
    );
  };

  const handleSubmit = (values: any) => {
    editGigCategory ? handleEdit(values) : handleAddGigCategory(values);
  };

  const handleEditGigCategory = (gigcategory: GigCategory) => {
    setEditGigCategory(gigcategory);
    setOpen(true);
  };

  const handlePageChange = (page: number) => {
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

  return (
    <div>
      <div className="mb-8">
        <DynamicTable<GigCategory>
          data={gigCategories}
          title="Gig Category"
          onClickCreateButton={handleAdd}
          totalPages={totalPages}
          searchPlaceholder="Search gig category by name, description"
          currentPage={queryParams.page}
          pageSize={queryParams.pageSize}
          handlePageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchSort={handleSearchSort}
          columns={[
            { key: "name", label: "Name", sortable: true },
            {
              key: "tire",
              label: "Tire",
              render: (_, data: GigCategory) => data.tire.name,
              sortable: true,
            },
          ]}
          actions={(row) => (
            <div className="flex items-center justify-center gap-x-3">
              <Button size={"icon"} onClick={() => handleEditGigCategory(row)}>
                <Edit size={16} />
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-500"
                size={"icon"}
                onClick={() => handleDeleteGigCategory(row.id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
        />
      </div>

      <CommonFormModal
        open={open}
        setOpen={setOpen}
        title={editGigCategory ? "Edit Gig Category" : "Add Gig Category"}
        fields={gigCategoryFields(servicesDropdown)}
        initialValues={editGigCategory || undefined}
        onSubmit={handleSubmit}
        submitLabel={
          editGigCategory ? "Update Gig Category" : "Save Gig Category"
        }
        width="600px"
      />
    </div>
  );
}

export default GigsCategory;
