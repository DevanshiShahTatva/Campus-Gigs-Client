"use client";

import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { ROUTES } from "@/utils/constant";
import { apiCall } from "@/utils/apiCall";
import Loader from "@/components/common/Loader";
import { CurrentSubscriptionPlan } from "@/utils/interface";
import { renderBaseOnCondition } from "@/utils/helper";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [planResponse, setPlanResponse] =
    useState<CurrentSubscriptionPlan | null>(null);
  const [isGigPayment, setGigPayment] = useState<boolean>(false);

  useEffect(() => {
    if (searchParams.size === 0) {
      router.push(ROUTES.GIGS);
    } else if (searchParams.get("session_id")) {
      setGigPayment(true);
      setIsLoading(false);
    } else if (searchParams.get("plan_buy_id") !== null) {
      fetchPlanDetails();
    } else {
      const subscriptionId = sessionStorage.getItem("subscriptionId");
      const orderId = sessionStorage.getItem("orderId");
      const isAutoDebit = sessionStorage.getItem("isAutoDebit") === "true";

      // call buy plan
      if (subscriptionId && orderId && isAutoDebit) {
        handleBuyPlan(subscriptionId, orderId, isAutoDebit);
      }
    }
  }, []);

  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchPlanDetails = async () => {
    try {
      const response = await apiCall({
        endPoint: `/subscription-plan/current`,
        method: "GET",
      });
      if (response.success) {
        setPlanResponse(response.data);
      } else {
        router.push(ROUTES.GIGS);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyPlan = async (
    subscriptionId: string,
    orderId: string,
    isAutoDebit: boolean
  ) => {
    try {
      const response = await apiCall({
        endPoint: `subscription-plan/buy-paid-plan/${subscriptionId}/${orderId}`,
        method: "POST",
        body: {
          isAutoDebit: isAutoDebit,
          auto_deduct_id: orderId,
        },
      });
      if (!response.success) {
        router.push(
          ROUTES.PAYMENT_CANCEL + `?subscription_id=${subscriptionId}`
        );
      } else {
        setPlanResponse(response.data);
        setIsLoading(false);
        sessionStorage.removeItem("subscriptionId");
        sessionStorage.removeItem("orderId");
        sessionStorage.removeItem("isAutoDebit");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <Loader size={48} colorClass="text-[var(--base)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-[var(--base)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--base)]">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderBaseOnCondition(
            isGigPayment,
            <></>,
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-mono text-foreground">
                  {planResponse?.subscription_plan.icon +
                    " " +
                    planResponse?.subscription_plan.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Transaction ID
                </span>
                <span className="text-sm font-mono text-foreground">
                  {planResponse?.transaction_id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-semibold text-foreground">
                  ${planResponse?.price}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm text-foreground">
                  {formatDate(planResponse?.created_at)}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <Button
              onClick={() => router.push(ROUTES.GIGS)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
