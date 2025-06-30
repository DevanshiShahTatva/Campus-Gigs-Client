import { CommonFormField } from "@/components/common/form/CommonFormModal";
import { IDropdownOption } from "@/utils/interface";

export const gigCategoryFields = (services: IDropdownOption[]) => {
  return [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Please enter gig category name",
      required: true,
    },
    {
      name: "tire_id",
      label: "Tire Service",
      type: "select",
      options: services ? services : [],
      placeholder: "Please select tire service",
      required: true
    },
  ] as CommonFormField[];
};

export interface GigCategoryFormVal {
  name: string;
  tire_id: number;
}
