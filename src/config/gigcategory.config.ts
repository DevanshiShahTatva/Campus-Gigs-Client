import { CommonFormField } from "@/components/common/form/CommonFormModal";
import { ColumnConfig } from "@/utils/interface";

export const gigCategoryFields: CommonFormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Please enter gig category name",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe the gig category...",
  },
];

export const GigCategoryTableColumns: ColumnConfig<any>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", sortable: true },
];

export interface GigCategoryFormVal {
  name: string,
  description: string
}
