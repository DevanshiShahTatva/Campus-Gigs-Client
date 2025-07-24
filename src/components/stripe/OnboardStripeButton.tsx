"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES } from "@/utils/constant";
import axios from "axios";

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

  return <Button onClick={handleOnboard}>Connect Stripe Account</Button>;
}
