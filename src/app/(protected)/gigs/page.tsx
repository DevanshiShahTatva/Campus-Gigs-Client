"use client";

import Link from "next/link";
import Slider from "react-slick";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, Clock, DollarSign, Star, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import GigFilterModal from "./filterModel";
import CommonFormModal from "@/components/common/form/CommonFormModal";
import GigListingSkeleton from "@/components/skeleton/gigListingSkeleton";
import { gigBidFields } from "@/config/gigbid.config";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const gigList = [
  {
    id: 1,
    title: "Tech Innovation Summit 2025",
    date: "Delivered by 30 June",
    category: "Technology",
    biderCount: 10,
    description: "Join industry leaders for insights into AI, blockchain, and the future of technology. Network with innovators and discover cutting-edge solutions.",
    image: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=240&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=240&fit=crop&auto=format",
    ],
    tags: ["AI", "Blockchain", "Networking"]
  },
  {
    id: 2,
    title: "Creative Arts & Design Workshop",
    organizer: {
      name: "Design Studio Pro",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format",
      rating: 4.7,
      verified: true
    },
    price: "₹1,200",
    originalPrice: null,
    date: "March 20, 2025 • 2:00 PM",
    location: "Rajkot, Gujarat",
    category: "Arts & Design",
    attendees: 85,
    capacity: 120,
    description: "Learn modern design techniques, color theory, and digital art fundamentals from professional designers and artists.",
    image: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop&auto=format"
    ],
    featured: false,
    tags: ["Design", "Digital Art", "Workshop"],
    duration: "4 hours"
  },
  {
    id: 3,
    title: "Startup Pitch Competition",
    organizer: {
      name: "Entrepreneur Hub",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format",
      rating: 4.8,
      verified: true
    },
    price: "Free",
    originalPrice: null,
    date: "March 25, 2025",
    time: "6:00 PM",
    location: "Online Event",
    category: "Business",
    attendees: 230,
    capacity: 300,
    description: "Watch innovative startups pitch their ideas to investors. Network with entrepreneurs and learn about the latest business trends.",
    image: ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=240&fit=crop&auto=format"],
    featured: true,
    tags: ["Startup", "Pitch", "Investment"],
    duration: "3 hours"
  },
  {
    id: 4,
    title: "Photography Masterclass",
    organizer: {
      name: "Photo Academy",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format",
      rating: 4.9,
      verified: true
    },
    price: "₹1,800",
    originalPrice: "₹2,200",
    date: "March 30, 2025",
    time: "9:00 AM",
    location: "Vadodara, Gujarat",
    category: "Photography",
    attendees: 65,
    capacity: 80,
    description: "Master portrait and landscape photography with professional techniques, lighting, and post-processing skills.",
    image: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=240&fit=crop&auto=format"],
    featured: false,
    tags: ["Photography", "Portrait", "Landscape"],
    duration: "6 hours"
  },
  {
    id: 5,
    title: "Digital Marketing Bootcamp",
    organizer: {
      name: "Marketing Masters",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format",
      rating: 4.6,
      verified: false
    },
    price: "₹3,200",
    originalPrice: null,
    date: "April 5, 2025",
    time: "11:00 AM",
    location: "Surat, Gujarat",
    category: "Marketing",
    attendees: 120,
    capacity: 150,
    description: "Comprehensive training on SEO, social media marketing, Google Ads, and analytics to boost your digital presence.",
    image: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop&auto=format"],
    featured: false,
    tags: ["SEO", "Social Media", "Google Ads"],
    duration: "2 days"
  },
  {
    id: 6,
    title: "Cooking & Culinary Arts Festival",
    organizer: {
      name: "Culinary Institute",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face&auto=format",
      rating: 4.8,
      verified: true
    },
    price: "₹800",
    originalPrice: "₹1,000",
    date: "April 10, 2025",
    time: "4:00 PM",
    location: "Gandhinagar, Gujarat",
    category: "Food & Culinary",
    attendees: 180,
    capacity: 200,
    description: "Learn from master chefs, taste exotic cuisines, and participate in cooking competitions with food enthusiasts.",
    image: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop&auto=format"],
    featured: true,
    tags: ["Cooking", "Festival", "Competition"],
    duration: "5 hours"
  }
];

const GigListing = () => {
  const [gigs, setGigs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      // const response = await fetch("/api/gigs");
      // const data = await response.json();
      setGigs(gigList);
    }
    fetchGigs();
  }, []);

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
  }

  const handleSubmitBid = (data: any) => {
    console.log(data);
  };

  if (!gigs.length) {
    return <GigListingSkeleton />;
  }

  const projectCardUI = (gig: any) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">$100-200</div>
              <div className="text-sm text-gray-500">Fixed</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">1 week</div>
              <div className="text-sm text-gray-500">Timeline</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">12 bids</div>
              <div className="text-sm text-gray-500">Received</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {gig.tags.slice(0, 3).map((tag: string, i: number) => (
            <span key={`${i + 1}`} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
              alt="Mike Chen"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900">Mike Chen</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.6</span>
                <span>•</span>
                <span>5 hours ago</span>
              </div>
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="px-4 py-4 rounded-sm"
          >
            Place Bid
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Browse Gigs</h1>
              <p className="text-gray-600">Discover amazing gigs and opportunities</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 bg-white">
            <div className="relative flex-1 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, location, or category..."
                className="pl-12 h-12 text-base bg-white border-gray-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="lg"
                onClick={() => setIsFilterOpen(true)}
                className="px-6 h-12"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filter
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <Link key={gig.id} href={`/gigs/${gig.id}`} className="group">
              <Card className="gap-0 py-0 relative overflow-hidden bg-white border-0 shadow-lg h-full flex flex-col hover:shadow-purple-500/10">
                <div className="relative overflow-hidden">
                  <div className="slider">
                    <Slider
                      slidesToShow={1}
                      dots={gig.image.length > 1}
                      infinite={gig.image.length > 1}
                      customPaging={() => (
                        <div className="w-[7px] h-[7px] bg-gray-400 rounded-full transition" />
                      )}
                    >
                      {gig.image.map((image: string, i: number) => (
                        <img
                          key={`${i + 1}`}
                          src={image}
                          alt={gig.title}
                          className="w-full h-full object-cover"
                        />
                      ))}
                    </Slider>
                  </div>
                  <CardContent className="content"></CardContent>
                  <div className="w-fit absolute bottom-4 left-4 right-4">
                    <Badge className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg font-medium`}>
                      {gig.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[var(--base)] transition-colors line-clamp-2 leading-tight">
                      {gig.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {gig.description}
                    </p>
                  </div>
                  {projectCardUI(gig)}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <GigFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
        <CommonFormModal
          width="600px"
          title="Bid Submission"
          submitLabel="Submit Bid"
          open={isModalOpen}
          setOpen={setIsModalOpen}
          fields={gigBidFields}
          onSubmit={handleSubmitBid}
        />
      </div>
    </div>
  );
};

export default GigListing;