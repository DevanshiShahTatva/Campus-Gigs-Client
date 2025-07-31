// Profile page helpers and config
import { educationOptions as rawEducationOptions } from "@/app/(auth)/sign-up/helper";
import React from "react";
import { IDropdownOption } from "@/utils/interface";

// Map educationOptions to { id, label } for DynamicForm compatibility
export const educationOptions = rawEducationOptions.map(opt => ({ id: opt.id, label: opt.label }));

export const CERTIFICATIONS = [
  { label: "Google Analytics", id: "google-analytics" },
  { label: "AWS Certified", id: "aws" },
  { label: "Microsoft Office", id: "ms-office" },
  { label: "Other", id: "other" },
];

export const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "43px",
    border: state.isFocused ? "1px solid var(--base)" : "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxShadow: state.isFocused ? "0 0 0 1px var(--base)" : "none",
    "&:hover": {
      borderColor: "var(--base)",
    },
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: "156px",
    overflowY: "auto",
    borderRadius: "8px",
  }),
  option: (base: any, state: any) => ({
    ...base,
    padding: "5px 8px",
    color: "#111827",
    cursor: "pointer",
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
  }),
};

export const getInitials = (name: string = "User") => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const profileFormConfig =(skillDropdown:IDropdownOption[]) => [
  {
    title: "Personal Information",
    groupSize: 2 as 2,
    section: true,
    subfields: [
      { id: "name", name: "name", label: "Full Name", type: "text" as const, required: true, errorMessage: "Name is required", placeholder: "Enter your full name" },
      { id: "phone", name: "phone_number", label: "Phone", type: "text" as const, required: false, errorMessage: "Phone number is required", placeholder: "Enter phone number" },
      { id: "address", name: "location", label: "Address", type: "text" as const, required: false, errorMessage: "Address is required", placeholder: "Enter address" },
    ],
  },
  {
    title: "Education",
    description: "Your education background.",
    groupSize: 1 as 1,
    section: true,
    subfields: [
      { id: "educationLevel", name: "educationLevel", label: "Education Level", type: "select" as const, required: true, errorMessage: "Education level is required", options: educationOptions, placeholder: "Search or select your education level" },
    ],
  },
  {
    title: "Professional Background",
    description: "Tell us about your professional interests and activities.",
    groupSize: 1 as 1,
    section: true,
    subfields: [
      { id: "professional_interests", name: "professional_interests", label: "Professional Interests", type: "textarea" as const, errorMessage: "Professional interests are required", placeholder: "What are your professional interests and career goals?" },
      { id: "extracurriculars", name: "extracurriculars", label: "Extracurricular Activities", type: "textarea" as const, errorMessage: "Extracurricular activities are required", placeholder: "Sports, clubs, volunteer work, hobbies, community involvement.." },
      { id: "certifications", name: "certifications", label: "Certifications", type: "text" as const, errorMessage: "Certifications are required", placeholder: "List your certifications (e.g., PMP, AWS, Google Analytics...)" },
    ],
  },
  {
    title: "Skills",
    description: "Add up to 10 skills to showcase your expertise.",
    groupSize: 1 as 1,
    section: true,
    subfields: [
      { id: "skills", name: "skills", label: "Skills", type: "multiselect", required: true, options: skillDropdown, errorMessage: "At least one skill is required", placeholder: "e.g., React, JavaScript", minItems: 1, maxItems: 10 },
    ],
  },
  {
    title: "About",
    description: "Write a short bio about yourself (max 300 chars).",
    groupSize: 1 as 1,
    section: true,
    subfields: [
      { id: "headline", name: "headline", label: "Headline",required:true, type: "text" as const, errorMessage: "Headline is required", placeholder: "e.g. Web Developer, Marketing Enthusiast, etc." },
      { id: "bio", name: "bio", label: "Short Bio", required:true, type: "textarea" as const, errorMessage: "Short bio is required", placeholder: "Write a short bio (max 300 chars)" },
    ],
  },
];

export const handleSkillsChange = (
  tags: string[],
  setFieldValue: (field: string, value: any) => void
) => {
  if (tags.length <= 10) {
    setFieldValue("skills", tags);
  } else {
    // You can add toast notification here if needed
    console.warn("Maximum 10 skills allowed!");
  }
};

export const handleEducationChange = (
  selectedOption: any,
  setFieldValue: (field: string, value: any) => void
) => {
  setFieldValue("educationLevel", selectedOption?.value || "");
  if (selectedOption?.value !== "Other") {
    setFieldValue("customEducation", "");
  }
};

export const handleCoverChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setCoverImage: (url: string | null) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    setCoverImage(url);
  }
};

export const handleProfileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setProfileImage: (url: string | null) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    setProfileImage(url);
  }
}; 