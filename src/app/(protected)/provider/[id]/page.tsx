"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaStar, FaCertificate, FaTag, FaLayerGroup, FaDollarSign, FaCrown } from "react-icons/fa";

// Mock data for demonstration
const provider = {
  id: "1",
  name: "Jane Doe",
  title: "Full Stack Developer",
  location: "San Francisco, CA",
  bio: "Experienced developer with a passion for building scalable web applications and beautiful user experiences.",
  coverImage: "/assets/hero.jpg",
  profileImage: "/profile1.jpg",
  rating: 4.8,
  reviewsCount: 32,
  tiers: [
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
  ],
  portfolio: [
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
  ],
  reviews: [
    { name: "Alice", rating: 5, comment: "Great work! Highly recommended." },
    { name: "Bob", rating: 4, comment: "Very professional and timely." },
    { name: "Charlie", rating: 5, comment: "Exceeded expectations!" },
  ],
};

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
  return (
    <div className="">
      <div className="">
        {/* Profile Header */}
        <div className="mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            {!provider.coverImage ? (
              <img src={provider.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: "linear-gradient(90deg, var(--base), var(--base-hover) 100%)",
                }}
              />
            )}
            <div className="absolute left-8 -bottom-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100 transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-2xl">
              <img src={provider.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
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
                  {provider.title} • {provider.location}
                </div>
                <div className="text-base text-gray-700 mt-2 max-w-2xl">{provider.bio}</div>
              </div>
              {/* Rating Card */}
              <div className="mt-6 sm:mt-0 flex flex-col items-center bg-[var(--base)]/10 rounded-xl px-8 py-4 min-w-[160px] shadow border border-[var(--base)]/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-[var(--base)]">{provider.rating}</span>
                  <FaStar className="text-yellow-400 text-2xl" />
                </div>
                <div className="text-gray-700 text-sm font-medium">Provider Rating</div>
                <div className="text-gray-500 text-xs">{provider.reviewsCount} reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tiers Section */}
        <div className="mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {provider.tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-white rounded-xl shadow p-6 flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-[var(--base)]/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-[var(--base)] text-white font-semibold px-3 py-1 text-xs border-0">{tier.name}</Badge>
                <span className="text-2xl font-bold text-[var(--base)]">${tier.price}</span>
              </div>
              <div className="text-gray-600 mb-3">{tier.description}</div>
              <ul className="mb-4 space-y-1 text-sm text-gray-700">
                {tier.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              <button className="mt-auto bg-[var(--base)] text-white rounded-lg px-4 py-2 font-medium hover:bg-[var(--base-hover)] transition">
                Book
              </button>
            </div>
          ))}
        </div>

        {/* Portfolio Section */}
        <div className="mx-auto mt-12">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {provider.portfolio.map((item, idx) => (
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
        <div className="max-w-8xl mx-auto mt-12 mb-10">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Ratings & Reviews</h3>
          <div className="space-y-4">
            {provider.reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-[var(--base)]/10"
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-bold">★ {review.rating}</span>
                  <span className="font-semibold text-gray-800">{review.name}</span>
                </div>
                <div className="text-gray-700 text-sm">{review.comment}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Gigs Section */}
        <div className="max-w-8xl mx-auto mt-12 mb-16">
          <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">Completed Gigs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedGigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-[var(--base)]/10 relative"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[var(--base)] text-white font-semibold px-3 py-1 text-xs border-0">{gig.tier}</Badge>
                  <span className="flex-1 text-right text-[var(--base)] font-semibold">{gig.price}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{gig.title}</h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{gig.description}</p>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center gap-1 text-yellow-500 font-bold">
                    <FaStar /> {gig.rating}
                  </span>
                </div>
                <div className="italic text-gray-500 text-xs mb-2">"{gig.review}"</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {gig.keywords.map((kw, i) => (
                    <span key={i} className="bg-[var(--base)]/10 text-[var(--base)] px-2 py-0.5 rounded text-xs font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {gig.skills.map((skill, i) => (
                    <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      {skill}
                    </span>
                  ))}
                  {gig.certifications.map((cert, i) => (
                    <span key={i} className="bg-[var(--base)]/10 text-[var(--base)] px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      {cert}
                    </span>
                  ))}
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
