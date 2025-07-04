"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiX, FiCheck, FiAlertCircle, FiLoader } from "react-icons/fi";
import { Formik, Form, FormikHelpers } from "formik";
import { apiCall } from "@/utils/apiCall";
import FormikTextField from "@/components/common/FormikTextField";
import Button from "@/components/common/Button";
import moment from "moment";
import Cookie from 'js-cookie';
import { useDispatch } from "react-redux";
import { setAuthData } from '@/redux/slices/userSlice';

import "../../termsContent.css";

interface ILogInFormValues {
  email: string;
  password: string;
}

interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    role: string;
    token: string;
    user: any;
  };
}

interface ITermsResponse {
  success: boolean;
  data: {
    title: string;
    content: string;
    updatedAt: string;
  };
}

const logInFormSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .test("email-format", "Please enter a valid email address", (value) => {
      if (!value) return true;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    }),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be no more than 50 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex flex-col items-center gap-3">
      <FiLoader className="h-8 w-8 text-[#218189] animate-spin" />
      <p className="text-sm text-gray-600">Loading terms and conditions...</p>
    </div>
  </div>
);

const TermsModal = ({
  isOpen,
  loginResponse,
  onAccept,
  onDecline,
}: {
  isOpen: boolean;
  loginResponse: ILoginResponse | null;
  onAccept: () => void;
  onDecline: () => void;
}) => {
  const [termsData, setTermsData] = useState<ITermsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !termsData) {
      fetchTermsAndConditions();
    }
  }, [isOpen]);

  const fetchTermsAndConditions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall({
        endPoint: "/terms-conditions",
        method: "GET",
      });

      if (response.success) {
        setTermsData(response.data[0]);
      } else {
        setError(response.message ?? "Failed to load terms and conditions");
      }
    } catch (err) {
      console.log("Err" + err);
      setError("Failed to load terms and conditions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const acceptTermAndCondition = async () => {
    try {
      const response = await apiCall({
        endPoint: "/auth/agreed-terms-policy",
        method: "PUT",
        body: {
          is_agreed: true,
          userId: loginResponse?.data.user._id,
        },
      });

      if (response.success) {
        onAccept();
      } else {
        toast.error(response.message ?? "Failed to accept terms and conditions. Please try again.");
      }
    } catch (err) {
      console.log("Err" + err);
      toast.error("Failed to accept terms and conditions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchTermsAndConditions();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-[#218189] to-[#1a6b72] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="h-6 w-6" />
              <h3 className="text-xl font-bold">Terms and Conditions</h3>
            </div>
            <button onClick={() => onDecline()} className="text-white hover:text-gray-200 transition-colors">
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-blue-100 mt-2">Please read and accept our terms to continue</p>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading && <LoadingSpinner />}
          {!isLoading && error && (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <FiAlertCircle className="h-12 w-12 mx-auto mb-3" />
                <p className="text-lg font-semibold">Unable to Load Terms</p>
                <p className="text-sm text-gray-600 mt-2">{error}</p>
              </div>
              <button onClick={handleRetry} className="px-4 py-2 bg-[#218189] text-white rounded-lg hover:bg-[#1a6b72] transition-colors text-sm">
                Try Again
              </button>
            </div>
          )}
          {!isLoading && !error && termsData && (
            <div className="prose prose-sm max-w-none">
              <div className="space-y-6 text-gray-700">
                <div className="text-sm terms-and-conditions" dangerouslySetInnerHTML={{ __html: termsData.content }} />
              </div>
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-800">
                  <strong>Last Updated:</strong>{" "}
                  {termsData.updatedAt ? moment(termsData.updatedAt).format("DD/MM/YYYY HH:mm") : moment().format("DD/MM/YYYY HH:mm")}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  By clicking "I Agree", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          )}
          {!isLoading && !error && !termsData && <div className="text-center py-8 text-gray-500">No terms data available</div>}
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onDecline}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Decline
            </button>
            <button
              onClick={() => acceptTermAndCondition()}
              disabled={isLoading || !!error || !termsData}
              className="px-6 py-2 bg-[#218189] text-white rounded-lg hover:bg-[#1a6b72] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiCheck className="h-4 w-4" />I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loginResponse, setLoginResponse] = useState<ILoginResponse | null>(null);
  const dispatch = useDispatch();

  const handleLogInSubmit = async (values: ILogInFormValues, actions: FormikHelpers<ILogInFormValues>) => {
    actions.setSubmitting(true);

    const response = await apiCall({
      endPoint: "/auth/login",
      method: "POST",
      body: {
        email: values.email,
        password: values.password,
      },
    });

    actions.setSubmitting(false);

    if (response.success) {
      if (response.data?.user?.is_agreed || response.data?.user?.role === "admin") {
        handleAllowedLogin(response);
      } else {
        setLoginResponse(response);
        setShowTermsModal(true);
      }
    } else {
      toast.error(response.message ?? "Login failed. Please try again.");
    }
  };

  const handleAllowedLogin = (loginResponse: ILoginResponse | null) => {
    if (loginResponse) {
      if (loginResponse.data?.token && loginResponse.data.user) {
        Cookie.set("token", loginResponse.data.token);
        document.cookie = `token=${loginResponse.data.token}; path=/;`;
        dispatch(setAuthData({
          token: loginResponse.data.token,
          name: loginResponse.data.user.name,
          profile: loginResponse.data.user.profile,
          user_id: loginResponse.data.user.id,
        }));
      }
      if (loginResponse.success) {
        toast.success(loginResponse.message);
      } else {
        toast.error(loginResponse.message ?? "Login failed. Please try again.");
      }
      const { role } = loginResponse.data.user;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }

    setShowTermsModal(false);
    setLoginResponse(null);
  };

  const handleTermsDecline = () => {
    setShowTermsModal(false);
    setLoginResponse(null);
    toast.info("You must accept the terms and conditions to continue.");
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
          <div className="p-8 lg:p-16 pt-3 lg:pt-6 flex flex-col justify-between h-full">
            <Link href="/" className="mb-10 w-fit">
              <img src="/logo.svg" alt="" height={40} width={266} />
            </Link>
            <div>
              <div className="mb-5">
                <p className="text-sm text-gray-500">Enter your email and password to access your account.</p>
              </div>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                onSubmit={handleLogInSubmit}
                validationSchema={logInFormSchema}
              >
                {({ isSubmitting }: any) => (
                  <Form className="space-y-5">
                    <FormikTextField name="email" label="Email" placeholder="Enter your email" type="email" />
                    <FormikTextField
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      endIcon={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 cursor-pointer">
                          {showPassword ? <FiEyeOff className="h-6 w-6 text-gray-500 mt-1" /> : <FiEye className="h-6 w-6 text-gray-500 mt-1" />}
                        </button>
                      }
                    />
                    <div className="flex items-center justify-end text-sm text-gray-600">
                      <Link href="/forgot-password" className="text-[var(--base)] hover:underline font-medium">
                        Forgot Password?
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      variant="green"
                      disabled={isSubmitting}
                      className="w-full py-3 transition-colors disabled:opacity-50 bg-[#218189]"
                    >
                      {isSubmitting ? "Logging In..." : "Log In"}
                    </Button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      {"Don't have an account? "}
                      <Link href="/sign-up" className="text-[var(--base)] font-medium hover:underline">
                        Register Now.
                      </Link>
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
            <p className="text-xs text-gray-400 text-center mt-10">Copyright © {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          <div className="relative w-full h-full bg-[#fff] text-white hidden lg:block">
            <img src="/illustration.svg" alt="" />
          </div>
        </div>
      </section>
      <TermsModal
        loginResponse={loginResponse}
        isOpen={showTermsModal}
        onDecline={handleTermsDecline}
        onAccept={() => handleAllowedLogin(loginResponse)}
      />
    </>
  );
};

export default LogInPage;
