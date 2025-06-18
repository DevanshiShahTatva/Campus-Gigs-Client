export interface ISignupFormValues {
  name: string;
  email: string;
  password: string;

  educationLevel: string;
  customEducation: string;
  profilePicture: File | null;

  professionalInterests: string;
  extracurriculars: string;
  certifications: string;
  skills: string[];

}

export interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  fields: (keyof ISignupFormValues)[];
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface EducationOption {
  value: string;
  label: string;
}