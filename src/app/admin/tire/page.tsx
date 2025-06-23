"use client";

import React, { useEffect, useState } from "react";
import CommonFormModal from "@/components/common/CommonFormModal";
import {
  tireFields,
  TireFormVal,
  tireTableColumns,
} from "@/config/tire.config";
import { DynamicTable } from "@/components/common/DynamicTables";
import { SortOrder, Tire } from "@/utils/interface";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/common/ui/Button";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import dayjs from "dayjs";

const PAGE_SIZE = 10;

function TireService() {
  const [open, setOpen] = useState(false);
  const [tires, setTires] = useState<Tire[]>([]);
  const [editTire, setEditTire] = useState<Tire | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const refetchCurrentPage = () => fetchTires(pagination.page);

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
    fetchTires(1);
  }, []);

  const handleAdd = () => {
    setEditTire(null);
    setOpen(true);
  };

  const handleChangeToTableData = (data: Tire[]) => {
    const tableData = data.map((tire) => {
      return {
        id: tire._id,
        name: tire.name,
        description: tire.description,
        create_at: dayjs(tire.createdAt).format("YYYY-MM-DD"),
        updated_at: dayjs(tire.updatedAt).format("YYYY-MM-DD"),
      };
    });

    return tableData;
  };

  const fetchTires = async (
    page: number,
    query: string = "",
    key: string = "",
    sortOrder: SortOrder = "asc"
  ) => {
    try {
      const resp = await apiCall({
        endPoint: `/tire?page=${page}&pageSize=${PAGE_SIZE}&search=${query}&sortKey=${key}&sortOrder=${sortOrder}`,
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
      { endPoint: `/tire`, method: "POST", body: values },
      "Tire added successfully",
      () => refetchCurrentPage()
    );
  };

  const handleEdit = (values: TireFormVal) => {
    handleApi(
      { endPoint: `/tire/${editTire?._id}`, method: "PUT", body: values },
      "Tire have been edited successfully",
      () => refetchCurrentPage()
    );
  };

  const handleDeleteTire = (id: string) => {
    handleApi(
      { endPoint: `/tire/${id}`, method: "DELETE" },
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
    order: SortOrder,
    page: number
  ) => {
    page = page === 0 ? page + 1 : page;
    fetchTires(page, searchTerm, key, order);
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
          columns={tireTableColumns}
          actions={(row) => (
            <div className="flex items-center justify-end gap-x-3">
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
