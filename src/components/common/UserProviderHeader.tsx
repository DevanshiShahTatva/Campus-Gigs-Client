"use client";
import React, { useState, useContext, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaChevronDown, FaExchangeAlt, FaUser, FaCog, FaSignOutAlt, FaCheckCircle, FaInfoCircle, FaBars, FaStar } from "react-icons/fa";
import { RoleContext } from "@/context/role-context";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/redux/api";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import { getRoleLabel, getAvatarName } from "@/utils/helper";

// Types
interface UserProviderHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type RoleType = "user" | "provider";

// Custom hook for optimistic role switching
function useOptimisticRole(role: RoleType, setRole: (r: RoleType) => void, updateUserProfile: any) {
  const [optimisticRole, setOptimisticRole] = useState<RoleType | undefined>();
  const handleRoleSwitch = useCallback(async () => {
    const newRole: RoleType = role === "user" ? "provider" : "user";
    setOptimisticRole(newRole);
    setRole(newRole);
    try {
      const response = await updateUserProfile({ profile_type: newRole }).unwrap();
      if (response?.data?.profile_type === newRole || response?.profile_type === newRole) {
        setOptimisticRole(undefined);
      } else {
        setRole(role);
        setOptimisticRole(undefined);
      }
    } catch (error) {
      setRole(role);
      setOptimisticRole(undefined);
    }
  }, [role, setRole, updateUserProfile]);
  return { optimisticRole, handleRoleSwitch };
}

// Local helper for role icon
function getRoleIcon(role: RoleType) {
  return role === "user" ? <FaUser className="w-3.5 h-3.5" /> : <FaStar className="w-3.5 h-3.5" />;
}

const UserProviderHeader: React.FC<UserProviderHeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { role, setRole } = useContext(RoleContext);
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = data?.data;
  const dispatch = useDispatch();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { optimisticRole, handleRoleSwitch } = useOptimisticRole(role, setRole, updateUserProfile);
  const currentRole: RoleType = optimisticRole ?? role;

  // Placeholder notifications
  const notifications = [
    { id: 1, type: "info", message: "Your gig was approved!", read: false },
    { id: 2, type: "success", message: "Payment received for completed gig.", read: false },
    { id: 3, type: "info", message: "New message from Alice.", read: true },
  ];

  // Get user initials for avatar fallback
  const initials = getAvatarName(user?.name || "", true);

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      if ((window as any).__PERSISTOR) {
        (window as any).__PERSISTOR.purge();
      }
      document.cookie = "token=; Max-Age=0; path=/;";
    }
    dispatch(logout());
    router.push("/login");
  };

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".notif-dropdown")) setNotifOpen(false);
      if (!(e.target as HTMLElement).closest(".profile-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync context with backend profile_type on mount or when user changes
  React.useEffect(() => {
    if (user?.profile_type && user?.profile_type !== role) {
      setRole(user.profile_type);
    }
    // eslint-disable-next-line
  }, [user?.profile_type]);

  // Determine if toggle should be shown based on subscription plan  
  const showRoleToggle = !!(user?.subscription && user.subscription.subscription_plan && user.subscription.subscription_plan.price > 0);

  return (
    <header className="w-full h-16 flex items-center justify-between border-b border-[var(--base)]/10 shadow bg-white sticky top-0 z-[40]">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-6 min-w-0">
          {/* Hamburger menu icon (always visible, themed) */}
          <button
            className="mr-2 p-2 rounded-md hover:bg-[var(--base)]/10 transition-colors flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FaBars className="w-6 h-6 text-[var(--base)]" />
          </button>
          <span className="flex items-center cursor-pointer min-w-0" onClick={() => router.push("/user/dashboard")}>
            <img
              src="/logo.svg"
              alt="CampusGig Logo"
              className="h-6 w-auto min-w-[24px] sm:h-8 sm:min-w-[32px] md:h-10 md:min-w-[40px] object-contain transition-all duration-300"
            />
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Notifications always visible */}
          <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-[var(--base)]/10 transition-colors focus:outline-none"
              title="Notifications"
              onClick={() => setNotifOpen((open) => !open)}
            >
              <FaBell className="text-xl text-[var(--base)]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {/* Notifications Dropdown */}
            <div
              className={`notif-dropdown absolute right-0 mt-2 w-80 bg-white border border-[var(--base)]/20 rounded-xl shadow-2xl transition-all duration-200 z-40 overflow-hidden ${notifOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              onMouseLeave={() => setNotifOpen(false)}
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-[var(--base)]/5 font-semibold text-gray-900 text-base">Notifications</div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="px-5 py-6 text-center text-gray-400">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`flex items-start gap-3 px-5 py-4 ${notif.read ? "bg-gray-50" : "bg-white"}`}>
                      <span className="mt-1">
                        {notif.type === "success" ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaInfoCircle className="text-[var(--base)] text-lg" />
                        )}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm text-gray-800">{notif.message}</div>
                        {!notif.read && <button className="mt-2 text-xs text-[var(--base)] hover:underline">Mark as read</button>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* User/Provider toggle for md+ (header, outside dropdown) */}
          {showRoleToggle && (
            <div className="hidden md:flex items-center gap-2 ml-2 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold select-none w-20
                ${currentRole === "user" ? "bg-gray-100 text-gray-700" : "bg-[var(--base)]/10 text-[var(--base)]"}`}
              >
                {getRoleIcon(currentRole)}
                {getRoleLabel(currentRole)}
              </span>
              <button
                className="p-2 rounded-full hover:bg-[var(--base)]/10 transition-colors text-[var(--base)]"
                onClick={handleRoleSwitch}
                title={`Switch to ${currentRole === "user" ? "Provider" : "User"}`}
                aria-label={`Switch to ${currentRole === "user" ? "Provider" : "User"}`}
              >
                <FaExchangeAlt className="w-4 h-4" />
              </button>
            </div>
          )}
          {/* Profile always visible, toggle in dropdown for mobile */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--base)]/10 transition-colors focus:outline-none profile-dropdown"
              title="Profile menu"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {isLoading ? (
                <span className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              ) : user?.profile ? (
                <img src={user.profile} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-[var(--base)] shadow-sm" />
              ) : (
                <span className="w-9 h-9 rounded-full bg-[var(--base)] text-white flex items-center justify-center font-bold text-md border-2 border-[var(--base)] shadow-sm">
                  {initials}
                </span>
              )}
              <FaChevronDown className={`text-xs text-gray-700 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {/* Profile Dropdown */}
            <div
              className={`profile-dropdown absolute right-0 mt-2 w-56 bg-white border border-[var(--base)]/20 rounded-xl shadow-2xl transition-all duration-200 z-40 overflow-hidden ${dropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100 bg-[var(--base)]/5">
                {isLoading ? (
                  <span className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                ) : user?.profile ? (
                  <img src={user.profile} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--base)]" />
                ) : (
                  <span className="w-10 min-w-10 h-10 rounded-full bg-[var(--base)] text-white flex items-center justify-center font-bold text-xl border-2 border-[var(--base)]">
                    {initials}
                  </span>
                )}
                <div>
                  {user?.name && <div className="font-semibold text-gray-900 text-base">{user.name}</div>}
                  {user?.email && <div className="text-xs text-gray-500 truncate max-w-xs">{user.email}</div>}
                  <div className="text-xs text-gray-500">{getRoleLabel(currentRole)} Mode</div>
                </div>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-[var(--base)]/10 transition text-sm font-medium"
              >
                <FaUser className="text-[var(--base)]" /> Profile
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-[var(--base)]/10 transition text-sm font-medium">
                <FaCog className="text-[var(--base)]" /> Settings
              </Link>
              {/* User/Provider toggle for mobile (only visible on small screens) */}
              {showRoleToggle && (
                <div className="flex md:hidden items-center gap-2 px-5 py-3 border-t border-gray-100">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold select-none w-20
                    ${currentRole === "user" ? "bg-gray-100 text-gray-700" : "bg-[var(--base)]/10 text-[var(--base)]"}`}
                  >
                    {getRoleIcon(currentRole)}
                    {getRoleLabel(currentRole)}
                  </span>
                  <button
                    className="p-2 rounded-full hover:bg-[var(--base)]/10 transition-colors text-[var(--base)]"
                    onClick={handleRoleSwitch}
                    title={`Switch to ${currentRole === "user" ? "Provider" : "User"}`}
                    aria-label={`Switch to ${currentRole === "user" ? "Provider" : "User"}`}
                  >
                    <FaExchangeAlt className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                className="flex items-center gap-3 w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition text-sm font-medium border-t border-gray-100"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="text-red-500" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default UserProviderHeader;
