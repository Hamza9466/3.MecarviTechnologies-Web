"use client";

import React from "react";

const ShowcaseSection: React.FC = () => {
    return (
        <section
            className="py-20 pt-20 pb-2 relative overflow-hidden h-auto min-h-[520px]"
        >
            {/* Background Shape */}
            <div
                className="absolute inset-0 opacity-180"
                style={{
                    backgroundImage: "url('/assets/images/shape-5.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>

            <div className="container mx-auto px-4 w-[95%] relative z-10" data-aos="fade-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT SIDE */}
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

                    {/* RIGHT IMAGE */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative max-w-xl w-full">
                            {/* Background Shape */}
                            <div
                                className="absolute inset-0 h-[40%] left-70 top-25 opacity-120"
                                style={{
                                    backgroundImage: "url('/assets/images/shape-3.webp')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            ></div>

                            {/* Blue Div Background */}
                            {/* Image Container */}
                            <div className="relative z-10 p-8 pt-2">
                                {/* Blue Background Div */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-blue-700 w-64 h-64 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] mr-30 mt-40"></div>
                                </div>
                                <img
                                    src="/assets/images/gallery-8.webp"
                                    alt="Showcase"
                                    className="w-full h-auto object-cover scale-120 relative z-10"
                                />
                            </div>

                            {/* Empty Overlay */}
                            <div className="absolute inset-0"></div>

                            {/* Floating Badge */}

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
