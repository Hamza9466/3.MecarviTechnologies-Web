"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
  };

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 lg:mt-[-70px]">
      <div className="max-w-[95%] mx-auto">
        <div className="bg-[#F0EFEB] rounded-lg p-8 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Column - Contact Info with 6 Boxes */}
            <div className="space-y-0">
              <div>
                
               
               
              </div>

              {/* 6 Boxes in Left Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Box 1 - Call Us */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/assets/images/Vector36.png"
                          alt="Call Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-1">Call Us</h4>
                        <p className="text-gray-900 font-semibold text-xs">+1 234 567 890</p>
                        <p className="text-gray-900 font-semibold text-xs">+1 987 654 321</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Box 2 - Fax */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/assets/images/Vector34.png"
                          alt="Fax"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-1">Fax</h4>
                        <p className="text-gray-900 font-semibold text-xs">1-770-347-7149</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Box 3 - Email */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/assets/images/Group-2101.png"
                          alt="Email Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-1">Email Us</h4>
                        <p className="text-gray-900 font-semibold text-xs">contact@mecarvi.com</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Box 4 - Address */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/assets/images/Vector35.png"
                          alt="Visit Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-1">Address</h4>
                        <p className="text-gray-900 font-semibold text-xs">123 Main St, City</p>
                        <p className="text-gray-900 font-semibold text-xs">State 12345, Country</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Box 5 - Store Hours */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/assets/images/Vector36.png"
                          alt="Store Opening Hours"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-1">Store Opening Hours</h4>
                        <p className="text-gray-900 font-semibold text-xs">Monday-Friday: 9am - 5pm EST
Saturday: CLOSED
Sunday: CLOSED
Public Holidays: CLOSED</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Box 6 - Online Hours */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/assets/images/Vector33.png"
                          alt="Online Opening Hours"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-1">Online Opening Hours</h4>
                        <p className="text-gray-900 font-semibold text-xs">Monday-Friday: 8am - 8pm EST
Saturday: 11am-5pm EST
Sunday: CLOSED
Public Holidays: CLOSED </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 lg:p-4 mb-7">
              <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Contact Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Full Name */}
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full px-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full px-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className="w-full px-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your Phone"
                      className="w-full px-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="w-full px-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Message"
                    rows={3}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500 resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-30 rounded-lg transition-all text-base md:text-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
