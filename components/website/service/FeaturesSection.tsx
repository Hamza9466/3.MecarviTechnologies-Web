"use client";

import React, { useState, useEffect } from 'react';

interface Feature {
    title: string;
    description: string;
}

interface FeaturesSectionData {
    id?: number;
    section_title: string;
    subtitle: string;
    title: string;
    description: string;
    features: Feature[];
    button_text: string;
    main_image?: string;
    small_image?: string;
    created_at?: string;
    updated_at?: string;
}

const FeaturesSection: React.FC = () => {
    const [featuresData, setFeaturesData] = useState<FeaturesSectionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturesData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/features-sections');

                if (!response.ok) {
                    throw new Error(`Failed to fetch features data: ${response.status}`);
                }

                const result = await response.json();

                if (result.success && result.data?.features_sections) {
                    setFeaturesData(result.data.features_sections);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (error) {
                console.error('Error fetching features data:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturesData();
    }, []);

    // Fallback static data for development or when API fails
    const staticData: FeaturesSectionData = {
        section_title: "Business analytics",
        subtitle: "Business analytics subtitle",
        title: "Accelerate your workflow and minimise your time",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        features: [
            {
                title: "Fully customisable for developers",
                description: "Tailor the solution to meet your specific development needs"
            },
            {
                title: "Variants and Component properties",
                description: "Flexible component system with extensive customization options"
            },
            {
                title: "Interactions for easy prototyping",
                description: "Rapid prototyping with interactive components and smooth transitions"
            }
        ],
        button_text: "Try Free Version",
        main_image: "/assets/images/features_img_one.png",
        small_image: "/assets/images/features_img_two.png"
    };

    // Use API data if available, otherwise fallback to static data
    const displayData = featuresData.length > 0 ? featuresData[0] : staticData;

    if (loading) {
        return (
            <section className="py-20 bg-white -mt-10">
                <div className="container mx-auto px-4 w-[95%]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="mt-2 text-gray-600">Loading features...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error && featuresData.length === 0) {
        console.warn('Using fallback data due to API error:', error);
    }

    return (
        <section className="py-20 bg-white -mt-10">
            <div className="container mx-auto px-4 w-[95%]">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-aos="fade-up">
                        {displayData.section_title || "Our Features"}
                    </h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6" data-aos="fade-up">
                        {displayData.subtitle && (
                            <p className='text-blue-800 text-xl font-bold'>{displayData.subtitle}</p>
                        )}
                        <h2 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight max-w-lg">
                            {displayData.title}
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            {displayData.description}
                        </p>

                        <div className="space-y-4">
                            {displayData.features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 font-medium">{feature.title}</p>
                                        {feature.description && (
                                            <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {displayData.button_text && (
                            <button className="text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" style={{ backgroundColor: '#2B5BFD' }}>
                                {displayData.button_text}
                            </button>
                        )}
                    </div>

                    {/* Right Images */}
                    <div className="relative" data-aos="fade-up">
                        <div className="relative pl-8 pt-8 pb-8 rounded-2xl" style={{ backgroundColor: '#DFD1ED' }}>
                            {/* Main Image */}
                            {displayData.main_image && (
                                <img
                                    src={displayData.main_image.startsWith('http') ? displayData.main_image : `http://localhost:8000${displayData.main_image}`}
                                    alt="Business Analytics Dashboard"
                                    className="w-full rounded-2xl"
                                    onError={(e) => {
                                        // Fallback to static image if API image fails
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/assets/images/features_img_one.png";
                                    }}
                                />
                            )}

                            {/* Small Image */}
                            {displayData.small_image && (
                                <div className="absolute top-1/5 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg z-10">
                                    <img
                                        src={displayData.small_image.startsWith('http') ? displayData.small_image : `http://localhost:8000${displayData.small_image}`}
                                        alt="Business Analytics Dashboard"
                                        className="w-64 h-48 object-cover rounded-2xl"
                                        onError={(e) => {
                                            // Fallback to static image if API image fails
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/assets/images/features_img_two.png";
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
