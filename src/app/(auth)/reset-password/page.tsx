"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Formik, Form, FormikHelpers } from "formik";

import { apiCall } from "@/utils/apiCall";
import Button from "@/components/common/Button";
import FormikTextField from "@/components/common/FormikTextField";

interface IResetPassValues {
  otp: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPassSchema = yup.object({
  otp: yup.number()
    .typeError("OTP must be a number")
    .required("OTP is required")
    .test("len", "OTP must be 6 digits", val => {
      if (val === undefined || val === null) return false;
      return val.toString().length === 6;
    }),

  newPassword: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be no more than 50 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

  confirmPassword: yup.string()
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPasswordPage = () => {
  const router = useRouter();

  const [otpError, setOtpError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleResetPassSubmit = async (
    values: IResetPassValues,
    actions: FormikHelpers<IResetPassValues>
  ) => {
    actions.setSubmitting(true);
    const response = await apiCall({
      endPoint: "/auth/reset-password",
      method: "POST",
      body: {
        otp: values.otp.toString(),
        password: values.confirmPassword,
        email: typeof window !== "undefined" ? localStorage?.getItem("resetPassEmail") : undefined,
      },
    });

    if (response.success) {
      toast.success(response.data?.message ?? "Password reset successfully. You can now log in.");
      router.push("/login");
      if (typeof window !== "undefined") {
        localStorage?.removeItem("resetPassEmail");
      }
    } else if (response.message === "Invalid otp") {
      setOtpError("Invalid OTP!");
    } else {
      toast.error(response.message ?? "Something went wrong. Please try again.");
    }
    actions.setSubmitting(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-16 pt-3 lg:pt-6 flex flex-col justify-between h-full">
          <Link href="/" className="w-fit">
            <img src="/logo.svg" alt="" height={40} width={266} />
          </Link>
          <div>
            <div className="mb-8 mt-10 ">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Your Password
              </h2>
              <p className="text-sm text-gray-500">
                Enter the OTP sent to your email, then set your new password.
              </p>
            </div>
            <Formik
              initialValues={{
                otp: "",
                email: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={ResetPassSchema}
              onSubmit={handleResetPassSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <FormikTextField
                      name="otp"
                      label="OTP (6-digit code)"
                      type="number"
                      maxLength={6}
                      placeholder="Enter OTP"
                      onChange={() => setOtpError("")}
                    />
                    {otpError && (
                      <p className="text-red-500 text-sm mt-1">{otpError}</p>
                    )}
                  </div>
                  <FormikTextField
                    name="newPassword"
                    label="New Password"
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    endIcon={
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("newPassword")
                        }
                        className="text-gray-500 cursor-pointer"
                      >
                        {showPassword.newPassword ? (
                          <FiEyeOff className="h-6 w-6 text-gray-500 mt-1" />
                        ) : (
                          <FiEye className="h-6 w-6 text-gray-500 mt-1" />
                        )}
                      </button>
                    }
                  />
                  <FormikTextField
                    name="confirmPassword"
                    label="Confirm New Password"
                    placeholder="Enter your confirm new password"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    endIcon={
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        className="text-gray-500 cursor-pointer"
                      >
                        {showPassword.confirmPassword ? (
                          <FiEyeOff className="h-6 w-6 text-gray-500 " />
                        ) : (
                          <FiEye className="h-6 w-6 text-gray-500 " />
                        )}
                      </button>
                    }
                  />
                  <Button
                    type="submit"
                    variant="green"
                    disabled={isSubmitting}
                    className="w-full py-3 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Resetting Password..."
                      : "Reset Password"
                    }
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Remembered your password?{" "}
                    <Link
                      href={"login"}
                      className="text-[var(--base)] font-medium hover:underline"
                    >
                      Go back to login.
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
          <p className="text-xs text-gray-400 text-center mt-10">
            Copyright © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
        <div className="relative w-full h-full bg-[#fff] text-white hidden lg:block">
          <img src="/illustration.svg" alt="" />
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
