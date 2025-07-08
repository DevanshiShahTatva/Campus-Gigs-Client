"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";

import { apiCall } from "@/utils/apiCall";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import BidSkeletonList from "@/components/skeleton/bidSkeleton";
import GigDetailSkeleton from "@/components/skeleton/gigDetailSkeleton";
import { ArrowLeftIcon, CalendarIcon, CheckCircle, ClockIcon, MessageCircle, TagIcon, Star, Edit, Trash, Image as ImageIcon } from "lucide-react";
import { gigBidFields } from "@/config/gigbid.config";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetUserProfileQuery } from "@/redux/api";

interface IBid {
  id: string;
  status: string;
  bid_amount: number;
  payment_type: string;
  description: string;
  created_at: string;
  provider: {
    id: string;
    name: string;
    profile?: string;
    avgRating: number;
    totalReview: number;
    about: string;
  };
}

const GigDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user_id } = useSelector((state: RootState) => state.user);
  const id = params.id;

  const [gigDetails, setGitDetails] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Description");
  const [editBid, setEditBid] = useState<IBid | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);
  const { data: userProfile } = useGetUserProfileQuery(undefined, { refetchOnMountOrArgChange: true, });

  const PlaceholderImage = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="text-center">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No Image</p>
      </div>
    </div>
  );

  const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
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
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="h-[210px] lg:h-[400px] w-full object-cover">
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
          className="max-h-[210px] lg:max-h-[400px] w-full h-full object-cover"
        />
      </div>
    );
  };

  const AvatarWithFallback = ({ src, alt, className, name }: { src?: string; alt: string; className: string; name: string }) => {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      setHasError(true);
    };

    if (hasError || !src) {
      return (
        <div className={`${className} bg-[var(--base)] text-white rounded-full flex items-center justify-center font-semibold text-lg sm:text-2xl flex-shrink-0`}>
          {name.charAt(0).toUpperCase()}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
      />
    );
  };

  useEffect(() => {
    if (!id) return;
    const getGitDetails = async () => {
      const response = await apiCall({
        endPoint: `/gigs/${id}`,
        method: "GET",
      });
      if (response?.success) {
        setGitDetails(response.data);
      }
    };
    getGitDetails();
  }, [id]);

  const fetchBids = async () => {
    const response = await apiCall({
      endPoint: `/bids/gig/${id}`,
      method: "GET",
    });
    if (response?.success) {
      setBids(response.data);
    }
  };

  const handleSubmitBid = async (data: any) => {
    try {
      setBidLoading(true);
      const response = await apiCall({
        endPoint: editBid ? `/bids/update/${editBid.id}` : `/bids/create`,
        method: editBid ? "PUT" : "POST",
        body: {
          "gig_id": id,
          "payment_type": data.payment_type,
          "bid_amount": Number(data.bid_amount),
          "description": data.description
        },
      });
      if (response?.success) {
        setIsModalOpen(false);
        setBidLoading(false);
        if (editBid) {
          setEditBid(null);
          const { bid_amount, description, payment_type } = response.data;
          setBids(bids.map((bid) => bid.id === editBid.id ? { ...bid, description, bid_amount, payment_type } : bid));
        } else {
          setBids([response.data, ...bids]);
          setGitDetails((prev: any) => ({ ...prev, hasBid: true }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      const response = await apiCall({
        endPoint: `/bids/accept/${bidId}`,
        method: "POST",
      });
      if (response?.success) {
        setBids(bids.map((bid) => bid.id === bidId ? { ...bid, updated_at: response.data.updated_at, status: "accepted" } : bid));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      const response = await apiCall({
        endPoint: `/bids/reject/${bidId}`,
        method: "POST",
      });
      if (response?.success) {
        setBids(bids.map((bid) => bid.id === bidId ? { ...bid, updated_at: response.data.updated_at, status: "rejected" } : bid));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Bids") {
      fetchBids();
    }
  };

  const handleEditBid = (bid: IBid) => {
    setEditBid(bid);
    setIsModalOpen(true);
  };

  const handleDeleteBid = async (bidId: string) => {
    try {
      const response = await apiCall({
        endPoint: `/bids/delete/${bidId}`,
        method: "DELETE",
      });
      if (response?.success) {
        setBids(bids.filter((bid) => bid.id !== bidId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date: Date | string) => {
    const now = moment();
    const inputTime = moment(date);
    const diffInHours = now.diff(inputTime, 'hours');

    if (diffInHours < 24) {
      return inputTime.fromNow();
    } else {
      return inputTime.format('DD/MM/YYYY [at] hh:mm A');
    }
  };

  const renderHeader = () => (
    <div className="mx-auto py-0 px-3 sm:py-0 sm:px-4 lg:px-8 flex items-center">
      <button
        onClick={() => router.back()}
        className="mr-3 p-1 rounded-full hover:bg-gray-100 cursor-pointer flex-shrink-0"
      >
        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
      </button>
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
        {gigDetails.title}
      </h1>
    </div>
  );

  const renderImageSlider = () => (
    <div className="lg:col-span-2 order-1">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-auto md:min-h-[360px]">
          <div className="slider h-full">
            <Slider
              speed={3000}
              autoplay={true}
              dots={gigDetails.images && gigDetails.images.length > 1}
              infinite={gigDetails.images && gigDetails.images.length > 1}
              customPaging={() => (
                <div className="w-[7px] h-[7px] bg-gray-400 rounded-full transition" />
              )}
            >
              {gigDetails.images && gigDetails.images.length > 0 ? (
                gigDetails.images.map((image: string, i: number) => (
                  <ImageWithFallback
                    key={`${i + 1}`}
                    src={image}
                    alt={gigDetails.title}
                  />
                ))
              ) : (
                <div className="h-[210px] lg:h-[400px]">
                  <PlaceholderImage />
                </div>
              )}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGigInfo = () => (
    <div className="space-y-3 pb-4">
      <div className="flex items-start text-gray-600">
        <CalendarIcon className="mt-1 h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0" />
        <span className="text-sm sm:text-base break-words">
          {`${moment(gigDetails.start_date_time).format('dddd, MMMM D, YYYY')} - ${moment(gigDetails.end_date_time).format('dddd, MMMM D, YYYY')}`}
        </span>
      </div>
      <div className="flex items-center text-gray-600">
        <ClockIcon className="mt-1 h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0" />
        <span className="text-sm sm:text-base">
          Duration - ({moment(gigDetails.end_date_time).diff(moment(gigDetails.start_date_time), 'days')} days)
        </span>
      </div>
      <div className="flex items-center text-gray-600">
        <TagIcon className="mt-1 h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0" />
        <div className="text-sm sm:text-base">
          {gigDetails.gig_category?.name}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {gigDetails.skills.map((skill: { name: string }, i: number) => (
          <span key={`${i + 1}`} className="px-2 py-1 sm:px-3 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );

  const renderPriceSection = () => (
    <div className="flex items-center justify-between bg-white pt-4 border-t-2 border-gray-200">
      <div className="flex flex-col">
        <div className="text-left">
          <div className="text-xl sm:text-2xl font-bold text-green-600">${gigDetails.price}</div>
          <div className="text-xs sm:text-sm text-gray-500">in {gigDetails.payment_type === "fixed" ? "Fixed Price" : "Range"}</div>
        </div>
      </div>
      {gigDetails?.profile_type === "provider" && userProfile?.data?.profile_type === "user" ? (
        <Button
          className="px-3 py-2 sm:px-4 sm:py-6 text-sm sm:text-md rounded-lg font-semibold"
        >
          Pay Now
        </Button>
      ) : (gigDetails?.user_id !== user_id && !gigDetails.hasBid && gigDetails?.profile_type === "user" && userProfile?.data?.profile_type === "provider") && (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 sm:px-4 sm:py-6 text-sm sm:text-md rounded-lg font-semibold"
        >
          Submit Bid
        </Button>
      )}
    </div>
  );

  const renderSidebar = () => (
    <div className="lg:col-span-1 order-2">
      <div className="h-full bg-white shadow rounded-lg p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            {gigDetails.title}
          </h2>
          {renderGigInfo()}
        </div>
        {renderPriceSection()}
      </div>
    </div>
  );

  const renderTabNavigation = () => (
    <div className="bg-white w-full border-b border-gray-300">
      <div className="relative flex w-full">
        {["Description", "Certificates", "Bids"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`relative pb-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === tab
              ? "text-[var(--base)] after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--base)]"
              : "text-gray-600 hover:text-[var(--base)]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDescriptionTab = () => (
    <div className="pt-4 sm:pt-6">
      {gigDetails.description ? (
        <div className="max-w-none">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm sm:text-base">
            {gigDetails.description}
          </div>
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center">
          <span className="text-gray-700 text-sm sm:text-base">No Description</span>
        </div>
      )}
    </div>
  );

  const renderCertificatesTab = () => (
    <div className="pt-4 sm:pt-6">
      <div className="space-y-3">
        {gigDetails.certifications.length > 0 ?
          gigDetails.certifications.map((cert: string, i: number) => (
            <div key={`${i + 1}`} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm sm:text-base">{cert}</span>
            </div>
          )) : (
            <div className="h-20 flex items-center justify-center">
              <span className="text-gray-700 text-sm sm:text-base">No Certificates</span>
            </div>
          )
        }
      </div>
    </div>
  );

  const renderBidCard = (bid: IBid) => (
    <Card key={bid.id} className="gap-0 py-0">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <AvatarWithFallback
              src={bid.provider.profile}
              alt="Provider avatar"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
              name={bid.provider.name}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <Link href={`/users/${bid.provider.id}`}>
                  <h4 className="font-semibold text-base sm:text-lg truncate">{bid.provider.name}</h4>
                </Link>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{bid.provider.avgRating}</span>
                    <span>({bid.provider.totalReview} reviews)</span>
                  </div>
                </div>
              </div>
              {bid.provider.about && <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{bid.provider.about}</p>}
            </div>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-green-600">${bid.bid_amount}</div>
            <div className="text-xs sm:text-sm text-gray-500">{bid.payment_type === "fixed" ? "Fixed Price" : "/Hour"}</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{bid.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <span className="text-xs sm:text-sm text-gray-500">Bid placed {formatDate(bid.created_at)}</span>
          {bid.status === "accepted" && (
            <div className="w-fit bg-green-600 hover:bg-green-600 pt-[2px] text-white h-8 rounded-md gap-1.5 px-3">
              Accepted
            </div>
          )}
          {bid.status === "rejected" && (
            <div className="w-fit bg-red-600 hover:bg-red-600 pt-[2px] text-white h-8 rounded-md gap-1.5 px-3">
              Rejected
            </div>
          )}
          {user_id === bid.provider.id && bid.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditBid(bid)}
                className="text-white hover:text-white bg-[var(--base)] hover:bg-[var(--base)]"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteBid(bid.id)}
                className="text-white hover:text-white bg-red-400 hover:bg-red-500"
              >
                <Trash
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
                />
                Delete
              </Button>
            </div>
          )}
          {user_id === gigDetails.user_id && bid.status !== "accepted" && bid.status !== "rejected" && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Message
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-initial"
                  onClick={() => handleRejectBid(bid.id)}
                >
                  Reject Bid
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAcceptBid(bid.id)}
                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial"
                >
                  Accept Bid
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderBidsTab = () => {
    if (bidLoading) {
      return (
        <BidSkeletonList count={2} />
      );
    }
    if (bids.length === 0) {
      return (
        <div className="flex flex-col gap-4 sm:gap-5 mt-3">
          <div className="h-20 flex items-center justify-center">
            <span className="text-gray-700 text-sm sm:text-base">No Bids</span>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4 sm:gap-5 mt-3">
        {bids.map((bid) => renderBidCard(bid))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Description":
        return renderDescriptionTab();
      case "Certificates":
        return renderCertificatesTab();
      case "Bids":
        return renderBidsTab();
      default:
        return null;
    }
  };

  if (!gigDetails) {
    return <GigDetailSkeleton />;
  }

  return (
    <div className="bg-gray-50">
      {renderHeader()}
      <main className="mx-auto py-4 sm:py-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
          {renderImageSlider()}
          {renderSidebar()}
        </div>
        <div className="mt-6 lg:mt-10 p-4 sm:p-6 shadow-lg rounded-lg bg-white">
          {renderTabNavigation()}
          {renderTabContent()}
        </div>
        <CommonFormModal
          width="600px"
          title="Bid Submission"
          open={isModalOpen}
          fields={gigBidFields}
          setOpen={setIsModalOpen}
          onSubmit={handleSubmitBid}
          initialValues={editBid || undefined}
          submitLabel={editBid ? "Update Bid" : "Submit Bid"}
        />
      </main>
    </div>
  );
};

export default GigDetail;