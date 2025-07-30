"use client";
import { CheckCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constant";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Complete() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.size === 0) {
      router.push(ROUTES.GIGS);
    }
  }, []);

  return (
   <div className="min-h-screen bg-gradient-to-br from-success/5 to-primary/5 flex items-center justify-center p-4">
    <Card className="w-full flex flex-col p-8 items-center max-w-md shadow-xl border-0 bg-card/95 backdrop-blur">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h2 className="text-3xl font-semibold text-gray-800">
        Onboarding Complete
      </h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Your Stripe onboarding is now complete. You’re all set to receive
        payments for gigs on the platform.
      </p>
      <Button
        onClick={() => router.push(ROUTES.GIGS)}
        className="mt-4 w-full inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-lg transition"
      >
        Go to Dashboard
      </Button>
      </Card>
    </div>
  );
}
