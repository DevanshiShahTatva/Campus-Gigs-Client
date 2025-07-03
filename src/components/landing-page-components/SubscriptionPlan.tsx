"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IPlanApiResponse, ISubscriptionPlan } from "@/utils/interface";
import { apiCall } from "@/utils/apiCall";
import { toast } from "react-toastify";
import SkeletonSubscriptionPlan from "./SkeletonSubscriptionPlan";
import { SUBSCRIPTION_PLAN_CATEGORIES } from "@/utils/constant";
import IconMap from "@/components/common/IconMap";

const SubscriptionPlan = () => {
  const [isToken, setIsToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);

  useEffect(() => {
    fetchSubscriptionPlan();
    if (localStorage) {
      setIsToken(localStorage.getItem("token") as string);
    }
  }, []);

  const fetchSubscriptionPlan = useCallback(async () => {
    setIsLoading(true);

    const res: IPlanApiResponse = await apiCall({
      endPoint: `/subscription/plan-all`,
      method: "GET",
    });

    if (res.status === 200) {
      const { data } = res;
      setPlans(data);
    } else {
      toast.error("Something went wrong, please try again later.");
    }

    setIsLoading(false);
  }, []);

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-[var(--bg-light)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text-dark)]">Choose Your Plan</h2>
          <p className="text-[var(--text-semi-dark)] max-w-3xl mx-auto text-base sm:text-lg px-4">
            Get access to premium features and maximize your CampusGig experience. All plans include our basic features plus exclusive benefits.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonSubscriptionPlan key={index} />)
            : plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:shadow-2xl group ${
                    plan.most_popular ? "ring-2 ring-[var(--base)] lg:scale-105" : ""
                  } ${hoveredPlan === index ? "ring-2 ring-[var(--base)]/50" : ""}`}
                  onMouseEnter={() => setHoveredPlan(index)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {/* Popular Badge */}
                  {plan.most_popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--base)] to-[var(--base-hover)] text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold rounded-bl-2xl shadow-lg">
                      Most Popular
                    </div>
                  )}

                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--base)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-6 sm:p-8 flex flex-col h-full">
                    {/* Plan Icon */}
                    <div className="text-3xl sm:text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">{plan.icon}</div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-dark)] mb-2 text-center group-hover:text-[var(--base)] transition-colors duration-300">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="text-center mb-4">
                      <span className="text-4xl sm:text-5xl font-bold text-[var(--base)]">{plan.price == 0 ? "Free" : plan.price}</span>
                      <span className="text-[var(--text-semi-dark)] ml-1 text-base sm:text-lg">/Month</span>
                    </div>

                    <p className="text-[var(--text-semi-dark)] mb-6 text-center text-sm sm:text-base">{plan.description}</p>

                    {/* Features - This will take up available space */}
                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 group-hover:translate-x-2 transition-transform duration-300"
                          style={{ transitionDelay: `${i * 100}ms` }}
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[var(--base)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[var(--base)] group-hover:scale-110 transition-all duration-300">
                            <IconMap name="check_hover" />
                          </div>
                          <span className="text-[var(--text-semi-dark)] group-hover:text-[var(--text-dark)] transition-colors duration-300 text-sm sm:text-base">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button - This will always be at the bottom */}
                    {isToken ? (
                      <Link href="/user/buy-subscription">
                        <button
                          className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 mt-auto text-sm sm:text-base bg-[var(--base)] text-white hover:bg-[var(--base-hover)] shadow-lg`}
                          onClick={() => setSelectedPlan(index)}
                        >
                          {plan.button_text}
                        </button>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <button
                          className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 mt-auto text-sm sm:text-base bg-[var(--base)] text-white hover:bg-[var(--base-hover)] shadow-lg`}
                          onClick={() => setSelectedPlan(index)}
                        >
                          {plan.button_text}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-semibold mb-8 text-[var(--text-dark)]">All Plans Include</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {SUBSCRIPTION_PLAN_CATEGORIES.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-[var(--base)]/10"
              >
                <div className="text-2xl sm:text-3xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[var(--text-dark)] text-center group-hover:text-[var(--base)] transition-colors duration-300">
                  {category.title}
                </h4>
                <ul className="space-y-3 sm:space-y-4">
                  {category.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 group-hover:translate-x-2 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[var(--base)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[var(--base)] group-hover:scale-110 transition-all duration-300">
                        <IconMap name="check_hover" />
                      </div>
                      <span className="text-[var(--text-semi-dark)] group-hover:text-[var(--text-dark)] transition-colors duration-300 text-sm sm:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-[var(--base)]/10 to-[var(--base)]/5 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto border border-[var(--base)]/20">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-[var(--text-dark)]">Ready to Get Started?</h3>
            <p className="text-[var(--text-semi-dark)] mb-6 text-base sm:text-lg">
              Join thousands of students who are already using CampusGig to find help or earn money on campus.
            </p>
            <Link href="/sign-up">
              <button className="bg-[var(--base)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-[var(--base-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                Start Your Journey Today
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlan;
