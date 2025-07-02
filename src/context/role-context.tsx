import React, { createContext, useState, ReactNode } from "react";

export const RoleContext = createContext<{
  role: "user" | "provider";
  setRole: (role: "user" | "provider") => void;
}>({ role: "user", setRole: () => {} });

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<"user" | "provider">("user");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}; 