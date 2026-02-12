"use client";

import React, { useState, useEffect } from 'react';

interface ChartSectionData {
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

interface ChartData {
    sectionTitle: string;
    subtitle: string;
    title: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonUrl: string;
    mainImage: string;
    smallImage: string;
}

export default function ChartSection() {
    const [chartData, setChartData] = useState<ChartData>({
        sectionTitle: 'Performance Charts',
        title: 'Track your progress with detailed analytics',
        subtitle: 'Performance metrics',
        description: 'Monitor key performance indicators and gain valuable insights into your business operations. Our comprehensive dashboard provides real-time data visualization and reporting tools to help you make informed decisions.',
        features: [
            'Comprehensive data visualization tools',
            'Customizable reports and dashboards',
            'Real-time performance monitoring'
        ],
        buttonText: 'View Charts',
        buttonUrl: '/charts',
        mainImage: '/assets/images/Chart.png',
        smallImage: '/assets/images/12.png'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                console.log("Fetching chart data from API...");

                const response = await fetch("http://localhost:8000/api/v1/chart-sections", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Chart API response data:", result);

                    if (result.success && result.data?.chart_sections && result.data.chart_sections.length > 0) {
                        const section = result.data.chart_sections[0];
                        console.log("Using chart section:", section);

                        // Convert API data to component format
                        const convertedData: ChartData = {
                            sectionTitle: section.section_title || 'Performance Charts',
                            title: section.title || 'Track your progress with detailed analytics',
                            subtitle: section.subtitle || 'Performance metrics',
                            description: section.description || 'Monitor key performance indicators and gain valuable insights into your business operations. Our comprehensive dashboard provides real-time data visualization and reporting tools to help you make informed decisions.',
                            features: section.features?.map((f: { title: string; description: string }) => f.title) || [
                                'Comprehensive data visualization tools',
                                'Customizable reports and dashboards',
                                'Real-time performance monitoring'
                            ],
                            buttonText: section.button_text || 'View Charts',
                            buttonUrl: section.button_url || '/charts',
                            mainImage: section.main_image ? `http://localhost:8000${section.main_image}` : '/assets/images/Chart.png',
                            smallImage: section.small_image ? `http://localhost:8000${section.small_image}` : '/assets/images/12.png'
                        };

                        setChartData(convertedData);
                    } else {
                        console.log("No chart sections found, using default data");
                    }
                } else {
                    console.log("Chart API not available, using default data");
                }
            } catch (err) {
                console.error("Error fetching chart data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-white -mt-20">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </section>
        );
    }
    return (
        <section className="py-20 bg-white -mt-20">
            <div className="container mx-auto px-4 w-[95%]">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
                        {chartData.sectionTitle}
                    </h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-aos="fade-up">
                    {/* Left Content */}
                    <div className="space-y-6 order-2 lg:order-1">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 leading-tight max-w-lg">
                            {chartData.title}
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            {chartData.description}
                        </p>

                        <div className="space-y-4">
                            {chartData.features.map((feature, index) => (
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

                    </div>

                    {/* Right Images */}
                    <div className="space-y-6 order-1 lg:order-2">
                        <div className="relative pl-8 pt-2 pb-2 rounded-2xl" style={{ backgroundColor: '#B3F7D5' }}>
                            <img
                                src={chartData.mainImage}
                                alt="Analytics Dashboard"
                                className="w-full rounded-2xl"
                                onError={(e) => {
                                    console.error('Main image failed to load:', chartData.mainImage);
                                    e.currentTarget.src = '/assets/images/Chart.png';
                                }}
                            />
                            <div className="absolute top-1/3 left-2/3 mt-8 transform -translate-x-1/5 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-lg z-10">
                                <img
                                    src={chartData.smallImage}
                                    alt="Performance Chart"
                                    className="object-cover rounded-2xl"
                                    style={{ width: '470px', height: '312px' }}
                                    onError={(e) => {
                                        console.error('Small image failed to load:', chartData.smallImage);
                                        e.currentTarget.src = '/assets/images/12.png';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

