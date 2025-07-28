"use client";
import { useEffect, useState } from "react";
import { API_ROUTES } from "@/utils/constant";
import { toast } from "react-toastify";
import { apiCall } from "@/utils/apiCall";
import ProfilePicture from "../common/ProfilePicture";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Gigs } from "@/utils/interface";
import { PlaceholderImage } from "../ui/placeholderImage";

const FeaturedGigs = () => {
  const router = useRouter();

  const [gigsProviders, setGigsProviders] = useState<any[]>([]);
  const [gigs, setGigs] = useState<Gigs[]>([]);

  const userId = useSelector(
    (state: any) => state.user?.user_id || state.user?.user?.id
  );

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const fetchTopProviders = async (search = "") => {
    try {
      let url = API_ROUTES.PUBLIC_TOP_PROVIDERS;

      const resp = await apiCall({
        endPoint: url,
        method: "GET",
      });

      if (resp?.success) {
        console.log("RESRSRER==>", resp);
        setGigsProviders(resp.data);
      }
    } catch (error) {
      toast.error("Failed to fetch Providers");
    } finally {
    }
  };

  const fetchGigs = async () => {
    try {
      let url = `${API_ROUTES.PUBLIC_GIGS_SEARCH}`;

      const resp = await apiCall({
        endPoint: url,
        method: "GET",
      });

      if (resp?.success) {
        setGigs(resp.data);
      }
    } catch (error) {
      toast.error("Failed to fetch gigs");
    } finally {
    }
  };

  useEffect(() => {
    fetchTopProviders();
    fetchGigs();
  }, []);

  const handleShowProfile = (redirectId: number) => {
    if (userId) {
      router.push(`/provider/${redirectId}`);
    } else {
      toast.warning("Please login first!");
      router.push("/login");
    }
  };
  const handleViewDetails = (requestId: number) => {
    if (userId) {
      router.push(`/gigs/${requestId}`);
    } else {
      toast.warning("Please login first!");
      router.push("/login");
    }
  };

  return (
    <section className="py-20 bg-[var(--bg-dark)]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-[color:var(--text-light)]">
          Featured Gigs & Providers
        </h2>

        {/* Featured Gigs - Responsive Grid */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold mb-6 text-[color:var(--text-light)] text-center">
            Featured Gigs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs?.slice(0,3)?.map((gig) => (
              <div
                key={gig?.id}
                className="cursor-pointer bg-[var(--card-dark)] rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group relative overflow-hidden"
              >
                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-[var(--base)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Image Container */}
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  {gig?.images.length > 0 ? (
                    <img
                      src={gig?.images[0]}
                      alt={gig.title}
                      className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-60">
                      <PlaceholderImage />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 bg-[var(--base)] text-[var(--text-light)] px-2 py-1 rounded-full text-xs font-semibold">
                    {gig.gig_category.name}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h4 className="font-semibold text-[color:var(--text-light)] mb-2 group-hover:text-[color:var(--base)] transition-colors duration-300 line-clamp-2">
                    {gig.title}
                  </h4>
                  <p className="text-sm text-[color:var(--text-light)]/70 mb-3 line-clamp-2">
                    {gig.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[color:var(--base)] font-bold text-lg">
                      ${gig.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">
                        {renderStars(Number(gig.rating?.rating))}
                      </span>
                      <span className="text-[color:var(--text-light)]/70 text-xs">
                        {gig.rating?.rating_feedback}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[color:var(--text-light)]/60">
                      by {gig.user.name}
                    </span>
                    <button onClick={()=> handleViewDetails(gig.id)} className="bg-[var(--base)] text-[var(--text-light)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--base-hover)] transition-colors duration-300 transform hover:scale-105">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Providers */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-[color:var(--text-light)] text-center">
            Top Providers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {gigsProviders?.map((provider) => (
              <div
                key={provider.id}
                className="cursor-pointer bg-[var(--card-dark)] rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 text-center group relative overflow-hidden"
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-[var(--base)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500`}
                />

                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto relative">
                    <ProfilePicture
                      image={provider?.profile}
                      name={provider?.name}
                    />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-[var(--base)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h4 className="font-semibold text-[color:var(--text-light)] mb-2 group-hover:text-[color:var(--base)] transition-colors duration-300">
                    {provider?.name}
                  </h4>
                  <p className="text-sm text-[color:var(--text-light)]/70 mb-2">
                    <span className="font-semibold">{provider?.gigCount}</span>{" "}
                    gigs completed
                  </p>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-yellow-400 text-sm">
                      {renderStars(provider?.avgRating)}
                    </span>
                  </div>

                  <button
                    className="bg-[var(--base)] text-[var(--text-light)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--base-hover)] transition-all duration-300 transform hover:scale-105 w-full"
                    onClick={() => handleShowProfile(provider?.id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGigs;
