import { CommonFormField } from "@/components/common/CommonFormModal";
import { ColumnConfig, IDropdownOption } from "@/utils/interface";
import dayjs from "dayjs";

export const tireFields = (categories: IDropdownOption[]) => {
  return [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Please enter tire name",
      required: true,
    },
    {
      name: "categories",
      label: "Gig Category",
      type: "multiselect",
      options: categories ? categories : [],
      placeholder: "Please select category",
      required: true,
    },
  ] as CommonFormField[];
};

export const tireTableColumns: ColumnConfig<any>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", sortable: true },
  {
    key: "create_at",
    label: "Created",
    sortable: true,
    render: (val) => dayjs(val).format("MMM DD, YYYY"),
  },
  {
    key: "updated_at",
    label: "Updated",
    sortable: true,
    render: (val) => dayjs(val).format("MMM DD, YYYY"),
  },
];

export interface TireFormVal {
  name: string;
  description: string;
}
