import { CommonFormField } from "@/components/common/form/CommonFormModal";

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
    placeholder: "Write description here...",
  },
];

export interface TireFormVal {
  name: string;
  description: string;
}
