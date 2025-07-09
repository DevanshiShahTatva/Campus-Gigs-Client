"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, Users, CreditCard, TrendingUp, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserProfileQuery } from '@/redux/api';

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    trend: "up",
  },
  {
    title: "Total Gigs",
    value: "2,345",
    description: "+180.1% from last month",
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    trend: "up",
  },
  {
    title: "Total Bids",
    value: "1,856",
    description: "+32.5% from last month",
    icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    trend: "up",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "New Gig created",
    description: "Gig 'Marketing Campaign' was created",
    time: "2 minutes ago",
    icon: <Clock className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 2,
    title: "Payment received",
    description: "$2,500.00 from Acme Inc.",
    time: "1 hour ago",
    icon: <CreditCard className="h-4 w-4 text-green-500" />,
  },
  {
    id: 3,
    title: "New Bid received",
    description: "Bid 'Marketing Campaign' was received",
    time: "1 hour ago",
    icon: <Users className="h-4 w-4 text-yellow-500" />,
  },
  {
    id: 4,
    title: "New Review received",
    description: "Bid 'Marketing Campaign' was received",
    time: "1 hour ago",
    icon: <Users className="h-4 w-4 text-yellow-500" />,
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Team meeting",
    time: "10:00 AM",
    date: "Tomorrow",
    priority: "high",
  },
  {
    id: 2,
    title: "Project deadline",
    time: "11:30 AM",
    date: "Jul 5",
    priority: "medium",
  },
  {
    id: 3,
    title: "Client call",
    time: "2:00 PM",
    date: "Jul 6",
    priority: "low",
  },
];

export default function Dashboard() {
  useGetUserProfileQuery(undefined, { refetchOnMountOrArgChange: true });

  return (
    <div className="flex items-center justify-center text-xl mt-30">In progress</div>
  );

  return (
    <div className="space-y-6 max-w-8xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your account today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />
                )}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4 border border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>You have {recentActivities.length} new activities today.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">{activity.icon}</div>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="col-span-3 border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your schedule for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.time} • {task.date}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
