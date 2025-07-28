"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaStar, FaCrown } from "react-icons/fa";
import { useGetProviderPublicProfileQuery } from "@/redux/api";
import { useParams } from "next/navigation";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { getAvatarName, getAverageRating, getProviderBadge } from "@/utils/helper";
import { ImageIcon } from "lucide-react";

// Mock completed gigs data

const PlaceholderImage = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div className="text-center">
      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">No Image</p>
    </div>
  </div>
);

const ProviderPortfolioPage = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const { data, isLoading, error } = useGetProviderPublicProfileQuery(id, { skip: !id, refetchOnMountOrArgChange: true });
  const provider = data?.data;
  // Dummy data for missing fields
  
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

  const badgeValidation = getProviderBadge(provider?.isMostRated, provider?.isTopRated, provider?.subscription?.price);
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
                  {badgeValidation && <Badge className="bg-[var(--base)]/10 text-[var(--base)] font-semibold px-4 py-1 text-sm rounded-full border border-[var(--base)]/30 shadow-sm tracking-wide flex items-center gap-1">
                    <FaCrown className="text-[var(--base)] text-base mb-0.5" />
                    {badgeValidation}
                  </Badge>}
                </div>
                {/* More provider details for appeal */}
                <div className="flex flex-col gap-3 mt-2 text-sm text-gray-600">
                  <div className="text-base text-gray-600">
                  {provider?.headline || provider?.title || "CampusGig user"}
                </div>
                <div className="text-base text-gray-700  max-w-2xl">{provider?.bio}</div>
                  <div className="flex gap-2 flex-wrap">
                    {
                      provider?.skills?.map((skill: any, id: number) => <span key={id} className="bg-gray-100 rounded px-2 py-1 font-medium">{skill?.name}</span>)
                    }
                  </div>
                  <div className="flex flx-wrap gap-3">
                    <span className="bg-gray-100 rounded px-2 py-1 font-medium">Completed Projects: {provider?.gigs_provider?.length > 40 ? '40+' : provider?.gigs_provider?.length}</span>
                    {/* <span className="bg-gray-100 rounded px-2 py-1 font-medium">Avg. Response: 1hr</span> */}
                    <span className="bg-gray-100 rounded px-2 py-1 font-medium">Verified</span>
                </div>
                
                  </div>
              </div>
              {/* Rating Card */}
              <div className="mt-6 sm:mt-0 flex flex-col items-center bg-[var(--base)]/10 rounded-xl px-8 py-4 min-w-[160px] shadow border border-[var(--base)]/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-[var(--base)]">{getAverageRating(provider?.gigs_provider?.map((item:any)=> item?.rating?.rating)) || 0}</span>
                  <FaStar className="text-yellow-400 text-2xl" />
                </div>
                <div className="text-gray-700 text-sm font-medium">Provider Rating</div>
                <div className="text-gray-500 text-xs">{provider?.gigs_provider?.length || 0} reviews</div>
              </div>
            </div>
          </div>
        </div>

      

        {/* Reviews Section */}
        {provider?.gigs_provider?.length > 0 && <div className="max-w-8xl mx-auto mt-12 mb-10">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Ratings & Reviews</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(provider?.gigs_provider?.slice(0, 3)).map((review: any, idx: number) => (
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
       {provider?.gigs_provider && <div className="max-w-8xl mx-auto mt-12 mb-16">
          <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">Completed Gigs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {provider?.gigs_provider?.slice(0, 3)?.map((gig: any, id: any) => (
              <div
                key={id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-[1.03] border border-gray-200"
              >
                {/* Image or Placeholder */}
                <div className="relative w-full h-48">
                  {gig?.images?.length > 0 ? (
                    <img
                      src={gig?.images[0]}
                      alt={gig?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PlaceholderImage />
                  )}

                  {/* Price Badge (over image) */}
                  <span className="absolute top-3 right-3 bg-[var(--base)] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    ${gig?.price}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col space-y-2">
                  {/* Title & Rating */}
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold text-gray-800 truncate">{gig?.title}</h4>
                    {gig?.rating && (
                      <div className="flex items-center text-yellow-500 text-sm font-medium">
                        <FaStar className="mr-1" /> {gig?.rating?.rating?.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {gig?.description}
                  </p>

                  {/* Feedback */}
                  {gig?.rating?.rating_feedback && (
                    <p className="italic text-gray-500 text-xs line-clamp-1">
                      "{gig?.rating?.rating_feedback}"
                    </p>
                  )}

                  {/* Tags (Skills & Certificates) */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {gig?.skills?.map((skill: any, i: number) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        {skill?.name}
                      </span>
                    ))}
                    {gig?.certifications?.map((cert: string, i: number) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
};

export default ProviderPortfolioPage;
