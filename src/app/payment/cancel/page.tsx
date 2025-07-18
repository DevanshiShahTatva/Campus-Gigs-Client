"use client";

import { useEffect } from "react";
import { XCircle, Home, RotateCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constant";

const PaymentCancel = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.size === 0) {
      router.push(ROUTES.HOME);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-error/5 to-warning/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-error/10 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-error text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Payment Cancelled
          </h1>
          <p className="text-muted-foreground">
            Your payment was cancelled. Don't worry, no charges were made to
            your account.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">
              What happened?
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• You chose to cancel the payment process</li>
              <li>• No money has been charged to your account</li>
              <li>• You can try again anytime</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push(ROUTES.BUY_PLAN_SUBSCRIPTION)}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Payment Again
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Need assistance with your payment?
            </p>
            <Button
              onClick={() => router.push(ROUTES.CONTACT)}
              variant="link"
              className="text-primary p-0 h-auto"
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;
