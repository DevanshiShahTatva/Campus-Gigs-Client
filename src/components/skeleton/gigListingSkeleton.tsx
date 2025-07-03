import React from 'react';
import { Search } from 'lucide-react';

export const SkeletonCard = () => (
  <div className="bg-white border-0 shadow-lg h-full flex flex-col rounded-lg overflow-hidden animate-pulse">
    <div className="relative h-48 bg-gray-200">
      <div className="absolute bottom-4 left-4">
        <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="mb-4">
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 p-2 rounded-lg w-9 h-9"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-10"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 p-2 rounded-lg w-9 h-9"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-14 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-12"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 p-2 rounded-lg w-9 h-9"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-14"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-7 bg-gray-100 rounded-full w-16"></div>
          <div className="h-7 bg-gray-100 rounded-full w-20"></div>
          <div className="h-7 bg-gray-100 rounded-full w-14"></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-24"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

const GigListingSkeleton = () => {
  return (
    <div className="mt-[25px] min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-100 rounded w-72 animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 bg-white">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
              <div className="pl-12 h-12 bg-gray-50 border border-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GigListingSkeleton;