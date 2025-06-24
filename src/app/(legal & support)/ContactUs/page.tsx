"use client";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/utils/helper";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, MESSAGES } from "@/utils/constant";

// Helper to decode JWT (no external lib)
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLocked, setUserLocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && (decoded.name || decoded.email)) {
        setForm((prev) => ({
          ...prev,
          name: decoded.name || "",
          email: decoded.email || "",
        }));
        setUserLocked(true);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (userLocked && (e.target.name === "name" || e.target.name === "email")) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.CONTACT_US,
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        },
        withToken: false,
      });
      if (response && response.success) {
        setSubmitted(true);
        setForm({ name: userLocked ? form.name : "", email: userLocked ? form.email : "", subject: "", message: "" });
      } else {
        setError(response?.message || MESSAGES.ERROR);
      }
    } catch (err) {
      setError(MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[var(--bg-light)] min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-dark)]">Contact Us</h2>
          <p className="text-[var(--text-semi-dark)] max-w-2xl mx-auto">
            Have a question, feedback, or need support? Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>
        <div className="bg-[var(--card-light)] rounded-xl shadow-md p-8">
          {submitted ? (
            <div className="text-center">
              <svg className="mx-auto mb-4 w-16 h-16 text-[var(--base)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-dark)]">Thank you!</h3>
              <p className="text-[var(--text-semi-dark)]">Your message has been sent. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--text-dark)] font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    readOnly={userLocked}
                    disabled={userLocked}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-light)] border border-[var(--base)]/20 focus:border-[var(--base)] focus:outline-none text-[var(--text-dark)] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-[var(--text-semi-dark)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-dark)] font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    readOnly={userLocked}
                    disabled={userLocked}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-light)] border border-[var(--base)]/20 focus:border-[var(--base)] focus:outline-none text-[var(--text-dark)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[var(--text-dark)] font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-light)] border border-[var(--base)]/20 focus:border-[var(--base)] focus:outline-none text-[var(--text-dark)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-dark)] font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-light)] border border-[var(--base)]/20 focus:border-[var(--base)] focus:outline-none text-[var(--text-dark)] resize-none"
                ></textarea>
              </div>
              {error && <div className="text-red-600 text-center font-medium">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--base)] text-[var(--text-light)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--base-hover)] transition-colors duration-300 transform disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
          <div className="mt-10 border-t border-[var(--base)]/10 pt-8 text-center">
            <h4 className="text-lg font-semibold mb-2 text-[var(--text-dark)]">Other ways to reach us</h4>
            <p className="text-[var(--text-semi-dark)] mb-2">Email: <a href="mailto:support@campusgig.com" className="text-[var(--base)] hover:underline">support@campusgig.com</a></p>
            <p className="text-[var(--text-semi-dark)]">For urgent issues, please mention "URGENT" in your subject line.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs; 