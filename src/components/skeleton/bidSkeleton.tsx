import React from 'react';

const BidSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-4">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                <span className="hidden sm:inline text-gray-300">•</span>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              </div>
              <div className="space-y-2 mb-2">
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-full sm:w-24"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse flex-1 sm:w-24"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse flex-1 sm:w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BidSkeletonList = ({ count = 2 }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-5 mt-3">
      {Array.from({ length: count }, (_, index) => (
        <BidSkeleton key={index} />
      ))}
    </div>
  );
};

export default BidSkeletonList;