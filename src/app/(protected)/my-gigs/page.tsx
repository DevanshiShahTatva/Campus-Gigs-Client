"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, MY_GIGS_TABS } from "@/utils/constant";
import { toast } from "react-toastify";
import { Gigs, IPagination } from "@/utils/interface";
import { renderBaseOnCondition } from "@/utils/helper";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/components/common/Loader";
import MyGigSkelton from "@/components/skeleton/MyGigSkelton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/redux/api";
import GigRatingModal from "../gig-pipeline/GigRatingModal";

const MyGigs = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("un_started");
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [gigIdForDelete, setGigIdForDelete] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [gigs, setGigs] = useState<Gigs[]>([]);
  const [gigIdForReview, setGigIdForReview] = useState<number>(0);
  const [meta, setMeta] = useState<IPagination>({
    page: 1,
    pageSize: 9,
    totalPages: 0,
    total: 1,
  });
  const { data: userProfile } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const fetchGigs = async (page = 1, status = "") => {
    setActiveTab(status);
    try {
      setLoading(true);

      const resp = await apiCall({
        endPoint: `${API_ROUTES.MY_GIGS}?page=${page}&pageSize=10&status=${status}&profile_type=${userProfile.data.profile_type}`,
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
  }, [userProfile]);

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

  const handleNavigateToView = (id: number) => {
    router.push(`gigs/${id}`);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
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
              <div className="space-y-6">
                {gigs.map((gig) => {
                  return (
                    <Card
                      key={gig.id}
                      className="hover:shadow-lg transition-shadow border-l-4 border-l-[var(--base)] cursor-pointer"
                      onClick={() => handleNavigateToView(gig.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="flex justify-between text-lg text-gray-900 mb-2">
                              <div className="flex items-center gap-2">
                                {gig.title}{" "}
                                <Badge
                                  variant={"secondary"}
                                  className="bg-[var(--base)] text-white"
                                >
                                  {gig.gig_category.name}
                                </Badge>
                              </div>
                              {gig.status === "completed" && (
                                <div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGigIdForReview(gig.id);
                                    }}
                                    className="bg-[var(--base)] text-white px-3 py-1 rounded"
                                  >
                                    Review
                                  </button>
                                </div>
                              )}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {gig.skills.map((data) => {
                                return (
                                  <Badge
                                    key={data.id}
                                    variant="secondary"
                                    className="bg-teal-50 text-teal-700 border-teal-200"
                                  >
                                    {data.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                          {activeTab === "un_started" && (
                            <div className="flex gap-2 ml-4">
                              <Edit
                                onClick={(event) =>
                                  handleNavigateToEdit(event, gig.id)
                                }
                                className="cursor-pointer h-5 w-5 text-teal-600 hover:text-teal-600"
                              />
                              <Trash2
                                onClick={(event) => handleDelete(event, gig.id)}
                                className="cursor-pointer h-5 w-5 text-red-600 hover:text-red-600"
                              />
                            </div>
                          )}
                        </div>

                        <CardDescription className="text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {gig.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                            <DollarSign className="h-4 w-4 text-teal-600" />
                            <span className="font-medium">
                              {Number(gig.price).toFixed(2)}/{gig.payment_type}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                            <span className="font-semibold">Bids: </span>
                            <span className="font-medium">
                              {gig.bids.length}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                            <Calendar className="h-4 w-4 text-teal-600" />
                            <span className="font-semibold">End Date:</span>
                            <span>
                              {moment(gig.start_date_time).format("DD/MM/yyyy")}
                            </span>
                          </div>
                        </div>

                        {activeTab === "completed" && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-green-800">
                                Completed Successfully
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-green-800">
                                  ★ 5
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-green-700 italic">
                              Nice job very good work
                            </p>
                          </div>
                        )}
                      </CardContent>
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
      {gigIdForReview && (
        <GigRatingModal
          gigId={gigIdForReview}
          onClose={() => setGigIdForReview(0)}
        />
      )}
    </>
  );
};

export default MyGigs;
