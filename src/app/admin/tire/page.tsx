"use client";

import React, { useState } from "react";
import CommonFormModal from "@/components/common/CommonFormModal";
import { tireFields, tireTableColumns } from "@/config/tire.config";
import { DynamicTable } from "@/components/common/DynamicTables";
import { Data } from "@/utils/interface";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/common/ui/Button";

type Tire = {
  id: number;
  [key: string]: any;
};

function TireService() {
  const [open, setOpen] = useState(false);
  const [tires, setTires] = useState<Tire[]>([]);
  const [editTire, setEditTire] = useState<Tire | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const handleAdd = () => {
    setEditTire(null);
    setOpen(true);
  };

  const handleEdit = (tire: Tire) => {
    setEditTire(tire);
    setOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editTire) {
      setTires((prev) =>
        prev.map((t) => (t.id === editTire.id ? { ...t, ...values } : t))
      );
    } else {
      setTires((prev) => [...prev, { ...values, id: Date.now() }]);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <DynamicTable<Data>
          data={[]}
          title="Service Tire"
          onClickPlus={handleAdd}
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          handlePageChange={() => {}}
          columns={tireTableColumns}
          actions={(row) => (
            <div className="flex items-center justify-end gap-x-3">
              <Button size={"icon"} onClick={() => console.log("Edit", row.id)}>
                <Edit size={16} />
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-500"
                size={"icon"}
                onClick={() => console.log("Delete", row.id)}
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
