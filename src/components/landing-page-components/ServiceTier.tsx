"use client";
import { useState } from "react";

const ServiceTier = () => {
  const [activeTier, setActiveTier] = useState("tier1");

  const tiers = [
    {
      id: "tier1",
      label: "Tier 1",
      services: [
        "Campus delivery",
        "Laundry pickup",
        "Basic errands",
        "Simple tasks",
      ],
    },
    {
      id: "tier2",
      label: "Tier 2",
      services: [
        "Study tips",
        "Course selection",
        "Job search help",
        "Campus navigation",
        "Tutoring",
      ],
    },
    {
      id: "tier3",
      label: "Tier 3",
      services: [
        "Subject tutoring",
        "Resume review",
        "Interview prep",
        "Project help",
      ],
    },
  ];

  const tierContent = [
    {
      id: "tier1",
      tier: "Tier 1",
      title: "Basic Tasks",
      description: "Laundry, delivery, and other simple services",
      examples: [
        "Campus delivery",
        "Laundry pickup",
        "Basic errands",
        "Simple tasks",
      ],
      price: "Starting at $10",
      image: "/tier1.jpg",
    },
    {
      id: "tier2",
      tier: "Tier 2",
      title: "Advice",
      description: "Class help, job search assistance, and guidance",
      examples: [
        "Study tips",
        "Course selection",
        "Job search help",
        "Campus navigation",
        "Tutoring",
      ],
      price: "Starting at $20",
      image: "/tier2.jpg",
    },
    {
      id: "tier3",
      tier: "Tier 3",
      title: "Expert Help",
      description: "Tutoring, resume review, and specialized services",
      examples: [
        "Subject tutoring",
        "Resume review",
        "Interview prep",
        "Project help",
      ],
      price: "Starting at $30",
      image: "/tier3.jpg",
    },
  ];

  const handleServiceClick = (service: string, tierId: string) => {
    console.log(`Selected service: ${service} from ${tierId}`);
  };

  return (
    <div>
      <section id="service-tiers" className="py-20 bg-[var(--bg-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-[var(--text-dark)]">
            Service Tiers Explained
          </h2>
          <p className="text-[var(--text-semi-dark)] text-center max-w-3xl mx-auto mb-12">
            Our tiered system ensures quality and appropriate pricing for
            different types of services. Each tier represents a different level
            of expertise and complexity.
          </p>

          {/* Tier Selection Tabs with Animated Underline */}
          <div className="flex justify-center mb-8 relative">
            <div className="flex space-x-4 relative">
              {tiers.map((tab) => (
                <button
                  key={tab.id}
                  className={`relative cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out ${
                    activeTier === tab.id
                      ? "text-[var(--base)] bg-white shadow-sm"
                      : "text-[var(--text-semi-dark)] hover:text-[var(--base)] hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTier(tab.id)}
                >
                  {tab.label}
                </button>
              ))}

              {/* Animated Underline */}
              <div className="absolute bottom-0 h-0.5 bg-[var(--base)] transition-all duration-300 ease-in-out" />
            </div>
          </div>

          {/* Service Buttons with Animation */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {tiers.map((tab) => (
              <div
                key={tab.id}
                className={`cursor-pointer flex flex-wrap gap-2 transition-all duration-500 ease-in-out ${
                  activeTier === tab.id
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform -translate-y-4 pointer-events-none absolute"
                }`}
              >
                {tab.services.map((service, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 cursor-pointer rounded-full bg-[var(--base)]/10 text-[color:var(--base)] hover:bg-[var(--base-hover)] hover:text-[var(--text-light)] transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleServiceClick(service, tab.id)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {service}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Tier Content with Smooth Animations */}
          <div className="bg-white rounded-xl p-8 hover:shadow-md transition-all duration-300 relative overflow-hidden">
            {tierContent.map((tier) => (
              <div
                key={tier.id}
                className={`transition-all duration-500 ease-in-out ${
                  activeTier === tier.id
                    ? "opacity-100 transform translate-x-0"
                    : "opacity-0 transform translate-x-full absolute top-0 left-0 w-full h-full"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <img
                      src={tier.image}
                      alt={`${tier.tier} illustration`}
                      className="w-full h-40 xs:h-60 sm:h-70 md:h-80 rounded-xl object-cover transition-all duration-500 transform hover:scale-105"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-bold text-[color:var(--base)] mb-2 transition-all duration-300">
                      {tier.tier}
                    </h3>
                    <h4 className="text-xl font-semibold mb-4 text-[var(--text-dark)] transition-all duration-300">
                      {tier.title}
                    </h4>
                    <p className="text-[var(--text-semi-dark)] mb-4 transition-all duration-300">
                      {tier.description}
                    </p>
                    <div className="mb-4">
                      <h5 className="font-semibold text-[var(--text-dark)] mb-2 transition-all duration-300">
                        Examples:
                      </h5>
                      <ul className="list-disc list-inside text-[var(--text-semi-dark)] space-y-1">
                        {tier.examples.map((example, i) => (
                          <li
                            key={i}
                            className="transition-all duration-300 transform hover:translate-x-2"
                            style={{
                              animationDelay: `${i * 100}ms`,
                            }}
                          >
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[color:var(--base)] font-semibold transition-all duration-300">
                      {tier.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceTier;
