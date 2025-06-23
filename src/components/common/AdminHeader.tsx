import React from "react";
import Cookie from 'js-cookie';
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  pageTitle?: string;
  adminName?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle = "Admin Panel", adminName = "Admin" }) => {
  const router = useRouter();

  const onLogout = () => {
    localStorage.clear();
    Cookie.remove("token");
    router.push("/login");
  }

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-[var(--bg-dark)] border-b border-[var(--base)]/10 shadow z-20">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-[var(--base)] tracking-tight">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--base)] flex items-center justify-center text-white font-bold">
            {adminName.charAt(0)}
          </div>
          <span className="text-[var(--text-light)] font-medium text-sm hidden sm:block">{adminName}</span>
        </div>
        <button className="p-2 rounded hover:bg-[var(--base)]/20 transition-colors" title="Logout" onClick={() => onLogout()}>
          <svg className="w-6 h-6 text-[var(--text-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader; 