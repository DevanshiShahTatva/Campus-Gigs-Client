import { FormFieldConfig } from "@/components/common/form/DynamicForm";
import { PAYMENT_TYPE, PROFILE_TYPE } from "@/utils/constant";
import { IDropdownOption } from "@/utils/interface";

export const gigsFields = (
  formValues: GigsFormVal,
  gigCategories: IDropdownOption[],
  skillsDropdown: IDropdownOption[],
  isMultiselectDataLoading: boolean
) => {
  return [
    {
      title: "Basic Information",
      description: "Provide the essential details about your gig",
      groupSize: 1,
      section: true,
      subfields: [
        {
          id: "title",
          name: "title",
          label: "Gig Title",
          type: "text",
          required: true,
          placeholder: "I will create a professional website for your business",
        },
        {
          id: "description",
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Describe your service in detail...",
        },
      ],
    },
    {
      title: "Budget & Timeline",
      description: "Please provide the budget and time line details",
      groupSize: 2,
      section: true,
      subfields: [
        {
          id: "payment_type",
          name: "payment_type",
          label: "Payment Type",
          type: "select",
          required: true,
          placeholder: "Please select payment type",
          options: [
            { id: "hourly", label: "Hourly" },
            { id: "fixed", label: "Fixed" },
          ],
        },
        {
          id: "price",
          name: "price",
          label: "Budget (USD)",
          type: "number",
          required: true,
          placeholder: "Enter price",
        },
        {
          id: "start_date_time",
          name: "start_date_time",
          label: "Start date",
          type: "datetime",
          required: true,
          enableTimeSelect: true,
          placeholder: "Choose date and time",
          minDate: new Date(),
        },
        {
          id: "end_date_time",
          name: "end_date_time",
          label: "End date",
          type: "datetime",
          required: true,
          enableTimeSelect: true,
          placeholder: "Choose date and time",
          minDate: formValues.start_date_time
            ? new Date(formValues.start_date_time)
            : new Date(),
        },
      ],
    },
    {
      title: "Skills & Attachments",
      description: "Please provide details of required skills and attachments",
      groupSize: 1,
      section: true,
      subfields: [
        {
          id: "gig_category_id",
          name: "gig_category_id",
          label: "Gig category",
          type: "select",
          required: true,
          placeholder: "Please select gig category",
          options: gigCategories ? gigCategories : [],
        },
        {
          id: "skills",
          name: "skills",
          label: "Skills",
          type: "multiselect",
          required: true,
          isMultiselectDataLoading: isMultiselectDataLoading,
          placeholder: "Please select skills",
          options: skillsDropdown ? skillsDropdown : [],
        },
        {
          id: "certifications",
          name: "certifications",
          label: "Certifications",
          type: "array",
          required: false,
          placeholder: "e.g., Software engineer",
        },
        {
          id: "images",
          name: "images",
          label: "Select image",
          type: "fileupload",
          required: true,
          multiple: true,
          accept: ".png, .svg, .jpg, .jpeg, image/*",
          maxSize: 5,
          placeholder: "Drop your documents here or click to browse",
        },
      ],
    },
  ] as FormFieldConfig[];
};

export interface GigsFormVal {
  title: string;
  description: string;
  price: number;
  payment_type: PAYMENT_TYPE;
  start_date_time: null | Date;
  end_date_time: null | Date;
  gig_category_id: string;
  skills: Array<string>;
  images: Array<File | string> | null;
  profile_type: PROFILE_TYPE;
  certifications: Array<string>
}
