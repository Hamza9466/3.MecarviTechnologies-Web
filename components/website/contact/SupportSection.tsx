"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SupportSection {
    id: number;
    section_title: string;
    title: string;
    description: string;
    call_icon: string | null;
    call_title: string;
    call_description: string;
    call_phone: string;
    email_icon: string | null;
    email_title: string;
    email_description: string;
    email_address: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export default function SupportSection() {
    const [supportData, setSupportData] = useState<SupportSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSupportSection = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("http://localhost:8000/api/v1/support-sections", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data?.support_sections?.length > 0) {
                        // Get the first active support section
                        const activeSection = data.data.support_sections.find(
                            (section: SupportSection) => section.is_active
                        ) || data.data.support_sections[0];

                        setSupportData(activeSection);
                    } else {
                        setError("No support section data available");
                    }
                } else {
                    throw new Error("Failed to fetch support section");
                }
            } catch (err) {
                console.error("Error fetching support section:", err);
                // Set fallback data when API fails
                setSupportData({
                    id: 1,
                    section_title: "Get in Touch",
                    title: "We're Here to Help",
                    description: "Have questions about our services? Need support? Our team is ready to assist you with any inquiries you may have.",
                    call_icon: null,
                    call_title: "Call Us",
                    call_description: "Speak with our friendly team during business hours",
                    call_phone: "+1-234-567-8900",
                    email_icon: null,
                    email_title: "Email Us",
                    email_description: "Send us a message and we'll respond as soon as possible",
                    email_address: "support@mecarvi.com",
                    is_active: true,
                    sort_order: 1,
                    created_at: "2024-01-01T00:00:00.000000Z",
                    updated_at: "2024-01-01T00:00:00.000000Z",
                });
                setError(""); // Clear error since we have fallback data
            } finally {
                setLoading(false);
            }
        };

        fetchSupportSection();
    }, []);

    if (loading) {
        return (
            <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
                <div className="max-w-[95%] mx-auto">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                        <p className="mt-4 text-gray-600">Loading support section...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !supportData) {
        return (
            <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
                <div className="max-w-[95%] mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-600">{error || "Support section not available"}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
            <div className="max-w-[95%] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        {supportData.section_title}
                    </h2>
                    <h3 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
                        {supportData.title}
                    </h3>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        {supportData.description}
                    </p>
                </div>

                {/* Contact Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Call Us Block */}
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="mb-6">
                            {supportData.call_icon ? (
                                <img
                                    src={`http://localhost:8000/storage/${supportData.call_icon}`}
                                    alt="Call Us"
                                    className="w-20 h-20 mx-auto object-contain"
                                />
                            ) : (
                                <div className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {supportData.call_title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {supportData.call_description}
                        </p>
                        <a
                            href={`tel:${supportData.call_phone}`}
                            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            {supportData.call_phone}
                        </a>
                    </div>

                    {/* Email Us Block */}
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="mb-6">
                            {supportData.email_icon ? (
                                <img
                                    src={`http://localhost:8000/storage/${supportData.email_icon}`}
                                    alt="Email Us"
                                    className="w-20 h-20 mx-auto object-contain"
                                />
                            ) : (
                                <div className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {supportData.email_title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {supportData.email_description}
                        </p>
                        <a
                            href={`mailto:${supportData.email_address}`}
                            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            {supportData.email_address}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
