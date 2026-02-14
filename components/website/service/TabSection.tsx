"use client";

import React, { useState, useEffect } from "react";

interface TabItem {
    title: string;
    icon: string;
    content: string;
    image?: string;
    features?: (string | { heading: string; text: string })[];
}

interface TabData {
    sectionTitle: string;
    sectionDescription: string;
    tabs: TabItem[];
}

const TabSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [tabData, setTabData] = useState<TabData>({
        sectionTitle: 'We Provide Expert Service',
        sectionDescription: 'We aim to earn your trust and have a long term relationship with you. Our team provides exceptional automotive services to keep your vehicle running smoothly.',
        tabs: [
            {
                title: 'Additional Services',
                icon: '',
                content: 'Our team provides a wide range of automotive services to keep your vehicle running smoothly. From basic maintenance to complex repairs, we ensure reliable and professional service.',
                image: '/assets/images/analytic_small.png',
                features: []
            },
            {
                title: 'Our Advantages',
                icon: '',
                content: 'Our advantages make us stand out from the rest. We combine quality, transparency, and reliability to provide exceptional service for every customer.',
                image: '',
                features: [
                    'We Make It Easy',
                    'OEM Factory Parts Warranty',
                    'Fair And Transparent Pricing',
                    'Happiness Guaranteed'
                ]
            },
            {
                title: 'About Company',
                icon: '',
                content: 'Learn more about our company values, mission, and commitment to providing exceptional service to our customers.',
                image: '',
                features: [
                    'We Make It Easy',
                    'OEM Factory Parts Warranty',
                    'Fair And Transparent Pricing',
                    'Happiness Guaranteed'
                ]
            }
        ]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTabData = async () => {
            try {
                setLoading(true);
                console.log("Fetching tab data from API...");

                const response = await fetch("http://localhost:8000/api/v1/tab-sections", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Tab API response data:", result);

                    if (result.success && result.data) {
                        // Handle both single section and array of sections
                        let tabSection;
                        if (result.data.tab_sections && result.data.tab_sections.length > 0) {
                            tabSection = result.data.tab_sections[0]; // Use first section
                        } else if (result.data.tab_section) {
                            tabSection = result.data.tab_section;
                        } else {
                            console.log("No tab section data found, using default");
                            return;
                        }

                        console.log("Processing tab section:", tabSection);

                        // Convert API data to component format
                        const convertedData: TabData = {
                            sectionTitle: tabSection.section_title || 'We Provide Expert Service',
                            sectionDescription: tabSection.section_description || 'We aim to earn your trust and have a long term relationship with you. Our team provides exceptional automotive services to keep your vehicle running smoothly.',
                            tabs: []
                        };

                        // Process tabs - ensure we have exactly 3 tabs
                        if (tabSection.tabs && Array.isArray(tabSection.tabs)) {
                            convertedData.tabs = tabSection.tabs.map((tab: any, index: number) => {
                                // Handle features based on tab type
                                let processedFeatures = tab.features || [];

                                // For Tab 3 (index 2), convert string features to objects with heading and text
                                if (index === 2 && Array.isArray(processedFeatures)) {
                                    processedFeatures = processedFeatures.map((feature: any, featureIndex: number) => {
                                        if (typeof feature === 'string') {
                                            // Convert string to object format
                                            const defaultTexts = [
                                                "Our streamlined process ensures getting your vehicle serviced is simple and hassle-free, from booking to completion.",
                                                "All our repairs come with genuine OEM parts and comprehensive warranty coverage for your peace of mind.",
                                                "We provide detailed quotes with no hidden fees, ensuring you know exactly what you're paying for.",
                                                "Your satisfaction is our priority. We stand behind our work with a satisfaction guarantee on all services."
                                            ];
                                            return {
                                                heading: feature,
                                                text: defaultTexts[featureIndex] || "Exceptional service and quality workmanship guaranteed."
                                            };
                                        } else if (typeof feature === 'object' && feature.heading) {
                                            return feature;
                                        } else {
                                            return {
                                                heading: feature.title || feature,
                                                text: feature.text || feature.description || "Exceptional service and quality workmanship guaranteed."
                                            };
                                        }
                                    });
                                }

                                return {
                                    title: tab.tab_title || `Tab ${index + 1}`,
                                    icon: tab.tab_icon ? (tab.tab_icon.startsWith('http') ? tab.tab_icon : `http://localhost:8000${tab.tab_icon}`) : '',
                                    content: tab.tab_content || '',
                                    image: tab.tab_image ? (tab.tab_image.startsWith('http') ? tab.tab_image : `http://localhost:8000${tab.tab_image}`) : '',
                                    features: processedFeatures
                                };
                            });
                        }

                        // Ensure we have exactly 3 tabs
                        while (convertedData.tabs.length < 3) {
                            const defaultTabs = [
                                {
                                    title: 'Additional Services',
                                    icon: '',
                                    content: 'Our team provides a wide range of automotive services to keep your vehicle running smoothly. From basic maintenance to complex repairs, we ensure reliable and professional service.',
                                    image: '/assets/images/analytic_small.png',
                                    features: []
                                },
                                {
                                    title: 'Our Advantages',
                                    icon: '',
                                    content: 'Our advantages make us stand out from the rest. We combine quality, transparency, and reliability to provide exceptional service for every customer.',
                                    image: '',
                                    features: [
                                        'We Make It Easy',
                                        'OEM Factory Parts Warranty',
                                        'Fair And Transparent Pricing',
                                        'Happiness Guaranteed'
                                    ]
                                },
                                {
                                    title: 'About Company',
                                    icon: '',
                                    content: 'Learn more about our company values, mission, and commitment to providing exceptional service to our customers.',
                                    image: '',
                                    features: [
                                        'We Make It Easy',
                                        'OEM Factory Parts Warranty',
                                        'Fair And Transparent Pricing',
                                        'Happiness Guaranteed'
                                    ]
                                }
                            ];
                            convertedData.tabs.push(defaultTabs[convertedData.tabs.length]);
                        }

                        console.log("Converted tab data for component:", convertedData);
                        setTabData(convertedData);
                    } else {
                        console.log("Tab API response not successful, using default data");
                    }
                } else {
                    console.log("Tab API not available, using default data");
                }
            } catch (err) {
                console.error("Error fetching tab data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTabData();
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
                {/* Heading and Description - Above tabs */}
                <div className="text-center mb-12">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 mb-2" data-aos="fade-up">
                        {tabData.sectionTitle}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto" data-aos="fade-up">
                        {tabData.sectionDescription}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center items-center mb-12 " data-aos="fade-up">
                    {tabData.tabs.map((tab, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`flex flex-col items-center cursor-pointer pb-2 px-4 ${activeTab === index
                                    ? "border-b-4 border-yellow-400 text-yellow-500"
                                    : "text-gray-700"
                                    }`}
                                onClick={() => setActiveTab(index)}
                            >
                                <div className="text-3xl mb-2">
                                    {tab.icon ? (
                                        <img
                                            src={tab.icon}
                                            alt={`${tab.title} icon`}
                                            className="w-8 h-8 object-cover rounded"
                                        />
                                    ) : (
                                        // Default SVG icon when no image is uploaded
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    )}
                                </div>
                                <span className="font-semibold">{tab.title}</span>
                            </div>
                            {index < tabData.tabs.length - 1 && (
                                <div className="h-12 w-px bg-gray-300 mx-2"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

                {/* Tab Content - Full width dark block */}
            <div className="w-full px-4 md:px-6 lg:px-8 -mt-8">
                <div className="text-white p-8 md:p-12 rounded-t-2xl rounded-b-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 w-full" style={{ backgroundColor: '#3A3A3A' }} data-aos="fade-up">
                    {activeTab === 0 && (
                        <>
                            {/* Tab 1: Image left, paragraph right */}
                            <div className="flex justify-center items-center">
                                <img
                                    src={tabData.tabs[0]?.image || '/assets/images/analytic_small.png'}
                                    alt="Additional Service"
                                    className="rounded-2xl w-full h-auto object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-lg text-gray-200">
                                    {tabData.tabs[0]?.content || 'Our team provides a wide range of automotive services to keep your vehicle running smoothly. From basic maintenance to complex repairs, we ensure reliable and professional service.'}
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === 1 && (
                        <>
                            {/* Tab 2: Paragraph left, points right */}
                            <div className="flex flex-col justify-center space-y-4">
                                <p className="text-lg text-gray-200">
                                    {tabData.tabs[1]?.content || 'Our advantages make us stand out from the rest. We combine quality, transparency, and reliability to provide exceptional service for every customer.'}
                                </p>
                            </div>
                            <div className="space-y-4">
                                {(tabData.tabs[1]?.features || [
                                    "We Make It Easy",
                                    "OEM Factory Parts Warranty",
                                    "Fair And Transparent Pricing",
                                    "Happiness Guaranteed"
                                ]).map((item, index) => (
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
                                        <p className="text-gray-200">{typeof item === 'object' ? `${item.heading}: ${item.text}` : item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 2 && (
                        <>
                            {/* Tab 3: About Company - 2x2 grid with heading + text, vertically centered */}
                            <div className="flex justify-center items-center min-h-[320px] w-full max-w-4xl mx-auto px-4 lg:px-8 col-span-1 lg:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 w-full">
                                    {(tabData.tabs[2]?.features || [
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
                                    ]).map((item, index) => (
                                        <div key={index} className="flex items-start space-x-4 min-w-0">
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
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-semibold text-white mb-1">
                                                    {typeof item === 'string' ? item : item.heading}
                                                </h4>
                                                <p className="text-gray-300 text-sm">
                                                    {typeof item === 'string' ? item : item.text}
                                                </p>
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
