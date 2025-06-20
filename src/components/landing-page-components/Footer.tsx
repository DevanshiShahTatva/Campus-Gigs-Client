import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-dark)] text-[color:var(--text-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[color:var(--base)] mb-4 sm:mb-6">
              CampusGig
            </h3>
            <p className="text-[color:var(--text-light)]/80 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
              Connecting UMich students for campus services, tutoring, and more.
              Join our community to find help or earn money on campus.
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
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[color:var(--base)]">
              Quick Links
            </h4>
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
            <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[color:var(--base)]">
              Contact Us
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="text-[color:var(--text-light)]/70 text-sm sm:text-base flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[color:var(--base)] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>support@campusgig.com</span>
              </li>
              <li className="text-[color:var(--text-light)]/70 text-sm sm:text-base flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[color:var(--base)] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>(734) 123-4567</span>
              </li>
              <li className="text-[color:var(--text-light)]/70 text-sm sm:text-base flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[color:var(--base)] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>
                  University of Michigan
                  <br />
                  Ann Arbor, MI 48109
                </span>
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
              <Link
                href="/PrivacyPolicy"
                className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/TermsConditions"
                className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/FAQs"
                className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
              >
                 FAQs
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
