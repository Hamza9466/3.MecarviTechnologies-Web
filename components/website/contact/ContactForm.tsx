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
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026'}}>
                        <Image
                          src="/assets/images/Vector36.png"
                          alt="Call Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%'}}>Call Us</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>+1 234 567 890</p>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>+1 987 654 321</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Box 2 - Fax */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026'}}>
                        <Image
                          src="/assets/images/Vector34.png"
                          alt="Fax"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%'}}>Fax</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>1-770-347-7149</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Box 3 - Email */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026'}}>
                        <Image
                          src="/assets/images/Group-2101.png"
                          alt="Email Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%'}}>Email Us</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>contact@mecarvi.com</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Box 4 - Address */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '120px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026'}}>
                        <Image
                          src="/assets/images/Vector35.png"
                          alt="Visit Us"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%'}}>Address</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>123 Main St, City</p>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>State 12345, Country</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Box 5 - Store Hours */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '170px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026'}}>
                        <Image
                          src="/assets/images/Vector36.png"
                          alt="Store Opening Hours"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%'}}>Store Opening Hours</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>Monday-Friday: 9am - 5pm EST
Saturday: CLOSED
Sunday: CLOSED
Public Holidays: CLOSED</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Box 6 - Online Hours */}
                  <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200" style={{width: '300px', height: '170px'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#F9EFFF] rounded-full flex items-center justify-center flex-shrink-0" style={{width: '50px', height: '50px', transform: 'rotate(0deg)', opacity: 1, top: '1039px', left: '90px', borderRadius: '6px', background: '#F9EFFF', boxShadow: '0px 4px 8px 0px #00000026'}}>
                        <Image
                          src="/assets/images/Vector33.png"
                          alt="Online Opening Hours"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm mb-3" style={{fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'Semi Bold', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%'}}>Online Opening Hours</h4>
                        <p className="text-gray-900 font-semibold text-xs" style={{fontFamily: 'Montserrat', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', lineHeight: '20px', letterSpacing: '0%', color: '#8A8A8A'}}>Monday-Friday: 8am - 8pm EST
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
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 lg:p-4 lg:mb-[60px]" style={{height: '440px'}}>
              <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Contact Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Full Name */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Email */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
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
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="w-full pl-10 pr-2 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A]"
                    required
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <div className="absolute left-3 top-3 w-5 h-5 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

                {/* Submit Button */}
                <div className="flex justify-start ">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-600  hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-30 rounded-lg transition-all text-base md:text-lg"
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
