import React from "react";
import Cookie from 'js-cookie';
import { useRouter } from "next/navigation";
import IconMap from "./IconMap";

interface AdminHeaderProps {
  pageTitle?: string;
  adminName?: string;
  onSidebarToggle?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle = "Admin Panel", adminName = "Admin", onSidebarToggle }) => {
  const router = useRouter();

  const onLogout = () => {
    if (typeof window !== "undefined") {
      localStorage?.clear();
    }
    Cookie.remove("token");
    router.push("/login");
  }

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-[var(--bg-dark)] border-b border-[var(--base)]/10 shadow z-20">
      <div className="flex items-center gap-3 min-w-0">
        {onSidebarToggle && (
          <button
            className="mr-2 p-2 rounded hover:bg-[var(--base)]/20 transition-colors"
            onClick={onSidebarToggle}
            aria-label="Open sidebar"
          >
            <IconMap name="big_hamburger_menu" />
          </button>
        )}
        {/* <span className="text-xl font-bold text-[var(--base)] tracking-tight">{pageTitle}</span> */}
        <div className="h-10 flex items-center justify-center">
          <img src="/light-logo.svg" alt="CampusGig Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--base)] flex items-center justify-center text-white font-bold">
            {adminName.charAt(0)}
          </div>
          <span className="text-[var(--text-light)] font-medium text-sm hidden sm:block">{adminName}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 