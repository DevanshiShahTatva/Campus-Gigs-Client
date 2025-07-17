"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Download, Briefcase, CalendarCheck, CreditCard, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentTransaction {
  id: number;
  user_id: number;
  transaction_id: string;
  amount: number;
  type: string;
  paid_at: string;
  description: string;
  created_at: string;
  is_deleted: boolean;
}

const mockPaymentData: PaymentTransaction[] = [
  // ... same as before
  {
    id: 1,
    user_id: 2,
    transaction_id: "I-YF8PSCG4M0VL",
    amount: 10,
    type: "subscription",
    paid_at: "2025-07-17T06:20:25.825Z",
    description: "Payment successfully paid for subscription",
    created_at: "2025-07-17T06:20:25.828Z",
    is_deleted: false
  },
  {
    id: 8,
    user_id: 2,
    transaction_id: "4DU74631B2155640X",
    amount: 10,
    type: "gig",
    paid_at: "2025-07-17T07:51:19.257Z",
    description: "Payment successfully paid for subscription",
    created_at: "2025-07-17T07:51:19.258Z",
    is_deleted: false
  }
];

const PaymentHistory = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setPayments(mockPaymentData);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const copyTransactionId = (transactionId: string, id: number) => {
    navigator.clipboard.writeText(transactionId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    return type === "subscription" 
      ? <CalendarCheck className="h-5 w-5 text-blue-500" /> 
      : <Briefcase className="h-5 w-5 text-purple-500" />;
  };

  const getTypeLabel = (type: string) => {
    return type === "subscription" 
      ? "Premium Subscription" 
      : "Gig Payment";
  };

  const getStatusBadge = () => {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {[1, 2, 3].map((id) => (
          <Card key={id} className="border border-gray-100 shadow-sm">
            <CardHeader>
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-16 mb-2 ml-auto" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="border-0 shadow-none bg-gray-50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No payment history</h3>
            <p className="text-gray-500 mb-6">
              You haven't made any transactions yet. Your payments will appear here once completed.
            </p>
            <Button>Make Payment</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
          <p className="text-gray-500 mt-1">All your recent transactions in one place</p>
        </div>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <Card 
            key={payment.id} 
            className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden gap-2"
          >
            <CardHeader>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    {getTypeIcon(payment.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {getTypeLabel(payment.type)}
                    </h3>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">${payment.amount}</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Transaction ID</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-1.5 rounded-md text-sm font-mono truncate max-w-[200px]">
                      {payment.transaction_id}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyTransactionId(payment.transaction_id, payment.id)}
                    >
                      {copiedId === payment.id ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Payment Date</p>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDate(payment.paid_at)} • {formatTime(payment.paid_at)}
                      </span>
                    </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Payment Status</p>
                  <div>
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 mt-4 bg-blue-50 rounded-lg flex items-center gap-2">
                <p className="font-semibold">Description:</p>
                <p>{payment.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;