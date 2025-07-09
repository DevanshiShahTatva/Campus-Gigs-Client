"use client";
import React, { useState, useRef, useContext, useMemo } from "react";
import { FiUpload, FiCamera, FiTrash2 } from "react-icons/fi";
import DynamicForm from "@/components/common/form/DynamicForm";
import { apiCall } from "@/utils/apiCall";
import { RoleContext } from "@/context/role-context";
import { getInitials, profileFormConfig } from "./helper";
import { USER_PROFILE } from "@/utils/constant";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/api";

// Custom Profile Photo Component
const ProfilePhotoUpload = ({
  value,
  onChange,
  name,
}: {
  value: File | null;
  onChange: (file: File | null) => void;
  name: string;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL when file is selected
  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        onChange(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        onChange(file);
      }
    }
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-32 h-32 rounded-full cursor-pointer"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {previewUrl ? (
          // Show uploaded image
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          // Show initials by default
          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">
              {getInitials(name)}
            </span>
          </div>
        )}

        {/* Hover overlay for change photo option */}
        {isHovered && !isDragOver && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <FiUpload className="w-6 h-6 text-white mx-auto mb-1" />
              <p className="text-xs text-white">Change Photo</p>
            </div>
          </div>
        )}

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
            <FiUpload className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload profile photo"
        title="Upload profile photo"
      />
    </div>
  );
};

const Profile = () => {
  const [success, setSuccess] = React.useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "gigs" | "history" | "support" | "subscription" | "settings"
  >("profile");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const { role: profileMode } = useContext(RoleContext);
  const { data, isLoading } = useGetUserProfileQuery(undefined, { refetchOnMountOrArgChange: true });
  const userProfile = data?.data;
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  // Merge userProfile into initialValues for the form
  const formInitialValues = useMemo(() => {
    if (!userProfile) return undefined;
    return {
      name: userProfile.name || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      address: userProfile.location || "",
      educationLevel: userProfile.education || "",
      customEducation: userProfile.customEducation || "",
      professionalInterests: userProfile.professional_interests || "",
      extracurriculars: userProfile.extracurriculars || "",
      certifications: userProfile.certifications || "",
      skills: Array.isArray(userProfile.skills) ? userProfile.skills : [],
      headline: userProfile.headline || "",
      bio: userProfile.bio || "",
    };
  }, [userProfile]);

  // Function to handle profile update API call
  const handleProfileUpdate = async (values: any) => {
    try {
      await updateUserProfile(values).unwrap();
      toast.success("Profile updated successfully");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      setSuccess(false);
      toast.error("Failed to update profile");
    }
  };

  if (isLoading || !userProfile) {
    return <ProfileSkeleton />;
  }
  return (
    <div>
      {/* Main LinkedIn-style Card */}
      <div className=" bg-white rounded  ">
        {/* Cover Image or Gradient */}
        <div className="relative shadow pb-8 rounded-2xl">
          <div className="w-full h-48 bg-gray-300 relative rounded-t-2xl overflow-hidden group/cover">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover "
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--base), var(--base-hover) 100%)",
                }}
              />
            )}
            {/* Animated Hover Overlay for Cover Image */}
            <div className="absolute top-4 right-4 flex flex-row gap-3 pointer-events-auto opacity-0 group-hover/cover:opacity-100 transition-opacity duration-400 ease-in-out z-10">
              {/* Camera Icon - always shown */}
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-400 ease-in-out bg-white/90 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  coverInputRef.current?.click();
                }}
                title={coverImage ? "Change Cover Image" : "Add Cover Image"}
                type="button"
              >
                <FiCamera className="w-6 h-6 text-[var(--base)]" />
              </button>
              {/* Trash Icon - only if cover image is set */}
              {coverImage && (
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-400 ease-in-out bg-white/90 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCoverImage(null);
                  }}
                  title="Remove Cover Image"
                  type="button"
                >
                  <FiTrash2 className="w-6 h-6 text-red-600" />
                </button>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setCoverImage(url);
                  }
                }}
                aria-label="Upload cover image"
                title="Upload cover image"
              />
            </div>
          </div>
          {/* Profile Picture - overlaps bottom left of cover image */}
          <div className="absolute left-[2rem] top-32 z-20">
            <div
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden flex items-center justify-center relative group cursor-pointer"
              onClick={() => {}}
            >
              {!userProfile.profile ? (
                <div
                  className="w-full h-full flex items-center justify-center rounded-full"
                  style={{ background: "var(--base)" }}
                >
                  <span className="text-white text-3xl font-bold">
                    {getInitials(userProfile?.name)}
                  </span>
                </div>
              ) : (
                <img
                  src={userProfile.profile}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
              {/* Animated Hover Overlay with Camera and Trash Icon */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(30,41,59,0.85) 60%, rgba(30,41,59,0.7) 100%)",
                  backdropFilter: "blur(2px)",
                }}
              >
                {profileImage ? (
                  <div className="flex flex-row gap-8 w-full justify-between px-6">
                    {/* Camera Icon - slides in from left with fade */}
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-400 ease-in-out transform opacity-0 -translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 focus:outline-none"
                      style={{
                        transitionProperty:
                          "transform, opacity, box-shadow, background",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        profileInputRef.current?.click();
                      }}
                      title="Change Profile Picture"
                      type="button"
                    >
                      <FiCamera className="w-6 h-6 text-[var(--base)]" />
                    </button>
                    {/* Trash Icon - slides in from right with fade */}
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-400 ease-in-out transform opacity-0 translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 focus:outline-none"
                      style={{
                        transitionProperty:
                          "transform, opacity, box-shadow, background",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileImage(null);
                      }}
                      title="Remove Profile Picture"
                      type="button"
                    >
                      <FiTrash2 className="w-6 h-6 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <button
                      className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-400 ease-in-out  focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        profileInputRef.current?.click();
                      }}
                      title="Add Profile Picture"
                      type="button"
                    >
                      <FiCamera className="w-7 h-7 text-[var(--base)]" />
                    </button>
                  </div>
                )}
              </div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setProfileImage(url);
                  }
                }}
                aria-label="Upload profile image"
                title="Upload profile image"
              />
            </div>
          </div>
          {/* User Info (name, bio, etc.) - left aligned */}
          <div className="flex flex-col sm:flex-row mt-20 px-6 pb-4 border-b border-gray-200 items-start sm:items-center justify-between">
            <div className="flex justify-between w-full">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userProfile?.name}
                </h2>
                <div className="text-gray-600 mt-1">
                  {userProfile?.headline}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {userProfile?.email}
                </div>
                <div className="text-base text-gray-700 mt-2 max-w-2xl">
                  {userProfile?.bio}
                </div>
              </div>
              {/* Preview Portfolio Button for Providers */}
              {userProfile.profile_type == "provider" && (
                <div className="flex">
                  <button
                    className="mt-auto px-4 py-2 bg-[var(--base)] text-white rounded shadow hover:bg-[var(--base-hover)] transition"
                    onClick={() =>
                      window.open(`/provider/${userProfile.id}`, "_blank")
                    }
                    type="button"
                  >
                    Preview Portfolio
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Tabs Navigation - responsive and scrollable */}
          <div className="relative px-2 sm:px-6 mt-6">
            {/* Gradient fade on right edge for scroll hint */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10 hidden sm:block" />
            <div className="flex border-b mb-6 flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-hide relative z-20 gap-x-2">
              <button
                className={`px-4 py-2 min-w-fit font-medium focus:outline-none transition border-b-2 ${
                  activeTab === "profile"
                    ? "border-[var(--base)] text-[var(--base)]"
                    : "border-transparent text-gray-500 hover:text-[var(--base)]"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Details
              </button>
              {profileMode === "provider" && (
                <>
                  <button
                    className={`px-4 py-2 min-w-fit font-medium focus:outline-none transition border-b-2 ${
                      activeTab === "gigs"
                        ? "border-[var(--base)] text-[var(--base)]"
                        : "border-transparent text-gray-500 hover:text-[var(--base)]"
                    }`}
                    onClick={() => setActiveTab("gigs")}
                  >
                    My Gigs
                  </button>
                  <button
                    className={`px-4 py-2 min-w-fit font-medium focus:outline-none transition border-b-2 ${
                      activeTab === "history"
                        ? "border-[var(--base)] text-[var(--base)]"
                        : "border-transparent text-gray-500 hover:text-[var(--base)]"
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    Gig History
                  </button>
                </>
              )}
              <button
                className={`px-4 py-2 min-w-fit font-medium focus:outline-none transition border-b-2 ${
                  activeTab === "support"
                    ? "border-[var(--base)] text-[var(--base)]"
                    : "border-transparent text-gray-500 hover:text-[var(--base)]"
                }`}
                onClick={() => setActiveTab("support")}
              >
                Support Requests
              </button>
              <button
                className={`px-4 py-2 min-w-fit font-medium focus:outline-none transition border-b-2 ${
                  activeTab === "subscription"
                    ? "border-[var(--base)] text-[var(--base)]"
                    : "border-transparent text-gray-500 hover:text-[var(--base)]"
                }`}
                onClick={() => setActiveTab("subscription")}
              >
                Subscription Plan
              </button>
              <button
                className={`px-4 py-2 min-w-fit font-medium focus:outline-none transition border-b-2 ${
                  activeTab === "settings"
                    ? "border-[var(--base)] text-[var(--base)]"
                    : "border-transparent text-gray-500 hover:text-[var(--base)]"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
            </div>
          </div>
          {/* Tab Content */}
          <div className="px-6">
            <div className="min-w-[340px] min-h-[420px] transition-all duration-300">
              {activeTab === "profile" && formInitialValues && (
                <DynamicForm
                  formConfig={profileFormConfig as any}
                  initialValues={formInitialValues}
                  onSubmit={handleProfileUpdate}
                  enableReinitialize
                />
              )}
              {profileMode === "provider" && activeTab === "gigs" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--base)]">
                      My Gigs
                    </h3>
                    <button
                      className="text-[var(--base)] font-medium hover:underline"
                      onClick={() =>
                        (window.location.href = "/profile/my-gigs")
                      }
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y">
                    {USER_PROFILE.GIGS.map((gig) => (
                      <div
                        key={gig.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {gig.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Posted: {gig.date}
                          </div>
                        </div>
                        <div
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            gig.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {gig.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {profileMode === "provider" && activeTab === "history" && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                    Gig History
                  </h3>
                  <div className="divide-y">
                    {USER_PROFILE.HISTORY.map((gig) => (
                      <div
                        key={gig.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {gig.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {gig.status} on {gig.date}
                          </div>
                        </div>
                        <div
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            gig.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {gig.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "support" && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                    Support Requests
                  </h3>
                  <div className="divide-y">
                    {USER_PROFILE.SUPPORT.map((req) => (
                      <div
                        key={req.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {req.subject}
                          </div>
                          <div className="text-xs text-gray-500">
                            Requested: {req.date}
                          </div>
                        </div>
                        <div
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            req.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {req.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "subscription" && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                    Subscription Plan
                  </h3>
                  <div className="divide-y">
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          Current Plan:{" "}
                          <span className="text-[var(--base)]">Premium</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Started: 2024-04-01
                        </div>
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                        Active
                      </div>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          Previous Plan: Basic
                        </div>
                        <div className="text-xs text-gray-500">
                          Ended: 2024-03-31
                        </div>
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-500">
                        Expired
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "settings" && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                    Settings
                  </h3>
                  <div className="divide-y">
                    <div className="py-3">
                      <div className="font-medium text-gray-900 mb-1">
                        Change Password
                      </div>
                      <button className="text-[var(--base)] font-medium hover:underline">
                        Change
                      </button>
                    </div>
                    <div className="py-3">
                      <div className="font-medium text-gray-900 mb-1">
                        Notification Preferences
                      </div>
                      <button className="text-[var(--base)] font-medium hover:underline">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
