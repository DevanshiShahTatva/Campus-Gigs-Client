"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, MY_GIGS_TABS } from "@/utils/constant";
import { toast } from "react-toastify";
import { Gigs, IPagination } from "@/utils/interface";
import { renderBaseOnCondition } from "@/utils/helper";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader, { CentralLoader } from "@/components/common/Loader";
import MyGigSkelton from "@/components/skeleton/MyGigSkelton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useRouter } from "next/navigation";
import GigRatingModal from "./GigRatingModal";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MyGigs = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("un_started");
  const [loading, setLoading] = useState<boolean>(true);
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [gigIdForDelete, setGigIdForDelete] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [gigs, setGigs] = useState<Gigs[]>([]);
  const [ratingData, setRatingData] = useState<any>(null);
  const [gigIdForRating, setGigIdForRating] = useState<number>(0);
  const [meta, setMeta] = useState<IPagination>({
    page: 1,
    pageSize: 9,
    totalPages: 0,
    total: 1,
  });

  const PlaceholderImage = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="text-center">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No Image</p>
      </div>
    </div>
  );

  const ImageWithFallback = ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => {
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
          style={{ display: isLoading ? "none" : "block" }}
          className="min-h-[250px] h-[250px] w-full object-contain"
        />
      </div>
    );
  };

  const profileType = useSelector(
    (state: RootState) => state.user.profile_type
  );

  const fetchGigs = async (page = 1, status = "") => {
    setActiveTab(status);
    try {
      setLoading(true);

      const resp = await apiCall({
        endPoint: `${API_ROUTES.MY_GIGS}?page=${page}&pageSize=10&status=${status}&profile_type=${profileType}`,
        method: "GET",
      });

      if (resp?.success) {
        setGigs((prev) => (page === 1 ? resp.data : [...prev, ...resp.data]));
        setMeta(resp.meta);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error("Failed to fetch gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs(1, "un_started");
  }, [profileType]);

  const fetchNextPage = () => {
    if (currentPage < meta.totalPages && !loading) {
      fetchGigs(currentPage + 1);
    }
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    fetchGigs(1, id);
  };

  const handleDelete = (event: React.SyntheticEvent, id: number) => {
    event.stopPropagation();
    setGigIdForDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteGig = async () => {
    try {
      setIsDeleting(true);

      const resp = await apiCall({
        endPoint: `${API_ROUTES.GIGS + "/" + gigIdForDelete}`,
        method: "DELETE",
      });

      if (resp?.success) {
        toast.success(resp.data.message);
        setDeleteDialogOpen(false);
        fetchGigs(1, activeTab);
      }
    } catch (error) {
      toast.error("Failed to delete gig");
    } finally {
      setIsDeleting(false);
    }
  };

  const geGigStatus = (status: string) => {
    if (status === "un_started") {
      return "Open Gigs";
    } else if (status === "in_progress") {
      return "in Progress";
    } else {
      return "completed";
    }
  };

  const handleNavigateToEdit = (event: React.SyntheticEvent, id: number) => {
    event.stopPropagation();
    const newQuery = { gigId: String(id) };
    const newUrl = `gigs/create?${new URLSearchParams(newQuery).toString()}`;
    router.push(newUrl);
  };

  const handlePaymentForGig = async (
    event: React.SyntheticEvent,
    gig: Gigs
  ) => {
    event.stopPropagation();
    const bid = gig.bids.find((bid) => bid.status === "accepted");
    try {
      setIsPaymentLoading(true);
      const resp = await apiCall({
        endPoint: `${API_ROUTES.GIG_PAYMENT_SESSION}`,
        method: "POST",
        body: {
          amount: Number(bid?.bid_amount),
          gigId: gig.id,
          userId: gig.user_id,
          gigTitle: gig.title,
        },
      });

      if (resp?.success) {
        window.location.href = resp.data.url;
      }
    } catch (error) {
      toast.error("Failed to create payment session");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleNavigateToView = (id: number) => {
    router.push(`gigs/${id}`);
  };

  const getRatingDetail = async (gigId: number) => {
    try {
      setRatingLoading(true);
      const res = await apiCall({
        method: "GET",
        endPoint: `/rating/get-by-gig/${gigId}`,
      });

      if (res?.success) {
        setRatingData(res.data);
      }
    } catch (error) {
      toast.error("Failed to get gig details");
    } finally {
      setRatingLoading(false);
    }
  };

  const renderImageSlider = (images: string[]) => (
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
                  <ImageWithFallback key={`${i + 1}`} src={image} alt={"img"} />
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
    <>
      <div className="mb-8 flex items-center justify-between">
        {ratingLoading && <CentralLoader loading={ratingLoading} />}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
          <p className="text-gray-600">
            Manage your gigs and track your progress
          </p>
        </div>
        <Link href={"/gigs/create"}>
          <Button>Create Gig</Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {MY_GIGS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {renderBaseOnCondition(
        loading,
        <MyGigSkelton cardNum={3} />,
        <>
          {renderBaseOnCondition(
            gigs.length === 0,
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No gigs found
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any {geGigStatus(activeTab)} gigs at the moment.
              </p>
            </div>,
            <InfiniteScroll
              dataLength={gigs.length}
              next={fetchNextPage}
              hasMore={currentPage < meta.totalPages}
              loader={
                <div className="h-20 mt-14 w-full text-center">
                  <Loader size={50} />
                </div>
              }
              scrollThreshold={0.9}
              scrollableTarget="scrollableDiv"
              className="py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => {
                  return (
                    <Card
                      key={gig.id}
                      className="p-0 flex flex-col h-full hover:shadow-md transition-shadow border border-gray-200 rounded-lg cursor-pointer overflow-hidden"
                      onClick={() => handleNavigateToView(gig.id)}
                    >
                      {/* Top: Image */}
                      <div className="relative h-[250px] w-full">
                        {renderImageSlider(gig?.images)}
                        <div className="absolute top-3 left-3 z-10">
                          <Badge
                            variant="secondary"
                            className="bg-[var(--base)] text-white px-3 py-1 rounded-full shadow-sm text-xs"
                          >
                            {gig.gig_category.name}
                          </Badge>
                        </div>
                      </div>

                      {/* Bottom: Content */}
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div className="mb-3">
                          {/* Title + Edit/Delete */}
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                              {gig.title}
                            </h3>
                            {activeTab === "un_started" &&
                              gig.provider_id == null && gig.bids.length == 0 && (
                                <div className="flex gap-2 ml-4">
                                  <Edit
                                    onClick={(event) =>
                                      handleNavigateToEdit(event, gig.id)
                                    }
                                    className="cursor-pointer h-5 w-5 text-teal-600 hover:text-teal-800"
                                  />
                                  <Trash2
                                    onClick={(event) =>
                                      handleDelete(event, gig.id)
                                    }
                                    className="cursor-pointer h-5 w-5 text-red-600 hover:text-red-800"
                                  />
                                </div>
                              )}
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                            {gig.description}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {gig.skills.slice(0, 3).map((data) => (
                              <Badge
                                key={data.id}
                                variant="secondary"
                                className="bg-teal-50 text-teal-700 border border-teal-200 text-xs"
                              >
                                {data.name}
                              </Badge>
                            ))}

                            {gig.skills.length > 3 && (
                              <span className="text-teal-700 text-xs flex items-center">
                                +{gig.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <DollarSign className="h-4 w-4 text-green-600" />₹
                            {Number(gig.price)} / {gig.payment_type}
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <span className="font-semibold">Bids:</span>{" "}
                            {gig.bids.length}
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            {moment(gig.start_date_time).format("DD/MM/yyyy")}
                          </div>
                        </div>

                        {activeTab === "un_started" &&
                          gig.provider_id !== null &&
                          gig.gig_payment == null && (
                            <Button
                              onClick={(event) =>
                                handlePaymentForGig(event, gig)
                              }
                              className="w-full mt-4"
                            >
                              {isPaymentLoading ? (
                                <Loader size={8} />
                              ) : (
                                "Pay Now"
                              )}
                            </Button>
                          )}

                        {/* Status */}
                        {gig.status === "completed" &&
                            <div className="mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGigIdForRating(gig.id);
                                  getRatingDetail(gig.id);
                                }}
                                className="bg-[var(--base)] text-white px-2 py-1 rounded w-full"
                              >
                               {gig.rating ? "Show Review" : "Review"}
                              </button>
                            </div>
                          }

                        {activeTab === "un_started" &&
                          gig.provider_id !== null &&
                          gig.gig_payment == null && (
                            <div className="pt-4 bg-red-50 rounded-lg p-4 mt-2">
                              <p className="text-sm text-red-700">
                                <strong>Payment Pending:</strong> You have
                                accepted bid of provider. Your payment is
                                pending for this gig.
                              </p>
                            </div>
                          )}

                        {activeTab === "un_started" &&
                          gig.provider_id !== null &&
                          gig.gig_payment !== null && (
                            <div className="pt-4 bg-green-50 rounded-lg p-4 mt-2">
                              <p className="text-sm text-green-700">
                                <strong>Payment Completed:</strong> Provider
                                will soon start working on the gig. Meanwhile if
                                you have any query message to provider.
                              </p>
                            </div>
                          )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </InfiniteScroll>
          )}
        </>
      )}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteGig}
        title="Delete Gig"
        description="Are you sure you want to delete this gig?"
        confirmText="Delete Gig"
        isDeleting={isDeleting}
      />
      {!!gigIdForRating && (
        <GigRatingModal
          isReadonly={!!ratingData}
          gigId={gigIdForRating}
          existingRating={ratingData}
          onClose={(step: string) => {
            setGigIdForRating(0);
            setRatingData(null);
            if (step === "submitted") {
              fetchGigs(1, "completed");
            }
          }}
        />
      )}
    </>
  );
};

export default MyGigs;
