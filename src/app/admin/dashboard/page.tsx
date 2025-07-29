"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { API_ROUTES, fallbackColors } from "@/utils/constant";
import {
  BarChartProps,
  DashboardData,
  DoughnutChartProps,
  LastSevenDaysRevenue,
  PieChartProps,
  StatCardProps,
} from "@/utils/interface";
import Loader from "@/components/common/Loader";

type TimeRange = "7_days" | "12_months" | "7_years";

const generateColor = (index: number): string =>
  `hsl(${(index * 137.508) % 360}, 85%, 60%)`;

// BarChart
const BarChart: React.FC<BarChartProps> = ({
  data,
  color = "bg-blue-500",
  height = 150,
}) => {
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.amount)),
    [data]
  );

  return (
    <div className="flex items-end h-full gap-2" style={{ height }}>
      {data.map(({ amount }, index) => {
        const barHeight = maxValue > 0 ? (amount / maxValue) * 100 : 0;
        return (
          <div
            key={index}
            className={`flex-1 ${color} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group`}
            style={{
              height: `${barHeight}%`,
              minHeight: "4px",
              animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
              ₹{amount}
            </div>
          </div>
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

// PieChart
const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercent = 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colorizedData = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        color: item.color || fallbackColors[index] || generateColor(index),
      })),
    [data]
  );

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox="-1 -1 2 2"
        className="rotate-[-90deg] w-full max-w-[240px] h-auto"
      >
        {colorizedData.map((slice, index) => {
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
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseMove={(e) => {
                const bounds = (
                  e.target as SVGPathElement
                ).getBoundingClientRect();
                setMousePos({
                  x: e.clientX - bounds.left,
                  y: e.clientY - bounds.top,
                });
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>

      {hoveredIndex !== null && (
        <div
          className="absolute z-10 px-3 py-1 text-xs bg-gray-700 text-white rounded shadow border border-slate-200 pointer-events-none"
          style={{
            top: mousePos.y,
            left: mousePos.x + 20,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="font-medium">
            {colorizedData[hoveredIndex].categoryName}
          </div>
          <div>{colorizedData[hoveredIndex].count} gigs</div>
        </div>
      )}

      <div className="mt-4 w-full">
        {colorizedData.map((slice, index) => (
          <div key={index} className="flex items-center text-sm mb-1">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: slice.color }}
            />
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

//DoughnutChart
const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.userCount, 0);
  let cumulativePercent = 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colorizedData = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        color: fallbackColors[index] || generateColor(index),
      })),
    [data]
  );

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox="-1 -1 2 2"
        className="rotate-[-90deg] w-full max-w-[240px] h-auto"
      >
        {colorizedData.map((slice, index) => {
          const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
          const slicePercent = slice.userCount / total;
          cumulativePercent += slicePercent;
          const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
          const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

          return (
            <path
              key={index}
              d={`M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
              fill={slice.color}
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseMove={(e) => {
                const bounds = (
                  e.target as SVGPathElement
                ).getBoundingClientRect();
                setMousePos({
                  x: e.clientX - bounds.left,
                  y: e.clientY - bounds.top,
                });
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}

        {/* Doughnut hole */}
        <circle cx="0" cy="0" r="0.5" fill="white" />
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-10 px-3 py-1 text-xs bg-gray-700 text-white rounded shadow border border-slate-200 pointer-events-none"
          style={{
            top: mousePos.y,
            left: mousePos.x + 20,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="font-medium">
            {colorizedData[hoveredIndex].planName}
          </div>
          <div>{colorizedData[hoveredIndex].userCount} users</div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 w-full">
        {colorizedData.map((slice, index) => (
          <div key={index} className="flex items-center text-sm mb-1">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-slate-700 font-medium">{slice.planName}</span>
            <span className="ml-auto text-slate-500">{slice.userCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// StatCard
const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  bgColor,
  textColor,
  value,
  percentage,
  percentageTextColor = "text-green-600",
  subtext,
  isCurrency = false,
  isDualStat = false,
  secondValue,
  secondLabel,
  secondTextColor = "text-green-600",
}) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
      </div>
    </CardHeader>
    <CardContent
      className={isDualStat ? "flex justify-between items-center" : ""}
    >
      {isDualStat ? (
        <>
          <div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <p className={`text-xs font-medium ${textColor}`}>{subtext}</p>
          </div>
          <div className="h-10 w-px bg-slate-200 mx-4" />
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {secondValue}
            </div>
            <p className={`text-xs font-medium ${secondTextColor}`}>
              {secondLabel}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold text-slate-800">
            {isCurrency ? `₹${(+value).toLocaleString()}` : value}
          </div>
          {percentage && (
            <p className={`text-xs font-medium mt-1 ${percentageTextColor}`}>
              +{percentage}% {subtext || "from last month"}
            </p>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

interface OutcomeData {
  [key: string]: number;
}

interface Props {
  data: OutcomeData;
  fallbackColors: string[];
}

const formatLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const ComplaintsOutcomeChart: React.FC<Props> = ({ data, fallbackColors }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return Object.entries(data).map(([key, value], index) => ({
      label: formatLabel(key),
      value,
      color: fallbackColors[index] || `hsl(${index * 72}, 70%, 60%)`,
    }));
  }, [data, fallbackColors]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const max = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {total === 0 ? (
        <div className="text-center text-gray-500 mt-4">
          No complaints found.
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="space-y-4">
            {chartData.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center relative">
                  <div className="w-32 text-sm font-medium text-gray-700">
                    {item.label}
                  </div>

                  <div
                    className="flex-1 h-6 bg-gray-200 rounded-md relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className="h-full rounded-md transition-all duration-300"
                      style={{
                        width: `${(item.value / max) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                    {hoveredIndex === index && (
                      <div
                        className="absolute top-[-35px] left-0 px-2 py-1 text-xs text-white bg-black rounded shadow"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.value} complaint{item.value !== 1 ? "s" : ""} (
                        {percentage}%)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend Section */}
          <div className="mt-6 border-t pt-4 space-y-2">
            {chartData.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-700">
                    {item.label}:
                  </span>
                  <span className="ml-1 text-gray-600">
                    {item.value} complaint{item.value !== 1 ? "s" : ""} (
                    {percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

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
            title="Complaints"
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

        {/* Charts Row */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
