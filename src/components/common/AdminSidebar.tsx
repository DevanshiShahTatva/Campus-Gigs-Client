import React from "react";
import Link from "next/link";
import { USER_SIDEBAR_ITEMS } from "@/utils/constant";
import Image from "next/image";

interface AdminSidebarProps {
  activeRoute?: string;
}


const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeRoute }) => {
  return (
    // Ensure sidebar is full height and does not shrink
    <aside className="h-full min-h-full w-64 bg-[var(--bg-dark)] text-[var(--text-light)] flex flex-col shadow-lg border-r border-[var(--base)]/10 z-10 flex-shrink-0">
      <nav className="flex-1 px-2 py-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--base)]/30 scrollbar-track-transparent">
        {USER_SIDEBAR_ITEMS.map((link) => {
          const isActive = activeRoute === link.route;
          return (
            <Link
              key={link.id}
              href={link.route}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-base hover:bg-[var(--base)]/20  ${
                isActive ? "bg-[var(--base)]/20 " : ""
              }`}
            >
              <Image
                src={link.icon}
                alt={link.title}
                height={24}
                width={24}
                className="mr-2"
              />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 py-4 text-xs text-[var(--text-light)]/60 border-t border-[var(--base)]/10">
        &copy; {new Date().getFullYear()} CampusGig Admin
      </div>
    </aside>
  );
};

export default AdminSidebar;
