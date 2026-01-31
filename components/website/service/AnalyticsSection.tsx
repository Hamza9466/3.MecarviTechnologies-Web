"use client";

import React, { useState, useEffect } from 'react';

interface AnalyticsSectionData {
    id?: number;
    section_title: string;
    subtitle: string;
    title: string;
    description: string;
    features: { title: string; description: string }[];
    button_text: string;
    button_url: string;
    main_image?: string;
    small_image?: string;
    created_at?: string;
    updated_at?: string;
}

interface AnalyticsData {
    sectionTitle: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonUrl: string;
    mainImage: string;
    smallImage: string;
}

const AnalyticsSection: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        sectionTitle: 'Analytics & Insights',
        title: 'Transform your data into actionable insights',
        subtitle: 'Data insights',
        description: 'Harness the power of advanced analytics to make informed decisions and drive business growth. Our comprehensive tools help you visualize trends, identify patterns, and optimize performance.',
        features: [
            'Real-time data processing and analysis',
            'Interactive dashboards and custom reports',
            'AI-powered predictions and recommendations'
        ],
        buttonText: 'Explore Analytics',
        buttonUrl: '/analytics',
        mainImage: '/assets/images/analytic_img.png',
        smallImage: '/assets/images/analytic_small.png'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setLoading(true);
                console.log("Fetching analytics data from API...");

                const response = await fetch("http://localhost:8000/api/v1/analytics-sections", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Analytics API response data:", result);

                    if (result.success && result.data?.analytics_sections && result.data.analytics_sections.length > 0) {
                        const section = result.data.analytics_sections[0];
                        console.log("Using analytics section:", section);

                        // Convert API data to component format
                        const convertedData: AnalyticsData = {
                            sectionTitle: section.section_title || 'Analytics & Insights',
                            title: section.title || 'Transform your data into actionable insights',
                            subtitle: section.subtitle || 'Data insights',
                            description: section.description || 'Harness the power of advanced analytics...',
                            features: section.features?.map((f: { title: string; description: string }) => f.title) || [
                                'Real-time data processing and analysis',
                                'Interactive dashboards and custom reports',
                                'AI-powered predictions and recommendations'
                            ],
                            buttonText: section.button_text || 'Explore Analytics',
                            buttonUrl: section.button_url || '/analytics',
                            mainImage: section.main_image ? `http://localhost:8000${section.main_image}` : '/assets/images/analytic_img.png',
                            smallImage: section.small_image ? `http://localhost:8000${section.small_image}` : '/assets/images/analytic_small.png'
                        };

                        setAnalyticsData(convertedData);
                    } else {
                        console.log("No analytics sections found, using default data");
                    }
                } else {
                    console.log("Analytics API not available, using default data");
                }
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) {
        return (
            <section className="py-20 -mt-20 relative overflow-hidden" style={{ backgroundColor: '#fef6fcff' }}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </section>
        );
    }
    return (
        <section className="py-20 -mt-20 relative overflow-hidden" style={{ backgroundColor: '#fef6fcff ' }}>

            <div className="container mx-auto px-4 w-[95%] relative z-10">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-aos="fade-up">
                        {analyticsData.sectionTitle}
                    </h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-aos="fade-up">
                    {/* Left Images */}
                    <div className="space-y-6 order-1 lg:order-1">
                        <div className="relative pl-8 pt-8 pb-8 rounded-2xl" style={{ backgroundColor: '#B1DEEF' }}>
                            <img
                                src={analyticsData.mainImage}
                                alt="Analytics Dashboard"
                                className="w-full rounded-2xl"
                                onError={(e) => {
                                    console.error('Main image failed to load:', analyticsData.mainImage);
                                    e.currentTarget.src = '/assets/images/analytic_img.png';
                                }}
                            />
                            <div className="absolute top-1/7 left-5/16 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg z-10">
                                <img
                                    src={analyticsData.smallImage}
                                    alt="Analytics Chart"
                                    className="w-64 h-36 object-cover  rounded-2xl"
                                    onError={(e) => {
                                        console.error('Small image failed to load:', analyticsData.smallImage);
                                        e.currentTarget.src = '/assets/images/analytic_small.png';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-6 order-2 lg:order-2 ms-25">
                        <p className='text-blue-800 text-xl font-bold'>{analyticsData.subtitle}</p>
                        <h2 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight max-w-lg">
                            {analyticsData.title}
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            {analyticsData.description}
                        </p>

                        <div className="space-y-4">
                            {analyticsData.features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">{feature}</p>
                                </div>
                            ))}
                        </div>

                        <a
                            href={analyticsData.buttonUrl}
                            className="text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
                            style={{ backgroundColor: '#2B5BFD' }}
                        >
                            {analyticsData.buttonText}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AnalyticsSection;
