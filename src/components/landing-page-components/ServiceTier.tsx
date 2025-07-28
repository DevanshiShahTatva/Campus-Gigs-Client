"use client";
import { useEffect, useState } from "react";
import { API_ROUTES, SERVICE_TIERS, SERVICE_TIER_CONTENT } from "@/utils/constant";
import { apiCall } from "@/utils/apiCall";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";

const ServiceTier = () => {
  const [activeTier, setActiveTier] = useState("");
  const [tireState, setTireState] = useState<any>([]);



const fetchTires = async (search = "") => {
  try {
    let url = API_ROUTES.TIRE;

    const resp = await apiCall({
      endPoint: url,
      method: "GET",
    });

    if (resp?.success) {
      console.log(resp, "RESPPPPPP");
      setActiveTier(resp?.data[0]?.id)
      setTireState(resp?.data)
    }
  } catch (error) {
    toast.error("Failed to fetch Tires");
  } finally {
  }
};

useEffect(() => {
  fetchTires();
}, []);



  const handleServiceClick = (service: string, tierId: string) => {
    console.log(`Selected service: ${service} from ${tierId}`);
  };

  return (
    <div>
      <section id="service-tiers" className="py-20 bg-[var(--bg-light)]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {tireState?.map((tab: any) => (
                <button
                  key={tab?.id}
                  className={`relative cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out ${
                    activeTier === tab?.id
                      ? "text-[var(--base)] bg-white shadow-sm"
                      : "text-[var(--text-semi-dark)] hover:text-[var(--base)] hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTier(tab?.id)}
                >
                  {tab?.name}
                </button>
              ))}

              {/* Animated Underline */}
              <div className="absolute bottom-0 h-0.5 bg-[var(--base)] transition-all duration-300 ease-in-out" />
            </div>
          </div>

          {/* Service Buttons with Animation */}

          {/* Tier Content with Smooth Animations */}
          <div className="bg-white rounded-xl p-8 hover:shadow-md transition-all duration-300 relative overflow-hidden">
            {tireState?.map((tier: any) => (
              <div
                key={tier?.id}
                className={`transition-all duration-500 ease-in-out ${
                  activeTier === tier?.id
                    ? "opacity-100 transform translate-x-0"
                    : "opacity-0 transform translate-x-full absolute top-0 left-0 w-full h-full"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <img
                      src={
                        tier?.name?.includes("1")
                          ? "/tier1.jpg"
                          : tier?.name?.includes("2")
                          ? "/tier2.jpg"
                          : tier?.name?.includes("3")
                          ? "/tier3.jpg"
                          : "/tier1.jpg"
                      }
                      alt={`${tier.tier} illustration`}
                      className="w-full h-40 xs:h-60 sm:h-70 md:h-80 rounded-xl object-cover transition-all duration-500 transform hover:scale-105"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-bold text-[color:var(--base)] mb-2 transition-all duration-300">
                      {tier?.name}
                    </h3>

                    <p className="text-[var(--text-semi-dark)] mb-4 transition-all duration-300">
                      {tier?.description}
                    </p>
                    <div className="mb-4">
                      <div className="font-semibold text-[var(--text-dark)] mb-2 transition-all duration-300">
                        <div className="text-lg">Categories </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {tier?.gigsCategories?.map((item: any) => (
                            <div>
                              <Badge
                                variant={"secondary"}
                                className="text-xs bg-[var(--base)] text-white border "
                              >
                                {item?.name}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <div className="text-lg mt-4">Skills </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {(() => {
                            const allSkills =
                              tier?.gigsCategories?.flatMap(
                                (item: any) => item?.skills || []
                              ) || [];

                            const firstTen = allSkills.slice(0, 10);
                            const remaining =
                              allSkills.length - firstTen.length;

                            return (
                              <>
                                {firstTen.map((skill: any, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-teal-50 text-teal-700 border border-teal-200  text-xs"
                                  >
                                    {skill?.name}
                                  </Badge>
                                ))}
                                {remaining > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-teal-50 text-teal-700 border border-teal-200 text-xs"
                                  >
                                    +{remaining}
                                  </Badge>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      
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
