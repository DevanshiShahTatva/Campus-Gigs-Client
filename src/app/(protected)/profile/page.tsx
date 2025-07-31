"use client";
import React, {
  useState,
  useRef,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { FiUpload, FiCamera, FiTrash2 } from "react-icons/fi";
import DynamicForm from "@/components/common/form/DynamicForm";
import { apiCall } from "@/utils/apiCall";
import { RoleContext } from "@/context/role-context";
import { getInitials, profileFormConfig, educationOptions } from "./helper";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateNotificationPreferencesMutation,
  useUpdateUserProfileMutation,
} from "@/redux/api";
import { CurrentSubscriptionPlan, IDropdownOption } from "@/utils/interface";
import { ChevronDown, ChevronUp } from "lucide-react";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import Link from "next/link";
import moment from "moment";
import { useSelector } from "react-redux";
import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/redux/index";
import { API_ROUTES } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { OnboardStripeButton } from "@/components/stripe/OnboardStripeButton";
import { Card, CardContent } from "@/components/ui/card";
import KycStatusPage from "@/components/stripe/KycStatus";
import { getAllNotificationStatus, renderBaseOnCondition } from "@/utils/helper";
import { CustomModal } from "@/components/common/CustomModal";
import { useSearchParams } from "next/navigation";

const Profile = () => {

  const searchParams = useSearchParams();

  const [success, setSuccess] = React.useState(false);
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "gigs"
    | "history"
    | "support"
    | "subscription"
    | "settings"
    | "stripe_kyc"
  >(searchParams.get("settings") ? "settings" : "profile");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const { role: profileMode } = useContext(RoleContext);
  const { data, isLoading } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const userProfile = data?.data;
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
    const [updateNotificationPref] = useUpdateNotificationPreferencesMutation();
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [supportRequests, setSupportRequests] = useState<any[]>([]);
  const [isSupportLoading, setIsSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changeNotificationOpen, setChangeNotificationOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.user?.user_id || state.user?.user?.id);
  const socket = useSocket(userId ? String(userId) : null);
  const [selectedPlan, setSelectedPlan] =
    useState<null | CurrentSubscriptionPlan>(null);
  const [deleteModelOpen, setDeleteModelOpen] = useState<boolean>(false);
  const [isCancellingAutoDebit, setIsCancellingAutoDebit] = useState<boolean>(false);
  const [
    { show_bid, show_chat, show_payment, show_rating, show_all },
    setNotificationPreference,
  ] = useState({
    show_chat: userProfile?.preferences?.show_chat,
    show_bid: userProfile?.preferences?.show_bid,
    show_payment: userProfile?.preferences?.show_payment,
    show_rating: userProfile?.preferences?.show_rating,
    show_all: getAllNotificationStatus(userProfile?.preferences),
  });

  useEffect(() => {
    if (activeTab === "subscription") {
      setIsSubscriptionLoading(true);
      setSubscriptionError(null);
      handleFetchPaymentPlans();
    }
    if (activeTab === "support") {
      setIsSupportLoading(true);
      setSupportError(null);
      (async () => {
        try {
          const res = await apiCall({
            endPoint: API_ROUTES.USER_SERVICE_REQUEST,
            method: "GET",
          });
          setSupportRequests(res?.data || []);
        } catch (err) {
          setSupportError("Failed to load support requests");
        } finally {
          setIsSupportLoading(false);
        }
      })();
    }
    if(activeTab === "settings"){
      setNotificationPreference({
        show_chat: userProfile?.preferences?.show_chat,
        show_bid: userProfile?.preferences?.show_bid,
        show_payment: userProfile?.preferences?.show_payment,
        show_rating: userProfile?.preferences?.show_rating,
        show_all: getAllNotificationStatus(userProfile?.preferences),
      });
    }
  }, [activeTab, changeNotificationOpen]);

  useEffect(() => {
    if (!socket) return;
    const handleUserNotification = (data: any) => {
      if (data?.title === "Support Request Acknowledged") {
        toast.info(
          data.message || "Your support request has been acknowledged."
        );
        if (activeTab === "support") {
          // Refetch support requests
          setIsSupportLoading(true);
          setSupportError(null);
          apiCall({ endPoint: API_ROUTES.USER_SERVICE_REQUEST, method: "GET" })
            .then((res) => {
              setSupportRequests(res?.data || []);
            })
            .catch(() => {
              setSupportError("Failed to load support requests");
            })
            .finally(() => setIsSupportLoading(false));
        }
      }
    };
    socket.on("userNotification", handleUserNotification);
    return () => {
      socket.off("userNotification", handleUserNotification);
    };
  }, [socket, activeTab]);

  const [skillsDropdown, setSkillsDropdown] = useState<IDropdownOption[]>([]);

  const fetchSkillsDropdown = useCallback(async () => {
    try {
      const res = await apiCall({
        endPoint: API_ROUTES.SKILLS_DROPDOWN,
        method: "GET",
      });
      if (res?.data?.length) {
        setSkillsDropdown(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch skills list");
    }
  }, []);

  useEffect(() => {
    fetchSkillsDropdown();
  }, [fetchSkillsDropdown]);

  // Merge userProfile into initialValues for the form
  const formInitialValues = useMemo(() => {
    if (!userProfile) return undefined;
    return {
      name: userProfile.name || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      location: userProfile.location || "",
      phone_number: userProfile.phone_number || "",
      educationLevel:
        educationOptions.find(
          (opt) =>
            opt.id === userProfile.education ||
            opt.label === userProfile.education
        )?.id || "",
      customEducation: userProfile.customEducation || "",
      professional_interests: userProfile.professional_interests || "",
      extracurriculars: userProfile.extracurriculars || "",
      certifications: userProfile.certifications || "",
      skills: Array.isArray(userProfile.skills)
        ? userProfile.skills.map((item: any) => String(item.id))
        : [],
      headline: userProfile.headline || "",
      bio: userProfile.bio || "",
    };
  }, [userProfile]);
console.log("USER PROFILE", userProfile);

  // When user selects a new profile image, store the File object and upload immediately
  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setIsProfileImageUploading(true);

      // Upload the image immediately
      try {
        const formData = new FormData();
        formData.append("file", file);

        await updateUserProfile(formData).unwrap();
        toast.success("Profile image updated successfully");
        setProfileImage(null); // Clear the selected file after successful upload
      } catch (error) {
        toast.error("Failed to update profile image");
        setProfileImage(null); // Clear the selected file on error
      } finally {
        setIsProfileImageUploading(false);
      }
    }
  };

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

  const handleChangeNotificationSubmit = async () => {
    try {
      await updateNotificationPref({
        userId: userId,
        preferences: { show_bid, show_chat, show_payment, show_rating },
      }).unwrap();
      toast.success("Notification preferences updated successfully");
      setChangeNotificationOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update notification preferences."
      );
    }
  };

 const handleChangeToggleStatus = (
  flag: boolean,
  name: "CHAT" | "RATING" | "PAYMENT" | "BID" | "ALL"
) => {
  if (name === "ALL") {
    setNotificationPreference({
      show_chat: !flag,
      show_bid: !flag,
      show_payment: !flag,
      show_rating: !flag,
      show_all: flag,
    });
    return;
  }

  setNotificationPreference((prev) => {
    const updated = {
      ...prev,
      show_chat: name === "CHAT" ? flag : prev.show_chat,
      show_bid: name === "BID" ? flag : prev.show_bid,
      show_payment: name === "PAYMENT" ? flag : prev.show_payment,
      show_rating: name === "RATING" ? flag : prev.show_rating,
    };

    const allOff =
      !updated.show_chat &&
      !updated.show_bid &&
      !updated.show_payment &&
      !updated.show_rating;

    return {
      ...updated,
      show_all: allOff,
    };
  });
};

  const handleChangePasswordSubmit = async (values: any) => {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.CHANGE_PASSWORD,
        method: "POST",
        body: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      });

      if (response?.success) {
        setChangePasswordOpen(false);
        toast.success("Password changed successfully!");
      } else {
        toast.error(response?.message || "Failed to change password.");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password."
      );
    }
  };

  const handleCancelAutoDebit = (plan: CurrentSubscriptionPlan) => {
    setSelectedPlan(plan);
    setDeleteModelOpen(true);
  };

  const handleFetchPaymentPlans = async () => {
    setIsSubscriptionLoading(true);
    setSubscriptionError(null);
    apiCall({ endPoint: "/subscription-plan/history", method: "GET" })
      .then((res) => {
        setSubscriptionHistory(res?.data || []);
      })
      .catch((err) => {
        setSubscriptionError("Failed to load subscription history");
      })
      .finally(() => setIsSubscriptionLoading(false));
  };

  const handleConfirmCancelAutoDebit = async () => {
    const paypalSubscriptionId = selectedPlan?.transaction_id;
    try {
      setIsCancellingAutoDebit(true);
      const res = await apiCall({
        endPoint: `subscription-plan/cancel-subscription/${paypalSubscriptionId}`,
        method: "PUT",
      });

      if (res?.status === 200) {
        toast.success("Auto debit subscription cancelled");
        setDeleteModelOpen(false);
        handleFetchPaymentPlans();
      } else {
        toast.error("Failed to cancel subscription");
      }
    } catch (error) {
      toast.error("Something went wrong while cancelling");
    } finally {
      setIsCancellingAutoDebit(false);
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
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--base), var(--base-hover) 100%)",
                }}
              />
            
          </div>
          {/* Profile Picture - overlaps bottom left of cover image */}
          <div className="absolute left-[2rem] top-32 z-20">
            <div
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden flex items-center justify-center relative group cursor-pointer"
              onClick={() => {}}
            >
              {!userProfile.profile && !profileImage ? (
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
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : userProfile.profile
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  key={profileImage ? profileImage.name : userProfile.profile}
                />
              )}
              {/* Loading overlay when uploading */}
              {isProfileImageUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
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
                onChange={handleProfileImageChange}
                aria-label="Upload profile image"
                title="Upload profile image"
              />
            </div>
          </div>
          {/* User Info (name, bio, etc.) - left aligned */}
          <div className="flex flex-col sm:flex-row mt-20 px-6 pb-4 border-b border-gray-200 items-start sm:items-center justify-between">
            <div className="flex flex-col gap-2 justify-between w-full sm:flex-row sm:gap-0">
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
              {profileMode === "provider" && (
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
              {userProfile.profile_type == "provider" && (
                <button
                  className={`px-4 py-2 min-w-fit font-medium focus:outline-none transition border-b-2 ${
                    activeTab === "stripe_kyc"
                      ? "border-[var(--base)] text-[var(--base)]"
                      : "border-transparent text-gray-500 hover:text-[var(--base)]"
                  }`}
                  onClick={() => setActiveTab("stripe_kyc")}
                >
                  Stripe KYC
                </button>
              )}
            </div>
          </div>
          {/* Tab Content */}
          <div className="w-full   mx-auto px-6 sm:px-6">
            <div className="min-h-[420px] transition-all duration-300 w-full">
              {activeTab === "profile" && formInitialValues && (
                <DynamicForm
                  formConfig={profileFormConfig(skillsDropdown) as any}
                  initialValues={formInitialValues}
                  onSubmit={handleProfileUpdate}
                  enableReinitialize
                />
              )}
              {activeTab === "support" && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                    Support Requests
                  </h3>
                  <div className="divide-y">
                    {isSupportLoading ? (
                      <div className="py-6 text-center text-gray-500">
                        Loading support requests...
                      </div>
                    ) : supportError ? (
                      <div className="py-6 text-center text-red-500">
                        {supportError}
                      </div>
                    ) : supportRequests.length === 0 ? (
                      <div className="py-6 text-center text-gray-500">
                        No support requests found.
                      </div>
                    ) : (
                      supportRequests.map((req, idx) => {
                        const status = req.status
                          ? req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)
                          : "-";
                        const isResolved = req.status === "resolved";
                        const isPending = req.status === "pending";
                        const requestedDate = req.created_at
                          ? new Date(req.created_at).toLocaleDateString()
                          : "-";
                        return (
                          <div
                            key={req.id || idx}
                            className="py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {req.subject}
                              </div>
                              <div className="text-xs text-gray-500 mb-1">
                                {req.message}
                              </div>
                              <div className="text-xs text-gray-400">
                                Email: {req.email}
                              </div>
                              <div className="text-xs text-gray-400">
                                Requested: {requestedDate}
                              </div>
                            </div>
                            <div
                              className={`text-xs font-semibold px-2 py-1 rounded w-fit ${
                                isResolved
                                  ? "bg-green-100 text-green-700"
                                  : isPending
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {status}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
              {activeTab === "subscription" && (
                <div>
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                      Subscription Plan History
                    </h3>
                    <Button>
                      <Link
                        className="rounded-lg text-white font-semibold"
                        href={"/user/buy-subscription"}
                      >
                        Go to Subscription Page
                      </Link>
                    </Button>
                  </div>
                  <div className="divide-y">
                    {isSubscriptionLoading ? (
                      <div className="py-6 text-center text-gray-500">
                        Loading subscription history...
                      </div>
                    ) : subscriptionError ? (
                      <div className="py-6 text-center text-red-500">
                        {subscriptionError}
                      </div>
                    ) : subscriptionHistory.length === 0 ? (
                      <div className="py-6 text-center text-gray-500">
                        No subscription history found.
                      </div>
                    ) : (
                      subscriptionHistory.map((plan, idx) => {
                        const planName = plan.subscription_plan?.name || "-";
                        const planPrice =
                          plan.subscription_plan?.price ?? plan.price;
                        const status = plan.status
                          ? plan.status.charAt(0).toUpperCase() +
                            plan.status.slice(1)
                          : "-";
                        const startDate = plan.created_at
                          ? moment(plan.created_at).format("DD/MM/YYYY")
                          : "-";
                        const endDate = plan.subscription_expiry_date
                          ? moment(plan.subscription_expiry_date).format(
                              "DD/MM/YYYY"
                            )
                          : "NA";
                        const isActive = plan.status === "active";
                        const isCancelled = plan.status === "cancelled";
                        const features = plan.subscription_plan?.features || [];
                        return (
                          <div
                            key={plan.id || idx}
                            className="py-3 flex flex-col gap-2"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                  <span>{plan.subscription_plan?.icon}</span>
                                  {planName}
                                  <span className="ml-2 text-xs text-gray-400">
                                    ({status})
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Price: $ {planPrice} | Start: {startDate} |
                                  End: {endDate}
                                </div>
                                {plan.transaction_id && (
                                  <div className="text-xs text-gray-400">
                                    Txn ID: {plan.transaction_id}
                                  </div>
                                )}
                              </div>
                              <div
                                className={`text-xs font-semibold px-2 py-1 rounded w-fit ${
                                  isActive
                                    ? "bg-green-100 text-green-700"
                                    : isCancelled
                                    ? "bg-gray-100 text-gray-500"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {status}
                              </div>
                            </div>
                            {plan.is_auto_debit && (
                              <div>
                                <Button
                                  variant={"destructive"}
                                  size={"sm"}
                                  onClick={() => handleCancelAutoDebit(plan)}
                                >
                                  Cancel Auto Debit
                                </Button>
                              </div>
                            )}
                            {features.length > 0 && (
                              <div>
                                <button
                                  className="flex items-center gap-1 text-[var(--base)] text-xs font-medium mt-1 hover:underline"
                                  onClick={() =>
                                    setExpandedPlan(
                                      expandedPlan === plan.id ? null : plan.id
                                    )
                                  }
                                  aria-expanded={
                                    expandedPlan === plan.id ? "true" : "false"
                                  }
                                >
                                  {expandedPlan === plan.id ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                  {expandedPlan === plan.id
                                    ? "Hide Features"
                                    : "Show Features"}
                                </button>
                                {expandedPlan === plan.id && (
                                  <ul className="list-disc ml-6 mt-1 text-xs text-gray-700">
                                    {features.map((f: string, i: number) => (
                                      <li key={i}>{f}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
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
                      <button
                        className="text-[var(--base)] font-medium hover:underline"
                        onClick={() => setChangePasswordOpen(true)}
                      >
                        Change
                      </button>
                      <CommonFormModal
                        open={changePasswordOpen}
                        setOpen={setChangePasswordOpen}
                        title="Change Password"
                        submitLabel="Change Password"
                        fields={[
                          {
                            name: "currentPassword",
                            label: "Current Password",
                            type: "password",
                            required: true,
                            placeholder: "Enter current password",
                          },
                          {
                            name: "newPassword",
                            label: "New Password",
                            type: "password",
                            required: true,
                            placeholder: "Enter new password",
                            minLength: 6,
                          },
                          {
                            name: "confirmNewPassword",
                            label: "Confirm New Password",
                            type: "password",
                            required: true,
                            placeholder: "Re-enter new password",
                            minLength: 6,
                          },
                        ]}
                        onSubmit={handleChangePasswordSubmit}
                      />
                    </div>
                    <div className="py-3">
                      <div className="font-medium text-gray-900 mb-1">
                        Notification Preferences
                      </div>
                      <button
                        className="text-[var(--base)] font-medium hover:underline"
                        onClick={() => setChangeNotificationOpen(true)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {renderBaseOnCondition(
                activeTab === "stripe_kyc" &&
                  userProfile.profile_type == "provider",
                <>
                  {renderBaseOnCondition(
                    userProfile.stripe_account_id &&
                      userProfile.completed_stripe_kyc,
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                        Stripe verification (KYC)
                      </h3>
                      <KycStatusPage status="completed" />
                    </div>,
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--base)] mb-4">
                        Stripe verification (KYC)
                      </h3>
                      <KycStatusPage
                        status="pending"
                        providerId={userProfile.id}
                      />
                    </div>
                  )}
                </>,
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      {changeNotificationOpen && (
        <CustomModal
          onClose={() => setChangeNotificationOpen(false)}
          title="Notification Preferences"
        >
          <div className="flex flex-col gap-6">
            <Toggle
              label="Show Chat Notifications"
              checked={show_chat}
              onChange={(flag) => handleChangeToggleStatus(flag, "CHAT")}
            />
            <Toggle
              label="Show Bid Notifications"
              checked={show_bid}
              onChange={(flag) => handleChangeToggleStatus(flag, "BID")}
            />
            <Toggle
              label="Show Payment Notifications"
              checked={show_payment}
              onChange={(flag) => handleChangeToggleStatus(flag, "PAYMENT")}
            />
            <Toggle
              label="Show Rating & Review Notifications"
              checked={show_rating}
              onChange={(flag) => handleChangeToggleStatus(flag, "RATING")}
            />
            <Toggle
              label={`Turn off all Notifications`}
              checked={show_all}
              onChange={(flag) => handleChangeToggleStatus(flag, "ALL")}
            />
            <div className="  w-full flex justify-end gap-3">
              <button
                className="border py-2 px-4 rounded-md"
                onClick={() => setChangeNotificationOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[var(--base)] text-[var(--text-light)] py-2 px-4 rounded-md"
                onClick={handleChangeNotificationSubmit}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </CustomModal>
      )}

      <ConfirmationDialog
        isOpen={deleteModelOpen}
        onClose={() => setDeleteModelOpen(false)}
        onConfirm={handleConfirmCancelAutoDebit}
        title="Cancel Auto Debit"
        description="Are you sure you want to cancel auto debit?"
        confirmText="Confirm"
        isDeleting={isCancellingAutoDebit}
      />
    </div>
  );
};

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between px-2">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          checked ? "bg-[var(--base)]" : "bg-gray-300"
        }`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};


export default Profile;