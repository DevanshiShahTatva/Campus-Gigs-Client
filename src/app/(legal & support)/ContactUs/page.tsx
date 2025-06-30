"use client";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/utils/helper";
import { apiCall } from "@/utils/apiCall";
import {
  API_ROUTES,
  MESSAGES,
  FOOTER_SOCIAL_LINKS,
  CONTACT_US_TEXT,
} from "@/utils/constant";
import IconMap from "@/components/common/IconMap";

// Helper to decode JWT (no external lib)
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (userLocked && (e.target.name === "name" || e.target.name === "email"))
      return;
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
        setForm({
          name: userLocked ? form.name : "",
          email: userLocked ? form.email : "",
          subject: "",
          message: "",
        });
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
        <div className="text-center my-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-dark)]">
            {CONTACT_US_TEXT.TITLE}
          </h2>
          <p className="text-[var(--text-semi-dark)] max-w-2xl mx-auto">
            {CONTACT_US_TEXT.SUBTITLE}
          </p>
        </div>
        <div className="bg-[var(--card-light)] rounded-xl shadow-md p-0 md:p-0 flex flex-col md:flex-row overflow-hidden">
          {!submitted ? (
            <>
              {/* Left: Image */}
              <div className="md:w-1/2 flex flex-col items-center justify-start bg-white border-b md:border-b-0 md:border-r border-[var(--base)]/10 p-4 md:p-8">
                <img
                  src="/assets/contact_us.svg"
                  alt="Contact Us Illustration"
                  className="w-48 h-48 md:w-80 md:h-80 object-contain mb-6 md:mb-12"
                />

                {/* Contact Details */}
                <div className="w-full mb-6 md:mb-12 flex flex-col md:flex-row gap-4">
                  <div className="bg-white rounded-xl border p-6 flex items-center space-x-3 md:space-x-4 w-full md:w-1/2">
                    <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6">
                      <IconMap
                        name="phone"
                        className="w-5 h-5 md:w-6 md:h-6 text-[var(--base)]"
                      />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[var(--text-dark)]">
                        Phone
                      </p>
                      <p className="text-xs md:text-sm text-[var(--text-semi-dark)]">
                        {CONTACT_US_TEXT.PHONE}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border p-6 flex items-center space-x-3 md:space-x-4 w-full md:w-1/2">
                    <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6">
                      <IconMap
                        name="address"
                        className="w-5 h-5 md:w-6 md:h-6 text-[var(--base)]"
                      />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[var(--text-dark)]">
                        Address
                      </p>
                      <p className="text-xs md:text-sm text-[var(--text-semi-dark)] whitespace-pre-line">
                        {CONTACT_US_TEXT.ADDRESS}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="w-full">
                  {/* <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-[var(--text-dark)] text-center">Follow Us</h3> */}
                  <div className="flex justify-center space-x-4 md:space-x-6">
                    {FOOTER_SOCIAL_LINKS.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="w-10 h-10 md:w-12 md:h-12 bg-[var(--base)]/10 hover:bg-[var(--base)]/20 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <IconMap
                          name={social.icon}
                          className="w-5 h-5 md:w-6 md:h-6 text-[var(--base)]"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right: Form */}
              <div className="md:w-1/2 w-full p-6 md:p-12 flex flex-col justify-center">
                {false ? (
                  <div className="flex flex-col items-center justify-center h-full w-full min-h-[340px]">
                    <IconMap name="submitted" />
                    <h3 className="text-2xl font-bold mb-2 mt-4 text-[var(--text-dark)]">
                      {CONTACT_US_TEXT.THANK_YOU}
                    </h3>
                    <p className="text-[var(--text-semi-dark)] mb-6">
                      {CONTACT_US_TEXT.GET_BACK_SOON}
                    </p>
                    <button
                      className="mt-2 px-6 py-3 rounded-lg bg-[var(--base)] text-white font-semibold hover:bg-[var(--base-hover)] transition"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit Another Query
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 contact-us-form"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[var(--text-dark)] font-medium mb-2">
                          Name
                        </label>
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
                        <label className="block text-[var(--text-dark)] font-medium mb-2">
                          Email
                        </label>
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
                      <label className="block text-[var(--text-dark)] font-medium mb-2">
                        Subject
                      </label>
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
                      <label className="block text-[var(--text-dark)] font-medium mb-2">
                        Message
                      </label>
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
                    {error && (
                      <div className="text-red-600 text-center font-medium">
                        {error}
                      </div>
                    )}
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
                  <h4 className="text-lg font-semibold mb-2 text-[var(--text-dark)]">
                    {CONTACT_US_TEXT.OTHER_WAYS}
                  </h4>
                  <p className="text-[var(--text-semi-dark)] mb-2">
                    Email:{" "}
                    <a
                      href="mailto:support@campusgig.com"
                      className="text-[var(--base)] hover:underline"
                    >
                      {CONTACT_US_TEXT.EMAIL}
                    </a>
                  </p>
                  <p className="text-[var(--text-semi-dark)]">
                    {CONTACT_US_TEXT.NOTE}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full min-h-[340px]">
              <IconMap name="submitted" />
              <h3 className="text-2xl font-bold mb-2 mt-4 text-[var(--text-dark)]">
                {CONTACT_US_TEXT.THANK_YOU}
              </h3>
              <p className="text-[var(--text-semi-dark)] mb-6">
                {CONTACT_US_TEXT.GET_BACK_SOON}
              </p>
              <button
                className="mt-2 px-6 py-3 rounded-lg bg-[var(--base)] text-white font-semibold hover:bg-[var(--base-hover)] transition"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Query
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
