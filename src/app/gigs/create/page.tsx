"use client";

import React, { useState } from "react";
import DynamicForm from "@/components/common/form/DynamicForm";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES } from "@/utils/constant";
import SuccessCard from "@/components/common/SuccessCard";
import { gigsFields, GigsFormVal } from "@/config/gigs.config";
import { FormikValues } from "formik";

const CreateGig = () => {
  const [initialValues, setIntialValues] = useState<GigsFormVal>({
    title: "",
    description: "",
    price: 0,
    payment_type: "hourly",
    start_date_time: null,
    end_date_time: null,
    gig_category_id: "",
    certifications: [],
    skills: [],
    image: null,
    profile_type: "user",
  });
  const [gigCategoryDropdown, setGigCategoryDropdown] = useState([
    { id: "2", label: "Laundry" },
    { id: "7", label: "Delivery" },
  ]);
  const [skillsDropdown, setSkillsDropdown] = useState([
    { id: "1", label: "NextJs" },
    { id: "2", label: "ReactJs" },
  ]);
  const [isFormSubmitted, setFormSubmitted] = useState<Boolean>(false);
  

  const handleFieldChange = (fieldName: string, value: any) => {
    if (fieldName === "gig_category_id" && value) {
      console.log("DATA::", value);
    }

    if (fieldName === "start_date_time") {
      setIntialValues({
        ...initialValues,
        [fieldName]: value,
      });
    }
  };

  const handleSubmit = async (values: FormikValues) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("payment_type", values.payment_type);
    formData.append("start_date_time", values.start_date_time);
    formData.append("end_date_time", values.end_date_time);
    formData.append("gig_category_id", values.gig_category_id);
    formData.append("profile_type", values.profile_type);

    if (values.skills.length > 0) {
      values.skills.forEach((skill: string) => {
        formData.append("skills[]", skill);
      });
    }

    if (values.certifications.length > 0) {
      values.certifications.forEach((certification: string) => {
        formData.append("certifications[]", certification);
      });
    }

    values.image && formData.append("file", values.image);

    try {
      const response = await apiCall({
        endPoint: API_ROUTES.GIGS,
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        isFormData: true,
      });
      if (response.success) {
        toast.success(response.message ?? "Gig created successfully!");
        setFormSubmitted(true);
        setIntialValues({
          title: "",
          description: "",
          price: 0,
          payment_type: "hourly",
          start_date_time: null,
          end_date_time: null,
          gig_category_id: "",
          certifications: [],
          skills: [],
          image: null,
          profile_type: "user",
        });
      } else {
        toast.error(
          response.message ?? "Gig creation failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[980px] mx-auto pt-24 pb-15">
        {isFormSubmitted ? (
          <SuccessCard
            successTitle="Gig created successfully"
            onClickButton={() => setFormSubmitted(false)}
            successPara="You can see your created gigs in profile under open gigs"
          />
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
              <h3 className="text-3xl font-bold text-[var(--base)]">
                Post Your Gig Request
              </h3>
              <p>
                Tell us what you need done and receive bids from skilled
                professionals
              </p>
            </div>
            <Card>
              <CardContent>
                <DynamicForm
                  formConfig={gigsFields(
                    initialValues,
                    gigCategoryDropdown,
                    skillsDropdown
                  )}
                  onSubmit={handleSubmit}
                  initialValues={initialValues}
                  onFieldChange={handleFieldChange}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGig;
