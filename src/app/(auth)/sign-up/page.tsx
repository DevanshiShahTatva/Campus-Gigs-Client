"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { ChevronLeft, ChevronRight, User, Camera, FileText, GraduationCap, Check } from "lucide-react";

import Button from "@/components/common/Button";
import FormikTextField from "@/components/common/FormikTextField";
import { apiCall } from "@/utils/apiCall";

export interface ISignupFormValues {
  name: string;
  email: string;
  password: string;

  profilePicture: File | null;

  professionalInterests: string;
  extracurriculars: string;
  certifications: string;
  skills: string;

  educationLevel: string;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  fields: (keyof ISignupFormValues)[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const SignupFormSchema = yup.object().shape({
  name: yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be no more than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

  email: yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be no more than 50 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

  professionalInterests: yup.string().required("Professional interests are required"),
  extracurriculars: yup.string().required("Extracurricular activities are required"),
  certifications: yup.string().required("Certifications are required"),
  skills: yup.string().required("Skills are required"),
  educationLevel: yup.string().required("Education level is required"),
});

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const steps: Step[] = [
    {
      id: 0,
      title: "Basic Information",
      subtitle: "Let's start with your essential details",
      icon: <User className="w-5 h-5" />,
      fields: ["name", "email", "password"]
    },
    {
      id: 1,
      title: "Profile Picture",
      subtitle: "Add your photo to personalize your profile",
      icon: <Camera className="w-5 h-5" />,
      fields: ["profilePicture"]
    },
    {
      id: 2,
      title: "Biography",
      subtitle: "Tell us about your professional background",
      icon: <FileText className="w-5 h-5" />,
      fields: ["professionalInterests", "extracurriculars", "certifications", "skills"]
    },
    {
      id: 3,
      title: "Education",
      subtitle: "Your educational background",
      icon: <GraduationCap className="w-5 h-5" />,
      fields: ["educationLevel"]
    }
  ];

  const educationLevels: string[] = [
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree",
    "Professional Certificate",
    "Diploma",
    "Other"
  ];

  const handleSignupSubmit = async (
    values: ISignupFormValues,
    actions: FormikHelpers<ISignupFormValues>
  ): Promise<void> => {
    actions.setSubmitting(true);

    try {
      const response: ApiResponse = await apiCall({
        endPoint: "/sign-up",
        method: "POST",
        body: values,
      });

      actions.setSubmitting(false);

      if (response.success) {
        router.push("/login");
        toast.success(response.message || "Account created successfully!");
      } else {
        toast.error(response.message ?? "Signup failed. Please try again.");
      }
    } catch (error) {
      actions.setSubmitting(false);
      toast.error("An error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          setFieldValue('profilePicture', file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isStepValid = (
    stepIndex: number,
    values: ISignupFormValues,
    errors: Record<string, string>
  ): boolean => {
    const step = steps[stepIndex];
    return step.fields.every((field: keyof ISignupFormValues) => {
      if (field === 'profilePicture') return true; // Optional
      const value = values[field];
      return value?.toString().trim() !== '' && !errors[field];
    });
  };

  const nextStep = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = (): React.ReactNode => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step: Step, index: number) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${index < currentStep
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
            : index === currentStep
              ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
              : 'bg-white border-gray-300 text-gray-400'
            }`}>
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              step.icon
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-3 transition-all duration-300 ${index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
              }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = (
    values: ISignupFormValues,
    errors: Record<string, string>,
    setFieldValue: (field: string, value: any) => void,
    isSubmitting: boolean
  ): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <FormikTextField
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />
            <FormikTextField
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
            />
            <FormikTextField
              name="password"
              label="Password"
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              }
            />
            <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Password must contain:</p>
              <ul className="space-y-1">
                <li>• At least 8 characters</li>
                <li>• One uppercase and lowercase letter</li>
                <li>• One number and special character</li>
              </ul>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-6">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  {profileImage && (
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {profileImage ? 'Change Photo' : 'Upload Photo'}
                </label>
                <p className="text-sm text-gray-500 mt-3">
                  JPG, PNG up to 5MB (Optional)
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Interests *
              </label>
              <textarea
                name="professionalInterests"
                value={values.professionalInterests}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFieldValue('professionalInterests', e.target.value)
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-black"
                placeholder="What are your professional interests and career goals?"
              />
              {errors.professionalInterests && (
                <p className="text-red-500 text-xs mt-1">{errors.professionalInterests}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Extracurricular Activities *
              </label>
              <textarea
                name="extracurriculars"
                value={values.extracurriculars}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFieldValue('extracurriculars', e.target.value)
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-black"
                placeholder="Sports, clubs, volunteer work, hobbies, community involvement..."
              />
              {errors.extracurriculars && (
                <p className="text-red-500 text-xs mt-1">{errors.extracurriculars}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Certifications *
              </label>
              <input
                type="text"
                name="certifications"
                value={values.certifications}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('certifications', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                placeholder="List your certifications (e.g., PMP, AWS, Google Analytics...)"
              />
              {errors.certifications && (
                <p className="text-red-500 text-xs mt-1">{errors.certifications}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills *
              </label>
              <input
                type="text"
                name="skills"
                value={values.skills}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('skills', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                placeholder="List your key skills (e.g., JavaScript, Project Management, Design...)"
              />
              {errors.skills && (
                <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Highest Education Level *
              </label>
              <select
                name="educationLevel"
                value={values.educationLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFieldValue('educationLevel', e.target.value)
                }
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select your education level</option>
                {educationLevels.map((level: string) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {errors.educationLevel && (
                <p className="text-red-500 text-xs mt-1">{errors.educationLevel}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-12 flex flex-col justify-between h-full">
          <div>
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
            {renderStepIndicator()}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {steps[currentStep].subtitle}
                </p>
              </div>
              <Formik<ISignupFormValues>
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  profilePicture: null,
                  professionalInterests: "",
                  extracurriculars: "",
                  certifications: "",
                  skills: "",
                  educationLevel: "",
                }}
                validationSchema={SignupFormSchema}
                onSubmit={handleSignupSubmit}
              >
                {({ values, errors, isSubmitting, setFieldValue }: FormikProps<ISignupFormValues>) => (
                  <Form className="space-y-6">
                    {renderStepContent(values, errors, setFieldValue, isSubmitting)}
                    <div className="flex justify-between items-center pt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                          }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      {currentStep === steps.length - 1 ? (
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isSubmitting || !isStepValid(currentStep, values, errors)}
                          className="flex items-center space-x-2 px-8 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {isSubmitting ? "Creating Account..." : "Create Account"}
                          <Check className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStepValid(currentStep, values, errors)}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isStepValid(currentStep, values, errors)
                            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6">
                      Already have an account?{" "}
                      <Link href={"/login"} className="text-blue-600 font-medium hover:underline">
                        Log In
                      </Link>
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-10">
            Copyright © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
        <div className="relative w-full h-full bg-[#fff] text-white min-h-[600px]">
          <Image
            fill
            priority
            alt="signup"
            className="object-contain p-8"
            src="https://rsssc.org/assest/img/Login.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;