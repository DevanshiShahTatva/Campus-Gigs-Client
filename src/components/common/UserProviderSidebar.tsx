"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaComments,
  FaTasks,
  FaCog,
  FaHome,
  FaTimes,
  FaCreditCard,
} from "react-icons/fa";
import Link from "next/link";
import { ROUTES } from "@/utils/constant";
import { useGetUserProfileQuery } from "@/redux/api";

const sidebarItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: <FaHome />,
    route: "/user/dashboard",
    access: ["provider"],
  },
  {
    id: 3,
    title: "Gigs",
    icon: <FaTasks />,
    route: "/gigs",
    access: ["user", "provider"],
  },
  {
    id: 6,
    title: "My Gigs",
    icon: <FaCog />,
    route: ROUTES.MY_GIGS,
    access: ["user", "provider"],
  },
  {
    id: 7,
    title: "Gigs Pipeline",
    icon: <FaTasks />,
    route: ROUTES.GIGS_PIPELINE,
    access: ["provider"],
  },
  {
    id: 2,
    title: "Chat",
    icon: <FaComments />,
    route: "/chat",
    access: ["user", "provider"],
  },
  {
    id: 5,
    title: "Subscription Plans",
    icon: <FaCreditCard />,
    route: "/user/buy-subscription",
    access: ["user", "provider"],
  },
  {
    id: 4,
    title: "Settings",
    icon: <FaCog />,
    route: "#",
    access: ["user", "provider"],
  }
];

const UserProviderSidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userProfile } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!userProfile?.data?.profile_type) return;

    const allowedRoutes = sidebarItems
      .filter((item) => item.access.includes(userProfile.data.profile_type))
      .map((item) => item.route);

    const changeRoutes = [...allowedRoutes, ROUTES.PROFILE];

    const isCurrentRouteAllowed = changeRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isCurrentRouteAllowed) {
      const fallbackRoute = changeRoutes[0] || ROUTES.GIGS;
      router.push(fallbackRoute);
    }
  }, [userProfile?.data?.profile_type, pathname]);

  return (
    <>
      {/* Sidebar Drawer (fixed left, white, 20rem wide) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 md:w-72 bg-white z-[99999] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } min-w-0 overflow-y-auto`}
        style={{ maxWidth: "90vw" }}
      >
        {/* Responsive Logo */}
        <div className="flex items-center justify-between px-4 py-4">
          <img
            src="/logo.svg"
            alt="CampusGig Logo"
            className="h-8 w-auto min-w-[32px] object-contain transition-all duration-300"
          />
        </div>
        {/* Mobile-only nav tabs */}
        <nav className="flex flex-col space-y-2 py-2 px-2 w-full text-base md:hidden">
          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[var(--base)]/10 hover:text-[var(--base)] transition"
          >
            <span className="text-lg text-[var(--base)]">
              <FaHome />
            </span>
            <span className="truncate">Dashboard</span>
          </Link>
          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[var(--base)]/10 hover:text-[var(--base)] transition"
          >
            <span className="text-lg text-[var(--base)]">
              <FaTasks />
            </span>
            <span className="truncate">Gigs</span>
          </Link>
          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[var(--base)]/10 hover:text-[var(--base)] transition"
          >
            <span className="text-lg text-[var(--base)]">
              <FaComments />
            </span>
            <span className="truncate">Chat</span>
          </Link>
          <Link
            href="/user/buy-subscription"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[var(--base)]/10 hover:text-[var(--base)] transition"
          >
            <span className="text-lg text-[var(--base)]">
              <FaCreditCard />
            </span>
            <span className="truncate">Subscription Plans</span>
          </Link>
        </nav>
        {/* User/Provider toggle and profile (mobile only) */}
        <div className="md:hidden px-4 py-4 border-t border-gray-100">
          {/* User/Provider toggle and profile dropdown code from header goes here */}
        </div>
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--base)] hover:bg-[var(--base)]/10 transition-colors z-10"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <nav className="flex-1 space-y-2 py-6 px-2 w-full text-base md:text-base">
          {sidebarItems
            .filter((barItem) =>
              barItem.access.includes(userProfile?.data?.profile_type)
            )
            .map((item) => (
              <Link
                key={item.id}
                href={item.route}
                onClick={() => setOpen(false)}
                className=
                  {`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[var(--base)]/10 hover:text-[var(--base)] transition ${pathname === item.route ? "bg-[var(--base)]/10 text-[var(--base)]" : ""}`}
              >
                <span className="text-lg text-[var(--base)]">{item.icon}</span>
                <span className="truncate">{item.title}</span>
              </Link>
            ))}
        </nav>
      </aside>
      {/* Overlay (covers the rest of the screen, only when open) */}
      {open && (
        <div
          className="fixed inset-0  bg-black opacity-40 z-[99998] transition-opacity duration-1000"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};
export default UserProviderSidebar;
