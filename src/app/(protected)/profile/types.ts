// Profile page types
// Add any interfaces/types used in the profile page here, e.g.:
export interface UserProfile {
  email: string;
  name: string;
  profilePicture: File | null;
  phone: string;
  address: string;
  headline: string;
  bio: string;
}

export interface ProfileFormValues {
  profilePicture: File | null;
  name: string;
  phone: string;
  address: string;
  skills: string[];
  certifications: string;
  professionalInterests: string;
  extracurriculars: string;
  bio: string;
  educationLevel: string;
  customEducation: string;
  headline: string;
} 