"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBell, FaUserCircle, FaChevronDown, FaExchangeAlt, FaUser, FaCog, FaSignOutAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { RoleContext } from '@/context/role-context';

const UserProviderHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { role, setRole } = useContext(RoleContext);
  const router = useRouter();

  // Placeholder user data
  const user = {
    name: 'John Doe',
    avatar: '', // Set to a valid image URL to test avatar, or leave empty for initials
  };
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Placeholder notifications
  const notifications = [
    { id: 1, type: 'info', message: 'Your gig was approved!', read: false },
    { id: 2, type: 'success', message: 'Payment received for completed gig.', read: false },
    { id: 3, type: 'info', message: 'New message from Alice.', read: true },
  ];

  const handleRoleSwitch = () => {
    setRole(role === 'user' ? 'provider' : 'user');
  };

  const handleLogout = () => {
    router.push('/login');
  };

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.notif-dropdown')) setNotifOpen(false);
      if (!(e.target as HTMLElement).closest('.profile-dropdown')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-[var(--base)]/10 shadow z-30">
      <div className="flex items-center gap-6">
        <span className="flex items-center cursor-pointer" onClick={() => router.push('/')}> 
          <img src="/logo.svg" alt="CampusGig Logo" className="h-8 w-auto min-w-[32px] object-contain transition-all duration-300" />
        </span>
        <nav className="hidden md:flex gap-4">
          <Link href="#" className="text-gray-700 font-medium hover:text-[var(--base)] transition-all duration-300">Dashboard</Link>
          <Link href="#" className="text-gray-700 font-medium hover:text-[var(--base)] transition-all duration-300">Gigs</Link>
          <Link href="#" className="text-gray-700 font-medium hover:text-[var(--base)] transition-all duration-300">Chat</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-[var(--base)]/10 transition-colors focus:outline-none"
            title="Notifications"
            onClick={() => setNotifOpen((open) => !open)}
          >
            <FaBell className="text-xl text-[var(--base)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {/* Notifications Dropdown */}
          <div
            className={`notif-dropdown absolute right-0 mt-2 w-80 bg-white border border-[var(--base)]/20 rounded-xl shadow-2xl transition-all duration-200 z-40 overflow-hidden ${notifOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            onMouseLeave={() => setNotifOpen(false)}
          >
            <div className="px-5 py-4 border-b border-gray-100 bg-[var(--base)]/5 font-semibold text-gray-900 text-base">Notifications</div>
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-400">No notifications</div>
              ) : notifications.map((notif) => (
                <div key={notif.id} className={`flex items-start gap-3 px-5 py-4 ${notif.read ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className="mt-1">
                    {notif.type === 'success' ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaInfoCircle className="text-[var(--base)] text-lg" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-gray-800">{notif.message}</div>
                    {!notif.read && (
                      <button className="mt-2 text-xs text-[var(--base)] hover:underline">Mark as read</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--base)]/10 transition-colors focus:outline-none profile-dropdown"
            title="Profile menu"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-[var(--base)] shadow-sm" />
            ) : (
              <span className="w-9 h-9 rounded-full bg-[var(--base)] text-white flex items-center justify-center font-bold text-lg border-2 border-[var(--base)] shadow-sm">
                {initials}
              </span>
            )}
            <FaChevronDown className={`text-xs text-gray-700 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {/* Profile Dropdown */}
          <div
            className={`profile-dropdown absolute right-0 mt-2 w-56 bg-white border border-[var(--base)]/20 rounded-xl shadow-2xl transition-all duration-200 z-40 overflow-hidden ${dropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100 bg-[var(--base)]/5">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--base)]" />
              ) : (
                <span className="w-10 h-10 rounded-full bg-[var(--base)] text-white flex items-center justify-center font-bold text-xl border-2 border-[var(--base)]">
                  {initials}
                </span>
              )}
              <div>
                <div className="font-semibold text-gray-900 text-base">{user.name}</div>
                <div className="text-xs text-gray-500">{role === 'user' ? 'User' : 'Provider'} Mode</div>
              </div>
            </div>
            <Link href="/profile" className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-[var(--base)]/10 transition text-sm font-medium">
              <FaUser className="text-[var(--base)]" /> Profile
            </Link>
            <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-gray-700 hover:bg-[var(--base)]/10 transition text-sm font-medium" onClick={handleRoleSwitch}>
              <FaExchangeAlt className="text-[var(--base)]" /> Switch to {role === 'user' ? 'Provider' : 'User'}
            </button>
            <Link href="#" className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-[var(--base)]/10 transition text-sm font-medium">
              <FaCog className="text-[var(--base)]" /> Settings
            </Link>
            <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition text-sm font-medium border-t border-gray-100" onClick={handleLogout}>
              <FaSignOutAlt className="text-red-500" /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default UserProviderHeader; 