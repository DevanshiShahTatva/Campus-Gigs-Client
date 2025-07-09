"use client";
import { useState, useEffect } from "react";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, FAQ_TEXT } from "@/utils/constant";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import IconMap from "@/components/common/IconMap";
import Image from "next/image";

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default
  const [faqs, setFaqs] = useState<{ question: string; answer: string; category?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const res = await apiCall({
          endPoint: API_ROUTES.ADMIN.FAQS,
          method: "GET",
          withToken: false,
        });
        if (res && res.success) {
          setFaqs(res.data);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="bg-[var(--bg-light)] pt-20 pb-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-dark)]">{FAQ_TEXT.TITLE}</h2>
          <p className="text-[var(--text-semi-dark)] max-w-3xl mx-auto">{FAQ_TEXT.SUBTITLE}</p>
        </div>

        <div className="bg-[var(--card-light)] rounded-xl shadow-md p-0 md:p-0 flex flex-col md:flex-row overflow-hidden relative min-h-40">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90">
              <Loader size={48} colorClass="text-[var(--base)]" />
            </div>
          )}
          {!loading && (
            <>
              {/* Left: Image */}
              <div className="md:w-1/2 flex flex-col items-center justify-start bg-white border-b md:border-b-0 md:border-r border-[var(--base)]/10 p-4 md:p-8">
                <Image
                  width={48}
                  height={48}
                  src="/assets/faqs_design.svg"
                  alt="FAQs Illustration"
                  className="w-48 h-48 md:w-80 md:h-80 object-contain mb-6 md:mb-12"
                />

                {/* Additional Info */}
                <div className="w-full text-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-[var(--text-dark)]">Need More Help?</h3>
                  <p className="text-xs md:text-sm text-[var(--text-semi-dark)] mb-4">{FAQ_TEXT.HELP}</p>
                  <Link
                    href={`/contact-us`}
                    className="block mx-auto w-fit bg-[var(--base)] text-[var(--text-light)] px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-[var(--base-hover)] transition-colors duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>

              {/* Right: FAQs Content */}
              <div className="md:w-1/2 w-full p-4 md:p-8">
                <div className="max-h-[600px] overflow-y-auto pr-2 md:pr-4">
                  {faqs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[var(--text-semi-dark)]">{FAQ_TEXT.NO_FAQ}</p>
                    </div>
                  ) : (
                    faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="mb-4 bg-white rounded-xl overflow-hidden  transition-all duration-300 transform border border-[var(--base)]/10"
                      >
                        {/* FAQ Header */}
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full p-4 md:p-6 text-left flex items-center justify-between transition-colors duration-300 group"
                        >
                          <div className="flex items-start gap-3 md:gap-4 w-full">
                            {/* Only show icon and tag if category exists */}

                            <div className="flex-1">
                              <h3 className="text-sm md:text-lg font-semibold text-[var(--text-dark)] group-hover:text-[var(--base)] transition-colors duration-300">
                                {faq.question}
                              </h3>
                              {faq.category && (
                                <span className="text-xs text-[var(--base)] font-medium bg-[var(--base)]/10 px-2 py-1 rounded-full">
                                  {faq.category}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Expand/Collapse Icon */}
                          <div className="flex-shrink-0 ml-2 md:ml-4">
                            <IconMap
                              name="expand"
                              className={`w-5 h-5 md:w-6 md:h-6 text-[var(--text-semi-dark)] transition-transform duration-300 ${
                                openFaq === index ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* FAQ Answer */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-4 md:px-6 pb-4 md:pb-6">
                            <div className="border-l-4 border-[var(--base)]/20 pl-3 md:pl-4">
                              <p className="text-xs md:text-sm text-[var(--text-semi-dark)] leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                        {/* Divider for clarity */}
                        {index < faqs.length - 1 && <div className="border-t border-[var(--base)]/10 mx-4 md:mx-6" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
