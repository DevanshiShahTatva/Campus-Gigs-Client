"use client";
import React, { useState } from "react";
import UserProviderHeader from "@/components/common/UserProviderHeader";
import UserProviderSidebar from "@/components/common/UserProviderSidebar";
import { RoleProvider } from "@/context/role-context";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/constant";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <RoleProvider>
      <div className={`flex flex-col ${pathname === ROUTES.GIGS_CREATE ? "" : "h-full"}`}>
        <UserProviderHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 flex-col overflow-auto" id="scrollableDiv">
          <UserProviderSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <main id="mainSection" className="w-full flex-1 py-6 bg-gray-50">
            <div className="max-w-8xl h-full mx-auto px-4 sm:px-6 lg:px-8 pb-4">{children}</div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
};

export default Layout;
