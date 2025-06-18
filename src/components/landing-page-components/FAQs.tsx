'use client'
import { useState } from 'react';

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  const faqs = [
    {
      question: "How do I get started with CampusGig?",
      answer:
        "Getting started is easy! Simply sign up with your UMich email, create your profile, and you can start browsing or posting gigs immediately. Make sure to verify your student status to access all features.",
      category: "Getting Started"
    },
    {
      question: "How does the payment system work?",
      answer:
        "We use a secure payment system that holds funds in escrow until the gig is completed. Once both parties confirm completion, the payment is released to the provider. We support various payment methods including credit cards and campus payment systems.",
      category: "Payments"
    },
    {
      question: "What safety measures are in place?",
      answer:
        "All users must verify their UMich student status. We have a review system, secure messaging, and payment protection. We also encourage meeting in public campus locations and following our safety guidelines.",
      category: "Safety"
    },
    {
      question: "How are service tiers determined?",
      answer:
        "Service tiers are based on the complexity and expertise required. Tier 1 is for basic tasks, Tier 2 for advice and guidance, and Tier 3 for specialized expertise. Providers can request tier upgrades based on their experience and reviews.",
      category: "Services"
    },
    {
      question: "Can I offer multiple types of services?",
      answer:
        "Yes! You can offer different services across multiple tiers. Your profile will show your expertise areas, and you can set different rates for different types of services.",
      category: "Services"
    },
    {
      question: "What if I have a dispute with a provider?",
      answer:
        "We have a dedicated support team to help resolve disputes. All communications and agreements are tracked in the platform, and we can mediate if needed. Our goal is to ensure a fair resolution for all parties.",
      category: "Support"
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 bg-[var(--bg-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="mb-4 bg-[var(--card-light)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* FAQ Header */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-[var(--base)]/5 transition-colors duration-300 group"
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div className="w-10 h-10 rounded-full bg-[var(--base)]/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[var(--base)]/20 transition-colors duration-300">
                    {faq.category === "Getting Started" && (
                      <svg className="w-5 h-5 text-[var(--base)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {faq.category === "Payments" && (
                      <svg className="w-5 h-5 text-[var(--base)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {faq.category === "Safety" && (
                      <svg className="w-5 h-5 text-[var(--base)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {faq.category === "Services" && (
                      <svg className="w-5 h-5 text-[var(--base)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    )}
                    {faq.category === "Support" && (
                      <svg className="w-5 h-5 text-[var(--base)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--text-dark)] group-hover:text-[var(--base)] transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <span className="text-xs text-[var(--base)] font-medium bg-[var(--base)]/10 px-2 py-1 rounded-full">
                      {faq.category}
                    </span>
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
