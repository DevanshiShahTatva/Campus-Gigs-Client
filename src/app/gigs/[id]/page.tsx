"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import { ArrowLeftIcon, CalendarIcon, CheckCircle, ClockIcon, MessageCircle, TagIcon, Star } from "lucide-react";
import { gigBidFields } from "@/config/gigbid.config";

const mockGigRequest = {
  id: 1,
  title: "Need help with calculus homework - derivatives and integrals",
  images: [
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&h=300&fit=crop&crop=entropy&auto=format"
  ],
  budget: "$50-80",
  budgetType: "Fixed Price",
  date: "Monday, June 30, 2025 - Tuesday, July 1, 2025",
  category: "Education",
  subcategory: "Mathematics",
  skills: ["Calculus", "Mathematics", "Tutoring", "Problem Solving"],
  postedAgo: "2 hours ago",
  expires: "5 days",
  description: `I'm a college student struggling with my calculus assignment and need help understanding derivatives and integrals. The assignment is due in 2 days and I really need someone who can explain the concepts clearly and help me solve the problems.

**What I need help with:**
• Understanding the fundamental concepts of derivatives
• Learning integration techniques  
• Solving 10 practice problems with step-by-step explanations
• A brief tutoring session to clarify any doubts

**Requirements:**
• Strong background in calculus and mathematics
• Ability to explain concepts in simple terms
• Available for a 1-2 hour tutoring session via video call
• Provide detailed solutions with explanations

**Timeline:**
Assignment due in 2 days, so I need this completed within 48 hours. Flexible on timing but prefer someone who can start soon.

**What I'll provide:**
• Assignment questions and materials
• Access to my textbook (digital copy)
• Flexibility with scheduling the tutoring session

**Budget:**
Willing to pay $50-80 depending on the quality of explanations and tutoring provided.`,
  requirements: [
    "Bachelor's degree in Mathematics or related field",
    "Previous tutoring experience preferred",
    "Available for video call sessions",
    "Fluent in English"
  ],
  bids: [
    {
      id: 1,
      provider: {
        name: "Dr. Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
        rating: 4.9,
        reviews: 156,
        expertise: "Mathematics PhD, 8 years tutoring experience",
        responseTime: "within 2 hours",
      },
      amount: 65,
      timeframe: "24 hours",
      proposal: "I have a PhD in Mathematics and 8+ years of tutoring experience. I specialize in calculus and have helped over 100 students master derivatives and integrals. I can provide step-by-step explanations, create visual aids, and offer a comprehensive 90-minute tutoring session via Zoom. I'm available to start immediately and can complete this within 24 hours.",
      postedAgo: "1 hour ago",
    },
    {
      id: 2,
      provider: {
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
        rating: 4.7,
        reviews: 89,
        expertise: "Math tutor specializing in calculus",
        verified: true,
        responseTime: "within 4 hours",
        completionRate: 94
      },
      amount: 55,
      timeframe: "36 hours",
      proposal: "I specialize in calculus tutoring and have helped many students master derivatives and integrals. I use interactive methods and provide detailed written explanations along with practice problems. I can offer flexible scheduling and will provide all solutions with step-by-step breakdowns.",
      postedAgo: "30 minutes ago"
    },
    {
      id: 3,
      provider: {
        name: "Alex Kim",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format",
        rating: 4.8,
        reviews: 67,
        expertise: "Engineering student with strong math background",
        verified: false,
        responseTime: "within 1 hour",
        completionRate: 92
      },
      amount: 45,
      timeframe: "48 hours",
      proposal: "As an engineering student, I use calculus daily and have tutored many peers. I can break down complex concepts into easy-to-understand steps and provide practical examples. I'm very responsive and can start working on this immediately.",
      postedAgo: "45 minutes ago"
    }
  ]
};

const GigDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [gitDetails, setGitDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Description");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const getGitDetails = async () => {
      // const response = await fetch(`/api/gigs/${id}`);
      // const data = await response.json();
      setGitDetails(mockGigRequest);
    };
    getGitDetails();
  }, [id]);

  const handleAcceptBid = (bid: any) => {

  };

  const handleSubmitBid = (data: any) => {
    console.log(data);
  };

  if (!gitDetails) {
    return <div className="fle justify-center items-center h-[500px]">Loading...</div>;
  }

  return (
    <div className="mt-[64px] min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {gitDetails.title}
          </h1>
        </div>
      </div>
      <main className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="h-full bg-white shadow rounded-lg overflow-hidden">
              <div className='min-h-[380px]'>
                {/* <ImageCarousel images={event.images} /> */}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 min-h-[380px]">
            <div className="bg-white shadow rounded-lg p-6 h-full flex flex-col justify-between min-h-[380px]">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {gitDetails.title}
                </h2>
                <div className="space-y-3 pb-4">
                  <div className="flex items-top text-gray-600">
                    <CalendarIcon className="mt-1 h-5 w-5 mr-2 text-gray-400" />
                    <span>
                      {gitDetails.date}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="mt-1 h-5 w-5 mr-2 text-gray-400" />
                    <span>
                      Duration - ({gitDetails.expires})
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TagIcon className="mt-1 h-5 w-5 mr-2 text-gray-400" />
                    <div>
                      {gitDetails.category}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gitDetails.skills.map((tag: string, i: number) => (
                      <span key={`${i + 1}`} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white pt-4 border-t-2 border-gray-200">
                <div className="flex flex-col">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{gitDetails.budget}</div>
                    <div className="text-sm text-gray-500">in {gitDetails.budgetType}</div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className='w-31 px-4 py-6 text-md rounded-lg font-semibold'
                >
                  Submit Bid
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-10 p-6 shadow-lg rounded-lg bg-white'>
          <div className="bg-white w-full border-b border-gray-300">
            <div className="relative space-x-4 flex w-full md:w-auto">
              {["Description", "Requirements", "Bids"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 px-2 text-sm md:text-base font-medium transition-all duration-200 cursor-pointer ${activeTab === tab
                    ? "text-[var(--base)] after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--base)]"
                    : "text-gray-600 hover:text-[var(--base)]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {activeTab === "Description" && (
            <div>
              <div className="pt-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {mockGigRequest.description}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Requirements" && (
            <div>
              <div className="pt-6">
                <div className="space-y-3">
                  {mockGigRequest.requirements.map((req, i) => (
                    <div key={`${i + 1}`} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "Bids" && (
            <div className="flex flex-col gap-5 mt-3">
              {mockGigRequest.bids.map((bid) => (
                <Card key={bid.id} className="gap-0 py-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {bid.provider.avatar ? (
                          <img
                            alt="not found"
                            src={bid.provider.avatar}
                            className="w-15 h-15 rounded-full"
                          />
                        ) : (
                          <div className="w-15 h-15 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-3xl">
                            {bid.provider.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{bid.provider.name} •</h4>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{bid.provider.rating}</span>
                                <span>({bid.provider.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{bid.provider.expertise}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${bid.amount}</div>
                        <div className="text-sm text-gray-500">in {bid.timeframe}</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 leading-relaxed">{bid.proposal}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Bid placed {bid.postedAgo}</span>
                      <div className="flex gap-2 ">
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-400 hover:bg-red-700"
                        >
                          Reject Bid
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptBid(bid)}
                          className="bg-green-400 hover:bg-green-700"
                        >
                          Accept Bid
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <CommonFormModal
          width="600px"
          title="Bid Submission"
          submitLabel="Submit Bid"
          open={isModalOpen}
          setOpen={setIsModalOpen}
          fields={gigBidFields}
          onSubmit={handleSubmitBid}
        />
      </main>
    </div>
  );
};

export default GigDetail;