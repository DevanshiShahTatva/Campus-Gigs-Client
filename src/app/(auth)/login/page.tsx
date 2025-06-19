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
import FormikTextField from "@/components/common/FormikTextField";
import Button from "@/components/common/Button";

interface ILogInFormValues {
  email: string;
  password: string;
}

const logInFormSchema = yup.object().shape({
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
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
});

const LogInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogInSubmit = async (values: ILogInFormValues, actions: FormikHelpers<ILogInFormValues>) => {
    actions.setSubmitting(true);

    const response = await apiCall({
      endPoint: "/login",
      method: "POST",
      body: {},
    });

    actions.setSubmitting(false);

    if (response.success) {
      const { role } = response.data;
      if (role === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }

      toast.success(response.message);
    } else {
      toast.error(response.message ?? "Login failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-16 flex flex-col justify-between h-full">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-sm text-gray-500">Enter your email and password to access your account.</p>
            </div>
            <Formik
              initialValues={{
                email: "",
                password: ""
              }}
              validationSchema={logInFormSchema}
              onSubmit={handleLogInSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <FormikTextField name="email" label="Email" placeholder="Enter your email" type="email" />
                  <FormikTextField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    endIcon={
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="text-gray-500 cursor-pointer"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-6 w-6 text-gray-500 mt-1" />
                        ) : (
                          <FiEye className="h-6 w-6 text-gray-500 mt-1" />
                        )}
                      </button>
                    }
                  />
                  <div className="flex items-center justify-end text-sm text-gray-600">
                    <Link href="/reset-password" className="text-[#4F46E5] hover:underline font-medium">
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full py-3 transition-colors disabled:opacity-50 bg-[#218189]">
                    {isSubmitting ? "Logging In..." : "Log In"}
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    {"Don't have an account? "}
                    <Link href="/sign-up" className="text-[#4F46E5] font-medium hover:underline">
                      Register Now.
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
            alt="dashboard preview"
            className="object-contain p-8"
            src="https://rsssc.org/assest/img/Login.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default LogInPage;