"use client";
import { usePathname } from "next/navigation";
import Header from "../landing-page-components/Header";
import Footer from "../landing-page-components/Footer";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showHeaderFooter = [
    '/',
    '/ContactUs',
    '/FAQs',
    '/TermsConditions',
    '/PrivacyPolicy',
  ].includes(pathname);

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}
