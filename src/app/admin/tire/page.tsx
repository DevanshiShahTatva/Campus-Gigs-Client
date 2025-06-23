"use client";

import React, { useEffect, useState } from "react";
import CommonFormModal from "@/components/common/CommonFormModal";
import { tireFields, tireTableColumns } from "@/config/tire.config";
import { DynamicTable } from "@/components/common/DynamicTables";
import { Data, Tire } from "@/utils/interface";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/common/ui/Button";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import dayjs from "dayjs";

function TireService() {
  const [open, setOpen] = useState(false);
  const [tires, setTires] = useState<Data[]>([]);
  const [editTire, setEditTire] = useState<Data | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

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

  const fetchTires = async (page: number) => {
    try {
      const resp = await apiCall({
        endPoint: `/tire?page=${page}&pageSize=${10}`,
        method: "GET",
      });

      if (resp) {
        if (resp.success) {
          const tableData = handleChangeToTableData(resp.data);
          setTires(tableData);
          setPagination(resp.meta);
        } else {
          toast.error(resp.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAddTire = async (values: any) => {
    try {
      const resp = await apiCall({
        endPoint: `/tire`,
        method: "POST",
        body: values,
      });

      if (resp) {
        if (resp.success) {
          toast.success("Tire have been added successfully");
          fetchTires(1);
        } else {
          toast.error(resp.message);
        }
        setOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = async (values: any) => {
    debugger;
    try {
      const resp = await apiCall({
        endPoint: `/tire/${editTire?.id}`,
        method: "PUT",
        body: values,
      });

      if (resp) {
        if (resp.success) {
          toast.success("Tire have been edited successfully");
          fetchTires(1);
        } else {
          toast.error(resp.message);
        }
        setOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleSubmit = (values: any) => {
    if (editTire) {
      handleEdit(values);
    } else {
      handleAddTire(values);
    }
  };

  const handleEditTire = (tire: Data) => {
    setEditTire(tire);
    setOpen(true);
  };

  const handleDeleteTire = async (id: string) => {
    try {
      const resp = await apiCall({
        endPoint: `/tire/${id}`,
        method: "DELETE",
      });
      if (resp) {
        if (resp.success) {
          toast.success("Tire have been deleted successfully");
          fetchTires(1);
        } else {
          toast.error(resp.message);
        }
        setOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <DynamicTable<Data>
          data={tires}
          title="Service Tire"
          onClickPlus={handleAdd}
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          handlePageChange={() => {}}
          columns={tireTableColumns}
          actions={(row) => (
            <div className="flex items-center justify-end gap-x-3">
              <Button size={"icon"} onClick={() => handleEditTire(row)}>
                <Edit size={16} />
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-500"
                size={"icon"}
                onClick={() => handleDeleteTire(row.id)}
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
