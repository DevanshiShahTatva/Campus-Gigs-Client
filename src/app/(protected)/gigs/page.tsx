"use client";

import Link from "next/link";
import Slider from "react-slick";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Search,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  Image as ImageIcon,
  CalendarRange,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import GigFilterModal from "./filterModel";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import GigListingSkeleton from "@/components/skeleton/gigListingSkeleton";
import { gigBidFields } from "@/config/gigbid.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES } from "@/utils/constant";
import { IPagination, Gigs } from "@/utils/interface";
import { formatTimeDifference, IFilter } from "./helper";
import { getAvatarName, renderBaseOnCondition } from "@/utils/helper";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/components/common/Loader";
import useDebounce from "@/hooks/useDebounce";
import React from "react";
import FilterChips from "./FilterChips";

const PlaceholderImage = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div className="text-center">
      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">No Image</p>
    </div>
  </div>
);


const ImageWithFallback = React.memo(
  ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
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
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={className}
          onError={handleError}
          onLoad={handleLoad}
          style={{ display: isLoading ? "none" : "block" }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.src === nextProps.src
);

const GigListing = () => {
  const [gigs, setGigs] = useState<Gigs[]>([]);
  const [meta, setMeta] = useState<IPagination>({
    page: 1,
    pageSize: 9,
    totalPages: 0,
    total: 1,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const filters = useSelector((state: RootState) => state.filter);
  const [appliedFilters, setAppliedFilters] = useState<IFilter>(filters);

  const debounceSearch = useDebounce(searchQuery, 700);

  const fetchGigs = async (
    page = 1,
    search = "",
    filters?: {
      rating?: number,
      paymentType?: string[],
      priceRange?: number[]
      startDate?: string,
      endDate?: string,
      category?: string[]
    },
  ) => {
    try {

      let url = `${API_ROUTES.GIGS}?page=${page}&pageSize=9&search=${search}`;
      if (filters?.rating) {
        const minRating = filters.rating;
        url += `&minRating=${minRating}`;
      }
      if (filters?.paymentType && filters?.paymentType?.length > 0) {
        url += `&paymentType=${filters?.paymentType?.join(',')}`;
      }
      if (filters?.priceRange && Array.isArray(filters?.priceRange) && (filters?.priceRange?.length == 2)) {
        url += `&minPrice=${filters?.priceRange[0]}&maxPrice=${filters?.priceRange[1]}`;
      }
      if (filters?.category && Array.isArray(filters.category) && filters.category.length > 0) {
        url += `&category=${filters.category.join(',')}`;
      }
      if (filters?.startDate) {
        url += `&startDate=${encodeURIComponent(filters.startDate)}`;
      }
      if (filters?.endDate) {
        url += `&endDate=${encodeURIComponent(filters.endDate)}`;
      }

      const resp = await apiCall({
        endPoint: url,
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
  const handleClearFilters = () => {
    setLoading(true);
    fetchGigs(1, searchQuery, {});
  };
  useEffect(() => {
    setAppliedFilters(filters);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    fetchGigs(1, debounceSearch, appliedFilters);
  }, [debounceSearch, appliedFilters]);

  const fetchNextPage = () => {
    if (currentPage < meta.totalPages && !loading) {
      fetchGigs(currentPage + 1, debounceSearch);
    }
  };

  const handleApplyFilters = (localFilters: IFilter) => {    
    setAppliedFilters(localFilters);
  };

  const handleSubmitBid = (data: any) => {
    console.log(data);
  };

  const capitalize = (str: string) =>
    str?.charAt(0)?.toUpperCase() + str?.slice(1);

  if (!gigs.length && loading) {
    return <GigListingSkeleton />;
  }

  const projectCardUI = (gig: Gigs) => {
    const visibleSkills = gig.skills.slice(0, 3);
    const remainingCount = gig.skills.length - 3;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                ${Number(gig.price).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {capitalize(gig.payment_type)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {gig._count?.bids ?? 0} bids
              </div>
              <div className="text-sm text-gray-500">Received</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <CalendarRange className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {moment(gig.start_date_time).format("DD MMM YYYY")}
              </div>
              <div className="text-sm text-gray-500">Start Date</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {formatTimeDifference(gig.start_date_time, gig.end_date_time)}
              </div>
              <div className="text-sm text-gray-500">Timeline</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {skill.name}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              +{remainingCount} more
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={gig.user.profile} />
              <AvatarFallback>{getAvatarName(gig.user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900">
                  {gig.user.name}
                </span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                {gig?.user?.averageRating > 0 && <>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{gig?.user?.averageRating}</span>
                  <span>•</span>
                </>
                }
                <span>{moment(gig.created_at).fromNow()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Gigs</h1>
            <p className="text-gray-600">
              Discover amazing gigs and opportunities
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 bg-white">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description or category..."
              className="pl-12 h-12 text-base bg-white border-gray-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              onClick={() => setIsFilterOpen(true)}
              className="px-6 h-12 bg-[var(--base)] hover:bg-[var(--base-hover)] relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              Filter
            </Button>
            <Link href="/gigs/create">
              <Button className="px-6 h-12" size="lg">
                Create Gig
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <FilterChips />
      </div>
      {renderBaseOnCondition(
        loading,
        <div className="h-20 mt-14 w-full text-center">
          <Loader size={50} />
        </div>,
        <>
          {gigs.length === 0 ? (
            <Card>
              <CardContent className="text-xl text-center font-semibold capitalize">
                No gigs found
              </CardContent>
            </Card>
          ) : (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gigs.map((gig) => (
                  <Link key={gig.id} href={`/gigs/${gig.id}`} className="group">
                    <Card className="gap-0 py-0 relative overflow-hidden bg-white border-0 shadow-lg h-full flex flex-col hover:shadow-purple-500/10">
                      <div className="relative overflow-hidden">
                        <div className="slider h-[200px]">
                          <Slider
                            slidesToShow={1}
                            dots={gig.images.length > 1}
                            infinite={gig.images.length > 1}
                            customPaging={() => (
                              <div className="w-[7px] h-[7px] bg-gray-400 rounded-full transition" />
                            )}
                          >
                            {gig.images.length > 0 ? (
                              gig.images.map((image, i) => (
                                <div key={i} className="h-[200px]">
                                  <ImageWithFallback
                                    src={image}
                                    alt={gig.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="h-[200px]">
                                <PlaceholderImage />
                              </div>
                            )}
                          </Slider>
                        </div>
                        <div className="w-fit absolute bottom-4 left-4 right-4">
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg font-medium">
                            {capitalize(gig.gig_category.name)}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[var(--base)] transition-colors line-clamp-1 leading-tight">
                            {gig.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed h-[45px]">
                            {gig.description}
                          </p>
                        </div>
                        {projectCardUI(gig)}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </>
      )}

      <GigFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilter={handleClearFilters}
      />
      <CommonFormModal
        width="600px"
        title="Bid Submission"
        submitLabel="Submit Bid"
        open={isModalOpen}
        setOpen={setIsModalOpen}
        fields={gigBidFields}
        onSubmit={handleSubmitBid}
      />
    </div>
  );
};

export default GigListing;
