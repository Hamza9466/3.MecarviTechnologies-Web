"use client";

import { useState } from "react";

export default function CareerSupport() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobLocation: "",
    preferredContact: "",
    bestTime: "",
    description: "",
    marketingEmails: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Quick Support */}
          <div className="bg-gray-50 rounded-lg p-8 md:p-10 lg:p-12">
            <h3 className="text-blue-600 text-lg md:text-xl font-semibold mb-4">
              Quick Support
            </h3>
            <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              career support section heading
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
              Proactively deliver seamless core competencies with scalable. Completely fabricate transparent paradigms.
            </p>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Call Us */}
              <div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h4 className="text-gray-900 font-bold text-lg mb-2">Call Us</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Questions about our product or pricing? Call for support
                </p>
                <p className="text-gray-900 font-semibold">1234</p>
              </div>

              {/* Email Us */}
              <div>
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="text-gray-900 font-bold text-lg mb-2">Email Us</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Our support will help you from 9am to 5pm
                </p>
                <p className="text-gray-900 font-semibold">email@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-50 rounded-lg p-8 md:p-10 lg:p-12">
            <p className="text-gray-700 text-sm md:text-base mb-6">
              Fill out the form and we'll be in touch shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Phone and Job Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="jobLocation"
                    value={formData.jobLocation}
                    onChange={handleInputChange}
                    placeholder="Job Location"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Preferred Contact Method and Best Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="" className="bg-white">Preferred Contact M</option>
                    <option value="phone" className="bg-white">Phone</option>
                    <option value="email" className="bg-white">Email</option>
                  </select>
                </div>
                <div>
                  <select
                    name="bestTime"
                    value={formData.bestTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="" className="bg-white">Best Time to Contact</option>
                    <option value="morning" className="bg-white">Morning</option>
                    <option value="afternoon" className="bg-white">Afternoon</option>
                    <option value="evening" className="bg-white">Evening</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project or any special requirements"
                  rows={4}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500 resize-none"
                />
              </div>

              {/* Marketing Emails Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="marketingEmails"
                  id="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={handleCheckboxChange}
                  className="mt-1 w-4 h-4 text-pink-500 bg-white border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="marketingEmails" className="text-gray-700 text-sm">
                  Yes, I would like to receive marketing emails. I can opt out anytime.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-base md:text-lg"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

