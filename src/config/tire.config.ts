import { CommonFormField } from "@/components/common/CommonFormModal";
import { IDropdownOption } from "@/utils/interface";

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

export interface TireFormVal {
  name: string;
  description: string;
}
 