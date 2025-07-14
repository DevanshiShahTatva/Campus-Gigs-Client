import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

const AdminUserDetailsSkelton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="w-full h-6" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <Skeleton className="w-full h-30" />

            <Separator />

            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-40" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <Skeleton className="w-full h-40" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <Skeleton className="w-full h-40" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetailsSkelton;
