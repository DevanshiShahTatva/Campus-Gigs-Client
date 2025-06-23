import React from "react";

const Loader: React.FC<{ size?: number; colorClass?: string }> = ({ size = 24, colorClass = "text-[var(--base)]" }) => (
  <span className={`inline-block animate-spin ${colorClass}`}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  >
    <svg
      className="w-full h-full"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 1 0-15 15v5A20 20 0 0 1 25 5z"
      />
    </svg>
  </span>
);

export default Loader; 