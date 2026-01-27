"use client";

import React from 'react';

const AnalyticsSection: React.FC = () => {
    return (
        <section className="py-20 -mt-20 relative overflow-hidden" style={{ backgroundColor: '#fcf5ffffon ' }}>

            <div className="container mx-auto px-4 w-[95%] relative z-10">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-aos="fade-up">
                        Analytics & Insights
                    </h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-aos="fade-up">
                    {/* Left Images */}
                    <div className="space-y-6 order-1 lg:order-1">
                        <div className="relative pl-8 pt-8 pb-8 rounded-2xl" style={{ backgroundColor: '#B1DEEF' }}>
                            <img
                                src="/assets/images/analytic_img.png"
                                alt="Analytics Dashboard"
                                className="w-full rounded-2xl"
                            />
                            <div className="absolute top-1/7 left-5/16 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg z-10">
                                <img
                                    src="/assets/images/analytic_small.png"
                                    alt="Analytics Chart"
                                    className="w-64 h-36 object-cover  rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-6 order-2 lg:order-2 ms-25">
                        <p className='text-blue-800 text-xl font-bold'>Data insights</p>
                        <h2 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight max-w-lg">
                            Transform your data into actionable insights
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Harness the power of advanced analytics to make informed decisions and drive business growth. Our comprehensive tools help you visualize trends, identify patterns, and optimize performance.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Real-time data processing and analysis</p>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Interactive dashboards and custom reports</p>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">AI-powered predictions and recommendations</p>
                            </div>
                        </div>

                        <button className="text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" style={{ backgroundColor: '#2B5BFD' }}>
                            Explore Analytics
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AnalyticsSection;
