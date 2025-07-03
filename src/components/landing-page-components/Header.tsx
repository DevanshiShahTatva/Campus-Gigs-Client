"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookie from "js-cookie";

const Header = () => {
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToken, setIsToken] = useState("");

  const onLogout = () => {
    Cookie.remove("token");
    router.push("/login");
  };

  const gotoProfile = () => {
    router.push("/profile");
  };

  useEffect(() => {
    if (localStorage) {
      setIsToken(localStorage.getItem("token") as string);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // 16 * 4 = 64px (h-16)
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    // Close mobile menu after clicking a link
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-[var(--bg-dark)]/95 backdrop-blur-sm shadow-sm sticky w-full top-0 z-500">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <span
            className="text-xl sm:text-2xl font-bold text-[color:var(--base)] hover:text-[color:var(--base-hover)] transition-colors duration-300 cursor-pointer"
            onClick={() => router.push("/")}
          >
            {/* CampusGig */}
            <img
              src="/light-logo.svg"
              alt="CampusGig Logo"
              className="h-6 w-auto sm:h-8 md:h-10 object-contain min-w-[32px] sm:min-w-[40px] mr-2 transition-all duration-300"
            />
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("how-it-works");
            }}
            className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
          >
            How it Works
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
            className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
          >
            About
          </a>
          <a
            href="#service-tiers"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("service-tiers");
            }}
            className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
          >
            Services
          </a>
          <a
            href="#featured-gigs"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("featured-gigs");
            }}
            className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
          >
            Browse Gigs
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("pricing");
            }}
            className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
          >
            Pricing
          </a>

          {isToken ? (
            <button
              className="h-[41.80px] w-[41.80px] rounded-full bg-[color:var(--base)] text-white font-bold relative cursor-pointer"
              onClick={() => gotoProfile()}
            >
              {localStorage?.getItem("name")?.charAt(0)?.toUpperCase()}
            </button>
          ) : (
            <Link href="/login">
              <button className="cursor-pointer bg-[var(--base)] text-[color:var(--text-light)] px-4 py-2 rounded-lg hover:bg-[var(--base-hover)] transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-[color:var(--text-light)] hover:text-[color:var(--base)] transition-colors duration-300 p-2"
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--bg-dark)]/95 backdrop-blur-sm border-t border-[var(--base)]/20">
          <div className="px-4 py-6 space-y-4">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
              className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("how-it-works");
              }}
              className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
            >
              How it Works
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
            >
              About
            </a>
            <a
              href="#service-tiers"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("service-tiers");
              }}
              className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
            >
              Services
            </a>
            <a
              href="#featured-gigs"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("featured-gigs");
              }}
              className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
            >
              Browse Gigs
            </a>
            <a
              href="#faqs"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("faqs");
              }}
              className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
            >
              FAQs
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pricing");
              }}
              className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
            >
              Pricing
            </a>
            <div className="pt-4 border-t border-[var(--base)]/20">
              <Link href="/login">
                <button className="w-full bg-[var(--base)] text-[color:var(--text-light)] px-4 py-3 rounded-lg hover:bg-[var(--base-hover)] transition-all duration-300 font-semibold shadow-lg">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
