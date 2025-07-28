"use client";
import CampGigInfo from "@/components/landing-page-components/CampGigInfo";
import FeaturedGigs from "@/components/landing-page-components/FeaturedGigs";
import ServiceTier from "@/components/landing-page-components/ServiceTier";
import SubscriptionPlan from "@/components/landing-page-components/SubscriptionPlan";
import { useState, useEffect } from "react";
import Link from "next/link";
import { API_ROUTES, LANDING_PAGE_TEXTS } from "@/utils/constant";
import IconMap from "@/components/common/IconMap";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import { Gigs } from "@/utils/interface";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [gigs, setGigs] = useState<Gigs[]>([]);
    const userId = useSelector(
      (state: any) => state.user?.user_id || state.user?.user?.id
    );

    const handleRedirect=(redirectId: number)=>{
      if (userId) {
        router.push(`/gigs/${redirectId}`)
      } else {
        toast.warning('Please login first!')
        router.push('/login')
      }
    }
  

  const searchSuggestions = LANDING_PAGE_TEXTS.SEARCH_SUGGESTIONS;
  const debounceSearch = useDebounce(userInput, 700);
  


const fetchGigs = async (search = "") => {
  try {
    let url = `${API_ROUTES.PUBLIC_GIGS_SEARCH}?search=${search}`;

    const resp = await apiCall({
      endPoint: url,
      method: "GET",
    });

    if (resp?.success) {
      setGigs(resp.data);
    }
  } catch (error) {
    toast.error("Failed to fetch gigs");
  } finally {
  }
};

  useEffect(() => {
    fetchGigs(debounceSearch);
  }, [debounceSearch]);


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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Splash Screen */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[99999] bg-[var(--bg-dark)] flex items-center justify-center transition-opacity duration-500 ${
            splashFading ? "opacity-0" : "opacity-100"
          }`}
        >
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
                  <IconMap name="splash_logo" />
                </div>
                {/* Ripple Effect */}
                <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-[var(--base)] rounded-full animate-ping opacity-20"></div>
                <div
                  className="absolute inset-0 w-24 h-24 mx-auto border-4 border-[var(--base)] rounded-full animate-ping opacity-10"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>

            {/* Brand Name */}
            <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--text-light)] mb-4 animate-fade-in">
              CampusGig
            </h1>

            {/* Tagline */}
            <p
              className="text-xl md:text-2xl text-[color:var(--text-light)]/80 mb-8 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              {LANDING_PAGE_TEXTS.TAGLINE}
            </p>

            {/* Loading Animation */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-[var(--base)] rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-[var(--base)] rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-[var(--base)] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 w-64 mx-auto bg-[var(--text-light)]/20 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-[var(--base)] rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      <main className="">
        <section
          id="hero"
          className="relative mt-14 bg-gradient-to-br from-[var(--bg-dark)]  to-[var(--bg-dark)] text-[color:var(--text-light)] py-20 md:py-40 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-40 bg-[url('/hero.jpg')] bg-cover bg-center"></div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-[color:var(--text-light)] ">
                {LANDING_PAGE_TEXTS.GET_HELP}
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[color:var(--text-light)]/80">
                {LANDING_PAGE_TEXTS.FIND_OR_OFFER}
              </p>
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <input
                      type="text"
                      value={isUserTyping ? userInput : ""}
                      placeholder={isUserTyping ? "" : searchText}
                      className={` ${
                        isUserTyping ? "rounded-t-3xl" : "rounded-full"
                      } w-full px-6 py-4 border border-[var(--text-light)] text-[color:var(--text-light)] placeholder-[color:var(--text-light)]/70 focus:outline-none`}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    {!isUserTyping && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[color:var(--base)] typing-cursor"
                        style={{
                          left: `${Math.min(
                            searchText.length * 8 + 24,
                            280
                          )}px`,
                        }}
                      ></div>
                    )}
                    <button
                      aria-label="Search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[color:var(--text-light)] hover:text-[color:var(--base)] transition-colors"
                    >
                      <IconMap name="searchbar_icon" />
                    </button>
                  </div>
                  {isUserTyping && (
                    <div className="relative">
                      <div className="absolute top-0 bg-black/70 w-full text-white z-30 rounded-b-2xl">
                        {gigs?.length > 0 ? (
                          gigs.slice(0, 4).map((gig) => (
                            <div
                              onClick={() => handleRedirect(gig.id)}
                              className="line-clamp-1 p-2 px-4 text-left hover:bg-gray-800 cursor-pointer transition"
                            >
                              {gig.title}
                            </div>
                          ))
                        ) : (
                          <div className="py-4 rounded-b-lg">
                            Sorry, No gigs found.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
        <section
          id="how-it-works"
          className="py-20 bg-[var(--bg-light)] relative overflow-hidden"
        >
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <h2 className="text-3xl font-bold text-center mb-4 text-[var(--text-dark)]">
              {LANDING_PAGE_TEXTS.HOW_IT_WORKS.TITLE}
            </h2>
            <p className="text-[var(--text-dark)] text-center max-w-3xl mx-auto mb-12">
              {LANDING_PAGE_TEXTS.HOW_IT_WORKS.DESCRIPTION}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {LANDING_PAGE_TEXTS.HOW_IT_WORKS.STEPS.map((step, index) => (
                <div key={index} className="group relative h-full">
                  <div className="absolute -inset-0.5 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative text-center p-6 bg-[var(--card-light)] rounded-xl hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="w-16 h-16 bg-[var(--base-hover)]/10 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 text-[var(--base)]">
                      <IconMap name={step.icon} />
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
                          <IconMap name="check" />
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
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">{LANDING_PAGE_TEXTS.CALL_TO_ACTION.TITLE}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-[color:var(--text-light)]/80">{LANDING_PAGE_TEXTS.CALL_TO_ACTION.SUBTITLE}</p>
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
          <IconMap name="scroll_top" />
        </button>
      )}
    </div>
  );
}
