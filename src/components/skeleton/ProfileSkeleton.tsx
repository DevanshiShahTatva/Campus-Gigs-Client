import React from "react";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse">
    <div className="bg-white shadow rounded-2xl pb-8">
      {/* Cover Image Skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-t-2xl" />
      {/* Profile Picture Skeleton */}
      <div className="relative">
        <div className="absolute left-8 -top-16 w-32 h-32 rounded-full border-4 border-white bg-gray-300" />
      </div>
      {/* User Info Skeleton */}
      <div className="flex flex-col sm:flex-row mt-20 px-6 pb-4 border-b border-gray-200 items-start sm:items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-7 w-48 bg-gray-300 rounded" />
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-100 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Tabs Skeleton */}
      <div className="px-6 mt-6">
        <div className="flex space-x-4 mb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-6 w-24 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Form Skeleton */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-64 bg-gray-100 rounded flex-1" />
            </div>
          ))}
          <div className="flex justify-end mt-6">
            <div className="h-10 w-32 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton; 