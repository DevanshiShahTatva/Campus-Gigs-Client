"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Formik, Form, FormikHelpers } from "formik";

import Button from "@/components/common/Button";
import FormikTextField from "@/components/common/FormikTextField";
import { apiCall } from "@/utils/apiCall";

export interface ISignupFormValues {
  name: string;
  email: string;
  password: string;
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
});

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignupSubmit = async (values: ISignupFormValues, actions: FormikHelpers<ISignupFormValues>) => {
    actions.setSubmitting(true);

    const response = await apiCall({
      endPoint: "/sign-up",
      method: "POST",
      body: values,
    });

    actions.setSubmitting(false);

    if (response.success) {
      router.push("/login");
      toast.success(response.message);
    } else {
      toast.error(response.message ?? "Signup failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-16 flex flex-col justify-between h-full">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
            </div>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
              }}
              validationSchema={SignupFormSchema}
              onSubmit={handleSignupSubmit}>
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <FormikTextField name="name" label="Your Name" placeholder="Enter your name" type="text" />
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
                  <Button
                    type="submit"
                    variant="black"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg transition-colors disabled:opacity-50">
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link href={"/login"} className="text-black font-medium hover:underline">
                      Log In
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
            priority
            alt="signup illustration"
            className="object-contain p-8"
            src="https://rsssc.org/assest/img/Login.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
