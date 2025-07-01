"use client";
import React from "react";
import UserProviderHeader from "@/components/common/UserProviderHeader";
import UserProviderSidebar from "@/components/common/UserProviderSidebar";
import { RoleProvider } from "@/context/role-context";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RoleProvider>
      <div className="h-screen min-h-screen flex flex-col">
        <UserProviderHeader />
        <div className="flex flex-1 min-h-0">
          <UserProviderSidebar />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleProvider>
  );
};

export default Layout;
