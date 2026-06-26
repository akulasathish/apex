"use my-client"; // This lets Next.js know it's a client component
"use client";

import { useState } from "react";

export default function ContactForm({ courses = [], defaultCourse = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: defaultCourse || (courses[0]?.id || ""),
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to urlencode parameters for Netlify Forms
  const encode = (data) => {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          ...formData,
        }),
      });

      if (res.ok) {
        setResponse({
          success: true,
          message: "Thank you! Your enquiry has been received. Our team will contact you shortly.",
        });
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          course: defaultCourse || (courses[0]?.id || ""),
          message: "",
        });
      } else {
        setResponse({
          success: false,
          error: "Could not submit enquiry. Please try again or call us directly.",
        });
      }
    } catch (err) {
      console.error("Netlify form submission error:", err);
      setResponse({
        success: false,
        error: "A network error occurred. Please check your internet connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl transition duration-300">
      <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
        <i className="fa-solid fa-paper-plane text-blue-500 mr-3 text-xl"></i>
        Request Callback / Enquiry
      </h3>
      <p className="text-gray-300 text-sm mb-6">
        Fill out your details below and an admissions counselor will reach out to you within 24 hours.
      </p>

      {response && (
        <div
          className={`p-4 mb-6 rounded-xl text-sm flex items-start space-x-3 border ${
            response.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <div className="mt-0.5">
            {response.success ? (
              <i className="fa-solid fa-circle-check text-base"></i>
            ) : (
              <i className="fa-solid fa-triangle-exclamation text-base"></i>
            )}
          </div>
          <div>
            <p className="font-semibold">{response.success ? "Success!" : "Submission Error"}</p>
            <p className="mt-0.5 opacity-90">{response.success ? response.message : response.error}</p>
          </div>
        </div>
      )}

      {/* Netlify attribute integration */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        name="contact"
        action="/__forms.html"
        data-netlify="true"
      >
        {/* Hidden inputs required for Netlify detection */}
        <input type="hidden" name="form-name" value="contact" />

        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={loading}
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              disabled={loading}
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Select Course <span className="text-rose-500">*</span>
          </label>
          <select
            id="course"
            name="course"
            required
            disabled={loading}
            value={formData.course}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50 appearance-none cursor-pointer"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id} className="bg-slate-900 text-white">
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Your Message / Questions
          </label>
          <textarea
            id="message"
            name="message"
            rows="3"
            disabled={loading}
            value={formData.message}
            onChange={handleChange}
            placeholder="Let us know your educational background or training goals..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50 resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
              <span>Sending Enquiry...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane"></i>
              <span>Submit Enquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
