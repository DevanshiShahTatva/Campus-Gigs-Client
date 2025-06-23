"use client";

import React from "react";
import clsx from "clsx";

type variant = "primary" | "secondary" | "delete" | "outlined" | "disabled" | "success" | "warning" | "black" | "green";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: variant;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", startIcon, endIcon, children, className, ...props }) => {
  const baseClasses = "px-4 py-2 font-bold transition duration-200";
  const typeClasses = {
    primary: "bg-[var(--base)] hover:bg-[var(--base-hover)] cursor-pointer rounded-[8px] text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 cursor-pointer rounded-[8px] text-white",
    success: "bg-green-600 hover:bg-green-700 cursor-pointer rounded-[8px] text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 cursor-pointer rounded-[8px] text-white",
    delete: "bg-red-500 hover:bg-red-600 rounded-[8px] text-white cursor-pointer",
    outlined: "border border-[var(--base)] text-[var(--base)] hover:bg-[var(--base-hover)] hover:text-[var(--text-light)] cursor-pointer rounded-[8px]",
    black: "bg-black hover:bg-gray-900 text-white cursor-pointer rounded-[8px]",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed rounded-[8px]",
    green: "bg-[var(--base)] text-white hover:bg-[var(--base-hover)] cursor-pointer rounded-[8px] transition-colors",
  };

  return (
    <button className={clsx(baseClasses, typeClasses[variant], className)} {...props}>
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
};

export default Button;
