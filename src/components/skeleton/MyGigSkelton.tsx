import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

interface Props {
  cardNum: number;
}

const MyGigSkelton = ({ cardNum }: Props) => {
  const cards = Array(cardNum).fill(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((_card, index) => (
        <Card
          key={index}
          className="p-0 flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden"
        >
          {/* Image */}
          <div className="relative h-[250px] w-full">
            <Skeleton className="absolute inset-0 w-full h-full" />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col justify-between flex-1 gap-3">
            {/* Title + Icons */}
            <div className="flex justify-between items-center">
              <Skeleton className="w-3/4 h-6" />
              <div className="flex gap-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-5 h-5 rounded-full" />
              </div>
            </div>

            {/* Description */}
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />

            {/* Skills */}
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="w-16 h-5 rounded" />
              <Skeleton className="w-14 h-5 rounded" />
              <Skeleton className="w-12 h-5 rounded" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Skeleton className="w-full h-6 rounded" />
              <Skeleton className="w-full h-6 rounded" />
              <Skeleton className="w-full h-6 rounded" />
            </div>

            {/* Rating or Review button */}
            <Skeleton className="w-full h-8 rounded mt-2" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MyGigSkelton;
