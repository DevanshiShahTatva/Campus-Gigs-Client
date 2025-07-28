"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { ROLE } from "@/utils/constant";

interface CommonUserLayoutProps {
  children: ReactNode;
  role: ROLE.Admin | ROLE.User;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const CommonUserLayout: React.FC<CommonUserLayoutProps> = ({
  role,
  children,
}) => {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 679px)");
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
      if (mediaQuery.matches) {
        setSidebarCollapsed(false); // force collapse off on small screens
      }
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  let breadcrumb: BreadcrumbItem[] = [];
  const isDashboard = pathname === "/admin" || pathname === "/admin/dashboard";
  if (pathname && pathname.startsWith("/admin") && !isDashboard) {
    const parts = pathname
      .replace(/^\/admin\/?/, "")
      .split("/")
      .filter(Boolean);
    breadcrumb = [
      { label: "Home", href: "/admin/dashboard" },
      ...parts.map((part, idx) => ({
        label: part
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        href:
          idx < parts.length - 1
            ? `/admin/${parts.slice(0, idx + 1).join("/")}`
            : undefined,
      })),
    ];
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 h-full">
      <AdminHeader
        pageTitle="Admin Panel"
        adminName="Admin"
        onSidebarToggle={toggleSidebar}
      />
      <div className="flex flex-1 min-h-0 h-full">
        <AdminSidebar
          activeRoute={pathname}
          isOpen={isMobile ? isSidebarOpen : false}
          onClose={isMobile ? closeSidebar : undefined}
          collapsed={!isMobile && sidebarCollapsed}
        />
        <main
          className={`flex-1 flex flex-col min-h-0 overflow-auto transition-all duration-200 `}
        >
          <>
            {breadcrumb.length > 0 && (
              <nav
                className="px-6 pt-6 pb-4 text-[var(--text-light)] text-sm"
                aria-label="Breadcrumb"
              >
                <ol className="flex items-center space-x-2">
                  {breadcrumb.map((item, idx) => (
                    <li key={item.label} className="flex items-center">
                      {item.href && idx !== breadcrumb.length - 1 ? (
                        <Link
                          href={item.href}
                          className="hover:underline text-[var(--base)]"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-[var(--text-dark)] font-medium cursor-pointer">
                          {item.label}
                        </span>
                      )}
                      {idx < breadcrumb.length - 1 && (
                        <svg
                          className="w-4 h-4 mx-2 text-[var(--text-dark)]/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </>
          <div className="p-6 pt-2">
            <div className="border border-gray-200 bg-white rounded-md shadow-lg p-6 h-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommonUserLayout;
