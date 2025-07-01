"use client";
import { usePathname } from "next/navigation";
import Header from "../landing-page-components/Header";
import Footer from "../landing-page-components/Footer";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderFooter =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/sign-up" ||
    pathname === "/user/buy-subscription";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
