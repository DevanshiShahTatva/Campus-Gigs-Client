"use client";
import React from "react";
import DynamicForm, {
  FormFieldConfig,
} from "@/components/common/form/DynamicForm";

const CreateGigPage = () => {
  const formConfig: FormFieldConfig[] = [
    {
      title: "Attachments",
      description: "Upload relevant files for your gig",
      groupSize: 1,
      section: true,
      subfields: [
        {
          id: "documents",
          name: "documents",
          label: "Supporting Documents",
          type: "fileupload",
          required: true,
          multiple: true,
          accept: ".pdf,.doc,.docx,image/*",
          maxSize: 5,
          placeholder: "Drop your documents here or click to browse",
        },
      ],
    },
    {
      title: "Basic Information",
      description: "Provide the essential details about your gig",
      groupSize: 1,
      section: true,
      subfields: [
        {
          id: "eventDate",
          name: "eventDate",
          label: "Event Date",
          type: "datetime",
          required: true,
          enableTimeSelect: true,
          placeholder: "Choose date and time",
        },
        {
          id: "publishDate",
          name: "publishDate",
          label: "Publish Date",
          type: "datetime",
          required: true,
          enableTimeSelect: false,
          placeholder: "Choose publish date",
        },
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
        {
          id: "category",
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          placeholder: "Please select category",
          options: [
            { value: "web-development", label: "Web Development" },
            { value: "design", label: "Design" },
            { value: "marketing", label: "Marketing" },
            { value: "writing", label: "Writing" },
          ],
        },
        {
          id: "tier",
          name: "tier",
          label: "Tier",
          type: "select",
          required: true,
          placeholder: "Please select tire",
          options: [
            { value: "basic", label: "Basic" },
            { value: "pro", label: "Professional" },
            { value: "expert", label: "Expert" },
          ],
        },
      ],
    },
    {
      title: "Pricing & Delivery",
      description: "Set your price and delivery timeline",
      groupSize: 1, // Explicit 2 as literal type
      section: true,
      subfields: [
        {
          id: "price",
          name: "price",
          label: "Price (USD)",
          type: "number",
          required: true,
          placeholder: "99",
        },
        {
          id: "deliveryTime",
          name: "deliveryTime",
          label: "Delivery Time",
          type: "select",
          required: true,
          options: [
            { value: "1-day", label: "1 day" },
            { value: "3-days", label: "3 days" },
            { value: "1-week", label: "1 week" },
            { value: "2-weeks", label: "2 weeks" },
          ],
        },
      ],
    },
    {
      title: "What's Included",
      description: "List the features included in your service",
      groupSize: 1,
      section: true,
      subfields: [
        {
          id: "features",
          name: "features",
          label: "Features",
          type: "array",
          required: true,
          placeholder: "e.g., Source code, 3 revisions",
        },
      ],
    },
    {
      title: "Skills & Keywords",
      description: "Add relevant skills to help users find your gig",
      groupSize: 1,
      section: true,
      subfields: [
        {
          id: "skills",
          name: "skills",
          label: "Skills",
          type: "tags",
          required: true,
          placeholder: "e.g., React, JavaScript",
        },
      ],
    },
    {
      title: "Additional Options",
      description: "Extra settings for your gig",
      groupSize: 1,
      section: true,
      subfields: [
        {
          id: "commercialUse",
          name: "commercialUse",
          label: "Allow commercial use",
          type: "checkbox",
        },
        {
          id: "fileTypes",
          name: "fileTypes",
          label: "Supported File Types",
          type: "multiselect",
          options: [
            { value: "pdf", label: "PDF" },
            { value: "doc", label: "Word Document" },
            { value: "psd", label: "Photoshop" },
            { value: "ai", label: "Illustrator" },
          ],
        },
      ],
    },
  ];

  const initialValues = {
    title: "",
    description: "",
    category: "",
    tier: "",
    price: "",
    deliveryTime: "",
    features: [""],
    skills: [],
    commercialUse: false,
    fileTypes: [],
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Gig
          </h1>
          <p className="text-gray-600">
            Tell us about the service you want to offer
          </p>
        </div>

        <DynamicForm
          formConfig={formConfig}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </div>
    </div>
  );
};

export default CreateGigPage;
