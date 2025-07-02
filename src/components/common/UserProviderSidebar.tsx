"use client";
import React from "react";
import { FaComments, FaTasks, FaCog, FaHome } from "react-icons/fa";
import Link from "next/link";

const sidebarItems = [
  { id: 1, title: "Dashboard", icon: <FaHome />, route: "#" },
  { id: 2, title: "Chat", icon: <FaComments />, route: "#" },
  { id: 3, title: "Gigs", icon: <FaTasks />, route: "/gigs" },
  { id: 4, title: "Settings", icon: <FaCog />, route: "#" },
];

const UserProviderSidebar = () => {
  return (
    <aside className="h-full w-64 bg-white border-r shadow flex flex-col py-6 px-2">
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => (
          <Link key={item.id} href={item.route} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[var(--base)]/10 transition">
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
export default UserProviderSidebar; 