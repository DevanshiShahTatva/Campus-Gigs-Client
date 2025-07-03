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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
import { formatTimeDifference, Gigs } from "./helper";
import { IPagination } from "@/utils/interface";
import { getAvtarName, renderBaseOnCondition } from "@/utils/helper";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/components/common/Loader";
import useDebounce from "@/hooks/useDebounce";

const GigListing = () => {
  const [gigs, setGigs] = useState<Gigs[]>([]);
  const [meta, setMeta] = useState<IPagination>({
    page: 1,
    pageSize: 9,
    totalPages: 0,
    total: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const debounceSearch = useDebounce(searchQuery, 700);

  const fetchGigs = async (page = 1, search = "") => {
    try {
      setLoading(true);

      const resp = await apiCall({
        endPoint: `${API_ROUTES.GIGS}?page=${page}&pageSize=9&search=${search}`,
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
    fetchGigs(1, debounceSearch);
  }, [debounceSearch]);

  const fetchNextPage = () => {
    if (currentPage < meta.totalPages && !loading) {
      fetchGigs(currentPage + 1);
    }
  };

  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters);
  };

  const handleSubmitBid = (data: any) => {
    console.log(data);
  };

  if (!gigs.length && loading) {
    return <GigListingSkeleton />;
  }

  const projectCardUI = (gig: Gigs) => {
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
              <div className="text-sm text-gray-500">{gig.payment_type}</div>
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
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">0 bids</div>
              <div className="text-sm text-gray-500">Received</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {gig.skills.slice(0, 3).map((skill: { name: string }, i: number) => (
            <span
              key={`${i + 1}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {skill.name}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={gig.user.profile} />
              <AvatarFallback>{getAvtarName(gig.user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900">
                  {gig.user.name}
                </span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.6</span>
                <span>•</span>
                <span>{moment(gig.created_at).fromNow()}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="px-4 py-4 rounded-sm"
          >
            Place Bid
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="">
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
            <div className="relative flex-1 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description or category..."
                className="pl-12 h-12 text-base bg-white border-gray-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="lg"
                onClick={() => setIsFilterOpen(true)}
                className="px-6 h-12"
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
              <Link href={"/gigs/create"}>
                <Button className="px-6 h-12" size="lg">
                  Create Gig
                </Button>
              </Link>
            </div>
          </div>
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
                    <Link
                      key={gig.id}
                      href={`/gigs/${gig.id}`}
                      className="group"
                    >
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
                              {gig.images.map((image: string, i: number) => (
                                <img
                                  key={`${i + 1}`}
                                  src={image}
                                  alt={gig.title}
                                  className="w-full h-full object-cover"
                                />
                              ))}
                            </Slider>
                          </div>
                          <CardContent className="content"></CardContent>
                          <div className="w-fit absolute bottom-4 left-4 right-4">
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg font-medium">
                              {gig.gig_category.name}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="mb-4">
                            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[var(--base)] transition-colors line-clamp-2 leading-tight">
                              {gig.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
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
    </div>
  );
};

export default GigListing;
