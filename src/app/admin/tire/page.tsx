"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const [totalPages, setTotalPages] = useState(DEFAULT_PAGINATION.totalPages);

  const [queryParams, setQueryParams] = useState({
    page: DEFAULT_PAGINATION.page,
    pageSize: DEFAULT_PAGINATION.pageSize,
    search: "",
    sortKey: "",
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

  const fetchTires = async () => {
    try {
      const { page, pageSize, search, sortKey, sortOrder } =
        queryParamsRef.current;

      const resp = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.TIRE}?page=${page}&pageSize=${pageSize}&search=${search}&sortKey=${sortKey}&sortOrder=${sortOrder}`,
        method: "GET",
      });

      if (resp?.success) {
        setTires(resp.data);
        setTotalPages(resp.meta.totalPages);
      } else {
        toast.error(resp?.message || "Error fetching tires");
      }
    } catch (error) {
      toast.error("Failed to fetch tires");
    }
  };

  useEffect(() => {
    fetchTires();
  }, [queryParams]);

  const handleAdd = () => {
    setEditTire(null);
    setOpen(true);
  };

  const handleAddTire = (values: TireFormVal) => {
    handleApi(
      { endPoint: API_ROUTES.ADMIN.TIRE, method: "POST", body: values },
      "Tire added successfully",
      fetchTires
    );
  };

  const handleEdit = (values: TireFormVal) => {
    if (!editTire) return;

    handleApi(
      {
        endPoint: `${API_ROUTES.ADMIN.TIRE}/${editTire._id}`,
        method: "PUT",
        body: values,
      },
      "Tire updated successfully",
      fetchTires
    );
  };

  const handleDeleteTire = (id: string) => {
    handleApi(
      { endPoint: `${API_ROUTES.ADMIN.TIRE}/${id}`, method: "DELETE" },
      "Tire deleted successfully",
      fetchTires
    );
  };

  const handleSubmit = (values: any) => {
    editTire ? handleEdit(values) : handleAddTire(values);
  };

  const handleEditTire = (tire: Tire) => {
    setEditTire(tire);
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
      sortKey: key,
      sortOrder: order,
      page: 1,
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <DynamicTable<Tire>
          data={tires}
          title="Service Tire"
          onClickCreateButton={handleAdd}
          totalPages={totalPages}
          searchPlaceholder="Search tire by name, description"
          currentPage={queryParams.page}
          pageSize={queryParams.pageSize}
          handlePageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
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
