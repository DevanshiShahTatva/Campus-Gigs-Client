import { CommonFormField } from "@/components/common/CommonFormModal";
import { ColumnConfig, Data } from "@/utils/interface";
import dayjs from "dayjs";

export const tireFields: CommonFormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Please enter tire name",
    required: true,
  },
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
  {
    key: "create_at",
    label: "Created",
    render: (val) => dayjs(val).format("MMM DD, YYYY"),
  },
  {
    key: "updated_at",
    label: "Updated",
    render: (val) => dayjs(val).format("MMM DD, YYYY"),
  },
];

export interface TireFormVal {
  name: string,
  description: string
}
