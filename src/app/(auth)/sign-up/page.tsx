"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Select from "react-select";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Formik, Form, FormikHelpers } from "formik";
import { ChevronLeft, ChevronRight, User, Camera, FileText, Check, Tag, Info, BookOpen, ExternalLink } from "lucide-react";

import TagsInput from "./TagInput";
import Button from "@/components/common/Button";
import FormikTextField from "@/components/common/FormikTextField";
import { apiCall } from "@/utils/apiCall";
import { SignupFormSchema, selectStyles, educationOptions } from "./helper";
import { ISignupFormValues, Step, ApiResponse, EducationOption } from "./type";

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
    title: "Profile & Education",
    subtitle: "Add your photo and educational background (both optional)",
    icon: <Camera className="w-5 h-5" />,
    fields: ["profilePicture", "educationLevel"]
  },
  {
    id: 2,
    title: "Biography",
    subtitle: "Tell us about your professional background (all optional)",
    icon: <FileText className="w-5 h-5" />,
    fields: ["professionalInterests", "extracurriculars", "certifications", "skills"]
  }
];

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState("");

  const handleSignupSubmit = async (values: ISignupFormValues, actions: FormikHelpers<ISignupFormValues>) => {
    if (!acceptedTerms) {
      toast.error("Please accept the Terms and Conditions to continue.");
      return;
    }

    actions.setSubmitting(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    values.profilePicture && formData.append("file", values.profilePicture);
    values.professionalInterests && formData.append("professional_interests", values.professionalInterests);
    values.extracurriculars && formData.append("extracurriculars", values.extracurriculars);
    values.certifications && formData.append("certifications", values.certifications);
    values.educationLevel && formData.append("education", values.educationLevel === "Other" ? values.customEducation : values.educationLevel);
    if (values.skills.length > 0) {
      values.skills.forEach((skill: string) => {
        formData.append("skills[]", skill);
      });
    }
    formData.append("isAgreed", acceptedTerms ? "true" : "false");

    try {
      const response: ApiResponse = await apiCall({
        endPoint: "/auth/register",
        method: "POST",
        body: formData,
        isFormData: true
      });

      actions.setSubmitting(false);

      if (response.success) {
        router.push("/login");
        toast.success(response.message ?? "Account created successfully!");
      } else if (response.message === "Email already registered") {
        setEmailErr(response.message);
        setCurrentStep(0);
      } else {
        toast.error(response.message ?? "Signup failed. Please try again.");
      }
    } catch (error) {
      actions.setSubmitting(false);
      toast.error("An error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
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

  const handleRemoveImage = (setFieldValue: (field: string, value: any) => void) => {
    setProfileImage(null);
    setFieldValue('profilePicture', null);
  };

  const handleSkillsChange = (tags: string[], setFieldValue: (field: string, value: any) => void) => {
    if (tags.length <= 10) {
      setFieldValue('skills', tags);
    } else {
      toast.warning("Maximum 10 skills allowed!");
    }
  };

  const handleEducationChange = (selectedOption: EducationOption | null, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('educationLevel', selectedOption?.value || '');
    if (selectedOption?.value !== 'Other') {
      setFieldValue('customEducation', '');
    }
  };

  const isStepValid = (stepIndex: number, values: ISignupFormValues, errors: any) => {
    const step = steps[stepIndex];
    return step.fields.every((field: keyof ISignupFormValues) => {
      if (field === 'profilePicture' || field === 'educationLevel' ||
        field === 'professionalInterests' || field === 'extracurriculars' ||
        field === 'certifications' || field === 'skills') {
        return true;
      }
      const value = values[field];
      return value?.toString().trim() !== '' && !errors[field];
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step: Step, index: number) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${index < currentStep
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
            : index === currentStep
              ? 'bg-[var(--base)] border-[var(--base)] text-white shadow-lg'
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

  const renderStep1 = () => {
    return (
      <div className="space-y-6">
        <FormikTextField
          name="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
        />
        <div>
          <FormikTextField
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email address"
            onChange={() => setEmailErr("")}
          />
          {emailErr && (
            <div className="text-red-500 text-sm mt-1">
              {emailErr}
            </div>
          )}
        </div>
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
      </div>
    );
  }

  const renderStep2 = (values: ISignupFormValues, setFieldValue: (field: string, value: any) => void) => {
    return (
      <div className="space-y-8">
        <div>
          <div>
            <div className="mb-6 flex gap-3 lg:gap-6 items items-center">
              <div className="relative min-w-16 h-16 lg:w-23 lg:h-23">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="h-fit flex justify-center space-x-3">
                  {!profileImage ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="profilePicture"
                        onChange={(e) => handleImageUpload(e, setFieldValue)}
                      />
                      <label
                        htmlFor="profilePicture"
                        className="cursor-pointer px-2 py-2 ml-[-8px] rounded-lg font-medium flex items-center space-x-2 text-[var(--base)]"
                      >
                        <span>Upload Photo</span>
                      </label>
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="changeProfilePicture"
                        onChange={(e) => handleImageUpload(e, setFieldValue)}
                      />
                      <label
                        htmlFor="changeProfilePicture"
                        className="cursor-pointer px-2 py-2 ml-[-8px] rounded-lg font-medium flex items-center m-0 text-indigo-500"
                      >
                        <span className="font-bold">Change</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(setFieldValue)}
                        className=" text-red-500 px-2 py-2 rounded-lg font-medium flex items-center space-x-2 cursor-pointer"
                      >
                        <span className="font-bold">Remove</span>
                      </button>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    We support PNGs, JPEGs and GIFs under 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-1 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Education (Optional)</span>
          </h4>

          <div>
            <Select
              isClearable
              isSearchable
              classNamePrefix="react-select"
              styles={selectStyles}
              options={educationOptions}
              className="text-black"
              placeholder="Search or select your education level"
              value={educationOptions.find(option => option.value === values.educationLevel) || null}
              onChange={(selectedOption) => handleEducationChange(selectedOption, setFieldValue)}
            />
          </div>
          {values.educationLevel === 'Other' && (
            <div className="animate-in slide-in-from-top-4 duration-300 ease-out">
              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-sm font-semibold text-gray-700">
                    Please specify your education
                  </div>
                </div>
                <input
                  type="text"
                  name="customEducation"
                  value={values.customEducation || ''}
                  onChange={(e) => setFieldValue('customEducation', e.target.value)}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-black placeholder-gray-500 bg-white shadow-sm"
                  placeholder="e.g., Trade School, Bootcamp, Self-taught, Online Courses..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderStep3 = (values: ISignupFormValues, setFieldValue: (field: string, value: any) => void) => {
    return (
      <div className="space-y-6">
        <div>
          <div className="block text-sm font-semibold text-gray-700 mb-2">
            Professional Interests
          </div>
          <textarea
            rows={3}
            name="professionalInterests"
            value={values.professionalInterests}
            onChange={(e) => setFieldValue('professionalInterests', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-black"
            placeholder="What are your professional interests and career goals? (Optional)"
          />
        </div>
        <div>
          <div className="block text-sm font-semibold text-gray-700 mb-2">
            Extracurricular Activities
          </div>
          <textarea
            rows={3}
            name="extracurriculars"
            value={values.extracurriculars}
            onChange={(e) => setFieldValue('extracurriculars', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-black"
            placeholder="Sports, clubs, volunteer work, hobbies, community involvement... (Optional)"
          />
        </div>
        <div>
          <div className="block text-sm font-semibold text-gray-700 mb-2">
            Certifications
          </div>
          <input
            type="text"
            name="certifications"
            value={values.certifications}
            onChange={(e) => setFieldValue('certifications', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
            placeholder="List your certifications (e.g., PMP, AWS, Google Analytics...) (Optional)"
          />
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="block text-sm font-semibold text-gray-700">
              Skills
            </div>
            <Tag className="w-4 h-4 text-gray-600" />
          </div>
          <div className="skill-tags-container">
            <TagsInput
              tags={values.skills || []}
              handleSkillsChange={(tags: any) => handleSkillsChange(tags, setFieldValue)}
            />
          </div>
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">How to add skills:</div>
                <ul className="space-y-1 text-xs">
                  <li>• Press <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> to add a tag</li>
                  <li>• Maximum <strong>10 tags</strong> allowed ({Array.isArray(values.skills) ? values.skills.length : 0}/10)</li>
                  <li>• Allowed characters: letters, numbers, space, dash (-), and underscore (_)</li>
                  <li>• Examples: JavaScript, React, Project-Management, UI_UX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div>
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 rounded-lg transition-all duration-200">
                    <div className="flex items-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="appearance-none w-6 h-6 border-[1.5px] border-gray-300 rounded-sm
                        bg-white checked:bg-purple-500 checked:border-purple-500 cursor-pointer
                          relative transition-colors duration-200  checked:after:content-['✓']
                          checked:after:font-bold checked:after:left-[5px] checked:after:absolute 
                        checked:after:text-white checked:after:text-sm checked:after:top-[0px]"
                      />
                    </div>
                    <label htmlFor="acceptTerms" className="flex-1">
                      <div className="mt-[4px] text-sm text-gray-700">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 font-medium underline inline-flex items-center"
                        >
                          Terms of Service
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                        {" "}and{" "}
                        <Link
                          href="/privacy"
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 font-medium underline inline-flex items-center"
                        >
                          Privacy Policy
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = (values: ISignupFormValues, setFieldValue: (field: string, value: any) => void) => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2(values, setFieldValue);
      case 2:
        return renderStep3(values, setFieldValue);
      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-12 lg:pt-6 flex flex-col justify-between h-full">
          <div>
            <div className="mb-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <h1 className="text-2xl md:text-3xl text-[var(--base)] font-bold  mb-4 animate-fade-in">
                  CampusGig
                </h1>
              </div>
            </div>
            {renderStepIndicator()}
            <div>
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
                  skills: [],
                  educationLevel: "",
                  customEducation: ""
                }}
                onSubmit={handleSignupSubmit}
                validationSchema={SignupFormSchema}
              >
                {({ values, errors, isSubmitting, setFieldValue }) => (
                  <Form className="space-y-6">
                    {renderStepContent(values, setFieldValue)}
                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center space-x-2 text-[13px] lg:text-[15px] px-3 lg:px-8 py-3 rounded-lg lg:font-medium transition-all duration-200 ${currentStep === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 cursor-pointer'
                          }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      {currentStep === steps.length - 1 ? (
                        <Button
                          type="submit"
                          variant="green"
                          disabled={isSubmitting || !isStepValid(currentStep, values, errors) || !acceptedTerms}
                          className="flex items-center space-x-2 text-[13px] lg:text-[15px] lg:font-medium px-3 lg:px-8 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
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
                            ? 'bg-[var(--base)] hover:bg-[var(--base-hover)] text-white shadow-lg hover:shadow-xl cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6">
                      Already have an account?{" "}
                      <Link href="/login" className="text-[var(--base)] font-medium hover:underline">
                        Log In
                      </Link>
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <div className="relative w-full h-full bg-[#fff] text-white min-h-[600px] hidden lg:block">
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