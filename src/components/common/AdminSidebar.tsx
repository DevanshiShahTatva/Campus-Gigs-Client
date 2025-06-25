import React from "react";
import Link from "next/link";
import { USER_SIDEBAR_ITEMS } from "@/utils/constant";
import Image from "next/image";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import ModalLayout from "./Modals/CommonModalLayout";
import IconMap from "./IconMap";

interface AdminSidebarProps {
  activeRoute?: string;
  isOpen?: boolean; // for mobile
  onClose?: () => void; // for mobile
  collapsed?: boolean; // for desktop
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeRoute,
  isOpen = false,
  onClose,
  collapsed = false,
}) => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage?.clear();
    }
    Cookie.remove("token");
    router.push("/login");
  };
  // Sidebar content
  const sidebarContent = (
    <aside
      className={`h-full min-h-full ${
        collapsed ? "w-16" : "w-64"
      } bg-[var(--bg-dark)] text-[var(--text-light)] flex flex-col shadow-lg border-r border-[var(--base)]/10 z-30 flex-shrink-0 transition-all duration-200 relative`}
    >
      {/* Close button for mobile */}
      {onClose && (
        <button
          className="absolute top-4 right-4 sm:hidden p-2 rounded hover:bg-[var(--base)]/20 transition-colors z-40"
          onClick={onClose}
          aria-label="Close sidebar"
        >
         <IconMap name="hamburger_menu" />
        </button>
      )}
      <nav
        className={`flex-1 px-2 py-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--base)]/30 scrollbar-track-transparent ${
          onClose ? "sm:mt-0 mt-12" : ""
        }`}
      >
        {USER_SIDEBAR_ITEMS.map((link) => {
          const isActive = activeRoute === link.route;
          return (
            <Link
              key={link.id}
              href={link.route}
              className={`flex items-center py-3 rounded-lg transition-colors font-medium text-base hover:bg-[var(--base)]/20 ${
                collapsed ? "justify-center w-full" : "gap-3 px-4"
              } ${isActive ? "bg-[var(--base)]/20 " : ""}`}
              title={collapsed ? link.title : undefined}
            >
              <Image
                src={link.icon}
                alt={link.title}
                height={24}
                width={24}
                className={collapsed ? "" : "mr-2"}
              />
              {/* Only show title if not collapsed */}
              {!collapsed && <span>{link.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-2">
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 text-[var(--text-light)] font-semibold rounded-lg hover:bg-[var(--base)]/20 transition-colors duration-200 mb-4 ${
            collapsed ? "justify-center px-0" : ""
          }`}
          onClick={() => setShowLogoutModal(true)}
          title="Logout"
        >
          <IconMap name="logout" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
      {showLogoutModal && (
        <ModalLayout
          onClose={() => setShowLogoutModal(false)}
          modalTitle="Logout Confirmation"
          footerActions={[
            {
              label: "Cancel",
              variant: "secondary",
              onClick: () => setShowLogoutModal(false),
            },
            {
              label: "Logout",
              variant: "delete",
              onClick: handleLogout,
            },
          ]}
        >
          <div className="py-6 text-center text-[var(--text-dark)] text-lg">
            Are you sure you want to logout?
          </div>
        </ModalLayout>
      )}
    </aside>
  );

  // Mobile overlay
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden sm:block h-full">{sidebarContent}</div>
      {/* Mobile overlay sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex sm:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
