import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Star,
  User,
  TrendingUp,
} from "lucide-react";
import { Gigs } from "@/utils/interface";
import moment from "moment";
import { useMemo } from "react";
// import type { Gig } from "@/types/gig";

interface GigCardProps {
  gig: Gigs;
  onStartGig?: (id: number) => void;
  onCompleteGig?: (id: string) => void;
  onPriorityChange?: (id: string, priority: "high" | "medium" | "low") => void;
  userId: number;
}

const GigCard = ({
  gig,
  onStartGig,
  onCompleteGig,
  onPriorityChange,
  userId,
}: GigCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "";
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "accepted":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return "";
    switch (status) {
      case "pending":
        return "Pending Approval";
      case "accepted":
        return "Ready to Start";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "rejected":
        return "Not Selected";
      default:
        return status;
    }
  };

  const bid = useMemo(
    () => gig.bids.find((bid) => bid.provider_id === userId),
    [gig]
  );

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-[var(--base)]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold text-xl text-gray-900">
                {gig.title}
              </h3>
              <Badge
                className={`${getStatusColor(bid?.status)} border font-medium`}
              >
                {getStatusText(bid?.status)}
              </Badge>
              {/* {gig.priority && (
                <Badge
                  className={`${getPriorityColor(
                    gig.priority
                  )} border font-medium`}
                >
                  {gig.priority} priority
                </Badge>
              )} */}
            </div>

            <div className="flex items-center gap-4 mb-3">
              <Badge
                variant="secondary"
                className="bg-teal-50 text-teal-700 border-teal-200"
              >
                {gig.gig_category.name}
              </Badge>
              {bid?.bid_amount && (
                <div className="flex items-center gap-1 text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">
                    Your bid: ${Number(bid?.bid_amount).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {gig.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <DollarSign className="h-4 w-4 text-teal-600" />
            <span className="font-medium">
              ${Number(gig.price).toFixed(2)}/{gig.payment_type}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <Calendar className="h-4 w-4 text-teal-600" />
            <span className="font-semibold">End Date:</span>
            <span>{moment(gig.start_date_time).format("DD/MM/yyyy")}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <User className="h-4 w-4 text-teal-600" />
            <span>{gig.user.name}</span>
          </div>

          {bid?.created_at && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              <Clock className="h-4 w-4 text-teal-600" />
              <span>
                Bid placed: {moment(bid?.created_at).format("DD/MM/yyyy")}
              </span>
            </div>
          )}

          {/* {gig.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              <MapPin className="h-4 w-4 text-teal-600" />
              <span>{gig.location}</span>
            </div>
          )}

          {gig.acceptedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded-md">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium">
                Accepted: {gig.acceptedDate}
              </span>
            </div>
          )} */}
        </div>

        {/* Accepted Gigs - Start Work Button */}
        {gig.status === "accepted" && (
          <div className="border-t pt-4">
            <Button
              onClick={() => onStartGig?.(gig.id)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3"
              size="lg"
            >
              🚀 Start Working on This Gig
            </Button>
          </div>
        )}

        {/* In Progress Gigs - Priority & Complete */}
        {/* {gig.status === "in-progress" && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Set Priority:
              </span>
              <div className="flex gap-1">
                {["high", "medium", "low"].map((priority) => (
                  <Button
                    key={priority}
                    size="sm"
                    variant={gig.priority === priority ? "default" : "outline"}
                    onClick={() => onPriorityChange?.(gig.id, priority as any)}
                    className={
                      gig.priority === priority
                        ? "bg-teal-600 hover:bg-teal-700"
                        : ""
                    }
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => onCompleteGig?.(gig.id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              size="lg"
            >
              ✅ Mark as Completed
            </Button>
          </div>
        )} */}

        {/* Completed Gigs - Review Display */}
        {/* {gig.status === "completed" && gig.rating && (
          <div className="border-t pt-4 bg-green-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-green-800">
                Client Review:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (gig.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-green-700 ml-1 font-medium">
                  ({gig.rating}/5)
                </span>
              </div>
            </div>
            {gig.review && (
              <p className="text-sm text-green-700 italic mb-2">
                "{gig.review}"
              </p>
            )}
            {gig.completedDate && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  Completed on {gig.completedDate}
                </span>
              </div>
            )}
          </div>
        )} */}

        {/* Rejected Gigs - Info */}
        {gig.status === "rejected" && (
          <div className="border-t pt-4 bg-red-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-red-700">
              <strong>Not selected:</strong> The client chose another provider
              for this gig. Keep applying to more opportunities!
            </p>
            {/* {gig.bidDate && (
              <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                <Clock className="h-4 w-4" />
                <span>Bid placed on {gig.bidDate}</span>
              </div>
            )} */}
          </div>
        )}

        {/* Requested Gigs - Waiting Status */}
        {bid?.status === "pending" && (
          <div className="border-t pt-4 bg-blue-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-700">
              <strong>⏳ Waiting for approval:</strong> Your bid is under review
              by the client. You'll be notified once they make a decision.
            </p>
            {bid?.created_at && (
              <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                <Clock className="h-4 w-4" />
                <span>
                  Bid submitted on{" "}
                  {moment(bid?.created_at).format("DD/MM/yyyy")}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GigCard;
