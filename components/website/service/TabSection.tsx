"use client";

import React, { useState } from "react";

const TabSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        {
            title: "Additional Services",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            title: "Our Advantages",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: "About Company",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
    ];

    return (
        <section className="py-20 bg-white -mt-20">
            <div className="container mx-auto px-4 w-[95%]">
                {/* Heading and Description - Above tabs */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        We Provide Expert Service
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We aim to earn your trust and have a long term relationship with you. Our team provides exceptional automotive services to keep your vehicle running smoothly.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center items-center mb-12 ">
                    {tabs.map((tab, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`flex flex-col items-center cursor-pointer pb-2 px-4 ${activeTab === index
                                    ? "border-b-4 border-yellow-400 text-yellow-500"
                                    : "text-gray-700"
                                    }`}
                                onClick={() => setActiveTab(index)}
                            >
                                <div className="text-3xl mb-2">{tab.icon}</div>
                                <span className="font-semibold">{tab.title}</span>
                            </div>
                            {index < tabs.length - 1 && (
                                <div className="h-12 w-px bg-gray-300 mx-2"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="text-white -mt-8 p-12 rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ backgroundColor: '#3A3A3A' }}>
                    {activeTab === 0 && (
                        <>
                            {/* Tab 1: Image left, paragraph right */}
                            <div className="flex justify-center items-center">
                                <img
                                    src="/assets/images/analytic_small.png"
                                    alt="Additional Service"
                                    className="rounded-2xl w-full h-auto object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-lg text-gray-200">
                                    Our team provides a wide range of automotive services to keep
                                    your vehicle running smoothly. From basic maintenance to
                                    complex repairs, we ensure reliable and professional
                                    service.
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === 1 && (
                        <>
                            {/* Tab 2: Paragraph left, points right */}
                            <div className="flex flex-col justify-center space-y-4">
                                <p className="text-lg text-gray-200">
                                    Our advantages make us stand out from the rest. We combine
                                    quality, transparency, and reliability to provide exceptional
                                    service for every customer.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    "We Make It Easy",
                                    "OEM Factory Parts Warranty",
                                    "Fair And Transparent Pricing",
                                    "Happiness Guaranteed",
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-7 h-7 border-2 border-yellow-400 rounded-lg flex items-center justify-center mt-1">
                                            <svg
                                                className="w-4 h-4 text-yellow-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-gray-200">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 2 && (
                        <>
                            {/* Tab 3: paragraph and bullet points in 2x2 grid */}

                            <div className="flex justify-center items-center min-h-[300px] w-[1300px] px-8">
                                <div className="grid grid-cols-2 gap-x-32 gap-y-8 w-full">
                                    {[
                                        {
                                            heading: "We Make It Easy",
                                            text: "Our streamlined process ensures getting your vehicle serviced is simple and hassle-free, from booking to completion."
                                        },
                                        {
                                            heading: "OEM Factory Parts Warranty",
                                            text: "All our repairs come with genuine OEM parts and comprehensive warranty coverage for your peace of mind."
                                        },
                                        {
                                            heading: "Fair And Transparent Pricing",
                                            text: "We provide detailed quotes with no hidden fees, ensuring you know exactly what you're paying for."
                                        },
                                        {
                                            heading: "Happiness Guaranteed",
                                            text: "Your satisfaction is our priority. We stand behind our work with a satisfaction guarantee on all services."
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 ms-25 w-7 h-7 border-2 border-yellow-400 rounded-lg flex items-center justify-center mt-1">
                                                <svg
                                                    className="w-4 h-4 text-yellow-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-white mb-1">{item.heading}</h4>
                                                <p className="text-gray-300 text-sm w-[280px]">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TabSection;
