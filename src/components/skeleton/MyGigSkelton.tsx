import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

interface Props {
  cardNum: number;
}

const MyGigSkelton = (props: Props) => {
  const { cardNum } = props;
  const cards = Array(cardNum).fill(1);
  return (
    <div className="space-y-6">
      {cards.map((_card, index: number) => {
        return (
          <Card key={index} className="w-full flex flex-col items-start gap-4 px-8 hover:shadow-lg transition-shadow border-l-4 border-l-[var(--base)]">
            <div className="flex w-full items-center justify-between">
              <Skeleton className="w-[300px] h-[40px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-[50px] h-[50px]" />
                <Skeleton className="w-[50px] h-[50px]" />
              </div>
            </div>
            <Skeleton className="w-full h-[40px]" />
            <div className="flex w-full items-center gap-8">
              <Skeleton className="w-[100px] h-[25px]" />
              <Skeleton className="w-[100px] h-[25px]" />
              <Skeleton className="w-[100px] h-[25px]" />
            </div>
            <div className="flex w-full items-center justify-between">
              <Skeleton className="w-[100px] h-[25px]" />
              <Skeleton className="w-[100px] h-[25px]" />
              <Skeleton className="w-[100px] h-[25px]" />
              <Skeleton className="w-[100px] h-[25px]" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MyGigSkelton;
