"use client";

import React, { useState } from "react";
import DynamicForm, {
  FormFieldConfig,
} from "@/components/common/form/DynamicForm";

const CreateGig = () => {
  const [initialValues, setIntialValues] = useState({
    title: "",
    description: "",
    price: 0,
    payment_type: "hourly",
    start_date_time: null,
    end_date_time: null,
    gig_category_id: "",
    skills: [],
    image: []
  });

  const formConfig: FormFieldConfig[] = [
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
            { value: "hourly", label: "Hourly" },
            { value: "fixed", label: "Fixed" },
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
          minDate: new Date()
        },
        {
          id: "end_date_time",
          name: "end_date_time",
          label: "End date",
          type: "datetime",
          required: true,
          enableTimeSelect: true,
          placeholder: "Choose date and time",
          minDate: new Date()
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
          options: [
            { value: "1", label: "Web development" },
            { value: "2", label: "Food management" },
            { value: "3", label: "Laundry management" },
          ],
        },
        {
          id: "skills",
          name: "skills",
          label: "Skills",
          type: "multiselect",
          required: true,
          placeholder: "Please select skills",
          options: [
            { value: "1", label: "NextJS" },
            { value: "2", label: "ReactJs" },
            { value: "3", label: "NodeJs" },
          ],
        },
        {
          id: "image",
          name: "image",
          label: "Select image",
          type: "fileupload",
          required: true,
          multiple: false,
          accept: ".png, .svg, .jpg, .jpeg, image/*",
          maxSize: 5,
          placeholder: "Drop your documents here or click to browse",
        },
      ],
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      console.log("Form submitted:", values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Gig created successfully!");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[980px] mx-auto pt-30 pb-15">
        <div className="flex flex-col items-center justify-center gap-3 mb-6">
          <h3 className="text-3xl font-bold text-[var(--base)]">
            Post Your Gig Request
          </h3>
          <p>
            Tell us what you need done and receive bids from skilled
            professionals
          </p>
        </div>
        <div>
          <DynamicForm
            formConfig={formConfig}
            onSubmit={handleSubmit}
            initialValues={initialValues}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
