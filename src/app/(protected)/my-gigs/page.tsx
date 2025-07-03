"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, DollarSign, Calendar, User, MapPin } from "lucide-react";
import Link from "next/link";

const Gigs = () => {
  const [activeTab, setActiveTab] = useState("open");

  const tabs = [
    { id: "open", label: "Open Gigs" },
    { id: "progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  const renderGigCard = (gig: any, type: string) => (
    <Card
      key={gig.id}
      className="hover:shadow-lg transition-shadow border-l-4 border-l-[var(--base)]"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900 mb-2">
              {gig.title}
            </CardTitle>
            <CardDescription className="text-gray-600 mb-3">
              {gig.description}
            </CardDescription>
          </div>
          {type === "open" && (
            <div className="flex gap-2 ml-4">
              <Button
                size="icon"
                variant="outline"
                className="text-teal-600 border-teal-600 hover:bg-teal-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {gig.skills.map((skill: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-teal-50 text-teal-700 border-teal-200"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4 text-teal-600" />
            <span className="font-medium">{gig.budget}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-teal-600" />
            <span>
              {type === "completed"
                ? gig.completedDate
                : type === "progress"
                ? `Due ${gig.deadline}`
                : gig.deadline}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4 text-teal-600" />
            <span>{gig.client}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span>{gig.location}</span>
          </div>
        </div>

        {type === "progress" && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-teal-600">{gig.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${gig.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {type === "completed" && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                Completed Successfully
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-green-800">
                  ★ {gig.rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-green-700 italic">"{gig.feedback}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const getCurrentGigs = () => {
    switch (activeTab) {
      case "open":
        return [];
      case "progress":
        return [];
      case "completed":
        return [];
      default:
        return [];
    }
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-6">
        {getCurrentGigs().map((gig) => renderGigCard(gig, activeTab))}
      </div>

      {getCurrentGigs().length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No gigs found
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any {activeTab} gigs at the moment.
          </p>
        </div>
      )}
    </>
  );
};

export default Gigs;
