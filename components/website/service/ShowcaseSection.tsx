"use client";

import React, { useState, useEffect } from "react";

interface ShowcaseItem {
    id?: number;
    title: string;
    description: string;
    image: string;
    order: number;
}

interface ShowcaseSectionData {
    id?: number;
    section_title: string;
    section_description: string;
    background_image?: string;
    background_image_mobile?: string;
    showcase_items: ShowcaseItem[];
}

const ShowcaseSection: React.FC = () => {
    const [showcaseData, setShowcaseData] = useState<ShowcaseSectionData>({
        section_title: 'Our Showcase',
        section_description: 'Explore our amazing work and projects that showcase our expertise and creativity.',
        background_image: '/assets/images/shape-5.webp',
        background_image_mobile: '/assets/images/shape-5.webp',
        showcase_items: [
            {
                id: 1,
                title: 'Improving Your Business Planning',
                description: 'We envision a future where our clients are at the forefront of their industries, setting new standards of excellence.',
                image: '/assets/images/icon-14.webp',
                order: 0
            },
            {
                id: 2,
                title: 'Expert Technical Solutions',
                description: 'Our expert team is here to help you find the right solutions tailored to your needs.',
                image: '/assets/images/icon-14.webp',
                order: 1
            }
        ]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShowcaseData = async () => {
            try {
                setLoading(true);
                console.log("Fetching showcase sections data from API...");

                const response = await fetch("http://localhost:8000/api/v1/showcase-sections", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Showcase sections API response data:", data);

                    if (data.success && data.data?.showcase_sections && data.data.showcase_sections.length > 0) {
                        // Get the first showcase section
                        const section = data.data.showcase_sections[0];
                        console.log("Using showcase section:", section);
                        console.log("Background image URL:", section.background_image);

                        setShowcaseData({
                            id: section.id,
                            section_title: section.section_title || 'Our Showcase',
                            section_description: section.section_description || 'Explore our amazing work and projects.',
                            background_image: section.background_image || '/assets/images/shape-5.webp',
                            background_image_mobile: section.background_image_mobile || '/assets/images/shape-5.webp',
                            showcase_items: section.showcase_items || []
                        });
                    } else {
                        console.log("No showcase sections found, using default data");
                    }
                } else {
                    console.log("Showcase sections API not available, using default data");
                }
            } catch (err) {
                console.error("Error fetching showcase sections data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchShowcaseData();
    }, []);

    if (loading) {
        return (
            <section className="py-20 pt-20 pb-2 relative overflow-hidden h-auto min-h-[520px]">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </section>
        );
    }
    return (
        <section
            className="py-20 pt-20 pb-2 relative overflow-hidden h-auto min-h-[520px]"
        >
            {/* Background Shape */}
            <div
                className="absolute inset-0 opacity-180"
                style={{
                    backgroundImage: `url('${showcaseData.background_image?.startsWith('http') ? showcaseData.background_image : `http://localhost:8000${showcaseData.background_image}`}')`,
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
                            • OUR SHOWCASE •
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            {showcaseData.section_title}
                        </h2>

                        <p className="text-gray-600 max-w-xl mb-10">
                            {showcaseData.section_description}
                        </p>

                        {/* INFO CARDS */}
                        <div className="space-y-6 ">
                            {showcaseData.showcase_items.map((item, index) => (
                                <div key={item.id || index} className="flex gap-4 bg-white p-6 rounded-2xl shadow-md hover:bg-purple-600 transition-all duration-300 cursor-pointer group" style={{ backgroundColor: '#F3F2F8' }}>
                                    <div className="flex items-center justify-center w-20 h-18 rounded-xl bg-white border-2 border-purple-400 group-hover:bg-purple-100 transition-all duration-300">
                                        {item.image ? (
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`}
                                                alt={`${item.title} Icon`}
                                                className="w-8 h-8"
                                            />
                                        ) : (
                                            <img
                                                src="/assets/images/icon-14.webp"
                                                alt="Showcase Item Icon"
                                                className="w-8 h-8"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative max-w-xl w-full">
                            {/* Background Shape */}
                            <div
                                className="absolute inset-0 h-[40%] left-70 top-25 opacity-120"
                                style={{
                                    backgroundImage: `url('${showcaseData.background_image_mobile?.startsWith('http') ? showcaseData.background_image_mobile : `http://localhost:8000${showcaseData.background_image_mobile}`}')`,
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
                                    src={showcaseData.showcase_items[0]?.image ?
                                        (showcaseData.showcase_items[0].image.startsWith('http') ?
                                            showcaseData.showcase_items[0].image :
                                            `http://localhost:8000${showcaseData.showcase_items[0].image}`) :
                                        '/assets/images/gallery-8.webp'
                                    }
                                    alt="Showcase"
                                    className="w-full h-auto object-cover scale-120 relative z-10"
                                />
                            </div>

                            {/* Empty Overlay */}
                            <div className="absolute inset-0"></div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
