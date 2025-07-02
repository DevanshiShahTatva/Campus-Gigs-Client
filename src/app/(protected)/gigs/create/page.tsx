"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import DynamicForm from "@/components/common/form/DynamicForm";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, PAYMENT_TYPE, PROFILE_TYPE } from "@/utils/constant";
import SuccessCard from "@/components/common/SuccessCard";
import { gigsFields, GigsFormVal } from "@/config/gigs.config";
import { FormikValues } from "formik";

const initialFormState = {
  title: "",
  description: "",
  price: 0,
  payment_type: PAYMENT_TYPE.HOURLY,
  start_date_time: null,
  end_date_time: null,
  gig_category_id: "",
  certifications: [],
  skills: [],
  image: null,
  profile_type: PROFILE_TYPE.USER,
};

const CreateGig = () => {
  const [formValues, setFormValues] = useState<GigsFormVal>(initialFormState);
  const [gigCategoryDropdown, setGigCategoryDropdown] = useState([
    { id: "2", label: "Laundry" },
    { id: "7", label: "Delivery" },
  ]);
  const [skillsDropdown, setSkillsDropdown] = useState([
    { id: "1", label: "NextJs" },
    { id: "2", label: "ReactJs" },
  ]);
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSkillsLoading, setIsSkillsLoading] = useState<boolean>(false);

  useEffect(() => {
    // fetchGigCategories();
  }, []);

  const fetchGigCategories = async () => {
  try {
    const resp = await apiCall({
      endPoint: `${API_ROUTES.ADMIN.GIG_CATEGORY}/dropdown`,
      method: "GET",
    });

    if (resp?.success) {
      setGigCategoryDropdown(resp.data);
    }
  } catch (error) {
    toast.error("Failed to fetch categories");
  }
};

const fetchSkillsBaseOnCategory = async (id: string) => {
  try {
    setIsSkillsLoading(true);
    const resp = await apiCall({
      endPoint: `${API_ROUTES}/category/${id}`,
      method: "GET",
    });

    if (resp?.success) {
      setSkillsDropdown(resp.data);
    }
  } catch (error) {
    toast.error("Failed to fetch skills");
  } finally {
    setIsSkillsLoading(false);
  }
};

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    if (fieldName === "gig_category_id" && value) {
      // fetchSkillsBaseOnCategory(value);
    }

    if (fieldName === "start_date_time") {
      setFormValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  }, []);

  const handleSubmit = useCallback(async (values: FormikValues) => {
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

    values.image && formData.append("file", values.image[0]);

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
        setFormValues(initialFormState);
      } else {
        toast.error(
          response.message ?? "Gig creation failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Submission error:", error);
    }
  }, []);

  const memoizedGigCategoryDropdown = useMemo(() => gigCategoryDropdown, [gigCategoryDropdown]);
  const memoizedSkillsDropdown = useMemo(() => skillsDropdown, [skillsDropdown]);

  return (
    <div className="w-full">
      <div className="max-w-[980px] mx-auto pt-8 pb-4">
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
                    formValues,
                    memoizedGigCategoryDropdown,
                    memoizedSkillsDropdown,
                    isSkillsLoading
                  )}
                  onSubmit={handleSubmit}
                  initialValues={formValues}
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
