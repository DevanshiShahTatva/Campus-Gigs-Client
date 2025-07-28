// app/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

interface Props {
  status: "pending" | "completed";
}
export default function KycStatusPage(props: Props) {
  const { status } = props;

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="space-y-6">
          {status === "pending" ? <PendingKycCard /> : <CompletedKycCard />}
        </div>
      </div>
    </div>
  );
}

function PendingKycCard() {
  return (
    <Card className="border border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50">
      <CardHeader>
        <CardTitle className="text-center text-amber-900">
          Verification Required
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-amber-600" strokeWidth={1.5} />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            You have pending KYC on Stripe
          </h3>
          <p className="text-gray-600 max-w-md">
            To withdraw funds, please complete your identity verification with
            Stripe. This process usually takes less than 10 minutes.
          </p>
        </div>

        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white py-6 px-8 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          Complete Verification
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="mt-6 text-sm text-gray-500 flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
          Verification pending
        </div>
      </CardContent>
    </Card>
  );
}

function CompletedKycCard() {
  return (
    <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50">
      <CardHeader>
        <CardTitle className="text-center text-emerald-900">
          Verification Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2
            className="w-12 h-12 text-emerald-600"
            strokeWidth={1.5}
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            KYC Successfully Completed
          </h3>
          <p className="text-gray-600 max-w-md">
            Your identity has been verified with Stripe. You can now withdraw
            funds from your account at any time.
          </p>
        </div>

        <div className="flex flex-col items-center w-full max-w-xs">
          <div className="flex items-center justify-center bg-emerald-50 text-emerald-800 py-3 px-6 rounded-full w-full">
            <BadgeCheck className="w-5 h-5 mr-2" />
            <span className="font-medium">Verified Account</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
