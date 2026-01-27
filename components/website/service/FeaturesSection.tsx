"use client";

import React from 'react';

const FeaturesSection: React.FC = () => {
    return (
        <section className="py-20 bg-white -mt-10">
            <div className="container mx-auto px-4 w-[95%]">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-aos="fade-up">
                        Our Features
                    </h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" >
                    {/* Left Content */}
                    <div className="space-y-6" data-aos="fade-up">
                        <p className='text-blue-800 text-xl font-bold'>Business analytics</p>
                        <h2 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight max-w-lg">
                            Accelerate your workflow and minimise your time
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Fully customisable for developers</p>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Variants and Component properties</p>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Interactions for easy prototyping</p>
                            </div>
                        </div>

                        <button className="text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" style={{ backgroundColor: '#2B5BFD' }}>
                            Try Free Version
                        </button>
                    </div>

                    {/* Right Images */}
                    <div className="relative" data-aos="fade-up">
                        <div className="relative pl-8 pt-8 pb-8 rounded-2xl" style={{ backgroundColor: '#DFD1ED' }}>
                            <img
                                src="/assets/images/features_img_one.png"
                                alt="Business Analytics Dashboard"
                                className="w-full rounded-2xl"
                            />
                            <div className="absolute top-1/5 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg z-10">
                                <img
                                    src="/assets/images/features_img_two.png"
                                    alt="Business Analytics Dashboard"
                                    className="w-64 h-48 object-cover rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
