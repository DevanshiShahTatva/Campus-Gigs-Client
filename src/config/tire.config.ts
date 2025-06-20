import { CommonFormField } from "@/components/common/CommonFormModal";
import { ColumnConfig, Data } from "@/utils/interface";

export const tireFields: CommonFormField[] = [
  { name: "tire", label: "Tire", type: "text", placeholder: "Please enter tire name", required: true },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the tire...",
  },
];

export const tireTableColumns: ColumnConfig<Data>[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];
