"use client";

import { useEffect, useState } from "react";
import GigCard from "./GigPipelineCard";
import { API_ROUTES, GIGS_PIPELINE_TABS } from "@/utils/constant";
import { apiCall } from "@/utils/apiCall";
import { Gigs, IPagination } from "@/utils/interface";
import { toast } from "react-toastify";
import MyGigSkelton from "@/components/skeleton/MyGigSkelton";
import { renderBaseOnCondition } from "@/utils/helper";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/components/common/Loader";
import { useGetUserProfileQuery } from "@/redux/api";

const GigPipeline = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState<IPagination>({
    page: 1,
    pageSize: 9,
    totalPages: 0,
    total: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [gigs, setGigs] = useState<Gigs[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const { data: userProfile } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    fetchGigsPipeline(1, "pending");
  }, []);

  const fetchGigsPipeline = async (page = 1, status = "") => {
    setActiveTab(status);
    try {
      setLoading(true);

      const resp = await apiCall({
        endPoint: `${API_ROUTES.GIG_PIPELINE}?page=${page}&pageSize=10&status=${status}`,
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

  const fetchNextPage = () => {
    if (currentPage < meta.totalPages && !loading) {
      fetchGigsPipeline(currentPage + 1);
    }
  };

  const findNextTab = (status: string) => {
    if (status === "accepted") {
      return "in_progress";
    }

    if (status === "in_progress") {
      return "completed";
    }

    if (status === "completed") {
      return "rejected";
    }

    return "pending";
  };

  const handleChangeStatusGig = async (gigId: number, status: string) => {
    try {
      const resp = await apiCall({
        endPoint: `${API_ROUTES.GIG_STATUS_CHANGE}/${gigId}`,
        method: "PUT",
        body: { status: status },
      });

      if (resp?.success) {
        toast.success(resp.data.message ?? "Gig status changed successfully");
        setActiveTab(findNextTab(activeTab));
        fetchGigsPipeline(1, findNextTab(activeTab));
      }
    } catch (error) {
      toast.error("Failed to fetch gigs");
    }
  };

  const handlePriorityChange = (
    gigId: number,
    priority: "high" | "medium" | "low"
  ) => {};

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    fetchGigsPipeline(1, id);
  };

  const getEmptyState = () => {
    let icon = "📋";
    let title = "No gigs found";
    let description = `You don't have any ${activeTab.replace(
      "-",
      " "
    )} gigs at the moment.`;

    switch (activeTab) {
      case "pending":
        icon = "📋";
        title = "No pending gigs";
        description = "Gigs you've bid on will appear here";
        break;
      case "accepted":
        icon = "🚀";
        title = "No accepted gigs";
        description = "Accepted gigs will appear here";
        break;
      case "in_progress":
        icon = "⚡";
        title = "No active gigs";
        description = "Gigs you're working on will appear here";
        break;
      case "completed":
        icon = "🏆";
        title = "No completed gigs yet";
        description = "Finished gigs will appear here";
        break;
      case "rejected":
        icon = "📋";
        title = "No rejected gigs";
        description = "Keep up the good work!";
        break;
    }

    return (
      <div className="text-center py-12 border border-gray-200 rounded-lg">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Gig Pipeline
        </h1>
        <p className="text-gray-600 text-lg">
          Track and manage all your bidded gigs in one place
        </p>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {GIGS_PIPELINE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.label}</span>
                </div>
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
            getEmptyState(),
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
                {gigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    userId={userProfile.data.id}
                    onStartGig={
                      activeTab === "accepted"
                        ? handleChangeStatusGig
                        : undefined
                    }
                    onPriorityChange={
                      activeTab === "in_progress"
                        ? handlePriorityChange
                        : undefined
                    }
                    onCompleteGig={
                      activeTab === "in_progress"
                        ? handleChangeStatusGig
                        : undefined
                    }
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
};

export default GigPipeline;
