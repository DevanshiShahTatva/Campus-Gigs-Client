"use client";

import React, { useEffect, useState } from "react";
import { Users, DollarSign, UserX, List, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, fallbackColors, tableHeaders } from "@/utils/constant";
import {
  DashboardData,
  LastSevenDaysRevenue,
  TimeRange,
  TopUsers,
} from "@/utils/interface";
import Loader from "@/components/common/Loader";
import { CustomTable } from "@/components/common/CustomTable";

import { BarChart } from "@/components/common/charts/BarChart";
import { PieChart } from "@/components/common/charts/PieChart";
import { DoughnutChart } from "@/components/common/charts/DoughnutChart";
import { ComplaintsOutcomeChart } from "@/components/common/charts/ComplaintsOutcomeChart";
import { StatCard } from "@/components/admin/dashboard/StatCard";

const AdminDashboard: React.FC = () => {
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [revenueOverview, setRevenueOverview] = useState<
    LastSevenDaysRevenue[] | null
  >([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("7_days");

  const fetchDashboardData = async () => {
    try {
      setLoader(true);
      const resp = await apiCall({
        endPoint: API_ROUTES.ADMIN.DASHBOARD,
        method: "GET",
      });

      if (resp?.success && resp.data) {
        setDashboardData(resp.data);
      } else {
        toast.error(resp?.message || "Failed to load dashboard data");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoader(false);
    }
  };

  const fetchRevenueOverview = async () => {
    try {
      setLoading(true);
      const resp = await apiCall({
        endPoint: API_ROUTES.ADMIN.REVENUE_OVERVIEW + timeRange,
        method: "GET",
      });

      if (resp?.success && resp.data) {
        setRevenueOverview(resp.data);
      } else {
        toast.error(resp?.message || "Failed to load revenueOverview data");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("revenueOverview fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRevenueOverview();
  }, []);

  useEffect(() => {
    fetchRevenueOverview();
  }, [timeRange]);

  return (
    <div className="h-full relative">
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader size={48} colorClass="text-[var(--base)]" />
        </div>
      )}
      <div className="container mx-auto space-y-6 p-4">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-slate-300 mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Users"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            bgColor="bg-blue-50"
            textColor="text-green-600"
            value={dashboardData?.totalUsers?.toLocaleString() ?? "0"}
            percentage={dashboardData?.percentageIncrease?.toString()}
          />
          <StatCard
            title="Blocked Users"
            icon={<UserX className="h-5 w-5 text-red-600" />}
            bgColor="bg-red-50"
            textColor="text-slate-500"
            value={dashboardData?.bannedUsers ?? 0}
            percentage={`${dashboardData?.bannedUserPercentage}`}
            subtext="of total users"
            percentageTextColor="text-slate-500"
          />
          <StatCard
            title="Total Gigs"
            icon={<List className="h-5 w-5 text-indigo-600" />}
            bgColor="bg-indigo-50"
            textColor="text-green-600"
            value={dashboardData?.totalGigs?.toLocaleString() ?? "0"}
            percentage={dashboardData?.percentageIncreaseGigs?.toString()}
          />
          <StatCard
            title="Support Request"
            icon={<FileText className="h-5 w-5 text-amber-600" />}
            bgColor="bg-amber-50"
            textColor="text-amber-600"
            value={dashboardData?.pendingComplaintsCount ?? 0}
            subtext="Pending"
            isDualStat
            secondValue={dashboardData?.respondedComplaintsCount}
            secondLabel="Resolved"
            secondTextColor="text-green-600"
          />
          <StatCard
            title="Total Revenue"
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            bgColor="bg-green-50"
            textColor="text-green-600"
            value={dashboardData?.totalRevenue ?? 0}
            percentage={dashboardData?.percentageIncreaseRevenue?.toString()}
            isCurrency
          />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Revenue Overview
                </CardTitle>
                <CardDescription></CardDescription>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              >
                <option value="7_days">Last 7 Days</option>
                <option value="12_months">Last 12 Months</option>
                <option value="7_years">Last 7 Years</option>
              </select>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader size={40} />
                </div>
              ) : revenueOverview && revenueOverview.length > 0 ? (
                <>
                  <div className="h-100">
                    <BarChart
                      data={revenueOverview}
                      color="bg-gradient-to-b from-green-400 to-green-600"
                      height={390}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-4 px-2">
                    {revenueOverview.map((data, i) => (
                      <span
                        key={i}
                        className="font-medium whitespace-nowrap items-center"
                      >
                        {data.label.split(" ").map((part, index) => (
                          <React.Fragment key={index}>
                            {part}
                            <br />
                          </React.Fragment>
                        ))}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 text-center py-6">
                  No revenue data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Gigs by Category
              </CardTitle>
              <CardDescription>Distribution of all gigs</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart data={dashboardData?.gigsByCategories || []} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Users by Plan
              </CardTitle>
              <CardDescription>Distribution of all users</CardDescription>
            </CardHeader>
            <CardContent>
              <DoughnutChart data={dashboardData?.usersByPlan || []} />
            </CardContent>
          </Card>
          {dashboardData?.complaintsByOutcome && (
            <Card className="border-0 shadow-sm flex justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Complaints by Outcome
                </CardTitle>
                <CardDescription>
                  Distribution of complaint statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintsOutcomeChart
                  data={
                    dashboardData.complaintsByOutcome as Record<string, number>
                  }
                  fallbackColors={fallbackColors}
                />
              </CardContent>
            </Card>
          )}
        </div>
        {dashboardData?.topRatedUsers && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Top Ratted Providers
              </CardTitle>
            </CardHeader>
            <div className="px-5">
              <CustomTable<TopUsers>
                searchPlaceholder="Search by Name or Email"
                data={dashboardData.topRatedUsers}
                columns={tableHeaders}
                pageSize={5}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
