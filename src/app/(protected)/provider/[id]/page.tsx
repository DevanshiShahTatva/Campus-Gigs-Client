"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaStar, FaCertificate, FaTag, FaLayerGroup, FaDollarSign, FaCrown } from "react-icons/fa";
import { useGetProviderPublicProfileQuery } from "@/redux/api";
import { useParams } from "next/navigation";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { getAvatarName } from "@/utils/helper";

// Mock completed gigs data
const completedGigs = [
  {
    id: 1,
    title: "Advanced Algorithms Tutoring",
    description: "Expert help with advanced algorithms and data structures.",
    tier: "Tier 3",
    price: "$45/hour",
    rating: 5,
    review: "Sarah was amazing! Helped me ace my exam.",
    keywords: ["algorithms", "data structures", "exam prep"],
    skills: ["Python", "C++", "Problem Solving"],
    certifications: ["Google Certified Educator"],
  },
  {
    id: 2,
    title: "Resume Review & Optimization",
    description: "Professional resume review with optimization tips.",
    tier: "Tier 2",
    price: "$30",
    rating: 4,
    review: "Great feedback and quick turnaround!",
    keywords: ["resume", "career", "review"],
    skills: ["Editing", "Career Coaching"],
    certifications: ["Certified Career Coach"],
  },
  {
    id: 3,
    title: "Campus Food Delivery",
    description: "Quick and reliable food delivery across campus.",
    tier: "Tier 1",
    price: "$8",
    rating: 4,
    review: "Fast and friendly service!",
    keywords: ["delivery", "food", "campus"],
    skills: ["Time Management"],
    certifications: [],
  },
];

const ProviderPortfolioPage = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const { data, isLoading, error } = useGetProviderPublicProfileQuery(id, { skip: !id, refetchOnMountOrArgChange: true });
  const provider = data?.data;
  // Dummy data for missing fields
  const dummyCoverImage = "/assets/hero.jpg";
  const dummyProfileImage = "/profile1.jpg";
  const dummyTiers = [
    {
      name: "Basic",
      price: 99,
      description: "Basic website with up to 3 pages.",
      features: ["Responsive Design", "Contact Form", "SEO Setup"],
    },
    {
      name: "Standard",
      price: 199,
      description: "Standard website with up to 7 pages and blog.",
      features: ["Everything in Basic", "Blog Integration", "Custom Animations"],
    },
    {
      name: "Premium",
      price: 399,
      description: "Premium website with unlimited pages and e-commerce.",
      features: ["Everything in Standard", "E-commerce", "Priority Support"],
    },
  ];
  const dummyPortfolio = [
    {
      title: "E-commerce Store",
      image: "/profile2.jpg",
      description: "A modern e-commerce platform.",
    },
    {
      title: "Portfolio Site",
      image: "/profile3.jpg",
      description: "Personal branding website.",
    },
    {
      title: "Blog Platform",
      image: "/profile1.jpg",
      description: "A scalable blog solution.",
    },
  ];
  const dummyReviews = [
    { name: "Alice", rating: 5, comment: "Great work! Highly recommended." },
    { name: "Bob", rating: 4, comment: "Very professional and timely." },
    { name: "Charlie", rating: 5, comment: "Exceeded expectations!" },
  ];
  const dummyLocation = "Unknown";
  const dummyRating = 4.5;
  const dummyReviewsCount = 10;

  // Helper for initials
  const getInitials = (name: string | undefined) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
  const initials = getInitials(provider?.name);

  if (isLoading) {
    return <ProfileSkeleton />;
  }
  if (error || !provider) {
    return <div className="flex justify-center items-center min-h-[40vh] text-red-500">Failed to load provider profile.</div>;
  }  
  return (
    <div className="">
      <div className="">
        {/* Profile Header */}
        <div className="mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            {provider?.coverImage ? (
              <img src={provider.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: "linear-gradient(90deg, var(--base), var(--base-hover) 100%)",
                }}
              ></div>
            )}
            <div className="absolute left-8 -bottom-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100 transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-2xl flex items-center justify-center bg-gray-100">
              {provider?.profileImage ? (
                <img src={provider.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-[var(--base)]">{initials}</span>
              )}
            </div>
          </div>
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{provider?.name}</h2>
                  <Badge className="bg-[var(--base)]/10 text-[var(--base)] font-semibold px-4 py-1 text-sm rounded-full border border-[var(--base)]/30 shadow-sm tracking-wide flex items-center gap-1">
                    <FaCrown className="text-[var(--base)] text-base mb-0.5" />
                    Most Rated
                  </Badge>
                </div>
                {/* More provider details for appeal */}
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span className="bg-gray-100 rounded px-2 py-1 font-medium">Top Skill: React.js</span>
                  <span className="bg-gray-100 rounded px-2 py-1 font-medium">Completed Projects: 120+</span>
                  <span className="bg-gray-100 rounded px-2 py-1 font-medium">Avg. Response: 1hr</span>
                  <span className="bg-gray-100 rounded px-2 py-1 font-medium">Verified</span>
                </div>
                <div className="text-gray-600 mt-1">
                  {provider?.headline || provider?.title || "No headline"} • {provider?.location || dummyLocation}
                </div>
                <div className="text-base text-gray-700 mt-2 max-w-2xl">{provider?.bio || "No bio available."}</div>
              </div>
              {/* Rating Card */}
              <div className="mt-6 sm:mt-0 flex flex-col items-center bg-[var(--base)]/10 rounded-xl px-8 py-4 min-w-[160px] shadow border border-[var(--base)]/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-[var(--base)]">{provider?.rating || dummyRating}</span>
                  <FaStar className="text-yellow-400 text-2xl" />
                </div>
                <div className="text-gray-700 text-sm font-medium">Provider Rating</div>
                <div className="text-gray-500 text-xs">{provider?.reviewsCount || dummyReviewsCount} reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mx-auto mt-12">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(provider?.portfolio || dummyPortfolio).map((item: any, idx: any) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-[var(--base)]/10"
              >
                <img src={item.image} alt={item.title} className="rounded-lg h-48 w-full object-cover mb-2" />
                <div className="font-semibold text-gray-800 mb-1">{item.title}</div>
                <div className="text-gray-500 text-sm mb-2">{item.description}</div>
                {/* Mock extra info */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                  <span className="bg-[var(--base)]/10 text-[var(--base)] px-2 py-0.5 rounded">Web App</span>
                  <span className="bg-[var(--base)]/10 text-[var(--base)] px-2 py-0.5 rounded">React.js</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">2024</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        {provider.gigs_provider.length > 0 && <div className="max-w-8xl mx-auto mt-12 mb-10">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Ratings & Reviews</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(provider?.gigs_provider.slice(0, 3)).map((review: any, idx: number) => (
              <div
                key={idx}
                className="border border-[var(--base)]/10 bg-[var(--light-bg)] text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 flex flex-col items-center text-center space-y-2"
              >
                {/* Profile Picture */}
                {review?.user?.profile ? (
                  <img
                    src={review?.user?.profile}
                    alt={review?.user?.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="flex justify-center items-center relative bg-[var(--base)] w-14 h-14 rounded-full">
                    <div className="text-lg">
                      {getAvatarName(review?.rating?.user?.name, true)}
                    </div>
                  </div>
                )}

                {/* Reviewer Name */}
                <div className="text-[var(--text-dark)] font-semibold">
                  {review?.rating?.user?.name}
                </div>

                {/* Stars */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review?.rating?.rating ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.285 3.943a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.285 3.943c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.785.57-1.84-.197-1.54-1.118l1.285-3.943a1 1 0 00-.364-1.118L2.326 9.37c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.285-3.943z" />
                    </svg>
                  ))}
                </div>

                {/* Feedback Text */}
                <p
                  className="text-sm italic text-[var(--text-dark)] max-h-[72px] overflow-hidden text-ellipsis line-clamp-3"
                  title={review?.rating?.rating_feedback} // show full text on hover
                >
                  "{review?.rating?.rating_feedback}"
                </p>
              </div>
            ))}
          </div>
        </div>}

        {/* Completed Gigs Section */}
        <div className="max-w-8xl mx-auto mt-12 mb-16">
          <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">Completed Gigs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {provider?.gigs_provider?.slice(0,3)?.map((gig:any, id:any) => (
              <div
                key={id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-[var(--base)]/10 relative"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[var(--base)] text-white font-semibold px-3 py-1 text-xs border-0">{gig?.gig_category?.name}</Badge>
                  <span className="flex-1 text-right text-[var(--base)] font-semibold">${gig?.price}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{gig?.title}</h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{gig?.description}</p>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center gap-1 text-yellow-500 font-bold">
                    <FaStar /> {gig?.rating?.rating}
                  </span>
                </div>
                <div className="italic text-gray-500 text-xs mb-2 overflow-hidden text-ellipsis line-clamp-2">"{gig?.rating?.rating_feedback}"</div>
                <div >
                  <div className="mb-4">
                    <div className="text-xs mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {gig?.skills?.map((skill: any, i: any) => (
                        <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                          {skill?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {gig?.certifications?.length > 0 && <div>
                    <div className="text-xs mb-2">Certificates</div>
                    <div className="flex flex-wrap gap-2">
                      {gig?.certifications?.map((cert: string, i: number) => (
                        <span key={i} className="bg-[var(--base)]/10 text-[var(--base)] px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPortfolioPage;
