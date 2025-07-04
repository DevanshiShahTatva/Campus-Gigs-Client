"use client";
import React, { useState, useEffect, useCallback } from "react";
import { apiCall } from "@/utils/apiCall";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { IPlanApiResponse, ISubscriptionCurrentPlanApiResponse, ISubscriptionPlan } from "@/utils/interface";
import IconMap from "@/components/common/IconMap";
import SkeletonSubscriptionPlan from "@/components/landing-page-components/SkeletonSubscriptionPlan";
import { CentralLoader } from "@/components/common/Loader";
import Layout from "../../layout";

const BuySubscription = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCentralLoading, setIsCentralLoading] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<ISubscriptionPlan | null>(null);

  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);

  useEffect(() => {
    fetchSubscriptionPlan();
    getCurrentPlan();
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

  const getCurrentPlan = useCallback(async () => {
    setIsLoading(true);

    const res: ISubscriptionCurrentPlanApiResponse = await apiCall({
      endPoint: `/subscription-plan/current`,
      method: "GET",
    });

    if (res.status === 200) {
      const { data } = res;
      setSelectedPlanId(data.subscription_plan);
    } else {
      toast.error("Something went wrong, please try again later.");
    }

    setIsLoading(false);
  }, []);

  const handleSelectPlan = async (plan: ISubscriptionPlan) => {
    if (plan.price == 0) {
      setIsCentralLoading(true);

      const res: ISubscriptionCurrentPlanApiResponse = await apiCall({
        endPoint: `/subscription-plan/buy`,
        method: "POST",
        body: {
          subscription_plan_id: plan.id,
        },
      });

      if (res.status === 201) {
        const { data } = res;
        setSelectedPlanId(data.subscription_plan);
        toast.success("Subscription plan purchased successfully.");
        router.push("/user/dashboard");
      } else {
        toast.error(res?.message || "Something went wrong, please try again later.");
      }

      setIsCentralLoading(false);
    } else {
      router.push(`/user/buy-subscription/${plan.id}/checkout`);
    }
  };

  const handleSkip = () => {
    router.push("/user/dashboard");
  };

  return (
    <>
      <CentralLoader loading={isCentralLoading} />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Skip Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-2">Choose Your Plan</h1>
            <p className="text-[var(--text-semi-dark)] text-lg">Select the perfect plan for your needs</p>
          </div>
          <button
            onClick={handleSkip}
            className="px-6 py-2 text-[var(--text-semi-dark)] hover:text-[var(--text-dark)] border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-300 font-medium"
          >
            Skip for now
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
                  {selectedPlanId?.id === plan.id && (
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-[var(--base)] to-[var(--base-hover)] text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold rounded-tl-2xl rounded-br-2xl shadow-lg">
                      Current Plan
                    </div>
                  )}
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
                    <button
                      disabled={selectedPlanId?.id === plan.id}
                      className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 mt-auto text-sm sm:text-base bg-[var(--base)] text-white hover:bg-[var(--base-hover)] shadow-lg ${
                        selectedPlanId?.id === plan.id ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      onClick={() => selectedPlanId?.id !== plan.id && handleSelectPlan(plan)}
                    >
                      {plan.button_text}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default BuySubscription;
