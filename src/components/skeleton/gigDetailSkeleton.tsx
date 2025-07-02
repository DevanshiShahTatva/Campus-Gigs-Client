import React from 'react';

const GigDetailSkeleton = () => {
  return (
    <div className=" min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-white shadow">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="mr-4 w-5 h-5 bg-gray-300 rounded-full" />
          <div className="h-6 bg-gray-300 rounded w-80 max-w-full" />
        </div>
      </div>
      <main className="mx-auto py-6 ">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="h-full bg-white shadow rounded-lg overflow-hidden">
              <div className="min-h-[360px] bg-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-white shadow rounded-lg p-6 h-full flex flex-col justify-between">
              <div>
                <div className="h-6 bg-gray-300 rounded w-full mb-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-6" />
                <div className="space-y-4 pb-4">
                  <div className="flex items-start">
                    <div className="mt-1 w-5 h-5 bg-gray-300 rounded mr-2" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-full mb-1" />
                      <div className="h-4 bg-gray-300 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-300 rounded mr-2" />
                    <div className="h-4 bg-gray-300 rounded w-32" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-300 rounded mr-2" />
                    <div className="h-4 bg-gray-300 rounded w-24" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-6 bg-gray-300 rounded-full w-16" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white pt-4 border-t-2 border-gray-200">
                <div className="flex flex-col">
                  <div className="h-8 bg-gray-300 rounded w-20 mb-1" />
                  <div className="h-3 bg-gray-300 rounded w-16" />
                </div>
                <div className="h-12 bg-gray-300 rounded-lg w-28" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 p-6 shadow-lg rounded-lg bg-white">
          <div className="bg-white w-full border-b border-gray-300 mb-6">
            <div className="relative space-x-4 flex w-full md:w-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pb-3 px-2">
                  <div className="h-5 bg-gray-300 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 bg-gray-300 rounded w-full" style={{
                width: i === 8 ? '60%' : i === 4 ? '80%' : '100%'
              }} />
            ))}
            <div className="mt-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-300 rounded mt-0.5 flex-shrink-0" />
                  <div className="h-4 bg-gray-300 rounded flex-1" />
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-5 bg-gray-300 rounded w-32 mb-4" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0" />
                  <div className="h-4 bg-gray-300 rounded flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GigDetailSkeleton;