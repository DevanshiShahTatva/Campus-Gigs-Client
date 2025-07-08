"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, FormikHelpers } from "formik";

import { apiCall } from "@/utils/apiCall";
import Button from "@/components/common/Button";
import FormikTextField from "@/components/common/FormikTextField";

interface IForgotPassValues {
  email: string;
}

const ForgotPassSchema = yup.object().shape({
  email: yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});

function ForgotPasswordPage() {

  const router = useRouter();

  const handleForgotPassSubmit = async (values: IForgotPassValues, actions: FormikHelpers<IForgotPassValues>) => {
    actions.setSubmitting(true);
    const response = await apiCall({
      endPoint: "/auth/forgot-password",
      method: "POST",
      body: {
        email: values.email,
      },
    });
    if (response.success) {
      toast.success(response.message);
      localStorage.setItem("resetPassEmail", values.email);
      router.push("/reset-password");
    } else {
      toast.error(response.message ?? "Something went wrong. Please try again.");
    }
    actions.setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-16 pt-3 lg:pt-6 flex flex-col justify-between h-full">
          <div>
            <div className="w-fit">
              <Link href="/">
                <img src="/logo.svg" alt="" height={40} width={266} />
              </Link>
            </div>
            <div className="mb-8 mt-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500">
                Enter your email address and we'll send you a One-Time Password
                (OTP) to reset your password.
              </p>
            </div>
            <Formik
              initialValues={{
                email: ""
              }}
              onSubmit={handleForgotPassSubmit}
              validationSchema={ForgotPassSchema}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <FormikTextField name="email" placeholder="Enter your email" label="Email" type="email" />
                  <Button
                    type="submit"
                    variant="green"
                    disabled={isSubmitting}
                    className="w-full py-3 transition-colors disabled:opacity-50 "
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Remember your password?{" "}
                    <Link
                      href="/login"
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
    </div>
  );
}

export default ForgotPasswordPage;