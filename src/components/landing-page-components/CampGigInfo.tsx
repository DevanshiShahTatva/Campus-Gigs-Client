import React from "react";
import { CAMP_GIG_BENEFITS, CAMP_GIG_STUDENT_BENEFITS, CAMP_GIG_PROVIDER_BENEFITS } from "@/utils/constant";
import IconMap from "@/components/common/IconMap";

const CampGigInfo = () => {
  return (
    <div>
      <section id="about" className="py-20 bg-[var(--bg-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-[color:var(--text-light)]">
            Why CampusGig?
          </h2>
          <p className="text-[color:var(--text-light)]/80 text-center max-w-3xl mx-auto mb-12">
            CampusGig is more than just a platform - it's a community of UMich
            students helping each other succeed. Here's what makes us different.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CAMP_GIG_BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-[var(--card-dark)] p-8 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--base-hover)]/10 rounded-full flex items-center justify-center mb-4 text-[var(--base)]">
                  <IconMap name={benefit.icon} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[color:var(--text-light)]">
                  {benefit.title}
                </h3>
                <p className="text-[color:var(--text-light)]/80">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--card-dark)] p-8 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4 text-[color:var(--text-light)]">
                For Students Seeking Help
              </h3>
              <ul className="space-y-3">
                {CAMP_GIG_STUDENT_BENEFITS.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[color:var(--text-light)]/80"
                  >
                    <IconMap name="check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--card-dark)] p-8 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4 text-[color:var(--text-light)]">
                For Service Providers
              </h3>
              <ul className="space-y-3">
                {CAMP_GIG_PROVIDER_BENEFITS.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[var(--text-light)]/80"
                  >
                    <IconMap name="check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampGigInfo;
