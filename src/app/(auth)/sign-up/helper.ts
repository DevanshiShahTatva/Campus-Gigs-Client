import * as yup from "yup";

export const SignupFormSchema = yup.object().shape({
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

  professionalInterests: yup.string(),
  extracurriculars: yup.string(),
  certifications: yup.string(),
  skills: yup.array(),
  educationLevel: yup.string(),
});

export const educationOptions = [
  { value: "High School", label: "High School" },
  { value: "Associate Degree", label: "Associate Degree" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "Doctoral Degree", label: "Doctoral Degree" },
  { value: "Professional Certificate", label: "Professional Certificate" },
  { value: "Diploma", label: "Diploma" },
  { value: "Other", label: "Other" }
];

export const selectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '43px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    '&:hover': {
      borderColor: '#3b82f6'
    },
    '&:focus-within': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 1px #3b82f6'
    }
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: '170px',
    overflowY: 'auto',
    borderRadius: '8px',
  }),
  option: (base: any, state: any) => ({
    ...base,
    padding: '5px 8px',
    color: '#111827',
    cursor: 'pointer',
    backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af'
  })
};