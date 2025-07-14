"use client";

import {
  ArrowLeft,
  Calendar,
  Mail,
  Shield,
  CreditCard,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { API_ROUTES } from "@/utils/constant";
import { apiCall } from "@/utils/apiCall";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAvatarName, renderBaseOnCondition } from "@/utils/helper";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/utils/interface";

export default function UserDetail() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.ADMIN.USER_DETAILS + params.id,
        method: "GET",
      });

      if (response.success) {
        setData(response.data);
      } else {
        toast.error(response.message ?? "Failed to load user data");
      }
    } catch (err) {
      console.error("Err" + err);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>

        {renderBaseOnCondition(
          loading,
          <h1>loading</h1>,
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={data?.profile || ""} />
                    <AvatarFallback className="text-lg">
                      {getAvatarName(data?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{data?.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    {data?.subscription.subscription_plan.roles_allowed.map(
                      (role) => {
                        return (
                          <Badge variant="secondary">
                            {role.toUpperCase()}
                          </Badge>
                        );
                      }
                    )}
                    {data?.is_banned && (
                      <Badge variant="destructive" className="gap-1">
                        <Ban className="h-3 w-3" />
                        Banned
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{data?.email}</span>
                  </div>
                  {data?.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{data?.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Joined {formatDate(data?.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant={data?.is_banned ? "destructive" : "default"}
                    >
                      {data?.is_banned ? "Banned" : "Active"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Strike Count</span>
                    <span className="font-medium">{data?.strike_number}/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Type</span>
                    <span className="font-medium capitalize">
                      {data?.profile_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terms Agreed</span>
                    <Badge
                      variant={data?.is_agreed ? "default" : "destructive"}
                    >
                      {data?.is_agreed ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {data?.subscription.subscription_plan.icon}{" "}
                        {data?.subscription.subscription_plan.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {data?.subscription.subscription_plan.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={
                            data?.subscription.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {data?.subscription.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium text-sm">
                          ${data?.subscription.subscription_plan.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="font-medium text-sm">
                          {formatDate(
                            data?.subscription.subscription_expiry_date
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h5 className="font-medium mb-2">Plan Limits</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Max Gigs/Month:
                        </span>
                        <span className="ml-2 font-medium">
                          {data?.subscription.subscription_plan
                            .max_gig_per_month || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Max Bids/Month:
                        </span>
                        <span className="ml-2 font-medium">
                          {data?.subscription.subscription_plan
                            .max_bid_per_month || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Features</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {data?.subscription.subscription_plan.features.map(
                        (feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            {feature}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.headline && (
                    <div>
                      <h5 className="font-medium mb-1">Headline</h5>
                      <p className="text-muted-foreground">{data?.headline}</p>
                    </div>
                  )}

                  {data?.bio && (
                    <div>
                      <h5 className="font-medium mb-1">Bio</h5>
                      <p className="text-muted-foreground">{data?.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Interests
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {data?.professional_interests || "---"}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Education
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {data?.education || "---"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Certifications
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {data?.certifications || "---"}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Extracurriculars</h5>
                      <p className="text-sm text-muted-foreground">
                        {data?.extracurriculars || "---"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Skills</h5>
                    {(data?.skills || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data?.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">---</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm">
                      Send Message
                    </Button>
                    <Button variant="outline" size="sm">
                      View Activity
                    </Button>
                    {data?.is_banned ? (
                      <Button variant="default" size="sm">
                        Unban User
                      </Button>
                    ) : (
                      <Button variant="destructive" size="sm">
                        Ban User
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
