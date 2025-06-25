import Link from "next/link";
import { FOOTER_SOCIAL_LINKS, FOOTER_CONTACT_INFO, FOOTER_BOTTOM_LINKS, FOOTER_COPYRIGHT, FOOTER_BRAND, FOOTER_QUICK_LINKS } from "@/utils/constant";
import IconMap from "@/components/common/IconMap";

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-dark)] text-[color:var(--text-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[color:var(--base)] mb-4 sm:mb-6">
              {FOOTER_BRAND.title}
            </h3>
            <p className="text-[color:var(--text-light)]/80 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
              {FOOTER_BRAND.description}
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              {FOOTER_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-[var(--base)]/10"
                >
                  <span className="sr-only">{item.label}</span>
                  <IconMap name={item.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[color:var(--base)]">
              Quick Links
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[color:var(--text-light)]/70 hover:text-[color:var(--base)] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[color:var(--base)]">
              Contact Us
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {FOOTER_CONTACT_INFO.map((item) => (
                <li key={item.label} className="text-[color:var(--text-light)]/70 text-sm sm:text-base flex items-start gap-2">
                  <IconMap name={item.icon} />
                  <span>{item.value.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#393E46] mt-12 sm:mt-16 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-[color:var(--text-light)]/60 text-xs sm:text-sm text-center sm:text-left">
              {FOOTER_COPYRIGHT}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              {FOOTER_BOTTOM_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[color:var(--text-light)]/60 hover:text-[color:var(--base)] text-xs sm:text-sm transition-all duration-300 hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
