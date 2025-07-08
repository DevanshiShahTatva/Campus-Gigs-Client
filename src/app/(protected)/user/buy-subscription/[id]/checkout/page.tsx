"use client";

import React, { use, useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiCall } from "@/utils/apiCall";
import { Shield, CreditCard, Lock, CheckCircle, Star } from "lucide-react";
import { ISubscriptionPlan } from "@/utils/interface";
import BuySubscriptionSkeleton from "./components/BuySubscriptionSkeleton";

interface PageProps {
  params: Promise<{ id: number }>;
}

const Checkout = ({ params }: PageProps) => {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [planDetails, setPlanDetails] = useState<ISubscriptionPlan | null>(null);

  useEffect(() => {
    fetchPlanDetails();
  }, [unwrappedParams.id, router]);

  const fetchPlanDetails = async () => {
    setIsLoading(true);
    const response = await apiCall({
      endPoint: `subscription/plan/${unwrappedParams.id}`,
      method: "GET",
    });

    if (response?.status === 200) {
      setPlanDetails(response.data);
    } else {
      toast.error("Failed to load plan details");
      router.back();
    }
    setIsLoading(false);
  };

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    components: "buttons",
    intent: "capture",
    vault: false,
    enableFunding: "venmo,applepay,paypal,card",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--base)] to-[var(--base-hover)] rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Complete Your <span className="text-[var(--base)]">Payment</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          You're just one step away from unlocking premium features. Secure, fast, and trusted by millions worldwide.
        </p>
      </div>

      {isLoading ? (
        <BuySubscriptionSkeleton />
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.9/5</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[var(--base)] to-[var(--base-hover)] rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-semibold mb-2">{planDetails?.name}</h3>
              <div className="text-3xl font-bold">${planDetails?.price.toFixed(2)}</div>
              <p className="text-blue-100 mt-1">per month</p>
              <p className="text-blue-100 text-sm mt-2">{planDetails?.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                planDetails?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[var(--base)] flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))
              )}
            </div>

            {/* Security badges */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[var(--base)]" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-[var(--base)]" />
                  <span>256-bit Encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

            {/* Payment Options */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-8 bg-[var(--base)] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PayPal</span>
                </div>
                <span className="text-gray-700 font-medium">Pay with PayPal</span>
                <div className="ml-auto">
                  <span className="bg-green-100 text-[var(--base)] text-xs px-2 py-1 rounded-full">Recommended</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">Pay safely and securely with your PayPal account or credit card. No account required.</p>
            </div>

            {/* PayPal Buttons */}
            <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
              <PayPalScriptProvider options={initialOptions}>
                {/* {!isLoading && ( */}
                <PayPalButtons
                  style={{
                    shape: "rect",
                    layout: "vertical",
                    color: "gold",
                    label: "paypal",
                    height: 50,
                  }}
                  createOrder={async () => {
                    const response = await apiCall({
                      endPoint: `subscription-plan/create-order/${unwrappedParams.id}`,
                      method: "POST",
                    });

                    if (response?.status === 201) {
                      return response?.data?.orderId;
                    } else {
                      toast.error("Something went wrong, please try again later.");
                      return null;
                    }
                  }}
                  onApprove={async (data) => {
                    const response = await apiCall({
                      endPoint: `subscription-plan/buy-paid-plan/${unwrappedParams.id}/${data.orderID}`,
                      method: "POST",
                    });

                    if (response?.status === 200) {
                      toast.success("🎉 Subscription plan purchased successfully!");

                      router.push("/user/dashboard");
                    } else {
                      toast.error("Payment completed but activation failed. Please contact support.");
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal Checkout onError", err);
                    toast.error("An error occurred with PayPal checkout. Please try again.");
                  }}
                  onCancel={() => {
                    toast.info("Payment was cancelled.");
                  }}
                />
                {/* )} */}
              </PayPalScriptProvider>
            </div>

            {/* {isLoading && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Processing...</span>
              </div>
            )} */}

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Trusted by over 100,000+ customers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ or Help Section */}
      <div className="mt-12 mb-4 text-center">
        <p className="text-gray-600">
          Need help?{" "}
          <Link href="/ContactUs" className="text-[var(--base)] hover:text-[var(--base-hover)] font-medium">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Checkout;
