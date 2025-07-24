"use client";

import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

export const GigPaymentForm = ({
  gigId,
  userId,
  providerId,
  amount,
}: {
  gigId: number;
  userId: number;
  providerId: number;
  amount: number; // in paise
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      const res = await axios.post("/api/payment/user/pay", {
        gigId,
        userId,
        providerId,
        amount,
      });
      setClientSecret(res.data.clientSecret);
    };

    createPaymentIntent();
  }, [gigId, userId, providerId, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: "Test User",
        },
      },
    });

    if (result.error) {
      setPaymentStatus("error");
    } else if (result.paymentIntent?.status === "succeeded") {
      setPaymentStatus("success");

      // Call your backend to store the payment in DB
      await axios.post("/api/payment/user/store", {
        gigId,
        transactionId: result.paymentIntent.id,
      });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 space-y-4 p-6 border rounded shadow"
    >
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {paymentStatus === "success" && (
        <p className="text-green-600">Payment successful!</p>
      )}
      {paymentStatus === "error" && (
        <p className="text-red-600">Payment failed.</p>
      )}
    </form>
  );
};
