"use client";
import React, { useState, useContext, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaChevronDown, FaExchangeAlt, FaUser, FaCog, FaSignOutAlt, FaCheckCircle, FaInfoCircle, FaBars, FaStar } from "react-icons/fa";
import { RoleContext } from "@/context/role-context";
import { useGetUserProfileQuery, useUpdateUserProfileMutation, useGetUserNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from "@/redux/api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import { getRoleLabel, getAvatarName } from "@/utils/helper";
import { showPushNotification } from "@/utils/helper";
import { useSocket } from "@/hooks/useSocket";
import Toast from "./Toast";

// Types
interface UserProviderHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type RoleType = "user" | "provider";

type Notification = {
  id: number;
  type: "info" | "success";
  message: string;
  read: boolean;
};

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
  const userId = useSelector((state: any) => state.user?.user_id || state.user?.user?.id);
  const token = useSelector((state: any) => state.user?.token);
  const { data: fetchedNotifications, refetch } = useGetUserNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  // Use the correct data property from the API response
  const notificationsRaw = Array.isArray(fetchedNotifications?.data)
    ? fetchedNotifications.data
    : Array.isArray(fetchedNotifications)
      ? fetchedNotifications
      : [];

  const notifications = notificationsRaw.map((notif:any) => ({
    id: notif.id,
    type: notif.notification_type || notif.type || "info",
    message: notif.description || notif.message || notif.title || "",
    read: notif.is_read ?? notif.read ?? false,
    link: notif.link,
  }));

  const socket = useSocket(userId);
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; link?: string } | null>(null);

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

  // Close dropdowns on outside clickz
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

  // Calculate if there are unread notifications
  const hasUnread = notifications.some((notif:any) => !notif.read);

  // Mark a single notification as read (UI + API)
  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationRead({ notificationId: id });
      refetch();
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  // Mark all notifications as read (UI + API)
  const handleMarkAllAsRead = async () => {
    setMarkAllLoading(true);
    try {
      await markAllNotificationsRead();
      refetch();
    } catch (e) {
      console.error("Failed to mark all notifications as read", e);
    } finally {
      setMarkAllLoading(false);
    }
  };

  // Mark all as read logic removed from handleNotifOpen
  const handleNotifOpen = () => {
    setNotifOpen((open) => !open);
  };

  React.useEffect(() => {
    const handleVisibilityChange = () => {

      console.log(document.visibilityState === "visible" ? "YESSSSSS IN ":"NOOO HERE NEVER")
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    if (!socket) return;

    // Listen for bid/user notifications
    const handleUserNotification = (data: any) => {
      console.log("SOMETHING NEW====>", data)
      showPushNotification(data.title || "Notification", {
        body: data.message || "You received a new notification.",
        link: data.link,
      });
      refetch();
    };
    socket.on("userNotification", handleUserNotification);

    // Listen for chat notifications
    const handleChatNotification = (data: any) => {
      console.log("SOCEKTID and USERID", userId, "=======");
      

      
      if (pathname !== `/chat`) {
        if (typeof document !== "undefined") {
          console.log(data,"SSSSSSSNotification received, visibilityState:", document.visibilityState, "hasFocus:", document.hasFocus && document.hasFocus());
        }
        if (
          typeof document !== "undefined" &&
          document.visibilityState === "visible" 
          // && document.hasFocus && document.hasFocus()
        ) {

          setToast({ message: `${data.title}: ${data.message}`, link: data.link });

          console.log("IN IFFF");
          
        } else{
          console.log("IN ELSE");
          
        }
        
        // if (window.Notification && Notification.permission === "granted") {
        //   console.log("IN ELSEEEE");
          
        //   const n = new Notification(data.title, {
        //     body: data.message,
        //     data: { url: data.link },
        //   });
        //   n.onclick = (event) => {
        //     event.preventDefault();
        //     window.open(data.link, "_blank");
        //   };
        // }
      }
    };
    socket.on("chatNotification", handleChatNotification);

    return () => {
      socket.off("userNotification", handleUserNotification);
      socket.off("chatNotification", handleChatNotification);
    };
  }, [socket, refetch, pathname]);



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
              onClick={handleNotifOpen}
            >
              <FaBell className="text-xl text-gray-400" />
              {hasUnread && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
            {/* Notifications Dropdown */}
            <div
              className={`notif-dropdown absolute -right-5 sm:right-0 mt-2 w-64 sm:w-80 bg-white border border-[var(--base)]/20 rounded-xl shadow-2xl transition-all duration-200 z-40 overflow-hidden ${notifOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              onMouseLeave={() => setNotifOpen(false)}
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-[var(--base)]/5 font-semibold text-gray-900 text-base flex items-center justify-between">
                <span>Notifications</span>
                {hasUnread && (
                  <button
                    className="text-xs text-[var(--base)] hover:underline font-semibold ml-2 disabled:opacity-50"
                    onClick={handleMarkAllAsRead}
                    disabled={markAllLoading}
                  >
                    {markAllLoading ? "Marking..." : "Mark all as read"}
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="px-5 py-6 text-center text-gray-400">No notifications</div>
                ) : (
                  notifications.map((notif:any) => (
                    <div
                      key={notif.id}
                      className={`flex flex-col gap-2 px-5 py-4 ${notif.read ? "bg-gray-50" : "bg-white"} ${notif.link ? "cursor-pointer hover:bg-[var(--base)]/10 transition" : ""}`}
                      onClick={async () => {
                        if (notif.link) {
                          if (!notif.read) {
                            await handleMarkAsRead(notif.id);
                          }
                          router.push(notif.link);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1">
                          {notif.type === "success" ? (
                            <FaCheckCircle className="text-green-500 text-lg" />
                          ) : (
                            <FaInfoCircle className="text-[var(--base)] text-lg" />
                          )}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-800">{notif.message}</div>
                        </div>
                      </div>
                      {!notif.read && (
                        <button
                          className="text-xs text-[var(--base)] hover:underline self-start"
                          onClick={e => {
                            e.stopPropagation();
                            handleMarkAsRead(notif.id);
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* User/Provider toggle for md+ (header, outside dropdown) */}
          {showRoleToggle && (
            <div className="hidden md:flex items-center gap-3 ml-2">
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={role === "provider"}
                  onChange={handleRoleSwitch}
                  aria-label="Toggle user/provider role"
                />
                <div className="w-24 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--base)] rounded-full peer peer-checked:bg-[var(--base)] transition-all duration-200 flex items-center justify-between relative px-2">
                  <span className={`text-sm text-white font-semibold transition-all duration-200 ${role === "provider" ? "opacity-100" : "opacity-0"}`}>Provider</span>
                  <span className={`text-sm font-semibold transition-all duration-200 ${role === "provider" ? "opacity-0" : "opacity-100"} -translate-x-4`}>User</span>
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md bg-white transition-all duration-200 ${role === "provider" ? "translate-x-16" : "translate-x-0"}`}></div>
                </div>
              </label>
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
      {toast && (
        <Toast
          message={toast.message}
          link={toast.link}
          onClose={() => setToast(null)}
        />
      )}
    </header>
  );
};

export default UserProviderHeader;
