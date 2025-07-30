"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES } from "@/utils/constant";
import { ArrowRight } from "lucide-react";

export function OnboardStripeButton({ providerId }: { providerId: number }) {
  const handleOnboard = async () => {
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.PROVIDER_ONBOARD,
        method: "POST",
        body: {
          providerId: providerId,
        },
      });

      if (response.success) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("Onboarding failed", err);
    }
  };

  return (
    <Button size={"lg"} className="bg-yellow-600 hover:bg-yellow-700 text-white py-6 px-8 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1" onClick={handleOnboard}>
      Complete Verification
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}
