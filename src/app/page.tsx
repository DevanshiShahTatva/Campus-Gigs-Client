"use client"
import CampGigInfo from "@/components/landing-page-components/CampGigInfo";
import FAQs from "@/components/landing-page-components/FAQs";
import FeaturedGigs from "@/components/landing-page-components/FeaturedGigs";
import ServiceTier from "@/components/landing-page-components/ServiceTier";
import SubscriptionPlan from "@/components/landing-page-components/SubscriptionPlan";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  const searchSuggestions = [
    "Search for gigs, services, or skills...",
    "Find tutoring help...",
    "Looking for campus delivery...",
    "Need help with assignments...",
    "Find study partners...",
    "Campus errands and tasks..."
  ];

  // Handle splash screen skip
  const handleSplashSkip = () => {
    setSplashFading(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 500);
  };

  // Hide splash screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashFading(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 500); // Wait for fade-out animation
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300); // Show button after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-typing effect for search bar
  useEffect(() => {
    // Don't run auto-typing if user is typing
    if (isUserTyping) return;
    
    const currentText = searchSuggestions[currentPlaceholderIndex];
    
    if (isTyping) {
      if (searchText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setSearchText(currentText.slice(0, searchText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Pause at end
        return () => clearTimeout(timeout);
      }
    } else {
      if (searchText.length > 0) {
        const timeout = setTimeout(() => {
          setSearchText(searchText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentPlaceholderIndex((prev) => (prev + 1) % searchSuggestions.length);
          setIsTyping(true);
        }, 500); // Pause before next suggestion
        return () => clearTimeout(timeout);
      }
    }
  }, [searchText, isTyping, currentPlaceholderIndex, searchSuggestions, isUserTyping]);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    if (value.length > 0) {
      setIsUserTyping(true);
      setSearchText(""); // Clear auto-typing text
    } else {
      setIsUserTyping(false);
      setSearchText(""); // Reset for auto-typing to resume
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (userInput.length === 0) {
      setIsUserTyping(false); // Allow auto-typing to resume if input is empty
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    if (userInput.length === 0) {
      setIsUserTyping(false); // Allow auto-typing to resume if input is empty
    }
  };
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // 16 * 4 = 64px (h-16)
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    // Close mobile menu after clicking a link
    setIsMobileMenuOpen(false);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Splash Screen */}
      {showSplash && (
        <div className={`fixed inset-0 z-[100] bg-[var(--bg-dark)] flex items-center justify-center transition-opacity duration-500 ${splashFading ? 'opacity-0' : 'opacity-100'}`}>
          {/* Skip Button */}
          <button 
            onClick={handleSplashSkip}
            className="absolute top-4 right-4 text-[color:var(--text-light)]/60 hover:text-[color:var(--text-light)] transition-colors duration-300 text-sm font-medium"
          >
            Skip
          </button>
          
          <div className="text-center">
            {/* Logo Animation */}
            <div className="mb-8">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-[var(--base)] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                {/* Ripple Effect */}
                <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-[var(--base)] rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-[var(--base)] rounded-full animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            
            {/* Brand Name */}
            <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--text-light)] mb-4 animate-fade-in">
              CampusGig
            </h1>
            
            {/* Tagline */}
            <p className="text-xl md:text-2xl text-[color:var(--text-light)]/80 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              Connecting UMich Students
            </p>
            
            {/* Loading Animation */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-[var(--base)] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[var(--base)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-[var(--base)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8 w-64 mx-auto bg-[var(--text-light)]/20 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-[var(--base)] rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-[var(--bg-dark)]/95 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span 
              className="text-xl sm:text-2xl font-bold text-[color:var(--base)] hover:text-[color:var(--base-hover)] transition-colors duration-300 cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              CampusGig
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
              className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
              className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              How it Works
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
              className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              About
            </a>
            <a
              href="#service-tiers"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('service-tiers');
              }}
              className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              Services
            </a>
            <a
              href="#featured-gigs"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('featured-gigs');
              }}
              className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              Browse Gigs
            </a>
            <a
              href="#faqs"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('faqs');
              }}
              className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              FAQs
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('pricing');
              }}
              className="text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              Pricing
            </a>

            <Link href="/login">
              <button className="cursor-pointer bg-[var(--base)] text-[color:var(--text-light)] px-4 py-2 rounded-lg hover:bg-[var(--base-hover)] transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl">
                Sign In
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-[color:var(--text-light)] hover:text-[color:var(--base)] transition-colors duration-300 p-2"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
                  scrollToSection('hero');
                }}
                className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
              >
                Home
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('how-it-works');
                }}
                className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
              >
                How it Works
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
                className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
              >
                About
              </a>
              <a
                href="#service-tiers"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('service-tiers');
                }}
                className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
              >
                Services
              </a>
              <a
                href="#featured-gigs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('featured-gigs');
                }}
                className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
              >
                Browse Gigs
              </a>
              <a
                href="#faqs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faqs');
                }}
                className="block text-[color:var(--text-light)]/80 hover:text-[color:var(--base)] transition-all duration-300 py-2 font-medium cursor-pointer"
              >
                FAQs
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('pricing');
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

      <main className="pt-16">
        <section id="hero" className="relative bg-gradient-to-br from-[var(--bg-dark)]  to-[var(--bg-dark)] text-[color:var(--text-light)] py-20 md:py-40 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-40 bg-[url('/hero.jpg')] bg-cover bg-center"></div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-[color:var(--text-light)] ">
                Get Help or Earn on Campus
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[color:var(--text-light)]/80">
                Find or offer gigs — from tutoring to food pickup, right within
                the UMich student network.
              </p>
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5  rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <input
                      type="text"
                      value={isUserTyping ? userInput : ""}
                      placeholder={isUserTyping ? "" : searchText}
                      className="w-full px-6 py-4 rounded-full bg-primary/50 border border-[var(--text-light)] text-[color:var(--text-light)] placeholder-[color:var(--text-light)]/70 focus:outline-none"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    {!isUserTyping && (
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[color:var(--base)] typing-cursor" 
                        style={{ 
                          left: `${Math.min(searchText.length * 8 + 24, 280)}px` 
                        }}
                      ></div>
                    )}
                    <button
                      aria-label="Search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[color:var(--text-light)] hover:text-[color:var(--base)] transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <button className="relative group cursor-pointer">
                    <div className="absolute -inset-0.5  rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[var(--base)] text-[color:var(--text-light)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--base-hover)] transition-colors">
                      Sign Up
                    </div>
                  </button>
                </Link>
                <Link href="#featured-gigs">
                  <button className="relative group cursor-pointer">
                    <div className="absolute -inset-0.5  rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[var(--bg-dark)]/50 text-[color:var(--text-light)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--bg-dark)] transition-colors border border-[var(--text-light)]">
                      Browse Gigs
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-[var(--bg-light)] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <h2 className="text-3xl font-bold text-center mb-4 text-[var(--text-dark)]">
              How It Works
            </h2>
            <p className="text-[var(--text-dark)] text-center max-w-3xl mx-auto mb-12">
              CampusGig makes it easy to find help or earn money on campus. Our
              platform connects UMich students for various services and
              opportunities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Post or Browse Gigs",
                  description:
                    "Create your own gig or find opportunities that match your skills",
                  details: [
                    "Create a detailed profile highlighting your skills",
                    "Browse through available gigs in your area",
                    "Filter by category, tier, or location",
                    "Set your own rates and availability",
                  ],
                  icon: (
                    <svg
                      className="w-12 h-12 text-[color:var(--text-secondary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Chat and Confirm",
                  description:
                    "Discuss details and agree on terms with other students",
                  details: [
                    "Use our secure messaging system",
                    "Share files and documents safely",
                    "Set clear expectations and deadlines",
                    "Agree on payment terms",
                  ],
                  icon: (
                    <svg
                      className="w-12 h-12 text-[color:var(--text-secondary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Secure Payment",
                  description: "Get paid safely after completing the gig",
                  details: [
                    "Funds held securely in escrow",
                    "Multiple payment methods available",
                    "Automatic payment release on completion",
                    "Dispute resolution support",
                  ],
                  icon: (
                    <svg
                      className="w-12 h-12 text-[color:var(--text-secondary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
              ].map((step, index) => (
                <div key={index} className="group relative h-full">
                  <div className="absolute -inset-0.5 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative text-center p-6 bg-[var(--card-light)] rounded-xl hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="w-16 h-16 bg-[var(--base-hover)]/10 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 text-[var(--base)]">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[var(--text-dark)]">
                      {step.title}
                    </h3>
                    <p className="text-[var(--text-semi-dark)] mb-4">
                      {step.description}
                    </p>
                    <ul className="text-left space-y-2 flex-grow">
                      {step.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[var(--text-semi-dark)]"
                        >
                          <svg
                            className="w-5 h-5 text-[color:var(--base)] mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CampGigInfo - What is CampusGig */}
        <CampGigInfo />

        {/* Service Tiers */}
        <ServiceTier />

        {/* Featured Gigs & Providers */}
        <div id="featured-gigs">
          <FeaturedGigs />
        </div>

        {/* FAQs */}
        <div id="faqs">
          <FAQs />
        </div>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-[var(--bg-dark)]  to-[var(--bg-dark)] text-[color:var(--text-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-[color:var(--text-light)]/80">
              Join thousands of UMich students who are already using CampusGig
              to find help or earn money on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <button
                  className="bg-[var(--base)] text-[color:var(--text-light)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--base-hover)] cursor-pointer
                 transition-colors"
                >
                  Sign Up Now
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="cursor-pointer bg-[var(--bg-dark)]/50 text-[color:var(--text-light)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--bg-dark)] transition-colors border border-[var(--text-light)]">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        <SubscriptionPlan />
      </main>

      <footer className="bg-[var(--bg-dark)] text-[color:var(--text-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* Brand and Description */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-[color:var(--base)] mb-4 sm:mb-6">
                CampusGig
              </h3>
              <p className="text-[color:var(--text-light)]/80 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                Connecting UMich students for campus services, tutoring, and
                more. Join our community to find help or earn money on campus.
              </p>
              <div className="flex space-x-4 sm:space-x-6">
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-[var(--base)]/10"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-[var(--base)]/10"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-[var(--base)]/10"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-[var(--base)]/10"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[color:var(--base)]">Quick Links</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    Browse Gigs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    Post a Gig
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    Safety Tips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    Student Resources
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[color:var(--base)]">Contact Us</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="text-[color:var(--text-light)]/70 text-sm sm:text-base flex items-start gap-2">
                  <svg className="w-4 h-4 text-[color:var(--base)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@campusgig.com</span>
                </li>
                <li className="text-[color:var(--text-light)]/70 text-sm sm:text-base flex items-start gap-2">
                  <svg className="w-4 h-4 text-[color:var(--base)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(734) 123-4567</span>
                </li>
                <li className="text-[color:var(--text-light)]/70 text-sm sm:text-base flex items-start gap-2">
                  <svg className="w-4 h-4 text-[color:var(--base)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>University of Michigan<br />Ann Arbor, MI 48109</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#393E46] mt-12 sm:mt-16 pt-8 sm:pt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-[color:var(--text-light)]/60 text-xs sm:text-sm text-center sm:text-left">
                © 2024 CampusGig. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
                >
                  Cookie Policy
                </a>
                <a
                  href="#"
                  className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
                >
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[var(--base)] text-white rounded-full shadow-lg hover:bg-[var(--base-hover)] transition-all duration-300 transform hover:scale-110 hover:shadow-xl flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
