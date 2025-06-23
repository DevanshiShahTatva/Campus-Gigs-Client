"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiCall } from "@/utils/apiCall";
import he from "he";
import "../../termsContent.css";

export default function PrivacyPolicy() {
  const [policyContent, setPolicyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPolicyContent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiCall({
        endPoint: "privacy-policy",
        method: "GET",
      });
      if (response && response.success && response.data && response.data[0]?.content) {
        setPolicyContent(response.data[0].content);
      } else {
        setError("No privacy policy found.");
      }
    } catch (err) {
      setError("Failed to load Privacy Policy. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicyContent();
  }, [fetchPolicyContent]);

  const decodedHTML = useMemo(() => he.decode(policyContent ?? ""), [policyContent]);

  return (
    <section className="min-h-screen py-20 bg-[var(--bg-light)] w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--base)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[var(--text-semi-dark)] text-base sm:text-lg">
            Please read our privacy policy carefully before using CampusGig.
          </p>
        </div>
        <div className="bg-[var(--card-light)] rounded-2xl shadow-lg p-6 sm:p-10 border border-[var(--base)]/10 w-full">
          {loading && (
            <div className="flex justify-center items-center py-16">
              <svg
                className="animate-spin h-8 w-8 text-[var(--base)]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          )}
          {error && !loading && (
            <div className="text-center text-red-600 font-medium py-8">{error}</div>
          )}
          {!loading && !error && (
            <div className="terms-and-conditions prose prose-lg max-w-none text-[var(--text-dark)]">
              <div dangerouslySetInnerHTML={{ __html: decodedHTML }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 