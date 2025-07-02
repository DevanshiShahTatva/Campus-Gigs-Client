import React from "react";

const BuySubscriptionSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Skeleton: Order Summary */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 h-fit animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-yellow-200 rounded" />
            ))}
            <div className="h-4 w-12 bg-gray-200 rounded ml-2" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl p-6 mb-6">
          <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-24 bg-gray-200 rounded mb-1" />
          <div className="h-4 w-20 bg-gray-300 rounded mt-2" />
          <div className="h-3 w-3/4 bg-gray-200 rounded mt-3" />
        </div>

        <div className="space-y-4 mb-6">
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-center space-x-6 text-sm">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton: Payment Method */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

        {/* Payment Option */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-8 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="ml-auto h-5 w-20 bg-green-100 rounded-full" />
          </div>
          <div className="h-4 w-full bg-gray-200 rounded mb-1" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* PayPal Button Placeholder */}
        <div className="h-12 bg-gray-300 rounded mb-6" />

        {/* Trust Message */}
        <div className="mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="h-4 w-2/3 mx-auto bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySubscriptionSkeleton;
