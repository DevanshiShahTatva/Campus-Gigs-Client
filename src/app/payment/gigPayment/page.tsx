// pages/gig/[id]/pay.tsx
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/utils/stripe";
import { useRouter } from "next/router";
import { GigPaymentForm } from "@/components/stripe/GigPaymentForm";

export default function GigPayPage() {
  const router = useRouter();
  const { id } = router.query;

  const userId = 1; // Replace with actual user ID from auth
  const providerId = 2; // From bid info
  const amount = 50000; // e.g., ₹500

  if (!id) return <p>Loading...</p>;

  return (
    <Elements stripe={stripePromise}>
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Pay for Gig #{id}</h2>
        <GigPaymentForm
          gigId={Number(id)}
          userId={userId}
          providerId={providerId}
          amount={amount}
        />
      </div>
    </Elements>
  );
}
