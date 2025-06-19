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
            {[
              {
                title: "Verified UMich Community",
                description:
                  "Every user is verified through their UMich email, ensuring a safe and trusted environment for all transactions.",
                icon: (
                  <svg
                    className="w-8 h-8 text-[color:var(--base)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
              {
                title: "Flexible Work and Help",
                description:
                  "Set your own schedule, choose your services, and work at your own pace. Perfect for balancing academics and earning.",
                icon: (
                  <svg
                    className="w-8 h-8 text-[color:var(--text-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "Secure Payment System",
                description:
                  "Our escrow system ensures safe transactions. Funds are only released when both parties are satisfied with the service.",
                icon: (
                  <svg
                    className="w-8 h-8 text-[color:var(--text-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
              },
              {
                title: "Reviews and Tier-based Ratings",
                description:
                  "Build your reputation through our review system. Higher tiers unlock more opportunities and premium services.",
                icon: (
                  <svg
                    className="w-8 h-8 text-[color:var(--text-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ),
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-[var(--card-dark)] p-8 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--base-hover)]/10 rounded-full flex items-center justify-center mb-4 text-[var(--base)]">
                  {benefit.icon}
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
                {[
                  "Find help with coursework and assignments",
                  "Get advice from experienced students",
                  "Access campus services and resources",
                  "Flexible scheduling around your classes",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[color:var(--text-light)]/80"
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
                {[
                  "Earn money using your skills and knowledge",
                  "Build your professional reputation",
                  "Flexible work around your schedule",
                  "Access to a large student network",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[var(--text-light)]/80"
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
