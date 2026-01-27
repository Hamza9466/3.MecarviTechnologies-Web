"use client";

import React from "react";

const BookAppointmentSection: React.FC = () => {
    return (
        <section className="py-20 bg-white relative -mt-10">
            <div className="container mx-auto px-4 w-[95%]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full">
                            • BOOK APPOINTMENT NOW •
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            Book a Time That Works for <br />
                            You Easy, and Hassle-Free!
                        </h2>

                        <p className="text-gray-600 max-w-xl mb-10">
                            Ready to take your business technology to the next level?
                            Our expert team is here to help you find the right solutions
                            tailored to your needs.
                        </p>

                        {/* INFO CARDS */}
                        <div className="space-y-6 ">
                            <div className="flex gap-4 bg-white p-6 rounded-2xl shadow-md hover:bg-purple-600 transition-all duration-300 cursor-pointer group" style={{ backgroundColor: '#F3F2F8' }}>
                                <div className="flex items-center justify-center w-20 h-18 rounded-xl bg-white border-2 border-purple-400 group-hover:bg-purple-100 transition-all duration-300">
                                    <img
                                        src="/assets/images/icon-14.webp"
                                        alt="Business Planning Icon"
                                        className="w-8 h-8"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        Improving Your Business Planning
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        We envision a future where our clients are at the forefront
                                        of their industries, setting new standards of excellence.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 bg-white p-6 rounded-2xl shadow-md hover:bg-purple-600 transition-all duration-300 cursor-pointer group" style={{ backgroundColor: '#F3F2F8' }}>
                                <div className="flex items-center justify-center w-20 h-18 rounded-xl bg-white border-2 border-purple-400 group-hover:bg-purple-100 transition-all duration-300">
                                    <img
                                        src="/assets/images/icon-14.webp"
                                        alt="Business Planning Icon"
                                        className="w-8 h-8"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        Improving Your Business Planning
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        We envision a future where our clients are at the forefront
                                        of their industries, setting new standards of excellence.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div className="relative max-w-2xl top-4 ">
                        {/* ANGLED HEADER */}
                        <div className="absolute -top-16 -left-0 z-20 ">
                            <div
                                className="px-8 py-4 lg:text-2xl text-white font-semibold text-sm rounded-t-xl"
                                style={{
                                    background: "linear-gradient(90deg, #6D28FF, #7C3AED)",
                                    clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)",
                                }}
                            >
                                Book Your Service Here
                            </div>
                        </div>

                        <div
                            className="relative p-8 rounded-3xl rounded-tl-none shadow-2xl overflow-hidden border border-white/10"
                            style={{
                                backgroundColor: "#050B31",
                                backgroundImage: "url('/assets/images/gallery-15.webp')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {/* DARK OVERLAY */}
                            <div className="absolute inset-0 bg-[#050B31]/95 "></div>

                            {/* FORM */}
                            <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 w-full h-[440px] ">
                                <input
                                    type="text"
                                    placeholder="First Name*"
                                    className="bg-transparent border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none  focus:border-purple-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Last Name*"
                                    className="bg-transparent border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:border-purple-500"
                                />

                                <input
                                    type="email"
                                    placeholder="Your Email*"
                                    className="bg-transparent border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:border-purple-500"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number*"
                                    className="bg-transparent border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:border-purple-500"
                                />

                                <input
                                    type="url"
                                    placeholder="Your Website Url*"
                                    className="md:col-span-2 bg-transparent border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:border-purple-500"
                                />

                                <textarea
                                    rows={4}
                                    placeholder="Write Your Message Here*"
                                    className="md:col-span-2 bg-transparent border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:border-purple-500 resize-none"
                                ></textarea>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    className="md:col-span-2 mt-4 bg-[#6D28FF] hover:bg-[#7C3AED] transition-all text-white font-semibold py-4 rounded-xl"
                                >
                                    Send Message Now
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Element - flows naturally after content */}
         

        </section>
    );
};

export default BookAppointmentSection;
