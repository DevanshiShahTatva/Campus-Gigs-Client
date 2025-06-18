"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      endPoint: "/reset-password",
      method: "POST",
      body: {
        password: values.confirmPassword,
        email: localStorage.getItem("resetPassEmail"),
        otp: values.otp.toString()
      },
    });

    if (response.success) {
      toast.success(response.message);
      router.push("/login");
      localStorage.removeItem("resetPassEmail");
    }
    actions.setSubmitting(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-16 flex flex-col justify-between h-full">
          <div>
            <div className="mb-8">
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
                  <FormikTextField
                    name="otp"
                    label="OTP (6-digit code)"
                    type="number"
                    maxLength={6}
                    placeholder="Enter OTP"
                  />
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
                    variant="primary"
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
                      className="text-[#4F46E5] font-medium hover:underline"
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
        <div className="relative w-full h-full bg-[#fff] text-white">
          <Image
            fill
            alt="reset password illustration"
            className="object-contain p-8"
            src="https://rsssc.org/assest/img/Login.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
