"use client";
import React, { use, useEffect, useState } from "react";
import { Formik, Form, Field, FormikHelpers, FormikProps, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { ROLE } from "@/utils/constant";
import Button from "@/components/common/Button";
import FormikTextField from "@/components/common/FormikTextField";
import CheckboxCard from "@/components/common/CheckboxCard";
import RadioCard from "@/components/common/RadioCard";
import { apiCall } from "@/utils/apiCall";

type SubscriptionPlanFormValues = {
  name: string;
  description: string;
  price: number;
  icon: string;
  is_pro: boolean;
  roles_allowed: string[];
  max_gig_per_month: string | null;
  max_bid_per_month: string | null;
  features: string[];
  can_get_badge: boolean;
  most_popular: boolean;
  button_text: string;
};

type RoleOption = {
  value: string;
  label: string;
};

type FeatureFieldProps = {
  index: number;
  values: SubscriptionPlanFormValues;
  errors: FormikProps<SubscriptionPlanFormValues>["errors"];
  touched: FormikProps<SubscriptionPlanFormValues>["touched"];
  handleBlur: FormikProps<SubscriptionPlanFormValues>["handleBlur"];
  removeFeature: (index: number) => void;
  isDuplicateFeature: (index: number) => boolean;
};

// Fix the PageProps interface to match Next.js App Router expectations
interface PageProps {
  params: Promise<{ id: string }>;
}

// Constants
const ROLE_OPTIONS: RoleOption[] = [
  { value: ROLE.USER, label: "User" },
  { value: ROLE.PROVIDER, label: "Provider" },
];

const MAX_FEATURES = 10;
const INITIAL_VALUES: SubscriptionPlanFormValues = {
  name: "",
  description: "",
  price: 0,
  icon: "⭐",
  is_pro: false,
  roles_allowed: [ROLE.USER],
  max_gig_per_month: "",
  max_bid_per_month: "",
  features: [""],
  can_get_badge: false,
  most_popular: false,
  button_text: "Get Started",
};

// Validation Schema
const subscriptionPlanSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").trim(),
  description: Yup.string().required("Description is required").trim(),
  price: Yup.number().required("Price is required").min(0, "Price must be positive"),
  icon: Yup.string().required("Icon is required").trim(),
  is_pro: Yup.boolean().default(false),
  roles_allowed: Yup.array().of(Yup.string()).default([ROLE.USER]).min(1, "At least one role is required"),
  max_gig_per_month: Yup.number().nullable(),
  max_bid_per_month: Yup.number().nullable(),
  features: Yup.array()
    .of(Yup.string().trim().required("Feature cannot be empty"))
    .min(1, "At least one feature is required")
    .max(MAX_FEATURES, `Maximum ${MAX_FEATURES} features allowed`)
    .test("unique", "All features must be unique", function (values) {
      const nonEmptyValues = values?.filter((v) => v?.trim() !== "");
      return new Set(nonEmptyValues).size === nonEmptyValues?.length;
    }),
  can_get_badge: Yup.boolean().default(false),
  most_popular: Yup.boolean().default(false),
  button_text: Yup.string().default("Get Started").trim().required("Button text is required"),
});

// Helper functions
const hasDuplicateFeatures = (features: string[]): boolean => {
  const normalized = features.map((f) => f.trim().toLowerCase());
  return new Set(normalized).size !== normalized.length;
};

const isDuplicateFeature = (features: string[], index: number): boolean => {
  const currentFeature = features[index]?.trim().toLowerCase();
  if (!currentFeature) return false;

  return features.some((f, i) => i !== index && f.trim().toLowerCase() === currentFeature);
};

const safeGetArrayError = (errors: any, field: string, index: number): string | undefined => {
  if (!errors || !errors[field] || !Array.isArray(errors[field])) return undefined;
  return errors[field][index];
};

// Component: FeatureField
const FeatureField: React.FC<FeatureFieldProps> = ({ index, values, errors, touched, handleBlur, removeFeature, isDuplicateFeature }) => {
  const error = touched.features ? safeGetArrayError(errors, "features", index) : undefined;
  const isDup = isDuplicateFeature(index);

  return (
    <div key={index} className="group">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Field
            name={`features.${index}`}
            type="text"
            placeholder="Enter feature description..."
            className={`w-full px-4 py-2 border text-black disabled:bg-gray-100 disabled:text-gray-500
              ${
                (touched.features && error) || isDup
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-[var(--base)] focus:border-[var(--base)]"
              }
            rounded-lg focus:outline-none focus:ring-1 outline-none transition-all no-spinner
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            onBlur={handleBlur}
          />
        </div>
        <button
          type="button"
          onClick={() => removeFeature(index)}
          disabled={values.features.length <= 1}
          className={`p-3 rounded-xl transition-all duration-200 ease-in-out
            ${
              values.features.length > 1
                ? "text-red-500 hover:text-red-600 hover:bg-red-50 active:scale-95 group-hover:opacity-100"
                : "text-gray-300 cursor-not-allowed opacity-50"
            }
          `}
          aria-label="Remove feature"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
      {((touched.features && error) || isDup) && (
        <div className="text-red-500 text-sm mt-1 whitespace-pre-line">{isDup ? "This feature already exists" : error}</div>
      )}
    </div>
  );
};

const CreateEditSubscriptionPlan = ({ params }: PageProps) => {
  // Properly unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const isEditMode = unwrappedParams.id !== "new";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const handleSubmit = async (values: SubscriptionPlanFormValues, { resetForm }: FormikHelpers<SubscriptionPlanFormValues>) => {
    setIsSubmitting(true);

    // Prepare the submission data
    const submissionData = {
      name: values.name,
      description: values.description,
      features: values.features.filter((f) => f.trim() !== ""), // Remove empty features
      price: Number(values.price),
      is_pro: values.is_pro,
      can_get_badge: values.can_get_badge,
      most_popular: values.most_popular,
      icon: values.icon,
      button_text: values.button_text,
      ...(values.is_pro
        ? {
            max_gig_per_month: null,
            max_bid_per_month: null,
            roles_allowed: ROLE_OPTIONS.map((role) => role.value.toLowerCase()), // Ensure lowercase role names
          }
        : {
            max_gig_per_month: Number(values.max_gig_per_month) || 0,
            max_bid_per_month: Number(values.max_bid_per_month) || 0,
            roles_allowed: values.roles_allowed.map((role) => role.toLowerCase()),
          }),
    };

    const method = isEditMode ? "PUT" : "POST";
    const endpoint = isEditMode ? `/subscription/plan/${unwrappedParams.id}` : "/subscription/plan";

    const response = await apiCall({
      endPoint: endpoint,
      method,
      body: submissionData,
    });

    if (!response) {
      throw new Error("No response from server");
    }

    // Check for successful response
    if (response?.status === 200 || response?.status === 201) {
      toast.success(`Subscription plan ${isEditMode ? "updated" : "created"} successfully!`);
      router.push("/admin/subscription-plan");
    } else {
      const errorMessage = response?.data?.message || "Something went wrong. Please try again later.";
      toast.error(errorMessage);
    }
    setIsSubmitting(false);
  };

  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);

  useEffect(() => {
    if (isEditMode) {
      const fetchSubscriptionPlan = async () => {
        const response = await apiCall({
          endPoint: `/subscription/plan/${unwrappedParams.id}`,
          method: "GET",
        });

        if (response?.status === 200) {
          const data = response.data;
          setInitialValues({
            name: data.name,
            description: data.description,
            price: data.price,
            icon: data.icon,
            is_pro: data.is_pro,
            roles_allowed: data.roles_allowed,
            max_gig_per_month: data.max_gig_per_month,
            max_bid_per_month: data.max_bid_per_month,
            features: data.features,
            can_get_badge: data.can_get_badge,
            most_popular: data.most_popular,
            button_text: data.button_text,
          });
        } else {
          toast.error("Subscription plan not found");
        }
        console.log(response, "data");
      };

      fetchSubscriptionPlan();
    }
  }, [isEditMode, unwrappedParams.id]);

  return (
    <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10 relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? "Edit" : "Create New"} Subscription Plan</h1>

      <Formik initialValues={initialValues} validationSchema={subscriptionPlanSchema} onSubmit={handleSubmit} enableReinitialize>
        {(formikProps: FormikProps<SubscriptionPlanFormValues>) => {
          const { values, errors, touched, setFieldValue, handleBlur } = formikProps;

          const addFeature = () => {
            if (values.features.length < MAX_FEATURES) {
              setFieldValue("features", [...values.features, ""]);
            }
          };

          const removeFeature = (index: number) => {
            if (values.features.length > 1) {
              const newFeatures = values.features.filter((_, i) => i !== index);
              setFieldValue("features", newFeatures);
            }
          };

          const checkDuplicateFeature = (index: number) => isDuplicateFeature(values.features, index);
          const hasDuplicates = hasDuplicateFeatures(values.features.filter((f) => f.trim() !== ""));

          const isAddDisabled = values.features.some((f) => f.trim() === "") || values.features.length >= MAX_FEATURES || hasDuplicates;

          return (
            <Form className="flex flex-col gap-5">
              <FormikTextField name="name" placeholder="Enter plan name" label="Plan Name *" type="text" className="w-full md:w-9/12 lg:w-1/2" />

              <FormikTextField name="icon" placeholder="Enter plan icon" label="Plan Icon *" type="text" className="w-full md:w-9/12 lg:w-1/2" />

              <FormikTextField
                name="price"
                placeholder="0.00"
                label="Plan Price in $ *"
                type="number"
                min={0}
                step={0.01}
                className="w-full md:w-9/12 lg:w-1/2"
              />

              <FormikTextField
                name="description"
                placeholder="Describe what this plan offers..."
                label="Plan Description *"
                type="textarea"
                rows={4}
                className="w-full md:w-9/12 lg:w-1/2"
              />

              <div className="w-full md:w-9/12 lg:w-1/2 flex flex-col gap-2">
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
                  Features *
                </label>
                <FieldArray
                  name="features"
                  render={() => (
                    <div className="space-y-4">
                      {values.features.map((_, index) => (
                        <FeatureField
                          key={index}
                          index={index}
                          values={values}
                          errors={errors}
                          touched={touched}
                          handleBlur={handleBlur}
                          removeFeature={removeFeature}
                          isDuplicateFeature={checkDuplicateFeature}
                        />
                      ))}
                    </div>
                  )}
                />

                {hasDuplicates && (
                  <div className="text-red-500 text-sm mt-1 whitespace-pre-line ">Please remove duplicate features before adding new ones</div>
                )}

                {values.features.length > MAX_FEATURES && (
                  <div className="text-red-500 text-sm mt-1 whitespace-pre-line">Maximum {MAX_FEATURES} features allowed</div>
                )}

                {values.features.length < MAX_FEATURES && (
                  <button
                    type="button"
                    onClick={addFeature}
                    disabled={isAddDisabled}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-md transition-all duration-200 ease-in-out w-fit
                            ${
                              !isAddDisabled
                                ? "text-[var(--base)] bg-[var(--base)]/10 hover:bg-[var(--base)]/20 hover:text-[var(--base)] active:scale-95"
                                : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-80"
                            }
                          `}
                  >
                    <FaPlus className="w-4 h-4" />
                    Add New Feature
                  </button>
                )}
              </div>
              <div className="w-full md:w-9/12 lg:w-1/2 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RadioCard
                      name="is_pro"
                      value="pro"
                      label="Pro Plan"
                      description="Full access to all features"
                      checked={values.is_pro}
                      onChange={() => setFieldValue("is_pro", true)}
                    />
                    <RadioCard
                      name="is_pro"
                      value="free"
                      label="Free Plan"
                      description="Limited features"
                      checked={!values.is_pro}
                      onChange={() => setFieldValue("is_pro", false)}
                    />
                  </div>
                </div>

                {!values.is_pro && (
                  <>
                    <FormikTextField
                      name="max_gig_per_month"
                      placeholder="Enter plan icon"
                      label="Max Gigs Per Month"
                      type="number"
                      min={0}
                      className="w-full"
                    />

                    <FormikTextField
                      name="max_bid_per_month"
                      placeholder="Enter plan icon"
                      label="Max Bids Per Month"
                      type="number"
                      min={0}
                      className="w-full"
                    />

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Available for Roles</label>
                      <div className="flex flex-col gap-4">
                        {ROLE_OPTIONS.map((role) => (
                          <CheckboxCard
                            key={role.value}
                            name="roles_allowed"
                            value={role.value}
                            label={role.label}
                            checked={values.roles_allowed.includes(role.value)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value;
                              if (e.target.checked) {
                                setFieldValue("roles_allowed", [...values.roles_allowed, value]);
                              } else {
                                setFieldValue(
                                  "roles_allowed",
                                  values.roles_allowed.filter((r) => r !== value)
                                );
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="can_get_badge" className="block text-sm font-medium text-gray-700 mb-1">
                    Can Get Badges
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RadioCard
                      name="can_get_badge"
                      description="User can get badges"
                      value="true"
                      label="Yes"
                      checked={values.can_get_badge}
                      onChange={() => setFieldValue("can_get_badge", true)}
                    />
                    <RadioCard
                      name="can_get_badge"
                      description="User can't get badges"
                      value="false"
                      label="No"
                      checked={!values.can_get_badge}
                      onChange={() => setFieldValue("can_get_badge", false)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="most_popular" className="block text-sm font-medium text-gray-700 mb-1">
                    Most Popular
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RadioCard
                      name="most_popular"
                      description="Show label on the plan"
                      value="true"
                      label="Yes"
                      checked={values.most_popular}
                      onChange={() => setFieldValue("most_popular", true)}
                    />
                    <RadioCard
                      name="most_popular"
                      description="Hide label on the plan"
                      value="false"
                      label="No"
                      checked={!values.most_popular}
                      onChange={() => setFieldValue("most_popular", false)}
                    />
                  </div>
                </div>
              </div>

              <FormikTextField
                name="button_text"
                placeholder="e.g., Get Started, Subscribe Now"
                label="Call-to-Action Button Text"
                type="text"
                className="w-full md:w-9/12 lg:w-1/2"
              />

              <div className="flex flex-col md:flex-row justify-start gap-4 pt-6">
                <Button variant="outlined" className="font-medium hover:text-white" onClick={goBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="green" className="font-medium">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving Plan...
                    </span>
                  ) : (
                    `${isEditMode ? "Update" : "Create"} Subscription Plan`
                  )}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </main>
  );
};

export default CreateEditSubscriptionPlan;
