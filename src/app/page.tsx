"use client"
import CampGigInfo from "@/components/landing-page-components/CampGigInfo";
import FeaturedGigs from "@/components/landing-page-components/FeaturedGigs";
import ServiceTier from "@/components/landing-page-components/ServiceTier";
import SubscriptionPlan from "@/components/landing-page-components/SubscriptionPlan";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
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
