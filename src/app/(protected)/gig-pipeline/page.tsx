"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
import GigCard from "./GigPipelineCard";
// import type { Gig } from "@/types/gig";

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly';
  deadline: string;
  location?: string;
  client: string;
  clientRating?: number;
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'rejected';
  priority?: 'high' | 'medium' | 'low';
  rating?: number;
  review?: string;
  completedDate?: string;
  bidAmount?: number;
  bidDate?: string;
  acceptedDate?: string;
  startedDate?: string;
}

const GigPipeline = () => {
//   const { toast } = useToast();
  
  const [gigs, setGigs] = useState<Gig[]>([
    {
      id: "1",
      title: "Laundry work",
      description: "A laundry worker, also known as a laundry attendant, is someone who washes, dries, folds, and irons laundry items like clothes, linens, and towels.",
      category: "Household",
      price: 50.00,
      priceType: "fixed",
      deadline: "01/08/2025",
      client: "John Smith",
      clientRating: 4.5,
      status: "requested",
      bidAmount: 45.00,
      bidDate: "25/07/2025"
    },
    {
      id: "2",
      title: "Learning Maths Tutoring",
      description: "Mathematics tutoring for high school student. Need help with algebra and geometry concepts.",
      category: "Education",
      price: 25.00,
      priceType: "hourly",
      deadline: "1 Week Timeline",
      client: "Sarah Johnson",
      clientRating: 4.8,
      status: "requested",
      bidAmount: 20.00,
      bidDate: "26/07/2025"
    },
    {
      id: "3",
      title: "Web Development Project",
      description: "Build a responsive e-commerce website with React and Node.js backend.",
      category: "Tech",
      price: 120.00,
      priceType: "fixed",
      deadline: "15/08/2025",
      client: "Tech Startup Inc",
      clientRating: 4.2,
      status: "accepted",
      bidAmount: 115.00,
      acceptedDate: "28/07/2025"
    },
    {
      id: "4",
      title: "Mobile App UI Design",
      description: "Design modern and intuitive UI for a fitness tracking mobile application.",
      category: "Design",
      price: 80.00,
      priceType: "fixed",
      deadline: "10/08/2025",
      client: "FitLife App",
      clientRating: 4.6,
      status: "in-progress",
      priority: "high",
      bidAmount: 75.00,
      startedDate: "30/07/2025"
    },
    {
      id: "5",
      title: "Data Analysis Report",
      description: "Analyze sales data and create comprehensive report with insights and recommendations.",
      category: "Data Science",
      price: 200.00,
      priceType: "fixed",
      deadline: "Completed",
      client: "Business Analytics Co",
      clientRating: 4.9,
      status: "completed",
      rating: 5,
      review: "Excellent work! The analysis was thorough and the insights were very valuable for our business decisions.",
      completedDate: "25/07/2025",
      bidAmount: 190.00
    },
    {
      id: "6",
      title: "Logo Design",
      description: "Create a modern logo for a new tech company with brand guidelines.",
      category: "Design",
      price: 75.00,
      priceType: "fixed",
      deadline: "Completed",
      client: "InnovateTech",
      clientRating: 4.3,
      status: "completed",
      rating: 4,
      review: "Good work, delivered on time. Would recommend for future projects.",
      completedDate: "20/07/2025",
      bidAmount: 70.00
    },
    {
      id: "7",
      title: "Content Writing",
      description: "Write SEO-optimized blog posts for digital marketing website.",
      category: "Writing",
      price: 15.00,
      priceType: "hourly",
      deadline: "Rejected",
      client: "Marketing Pro",
      status: "rejected",
      bidAmount: 12.00,
      bidDate: "22/07/2025"
    }
  ]);

  const handleStartGig = (gigId: string) => {
  };

  const handleCompleteGig = (gigId: string) => {
  };

  const handlePriorityChange = (gigId: string, priority: 'high' | 'medium' | 'low') => {
  };

  const getGigsByStatus = (status: string) => {
    return gigs.filter(gig => gig.status === status);
  };

  const getStatusCount = (status: string) => {
    return getGigsByStatus(status).length;
  };

  const tabs = [
    { id: "requested", label: "Pending", count: getStatusCount("requested") },
    { id: "accepted", label: "Accepted", count: getStatusCount("accepted") },
    { id: "in-progress", label: "Active", count: getStatusCount("in-progress") },
    { id: "completed", label: "Completed", count: getStatusCount("completed") },
    { id: "rejected", label: "Rejected", count: getStatusCount("rejected") },
  ];

  const [activeTab, setActiveTab] = useState("requested");

  const getTabContent = () => {
    switch (activeTab) {
      case "requested":
        return getGigsByStatus("requested");
      case "accepted":
        return getGigsByStatus("accepted");
      case "in-progress":
        return getGigsByStatus("in-progress");
      case "completed":
        return getGigsByStatus("completed");
      case "rejected":
        return getGigsByStatus("rejected");
      default:
        return [];
    }
  };

  const getTabHeadingColor = () => {
    switch (activeTab) {
      case "requested":
        return "bg-blue-500";
      case "accepted":
        return "bg-teal-500";
      case "in-progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "requested": return "Pending Approval";
      case "accepted": return "Ready to Start";
      case "in-progress": return "Active Work";
      case "completed": return "Completed Work";
      case "rejected": return "Not Selected";
      default: return "";
    }
  };

  const getTabDescription = () => {
    const count = getStatusCount(activeTab);
    switch (activeTab) {
      case "requested": 
        return `${count} gigs waiting for client approval`;
      case "accepted": 
        return `${count} gigs ready to begin`;
      case "in-progress": 
        return `${count} gigs currently in progress`;
      case "completed": 
        return `${count} successfully completed gigs`;
      case "rejected": 
        return `${count} gigs where client chose another provider`;
      default: return "";
    }
  };

  const getEmptyState = () => {
    let icon = "📋";
    let title = "No gigs found";
    let description = `You don't have any ${activeTab.replace("-", " ")} gigs at the moment.`;

    switch (activeTab) {
      case "requested":
        icon = "📋";
        title = "No pending gigs";
        description = "Gigs you've bid on will appear here";
        break;
      case "accepted":
        icon = "🚀";
        title = "No accepted gigs";
        description = "Accepted gigs will appear here";
        break;
      case "in-progress":
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gig Pipeline</h1>
        <p className="text-gray-600 text-lg">Track and manage all your bidded gigs in one place</p>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {/* Tab Content */}
      <div className="mt-6">
        <div className={`px-4 py-2 rounded-lg mb-6 ${getTabHeadingColor()}`}>
          <h3 className="text-xl font-semibold text-white">{getTabTitle()}</h3>
          <p className="text-white">{getTabDescription()}</p>
        </div>

        {getTabContent().length === 0 ? (
          getEmptyState()
        ) : (
          <div className="space-y-6">
            {getTabContent().map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onStartGig={activeTab === "accepted" ? handleStartGig : undefined}
                onPriorityChange={activeTab === "in-progress" ? handlePriorityChange : undefined}
                onCompleteGig={activeTab === "in-progress" ? handleCompleteGig : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigPipeline;