"use client";

import React, { useEffect, useState } from "react";
import CommonFormModal from "@/components/common/CommonFormModal";
import { tireFields, TireFormVal } from "@/config/tire.config";
import { DynamicTable } from "@/components/common/DynamicTables";
import { IDropdownOption, SortOrder, Tire } from "@/utils/interface";
import { API_ROUTES, DEFAULT_PAGINATION } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/common/ui/Button";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";

const PAGE_SIZE = 10;

interface EditTire {
  _id: string;
  name: string;
  categories: string[];
}

function TireService() {
  const [open, setOpen] = useState(false);
  const [tires, setTires] = useState<Tire[]>([]);
  const [editTire, setEditTire] = useState<EditTire | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [categories, setCategories] = useState<IDropdownOption[]>([]);

  const refetchCurrentPage = () => fetchTires(pagination.page);

  const handleApi = async (
    config: any,
    successMsg?: string,
    callback?: (data: any) => void
  ) => {
    try {
      const resp = await apiCall(config);
      if (resp?.success) {
        successMsg && toast.success(successMsg);
        callback?.(resp.data);
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
    fetchTires(1);
    handleApi(
      {
        endPoint: API_ROUTES.ADMIN.GIG_CATEGORY + "/dropdown",
        method: "GET",
      },
      "",
      (data) => setCategories(data)
    );
  }, []);

  const handleAdd = () => {
    setEditTire(null);
    setOpen(true);
  };

  const fetchTires = async (
    page: number,
    query: string = "",
    key: string = "",
    sortOrder: SortOrder = "asc"
  ) => {
    try {
      const resp = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.TIRE}?page=${page}&pageSize=${PAGE_SIZE}&search=${query}&sortKey=${key}&sortOrder=${sortOrder}`,
        method: "GET",
      });

      if (resp) {
        if (resp.success) {
          setTires(resp.data);
          setPagination(resp.meta);
        } else {
          toast.error(resp.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAddTire = (values: TireFormVal) => {
    handleApi(
      { endPoint: API_ROUTES.ADMIN.TIRE, method: "POST", body: values },
      "Tire added successfully",
      () => refetchCurrentPage()
    );
  };

  const handleEdit = (values: TireFormVal) => {
    handleApi(
      {
        endPoint: `${API_ROUTES.ADMIN.TIRE}/${editTire?._id}`,
        method: "PUT",
        body: values,
      },
      "Tire have been edited successfully",
      () => refetchCurrentPage()
    );
  };

  const handleDeleteTire = (id: string) => {
    handleApi(
      { endPoint: `${API_ROUTES.ADMIN.TIRE}/${id}`, method: "DELETE" },
      "Tire have been deleted successfully",
      () => refetchCurrentPage()
    );
  };

  const handleSubmit = (values: any) => {
    if (editTire) {
      handleEdit(values);
    } else {
      handleAddTire(values);
    }
  };

  const handleEditTire = (tire: Tire) => {
    const editRow = {
      ...tire,
      categories: tire.categories.map((row) => row._id),
    };
    setEditTire(editRow);
    setOpen(true);
  };

  const handleSearchSort = (
    searchTerm: string,
    key: string,
    order: SortOrder,
    page: number
  ) => {
    page = page === 0 ? page + 1 : page;
    fetchTires(page, searchTerm, key, order);
  };

  const handleChip = (row: Tire) => {
    return (
      <div className="flex flex-row gap-2">
        {row.categories.map((val) => {
          return (
            <span className="p-2 bg-[var(--base)] rounded-lg text-white">
              {val.name}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <DynamicTable<Tire>
          data={tires}
          title="Service Tire"
          onClickCreateButton={handleAdd}
          totalPages={pagination.totalPages}
          searchPlaceholder="Search tire by name, description"
          currentPage={pagination.page}
          handlePageChange={(page) => fetchTires(page)}
          onSearchSort={handleSearchSort}
          columns={[
            { key: "name", label: "Name", sortable: true },
            {
              key: "categories",
              label: "Gig category",
              render: (_, row) => handleChip(row),
            },
          ]}
          actions={(row) => (
            <div className="flex items-center justify-center gap-x-3">
              <Button size={"icon"} onClick={() => handleEditTire(row)}>
                <Edit size={16} />
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-500"
                size={"icon"}
                onClick={() => handleDeleteTire(row._id)}
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
        title={editTire ? "Edit Tire" : "Add Tire"}
        fields={tireFields(categories)}
        initialValues={editTire || undefined}
        onSubmit={handleSubmit}
        submitLabel={editTire ? "Update Tire" : "Save Tire"}
        width="600px"
      />
    </div>
  );
}

export default TireService;
