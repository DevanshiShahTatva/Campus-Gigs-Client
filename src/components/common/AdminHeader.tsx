import React from "react";
import Cookie from 'js-cookie';
import { useRouter } from "next/navigation";
import IconMap from "./IconMap";
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/userSlice';

interface AdminHeaderProps {
  pageTitle?: string;
  adminName?: string;
  onSidebarToggle?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle = "Admin Panel", adminName = "Admin", onSidebarToggle }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogout = () => {
    if (typeof window !== "undefined") {
      if ((window as any).__PERSISTOR) {
        (window as any).__PERSISTOR.purge();
      }
      document.cookie = 'token=; Max-Age=0; path=/;';
    }
    dispatch(logout());
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
          <img onClick={()=>router.push('/admin/dashboard')} src="/light-logo.svg" alt="CampusGig Logo" className="h-6 w-auto sm:h-8 md:h-10 min-w-[32px] sm:min-w-[40px] object-contain transition-all duration-300 cursor-pointer" />
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