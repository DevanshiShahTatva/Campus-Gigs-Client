"use client";
import React, { useState, createContext } from "react";
import UserProviderHeader from "@/components/common/UserProviderHeader";
import UserProviderSidebar from "@/components/common/UserProviderSidebar";

// Create context for user role
export const RoleContext = createContext<{
  role: "user" | "provider";
  setRole: (role: "user" | "provider") => void;
}>({ role: "user", setRole: () => {} });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<"user" | "provider">("user");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div className="h-screen min-h-screen flex flex-col">
        <UserProviderHeader />
        <div className="flex flex-1 min-h-0">
          <UserProviderSidebar />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleContext.Provider>
  );
};

export default Layout;
