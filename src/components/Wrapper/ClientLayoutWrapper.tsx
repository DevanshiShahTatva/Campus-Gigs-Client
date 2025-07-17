"use client";
import { usePathname } from "next/navigation";
import Header from "../landing-page-components/Header";
import Footer from "../landing-page-components/Footer";
import { useEffect } from 'react';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log("Notification permission:", permission);
        });
      } else {
        console.log("Notification permission:", Notification.permission);
      }
    }
  }, []);

  const showHeaderFooter = ["/", "/contact-us", "/faqs", "/terms-conditions", "/privacy-policy"].includes(pathname);

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}
