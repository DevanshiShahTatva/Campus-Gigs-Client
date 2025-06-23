'use client'
import { useState, useEffect } from 'react';
import { apiCall } from '@/utils/apiCall';
import { API_ROUTES } from '@/utils/constant';
import Loader from '@/components/common/Loader';

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default
  const [faqs, setFaqs] = useState<{ question: string; answer: string; category?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const res = await apiCall({
          endPoint: API_ROUTES.ADMIN.FAQS,
          method: 'GET',
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
    <section className="py-20 bg-[var(--bg-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader size={48} colorClass="text-[var(--base)]" />
          </div>
        )}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-dark)]">
            Frequently Asked Questions
          </h2>
          <p className="text-[var(--text-semi-dark)] max-w-3xl mx-auto">
            Find answers to common questions about using CampusGig. Can't find
            what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 bg-[var(--card-light)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-[var(--base)]/10"
            >
              {/* FAQ Header */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-[var(--base)]/5 transition-colors duration-300 group"
              >
                <div className="flex items-start gap-4 w-full">
                  {/* Only show icon and tag if category exists */}
                  {faq.category ? (
                    <div className="w-10 h-10 rounded-full bg-[var(--base)]/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[var(--base)]/20 transition-colors duration-300">
                      {/* You can add a default icon or use a switch/case for known categories here if desired */}
                      <svg className="w-5 h-5 text-[var(--base)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path d="M8 12l2 2 4-4" strokeWidth="2" />
                      </svg>
                    </div>
                  ) : null}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--text-dark)] group-hover:text-[var(--base)] transition-colors duration-300">
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
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-6 h-6 text-[var(--text-semi-dark)] transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* FAQ Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="border-l-4 border-[var(--base)]/20 pl-4">
                    <p className="text-[var(--text-semi-dark)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
              {/* Divider for clarity */}
              {index < faqs.length - 1 && <div className="border-t border-[var(--base)]/10 mx-6" />}
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[var(--base)]/10 to-[var(--base)]/5 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-[var(--text-dark)]">
              Still have questions?
            </h3>
            <p className="text-[var(--text-semi-dark)] mb-4">
              Our support team is here to help you get the most out of CampusGig.
            </p>
            <button className="bg-[var(--base)] text-[var(--text-light)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--base-hover)] transition-colors duration-300 transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
