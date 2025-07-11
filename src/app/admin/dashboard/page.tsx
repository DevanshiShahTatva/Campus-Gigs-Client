"use client";

import React from "react";
import { Users, DollarSign, UserX, Activity, ShieldCheck, BarChart3, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Types
interface ActivityLog {
  id: number;
  user: string;
  action: string;
  time: string;
  type: "signup" | "payment" | "block" | "login";
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  userActivity: number[];
  revenueData: number[];
  recentActivities: ActivityLog[];
  pendingComplaints: number;
  resolvedComplaints: number;
}

interface BarChartProps {
  data: number[];
  color?: string;
  height?: number;
}

const stats: Stats = {
  totalUsers: 1245,
  activeUsers: 845,
  blockedUsers: 45,
  totalRevenue: 45231.89,
  monthlyGrowth: 12.5,
  userActivity: [65, 59, 80, 81, 56, 55, 40],
  revenueData: [1200, 1900, 1500, 2500, 2100, 3200, 2800],
  pendingComplaints: 18,
  resolvedComplaints: 124,
  recentActivities: [
    {
      id: 1,
      user: "John Doe",
      action: "filed a complaint",
      time: "30 minutes ago",
      type: "signup",
    },
    {
      id: 2,
      user: "Acme Corp",
      action: "resolved complaint #1234",
      time: "2 hours ago",
      type: "payment",
    },
    {
      id: 3,
      user: "Admin",
      action: "blocked user: jane_doe",
      time: "3 hours ago",
      type: "block",
    },
    {
      id: 4,
      user: "Sarah Johnson",
      action: "logged in",
      time: "5 hours ago",
      type: "login",
    },
  ],
};

const BarChart: React.FC<BarChartProps> = ({ data, color = "bg-blue-500", height = 100 }) => {
  const maxValue = Math.max(...data);

  return (
    <div className="flex items-end h-full gap-2" style={{ height: `${height}px` }}>
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

const getActivityIcon = (type: string) => {
  switch (type) {
    case "signup":
      return <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />;
    case "payment":
      return <div className="h-3 w-3 rounded-full bg-blue-500" />;
    case "block":
      return <div className="h-3 w-3 rounded-full bg-red-500" />;
    default:
      return <div className="h-3 w-3 rounded-full bg-gray-400" />;
  }
};

const AdminDashboard: React.FC = () => {

  return (
    <div className="flex items-center justify-center text-xl mt-10 h-[85vh]">In progress</div>
  );
  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-300 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 font-medium mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">Blocked Users</CardTitle>
              <div className="p-2 rounded-lg bg-red-50">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats.blockedUsers}</div>
            <p className="text-xs text-slate-500 mt-1">2% of total users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">Complaints</CardTitle>
              <div className="p-2 rounded-lg bg-amber-50">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.pendingComplaints}</div>
              <p className="text-xs text-amber-600 font-medium">Pending</p>
            </div>
            <div className="h-10 w-px bg-slate-200 mx-4"></div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.resolvedComplaints}</div>
              <p className="text-xs text-green-600">Resolved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 font-medium mt-1">+8.2% from last month</p>
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
                <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart data={stats.revenueData} color="bg-gradient-to-b from-green-400 to-green-600" height={220} />
              <div className="flex justify-between text-xs text-slate-500 mt-4 px-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <span key={i} className="font-medium">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
                <CardDescription>Latest admin actions</CardDescription>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All</button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {stats.recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group border border-transparent hover:border-slate-200"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800 truncate">{activity.user}</p>
                      <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">{activity.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{activity.action}</p>
                  </div>
                </div>
              ))}
            </div>
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
