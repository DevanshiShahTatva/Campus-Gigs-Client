export interface ISignupFormValues {
  name: string;
  email: string;
  password: string;

  educationLevel: string;
  customEducation: string;
  profile: File | null;

  professional_interests: string;
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
  data?: {
    token: string;
    user: {
      name: string;
      profile: string;
      id: string;
      profile_type: string;
    };
  };
}

export interface EducationOption {
  value: string;
  label: string;
}
