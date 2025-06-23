const SkeletonSubscriptionPlan = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden p-6 sm:p-8 flex flex-col space-y-4">
    <div className="h-10 w-10 mx-auto bg-gray-200 rounded-full" />
    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto" />
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="space-y-3 flex-grow">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
    <div className="h-10 bg-gray-300 rounded w-full" />
  </div>
);

export default SkeletonSubscriptionPlan;
