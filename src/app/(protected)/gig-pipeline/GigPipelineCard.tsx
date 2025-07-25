import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Clock,
  Star,
  User,
  TrendingUp,
} from "lucide-react";
import { Gigs } from "@/utils/interface";
import moment from "moment";
import { useMemo, useState } from "react";
import { BID_STATUS, GIG_STATUS, PRIORITY } from "@/utils/constant";
import Slider from "react-slick";
import { PlaceholderImage } from "@/components/ui/placeholderImage";

interface GigCardProps {
  gig: Gigs;
  activeTab: string;
  onStartGig?: (id: number, status: string) => void;
  onCompleteGig?: (id: number, status: string) => void;
  onPriorityChange?: (id: number, priority: PRIORITY) => void;
  onChallengeReview: (id: number) => void;
  userId: number;
}

const GigCard = ({
  gig,
  activeTab,
  onStartGig,
  onCompleteGig,
  onPriorityChange,
  onChallengeReview,
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

  const getStatusColor = (status: string | null) => {
    if (!status) return "";
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "accepted":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string | null) => {
    if (!status) return "";
    switch (status) {
      case "pending":
        return "Pending Approval";
      case "accepted":
        return "Ready to Start";
      case "in_progress":
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

  const pipelineStage = useMemo(() => {
    if (!bid) return null;

    if (bid.status === BID_STATUS.PENDING) return "pending";
    if (
      bid.status === BID_STATUS.REJECTED ||
      gig.status === GIG_STATUS.REJECTED
    )
      return "rejected";
    if (
      bid.status === BID_STATUS.ACCEPTED &&
      gig.status === GIG_STATUS.UNSTARTED
    )
      return "accepted";
    if (
      bid.status === BID_STATUS.ACCEPTED &&
      gig.status === GIG_STATUS.INPROGRESS
    )
      return "in_progress";
    if (
      bid.status === BID_STATUS.ACCEPTED &&
      gig.status === GIG_STATUS.COMPLETED
    )
      return "completed";

    return null;
  }, [bid, gig.status]);

    const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string, className?: string }) => {
      const [hasError, setHasError] = useState(false);
      const [isLoading, setIsLoading] = useState(true);
  
      const handleError = () => {
        setHasError(true);
        setIsLoading(false);
      };
  
      const handleLoad = () => {
        setIsLoading(false);
      };
  
      if (hasError || !src) {
        return <PlaceholderImage />;
      }
  
      return (
        <div className={`relative w-full bg-gray-300 h-auto ${className}`}>
          {isLoading && (
            <div className="h-full w-full object-contain">
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            style={{ display: isLoading ? 'none' : 'block' }}
            className="min-h-[250px] h-[250px] w-full object-contain"
          />
        </div>
      );
    };
  

   const renderImageSlider = (images:string[]) => (
      <div className="lg:col-span-2 order-1">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="h-auto ">
            <div className="slider h-[250px]">
              <Slider
                speed={3000}
                autoplay={true}
                dots={images && images.length > 1}
                infinite={images.length > 1}
                customPaging={() => (
                  <div className="w-[7px] h-[7px] bg-gray-400 rounded-full transition" />
                )}
              >
                {images && images.length > 0 ? (
                  images.map((image: string, i: number) => (
                    <ImageWithFallback
                      key={`${i + 1}`}
                      src={image}
                      alt={'img'}
                    />
                  ))
                ) : (
                  <div className="h-[250px]">
                    <PlaceholderImage />
                  </div>
                )}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <Card className="pt-0 mb-4 hover:shadow-lg transition-all duration-200 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      {/* Top Section: Header & Badge */}
      <div className="border-b">
        {renderImageSlider(gig.images)}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-xl text-gray-900 line-clamp-1">
              {gig.title}
            </h3>
            {activeTab === "rejected" && (
              <button
                onClick={() => onChallengeReview(gig.id)}
                className="bg-[var(--base)] text-white px-3 py-1 rounded text-sm"
              >
                Review
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              className={`${getStatusColor(
                pipelineStage
              )} border font-medium text-xs`}
            >
              {getStatusText(pipelineStage)}
            </Badge>

            {gig.priority && pipelineStage === "in_progress" && (
              <Badge
                className={`${getPriorityColor(
                  gig.priority
                )} border font-medium text-xs`}
              >
                {gig.priority} priority
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="bg-teal-50 text-teal-700 border-teal-200 text-xs"
            >
              {gig.gig_category.name}
            </Badge>

            {bid?.bid_amount && (
              <div className="flex items-center gap-1 text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded-md text-xs">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">
                  Your bid: ${Number(bid?.bid_amount).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm line-clamp-3 h-[60px]">
            {gig.description}
          </p>
        </div>
      </div>

      {/* Main Content: Stats */}
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <DollarSign className="h-4 w-4 text-teal-600" />
            <span className="font-medium">
              ${Number(gig.price).toFixed(2)} / {gig.payment_type}
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
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md ">
              <Clock className="h-4 w-4 text-teal-600" />
              <span>
                Bid placed: {moment(bid?.created_at).format("DD/MM/yyyy")}
              </span>
            </div>
          )}
        </div>

        {/* CTA / Status Sections */}
        {pipelineStage === BID_STATUS.ACCEPTED && (
          <div className="pt-4">
            <Button
              onClick={() => onStartGig?.(gig.id, "in_progress")}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3"
              size="lg"
            >
              🚀 Start Working on This Gig
            </Button>
          </div>
        )}

        {pipelineStage === BID_STATUS.ACCEPTED && gig.gig_payment === null && (
          <div className="border-t pt-4 bg-green-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-green-700">
              <strong>Payment Pending:</strong> Congratulaton 🚀, Your bid has
              been accepted. Once Owner will pay for this gig you can able to
              work on this gig.
            </p>
          </div>
        )}

        {pipelineStage === "in_progress" && (
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Set Priority:
              </span>
              <div className="flex gap-1">
                {["low", "medium", "high"].map((priority) => (
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
              onClick={() => onCompleteGig?.(gig.id, "completed")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              size="lg"
            >
              ✅ Mark as Completed
            </Button>
          </div>
        )}

        {gig.status === "completed" && (
          <div className="pt-4 bg-green-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-green-800">
                Client Review:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (gig.rating?.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-green-700 ml-1 font-medium">
                  ({gig.rating?.rating || 0}/5)
                </span>
              </div>
            </div>
            {gig.rating?.rating_feedback ? (
              <p className="text-sm text-green-700 italic mb-2 line-clamp-1">
                "{gig.rating?.rating_feedback}"
              </p>
            ) : (
              <p className="text-sm text-green-700 italic mb-2">NA</p>
            )}
          </div>
        )}

        {pipelineStage === "rejected" && (
          <div className="pt-4 bg-red-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-red-700">
              <strong>Not selected:</strong> The client chose another provider.
            </p>
            {bid?.created_at && (
              <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                <Clock className="h-4 w-4" />
                <span>
                  Bid placed on {moment(bid?.created_at).format("DD/MM/YYYY")}
                </span>
              </div>
            )}
          </div>
        )}

        {pipelineStage === "pending" && (
          <div className="pt-4 bg-blue-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-700">
              <strong>⏳ Waiting for approval:</strong> Your bid is under
              review.
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
