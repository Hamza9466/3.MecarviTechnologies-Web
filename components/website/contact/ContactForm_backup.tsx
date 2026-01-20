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
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 lg:mt-[-70px]">
      <div className="max-w-[95%] mx-auto">
        <div className="bg-[#F0EFEB] rounded-lg p-8 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Column - Contact Info with 4 Cards */}
            <div className="space-y-0">
              <div>

                {/* 4 Boxes in Left Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Box 1 - Call Us */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{ width: '300px', height: '120px' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026' }}>
                        <Image
                          src="/assets/images/Vector36.png"
                          alt="Call Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Call Us</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>+1 234 567 890</p>
                        <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>+1 987 654 321</p>
                      </div>
                    </div>
                  </div>

                  {/* Box 2 - Fax */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{ width: '300px', height: '120px' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026' }}>
                        <Image
                          src="/assets/images/Vector34.png"
                          alt="Fax"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Fax</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>1-770-347-7149</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Box 3 - Email */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{ width: '300px', height: '120px' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026' }}>
                        <Image
                          src="/assets/images/Group-2101.png"
                          alt="Email Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Email Us</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>contact@mecarvi.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Box 4 - Address */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{ width: '300px', height: '120px' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026' }}>
                        <Image
                          src="/assets/images/Vector35.png"
                          alt="Visit Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Address</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>123 Main St, City</p>
                        <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>State 12345, Country</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Image
                  src="/assets/images/Vector36.png"
                  alt="Store Opening Hours"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Store Opening Hours</h4>
                <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>Monday-Friday: 9am - 5pm EST
                  Saturday: CLOSED
                  Sunday: CLOSED
                  Public Holidays: CLOSED</p>
              </div>
            </div>
          </div>

          {/* Box 6 - Online Hours */}
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{ width: '300px', height: '170px' }}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026' }}>
                <Image
                  src="/assets/images/Vector33.png"
                  alt="Online Opening Hours"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Online Opening Hours</h4>
                <p className="text-gray-900 font-semibold text-xs" style={{ fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A' }}>Monday-Friday: 8am - 8pm EST
                  Saturday: 11am-5pm EST
                  Sunday: CLOSED
                  Public Holidays: CLOSED </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div >

    {/* Right Column - Contact Form */ }
    < div className = "bg-gray-50 rounded-lg p-2 md:p-3 lg:p-4 lg:mb-[60px]" style = {{ height: '440px' }
}>
  <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
    Contact Form
  </h2>

{/* Success/Error Messages */ }
{
  success && (
    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
      {success}
    </div>
  )
}
{
  error && (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {error}
    </div>
  )
}
<form onSubmit={handleSubmit} className="space-y-2">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    {/* First Name */}
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
        </svg>
      </div>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleInputChange}
        placeholder="First Name"
        className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
        required
      />
    </div>

    {/* Last Name */}
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
        </svg>
      </div>
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleInputChange}
        placeholder="Last Name"
        className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
        required
      />
    </div>
    {/* Email */}
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Your Email"
        className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
        required
      />
    </div>

    {/* Phone */}
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
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
        className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
        required
      />
    </div>
    {/* Company */}
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011.21-.502l4.493 1.498a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleInputChange}
        placeholder="Company (Optional)"
        className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
      />
    </div>
    {/* Message */}
    <div className="relative">
      <div className="absolute left-3 top-3 w-5 h-5 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        placeholder="Message"
        rows={3}
        className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] resize-none"
        required
      />
    </div>
  </div>
  {/* Submit Button */}
  <div className="flex justify-start ">
    <button
      type="submit"
      disabled={loading}
      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-30 rounded-lg transition-all text-base md:text-lg"
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
  </div>
</form>
  </div >
          </div >
        </div >
      </div >
    </section >
  );
}
