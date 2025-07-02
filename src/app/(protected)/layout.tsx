"use client";
import React, { useState } from "react";
import UserProviderHeader from "@/components/common/UserProviderHeader";
import UserProviderSidebar from "@/components/common/UserProviderSidebar";
import { RoleProvider } from "@/context/role-context";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <RoleProvider>
      <div className="h-screen min-h-screen flex flex-col">
        <UserProviderHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 min-h-0">
          <UserProviderSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <main className="w-full h-full overflow-auto py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
            </div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
};

export default Layout;
