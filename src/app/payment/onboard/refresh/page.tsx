"use client";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/constant";
import { Card } from "@/components/ui/card";

export default function Refresh() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full flex flex-col p-8 items-center max-w-md shadow-xl border-0 bg-card/95 backdrop-blur">
        <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-3xl font-semibold text-gray-800">
          Onboarding Failed
        </h2>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          Something went wrong while completing your Stripe onboarding. Please
          try again by clicking the connect button.
        </p>
        <Button
          onClick={() => router.push(ROUTES.PROFILE)}
          className="mt-4 w-full inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-6 rounded-lg transition"
        >
          Retry Onboarding
        </Button>
      </Card>
    </div>
  );
}
