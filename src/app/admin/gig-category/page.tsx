"use client";

import React, { useEffect, useState } from "react";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import {
  GigCategoryTableColumns,
  gigCategoryFields,
  GigCategoryFormVal,
} from "@/config/gigcategory.config";
import { DynamicTable } from "@/components/common/DynamicTables";
import { GigCategory, SortOrder } from "@/utils/interface";
import { API_ROUTES, DEFAULT_PAGINATION } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/common/ui/Button";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";

const PAGE_SIZE = 10;

function GigsCategory() {
  const [open, setOpen] = useState(false);
  const [gigCategories, setGigCategories] = useState<GigCategory[]>([]);
  const [editGigCategory, setEditGigCategory] = useState<GigCategory | null>(
    null
  );
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const refetchCurrentPage = () => fetchGigCategory(pagination.page);

  const handleApi = async (
    config: any,
    successMsg: string,
    callback?: () => void
  ) => {
    try {
      const resp = await apiCall(config);
      if (resp?.success) {
        toast.success(successMsg);
        callback?.();
      } else {
        toast.error(resp?.message || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchGigCategory(1);
  }, []);

  const handleAdd = () => {
    setEditGigCategory(null);
    setOpen(true);
  };

  const fetchGigCategory = async (
    page: number,
    query: string = "",
    key: string = "",
    sortOrder: SortOrder = "asc"
  ) => {
    try {
      const resp = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.GIG_CATEGORY}?page=${page}&pageSize=${PAGE_SIZE}&search=${query}&sortKey=${key}&sortOrder=${sortOrder}`,
        method: "GET",
      });

      if (resp) {
        if (resp.success) {
          setGigCategories(resp.data);
          setPagination(resp.meta);
        } else {
          toast.error(resp.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAddGigCategory = (values: GigCategoryFormVal) => {
    handleApi(
      { endPoint: API_ROUTES.ADMIN.GIG_CATEGORY, method: "POST", body: values },
      "Gig category added successfully",
      () => refetchCurrentPage()
    );
  };

  const handleEdit = (values: GigCategoryFormVal) => {
    handleApi(
      {
        endPoint: `${API_ROUTES.ADMIN.GIG_CATEGORY}/${editGigCategory?._id}`,
        method: "PUT",
        body: values,
      },
      "Gig category have been edited successfully",
      () => refetchCurrentPage()
    );
  };

  const handleDeleteGigCategory = (id: string) => {
    handleApi(
      { endPoint: `${API_ROUTES.ADMIN.GIG_CATEGORY}/${id}`, method: "DELETE" },
      "Gig category have been deleted successfully",
      () => refetchCurrentPage()
    );
  };

  const handleSubmit = (values: any) => {
    if (editGigCategory) {
      handleEdit(values);
    } else {
      handleAddGigCategory(values);
    }
  };

  const handleEditGigCategory = (gigcategory: GigCategory) => {
    setEditGigCategory(gigcategory);
    setOpen(true);
  };

  const handleSearchSort = (
    searchTerm: string,
    key: string,
    order: SortOrder,
    page: number
  ) => {
    page = page === 0 ? page + 1 : page;
    fetchGigCategory(page, searchTerm, key, order);
  };

  return (
    <div>
      <div className="mb-8">
        <DynamicTable<GigCategory>
          data={gigCategories}
          title="Gig Category"
          onClickCreateButton={handleAdd}
          totalPages={pagination.totalPages}
          searchPlaceholder="Search gig category by name, description"
          currentPage={pagination.page}
          handlePageChange={(page) => fetchGigCategory(page)}
          onSearchSort={handleSearchSort}
          columns={GigCategoryTableColumns}
          actions={(row) => (
            <div className="flex items-center justify-center gap-x-3">
              <Button size={"icon"} onClick={() => handleEditGigCategory(row)}>
                <Edit size={16} />
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-500"
                size={"icon"}
                onClick={() => handleDeleteGigCategory(row._id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
        ></DynamicTable>
      </div>

      <CommonFormModal
        open={open}
        setOpen={setOpen}
        title={editGigCategory ? "Edit gig category" : "Add gig category"}
        fields={gigCategoryFields}
        initialValues={editGigCategory || undefined}
        onSubmit={handleSubmit}
        submitLabel={
          editGigCategory ? "Update gig category" : "Save gig category"
        }
        width="600px"
      />
    </div>
  );
}

export default GigsCategory;
