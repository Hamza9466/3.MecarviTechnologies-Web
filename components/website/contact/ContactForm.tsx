"use client";

import { useState } from "react";
import Image from "next/image";

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (success) setSuccess("");
    if (error) setError("");
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.first_name.trim()) errors.push("First name is required");
    if (!formData.last_name.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.message.trim()) errors.push("Message is required");

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submission started with data:", formData);

    const errors = validateForm();
    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      setError(errors.join(", "));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Sending API request to: http://localhost:8000/api/v1/contact-form");

      const response = await fetch("http://localhost:8000/api/v1/contact-form", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API response status:", response.status);
      console.log("API response ok:", response.ok);

      const responseData = await response.json();
      console.log("API response data:", responseData);

      if (response.ok) {
        if (responseData.success) {
          setSuccess(responseData.message || "Contact form submitted successfully!");
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
          });
          console.log("Form submitted successfully!");
        } else {
          throw new Error(responseData.message || "Failed to submit contact form");
        }
      } else {
        console.log("API request failed with status:", response.status);
        if (responseData.errors) {
          // Handle validation errors
          const errorMessages = Object.values(responseData.errors).flat();
          console.log("Validation errors from API:", errorMessages);
          setError(errorMessages.join(", "));
        } else {
          throw new Error(responseData.message || "Failed to submit contact form");
        }
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError(err instanceof Error ? err.message : "Failed to submit contact form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 lg:mt-[-70px]">
        <div className="max-w-[95%] mx-auto">
          <div className="rounded-lg p-8 md:p-10 lg:p-12">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                We are always here for you
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Feel free to reach out to us for any inquiries, collaborations, or support. We're here to help and will get back to you as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Left Column - Contact Info with 6 Boxes */}
              <div className="space-y-0">
                <div>



                </div>

                {/* 6 Boxes in Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Box 1 - Call Us */}
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow" style={{ width: '300px', height: '160px' }}>
                      {/* Call Button */}
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full mb-3 hover:from-pink-600 hover:to-purple-700 transition-all">
                        Call
                      </button>

                      {/* Line Separator */}
                      <div className="w-full h-px bg-gray-200 mb-3"></div>

                      {/* Icon and Content */}
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 flex items-start justify-center flex-shrink-0 pt-1">
                          <svg className="w-5 h-5" style={{ color: '#7E70E5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-bold text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Call Us</h4>
                          <p className="text-gray-600 text-xs mt-1 truncate">+1 234 567 890</p>
                          <p className="text-gray-600 text-xs truncate">+1 987 654 321</p>
                        </div>
                      </div>
                    </div>

                    {/* Box 2 - Fax */}
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow" style={{ width: '300px', height: '160px' }}>
                      {/* Call Button */}
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full mb-3 hover:from-pink-600 hover:to-purple-700 transition-all">
                        Fax
                      </button>

                      {/* Line Separator */}
                      <div className="w-full h-px bg-gray-200 mb-3"></div>

                      {/* Icon and Content */}
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 flex items-start justify-center flex-shrink-0 pt-1">
                          <svg className="w-5 h-5" style={{ color: '#7E70E5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-bold text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Fax</h4>
                          <p className="text-gray-600 text-xs mt-1 truncate">1-770-347-7149</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Box 3 - Email */}
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow" style={{ width: '300px', height: '160px' }}>
                      <div className="relative">
                        {/* Call Button */}
                        <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full mb-3 hover:from-pink-600 hover:to-purple-700 transition-all">
                          Email
                        </button>
                        <div className="absolute top-0 right-0">
                          <button
                            onClick={() => setShowEmailPopup(true)}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all"
                          >
                            Team
                          </button>
                        </div>
                      </div>
                      {/* Line Separator */}
                      <div className="w-full h-px bg-gray-200 mb-3"></div>

                      {/* Icon and Content */}
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 flex items-start justify-center flex-shrink-0 pt-1">
                          <svg className="w-5 h-5" style={{ color: '#7E70E5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-bold text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Email Us</h4>
                          <p className="text-gray-600 text-xs mt-1 truncate">contact@mecarvi.com</p>

                        </div>
                      </div>
                    </div>

                    {/* Box 4 - Address */}
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow" style={{ width: '300px', height: '160px' }}>
                      {/* Call Button */}
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full mb-3 hover:from-pink-600 hover:to-purple-700 transition-all">
                        Visit
                      </button>

                      {/* Line Separator */}
                      <div className="w-full h-px bg-gray-200 mb-3"></div>

                      {/* Icon and Content */}
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 flex items-start justify-center flex-shrink-0 pt-1">
                          <svg className="w-5 h-5" style={{ color: '#7E70E5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-bold text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Address</h4>
                          <p className="text-gray-600 text-xs mt-1 truncate">123 Main St, City</p>
                          <p className="text-gray-600 text-xs truncate">State 12345, Country</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Box 5 - Store Hours */}
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow" style={{ width: '300px', height: '180px' }}>
                      {/* Call Button */}
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full mb-3 hover:from-pink-600 hover:to-purple-700 transition-all">
                        Store Hours
                      </button>

                      {/* Line Separator */}
                      <div className="w-full h-px bg-gray-200 mb-3"></div>

                      {/* Icon and Content */}
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 flex items-start justify-center flex-shrink-0 pt-1">
                          <svg className="w-5 h-5" style={{ color: '#7E70E5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-bold text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Store Hours</h4>
                          <p className="text-gray-600 text-xs mt-1">Monday-Friday: 9am - 5pm</p>
                          <p className="text-gray-600 text-xs">Saturday: CLOSED</p>
                          <p className="text-gray-600 text-xs">Sunday: CLOSED</p>
                        </div>
                      </div>
                    </div>

                    {/* Box 6 - Online Hours */}
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow" style={{ width: '300px', height: '180px' }}>
                      {/* Call Button */}
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full mb-3 hover:from-pink-600 hover:to-purple-700 transition-all">
                        Online Hours
                      </button>

                      {/* Line Separator */}
                      <div className="w-full h-px bg-gray-200 mb-3"></div>

                      {/* Icon and Content */}
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 flex items-start justify-center flex-shrink-0 pt-1">
                          <svg className="w-5 h-5" style={{ color: '#7E70E5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-bold text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Online Hours</h4>
                          <p className="text-gray-600 text-xs mt-1">Monday-Friday: 8am - 8pm</p>
                          <p className="text-gray-600 text-xs">Saturday: 11am-5pm</p>
                          <p className="text-gray-600 text-xs">Sunday: CLOSED</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 lg:p-4 lg:mb-[60px] flex flex-col" style={{ height: '530px' }}>
                <h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Contact Form
                </h2>

                {/* Success/Error Messages */}
                {success && (
                  <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* First Name */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                          required
                        />
                      </div>

                      {/* Last Name */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Email */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your Phone"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company (Optional)"
                        className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                      />
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <div className="absolute left-3 top-3 w-4 h-4 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Message"
                        rows={4}
                        className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] resize-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-start pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-8 rounded-lg transition-all text-sm md:text-base"
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Contact Our Team</h3>
              <button
                onClick={() => setShowEmailPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Team Member 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">John Doe</h4>
                    <p className="text-sm text-gray-600">CEO & Founder</p>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">john@mecarvi.com</p>
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Sarah Miller</h4>
                    <p className="text-sm text-gray-600">Sales Manager</p>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">sarah@mecarvi.com</p>
                  </div>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    TC
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Tom Chen</h4>
                    <p className="text-sm text-gray-600">Technical Lead</p>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">tom@mecarvi.com</p>
                  </div>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    EJ
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Emma Johnson</h4>
                    <p className="text-sm text-gray-600">Customer Support</p>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">emma@mecarvi.com</p>
                  </div>
                </div>
              </div>

              {/* Team Member 5 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    MR
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Mike Roberts</h4>
                    <p className="text-sm text-gray-600">Project Manager</p>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">mike@mecarvi.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
