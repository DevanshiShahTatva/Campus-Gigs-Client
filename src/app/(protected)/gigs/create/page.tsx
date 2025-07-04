"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import DynamicForm from "@/components/common/form/DynamicForm";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, PAYMENT_TYPE, PROFILE_TYPE, ROUTES } from "@/utils/constant";
import SuccessCard from "@/components/common/SuccessCard";
import { gigsFields, GigsFormVal } from "@/config/gigs.config";
import { FormikValues } from "formik";
import { Gigs, IDropdownOption } from "@/utils/interface";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation"

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
  images: [],
  profile_type: PROFILE_TYPE.USER,
};

const CreateGig = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<GigsFormVal>(initialFormState);
  const [gigCategoryDropdown, setGigCategoryDropdown] = useState<
    IDropdownOption[]
  >([]);
  const [skillsDropdown, setSkillsDropdown] = useState<IDropdownOption[]>([]);
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSkillsLoading, setIsSkillsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const gigId = searchParams.get("gigId");

  useEffect(() => {
    if (gigId) {
      fetchGigDetails(gigId);
    }
    fetchGigCategories();
  }, []);

  const fetchGigDetails = async (gigId: string) => {
    try {
      setLoading(true);

      const resp = await apiCall({
        endPoint: `${API_ROUTES.GIGS + "/" + gigId}`,
        method: "GET",
      });

      if (resp?.success) {
        const formData = getFormData(resp.data);
        fetchSkillsBaseOnCategory(formData.gig_category_id);
        setFormValues(formData);
        setIsEdit(true);
      }
    } catch (error) {
      toast.error("Failed to delete gig");
    } finally {
      setLoading(false);
    }
  };

  const getFormData = (gig: Gigs): GigsFormVal => {
    return {
      title: gig.title,
      description: gig.description,
      certifications: gig.certifications,
      profile_type: gig.profile_type as PROFILE_TYPE,
      payment_type: gig.payment_type as PAYMENT_TYPE,
      price: Number(gig.price),
      gig_category_id: String(gig.gig_category_id),
      skills: gig.skills.map((skill) => String(skill.id)),
      start_date_time: gig.start_date_time,
      end_date_time: gig.end_date_time,
      images: gig.images || [],
    };
  };

  const fetchGigCategories = async () => {
    try {
      const resp = await apiCall({
        endPoint: API_ROUTES.GIG_CATEGORY,
        method: "GET",
      });

      if (resp?.success) {
        const options = resp.data.map((opt: { id: number; name: string }) => {
          return {
            id: String(opt.id),
            label: opt.name,
          };
        });
        setGigCategoryDropdown(options);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSkillsBaseOnCategory = async (id: string) => {
    try {
      setIsSkillsLoading(true);
      const resp = await apiCall({
        endPoint: `${API_ROUTES.GIG_CATEGORY}/${id}`,
        method: "GET",
      });

      if (resp?.success) {
        const options: IDropdownOption[] = resp.data.skills.map(
          (opt: { id: number; name: string }) => {
            return {
              id: String(opt.id),
              label: opt.name,
            };
          }
        );
        setSkillsDropdown(options);
      }
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setIsSkillsLoading(false);
    }
  };

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    if (fieldName === "gig_category_id" && value) {
      fetchSkillsBaseOnCategory(value);
    }

    if (fieldName === "start_date_time" && value) {
      setFormValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: FormikValues) => {
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

      const filesToUpload = values.images.filter(
        (img: any) => img instanceof File
      ) as File[];
      const retainedImageUrls = values.images.filter(
        (img: any) => typeof img === "string"
      ) as string[];

      retainedImageUrls.forEach((img: string) => {
        formData.append("images[]", img);
      });

      filesToUpload.forEach((file: File) => {
        formData.append("files", file);
      });

      try {
        const API_URL = isEdit
          ? `${API_ROUTES.GIGS}/${gigId}`
          : API_ROUTES.GIGS;
        const response = await apiCall({
          endPoint: API_URL,
          method: isEdit ? "PUT" : "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          isFormData: true,
        });
        if (response.success) {
          toast.success(
            response.message ??
              `Gig ${isEdit ? "edited" : "created"} successfully!`
          );
          if (isEdit) {
            router.push(ROUTES.MY_GIGS)
          } else {
            setFormSubmitted(true);
            setFormValues(initialFormState);
          }
        } else {
          toast.error(
            response.message ?? "Gig creation failed. Please try again."
          );
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error("Submission error:", error);
      }
    },
    [isEdit]
  );

  const memoizedGigCategoryDropdown = useMemo(
    () => gigCategoryDropdown,
    [gigCategoryDropdown]
  );
  const memoizedSkillsDropdown = useMemo(
    () => skillsDropdown,
    [skillsDropdown]
  );

  return (
    <div className="w-full">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader size={48} colorClass="text-[var(--base)]" />
        </div>
      )}
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
                {isEdit ? "Edit" : "Post"} Your Gig Request
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
                  buttonText={isEdit ? "Edit" : "Submit"}
                  enableReinitialize={isEdit ? true : false}
                  onCancel={() => router.back()}
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
