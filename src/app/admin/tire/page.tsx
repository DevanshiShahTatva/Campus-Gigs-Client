"use client";

import React, { useEffect, useState } from "react";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import { tireFields, TireFormVal } from "@/config/tire.config";
import { DynamicTable } from "@/components/common/DynamicTables";
import { SortOrder, Tire } from "@/utils/interface";
import { API_ROUTES, DEFAULT_PAGINATION } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/common/ui/Button";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";

function TireService() {
  const [open, setOpen] = useState(false);
  const [tires, setTires] = useState<Tire[]>([]);
  const [editTire, setEditTire] = useState<Tire | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const refetchCurrentPage = () => fetchTires();

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

  useEffect(() => {
    fetchTires();
  }, []);

  const handleAdd = () => {
    setEditTire(null);
    setOpen(true);
  };

  const fetchTires = async (
    query: string = "",
    key: string = "",
    sortOrder: SortOrder = "asc",
  ) => {
    try {
      const { page, pageSize } = pagination;
      const resp = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.TIRE}?page=${page}&pageSize=${pageSize}&search=${query}&sortKey=${key}&sortOrder=${sortOrder}`,
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
    setEditTire(tire);
    setOpen(true);
  };

  const handleSearchSort = (
    searchTerm: string,
    key: string,
    order: SortOrder
  ) => {
    fetchTires(searchTerm, key, order);
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
          handlePageChange={(page) => {
            setPagination({
              ...pagination,
              page: page
            })
          }}
          onPageSizeChange={(pageSize) => {
            setPagination({
              ...pagination,
              pageSize: pageSize
            })
          }}
          onSearchSort={handleSearchSort}
          columns={[
            { key: "name", label: "Name", sortable: true },
            {
              key: "description",
              label: "Description",
              sortable: true,
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
        fields={tireFields}
        initialValues={editTire || undefined}
        onSubmit={handleSubmit}
        submitLabel={editTire ? "Update Tire" : "Save Tire"}
        width="600px"
      />
    </div>
  );
}

export default TireService;
