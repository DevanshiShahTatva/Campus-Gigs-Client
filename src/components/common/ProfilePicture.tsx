"use client";

import { getInitials } from "@/app/(protected)/profile/helper";
import Image from "next/image";

interface ProfilePicturePorps {
  name: string;
  image: string;
  width?: number;
  isLoading?: boolean;
}

const ProfilePicture = (props: ProfilePicturePorps) => {
  const { image, isLoading = false, name = "User", width = "96" } = props;
  if (isLoading) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full`}
      >
        <div
          className="bg-gray-200 rounded-full animate-pulse"
          style={{
            height: width + "px",
            width: width + "px",
          }}
        ></div>
      </div>
    );
  } else if (image && image?.length) {
    return (
      <Image
        src={image}
        alt={name}
        width={width}
        height={width}
        className="w-full h-full rounded-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
        style={{
          height: width + "px",
          width: width + "px",
        }}
      />
    );
  } else {
    return (
      <div
        className={`rounded-full bg-[var(--base)] text-white relative flex items-center justify-center`}
        style={{
          height: width + "px",
          width: width + "px",
        }}
      >
        <span className="text-2xl font-bold">{getInitials(name)}</span>
      </div>
    );
  }
};

export default ProfilePicture;
