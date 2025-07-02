import * as yup from "yup";

export const SignupFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be no more than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

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

  professional_interests: yup.string(),
  extracurriculars: yup.string(),
  certifications: yup.string(),
  skills: yup.array(),
  educationLevel: yup.string(),
});

export const educationOptions = [
  { id: "highschool", label: "High School" },
  { id: "associate", label: "Associate Degree" },
  { id: "bachelor", label: "Bachelor's Degree" },
  { id: "masters", label: "Master's Degree" },
  { id: "doctoral", label: "Doctoral Degree" },
  { id: "professional", label: "Professional Certificate" },
  { id: "Diploma", label: "Diploma" },
  { id: "Other", label: "Other" },
];