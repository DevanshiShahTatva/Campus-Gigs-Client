import { ReactNode } from "react";

export const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage?.getItem("token") ?? sessionStorage.getItem("token") ?? "";
  return token;
}

export const logout = () => {
  if (typeof window === "undefined") return;
  sessionStorage?.clear();
}

export const getAvatarName = (name: string, isCapital: boolean = false) => {
  if (!name) return '';
  const parts = name.split(' ');
  let initials = '';
  if (parts.length > 1) {
    initials = `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
  } else {
    initials = name.charAt(0);
  }
  return isCapital ? initials.toUpperCase() : initials;
};

export const renderBaseOnCondition = (
  condition: boolean,
  trueValue: ReactNode,
  falseValue: ReactNode
) => {
  return condition ? trueValue : falseValue;
};

export function getRoleLabel(role: "user" | "provider") {
  return role === "user" ? "User" : "Provider";
}