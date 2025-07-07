"use client";
import { usePathname } from "next/navigation";
import Header from "../landing-page-components/Header";
import Footer from "../landing-page-components/Footer";
import { useEffect } from 'react';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/sw.js').then((registration) => {
  //       // Send a static push notification every 10 seconds
  //       const interval = setInterval(() => {
  //         if (registration.active) {
  //           console.log('Triggering static push notification');
  //           registration.active.postMessage({
  //             type: 'STATIC_PUSH',
  //             title: 'Static Push Notification',
  //             body: 'This is a demo notification shown every 10 seconds.',
  //             url: '/'
  //           });
  //         }
  //       }, 10000);
  //       return () => clearInterval(interval);
  //     });
  //   }
  // }, []);

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
