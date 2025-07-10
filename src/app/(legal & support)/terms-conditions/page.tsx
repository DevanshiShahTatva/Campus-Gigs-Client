"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiCall } from "@/utils/apiCall";
import he from "he";
import "../../termsContent.css";
import Loader from "@/components/common/Loader";

export default function TermsConditions() {
  const [termsContent, setTermsContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTermsContent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiCall({
        endPoint: "terms-conditions",
        method: "GET",
      });
      if (response && response.success && response.data && response.data[0]?.content) {
        setTermsContent(response.data[0].content);
      } else {
        setError("No terms and conditions found.");
      }
    } catch (err) {
      setError("Failed to load Terms & Conditions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTermsContent();
  }, [fetchTermsContent]);

  const decodedHTML = useMemo(() => he.decode(termsContent ?? ""), [termsContent]);

  return (
    <section className="bg-[var(--bg-light)] w-full py-12 pt-20">
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-4">Terms & Conditions</h1>
          <p className="text-[var(--text-semi-dark)] text-base sm:text-lg">
            Please read these terms and conditions carefully before using CampusGig.
          </p>
        </div>
        <div className="bg-[var(--card-light)] rounded-2xl shadow-lg p-6 sm:p-10 border border-[var(--base)]/10 w-full">
          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader size={48} colorClass="text-[var(--base)]" />
            </div>
          )}
          {error && !loading && <div className="text-center text-red-600 font-medium py-8">{error}</div>}
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
