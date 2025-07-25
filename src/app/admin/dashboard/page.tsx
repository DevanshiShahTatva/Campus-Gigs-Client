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
import { apiCall } from "@/utils/apiCall";
import { toast } from "react-toastify";
import { API_ROUTES } from "@/utils/constant";

// Types
interface Stats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalGigs: number;
  userActivity: number[];
  revenueData: number[];
  pendingComplaints: number;
  resolvedComplaints: number;
}

interface BarChartProps {
  data: number[];
  color?: string;
  height?: number;
}

interface CategoryGigData {
  categoryId: number;
  categoryName: string;
  count: number;
  color?: string; // optional, fallback will be used if not provided
}

interface PieChartProps {
  data: CategoryGigData[];
  size?: number;
}

export interface GigCategory {
  categoryId: number;
  categoryName: string;
  count: number;
}

export interface DashboardData {
  totalUsers: number;
  percentageIncrease: number;
  bannedUsers: number;
  bannedUserPercentage: number;
  totalGigs: number;
  percentageIncreaseGigs: number;
  totalComplaints: number;
  pendingComplaintsCount: number;
  respondedComplaintsCount: number;
  gigsByCategories: GigCategory[];
  totalRevenue: number;
  percentageIncreaseRevenue: number;
}

export interface DashboardResponse {
  success: boolean;
  status: number;
  data: DashboardData;
}

const stats: Stats = {
  totalUsers: 1245,
  activeUsers: 845,
  blockedUsers: 45,
  totalRevenue: 45231.89,
  monthlyGrowth: 12.5,
  totalGigs: 25,
  userActivity: [65, 59, 80, 81, 56, 55, 40],
  revenueData: [1200, 1900, 1500, 2500, 2100, 3200, 2800],
  pendingComplaints: 18,
  resolvedComplaints: 124,
};

const generateColor = (index: number): string => {
  const hue = (index * 137.508) % 360; // Golden angle for distinctness
  return `hsl(${hue}, 85%, 60%)`; // Bright, Tailwind-friendly colors
};

const fallbackColors = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
];

const BarChart: React.FC<BarChartProps> = ({
  data,
  color = "bg-blue-500",
  height = 100,
}) => {
  const maxValue = Math.max(...data);

  return (
    <div
      className="flex items-end h-full gap-2"
      style={{ height: `${height}px` }}
    >
      {data.map((value, index) => {
        const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div
            key={index}
            className={`flex-1 ${color} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer`}
            style={{
              height: `${barHeight}%`,
              minHeight: "4px",
              animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
            }}
            aria-label={`Bar ${index + 1}: ${value}`}
          />
        );
      })}
      <style jsx>{`
        @keyframes slideUp {
          from {
            height: 0%;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercent = 0;

  // Assign fallback color if color not provided
  const colorizedData = data.map((item, index) => ({
    ...item,
    color: item.color || fallbackColors[index] || generateColor(index),
  }));

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const generatePath = (slice: CategoryGigData, index: number) => {
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    const slicePercent = slice.count / total;
    cumulativePercent += slicePercent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

    return (
      <path
        key={index}
        d={`M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
        fill={slice.color}
        className="transition-all duration-500 hover:opacity-80"
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox="-1 -1 2 2"
        style={{ transform: "rotate(-90deg)" }}
        className="w-full max-w-[240px] h-auto"
      >
        {colorizedData.map((slice, index) => generatePath(slice, index))}
      </svg>
      <div className="mt-4 w-full">
        {colorizedData.map((slice, index) => (
          <div key={index} className="flex items-center text-sm mb-1">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: slice.color }}
            ></span>
            <span className="text-slate-700 font-medium">
              {slice.categoryName}
            </span>
            <span className="ml-auto text-slate-500">{slice.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "signup":
      return (
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
      );
    case "payment":
      return <div className="h-3 w-3 rounded-full bg-blue-500" />;
    case "block":
      return <div className="h-3 w-3 rounded-full bg-red-500" />;
    default:
      return <div className="h-3 w-3 rounded-full bg-gray-400" />;
  }
};

const AdminDashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApi = async (
    config: any,
    successMsg?: string,
    callback?: (data: any) => void,
    closeOnError: boolean = false
  ) => {
    try {
      const resp = await apiCall(config);
      if (resp?.success) {
        successMsg && toast.success(successMsg);
        callback?.(resp.data);
        setOpen(false);
      } else {
        toast.error(resp?.message || "Something went wrong");
        closeOnError && setOpen(false);
      }
    } catch {
      toast.error("Something went wrong");
      closeOnError && setOpen(false);
    }
  };

  const fetchDashboardData = async () => {
    handleApi(
      { endPoint: API_ROUTES.ADMIN.DASHBOARD, method: "GET" },
      "",
      (data) => setDashboardData(data)
    );
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Header */}
      {console.log("dashboard data =>", dashboardData)}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-300 mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {dashboardData?.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              +{dashboardData?.percentageIncrease}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">
                Blocked Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-red-50">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {dashboardData?.bannedUsers}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {dashboardData?.bannedUserPercentage}% of total users
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Gigs
              </CardTitle>
              <div className="p-2 rounded-lg bg-indigo-50">
                <List className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {dashboardData?.totalGigs.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              +{dashboardData?.percentageIncreaseGigs}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">
                Complaints
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-50">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {dashboardData?.pendingComplaintsCount}
              </div>
              <p className="text-xs text-amber-600 font-medium">Pending</p>
            </div>
            <div className="h-10 w-px bg-slate-200 mx-4"></div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {dashboardData?.respondedComplaintsCount}
              </div>
              <p className="text-xs text-green-600">Resolved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Revenue
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              ${dashboardData?.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              +{dashboardData?.percentageIncreaseRevenue}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Revenue Overview
                </CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart
                data={stats.revenueData}
                color="bg-gradient-to-b from-green-400 to-green-600"
                height={390}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-4 px-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, i) => (
                    <span key={i} className="font-medium">
                      {day}
                    </span>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Gigs by Category
              </CardTitle>
            </div>
            <CardDescription>Distribution of all gigs</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={dashboardData?.gigsByCategories || []} />
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
