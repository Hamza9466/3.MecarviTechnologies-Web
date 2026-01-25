"use client";

import { useState, useEffect } from "react";

interface HoursOfOperation {
    id: number;
    section_title: string | null;
    category_title: string;
    monday_friday_hours: string | null;
    saturday_hours: string | null;
    sunday_hours: string | null;
    sunday_status: string | null;
    public_holidays_hours: string | null;
    public_holidays_status: string | null;
    description_1: string | null;
    description_2: string | null;
    is_active: boolean;
    sort_order: number;
}

export default function HoursOfOperation() {
    const [hours, setHours] = useState<HoursOfOperation[]>([]);
    const [sectionTitle, setSectionTitle] = useState<string>("Hours of Operation");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHours = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8000/api/v1/hours-of-operation", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        // Set section title from API, or use default if not provided
                        if (data.data.section_title && data.data.section_title.trim()) {
                            setSectionTitle(data.data.section_title.trim());
                        } else {
                            // Fallback: try to get section title from first hour entry
                            if (data.data.hours_of_operation && data.data.hours_of_operation.length > 0) {
                                const firstHour = data.data.hours_of_operation[0];
                                if (firstHour.section_title && firstHour.section_title.trim()) {
                                    setSectionTitle(firstHour.section_title.trim());
                                }
                            }
                        }

                        // Set hours
                        if (data.data.hours_of_operation) {
                            const activeHours = data.data.hours_of_operation
                                .filter((hour: HoursOfOperation) => hour.is_active)
                                .sort((a: HoursOfOperation, b: HoursOfOperation) => a.sort_order - b.sort_order);
                            setHours(activeHours);
                        } else {
                            setHours([]);
                        }
                    } else {
                        setHours([]);
                    }
                } else if (response.status === 401) {
                    // Handle 401 gracefully - show default content
                    console.warn("Unauthorized access to hours of operation API (401). Showing default content.");
                    setHours([]);
                } else {
                    console.error("Failed to fetch hours of operation:", response.status);
                    setHours([]);
                }
            } catch (err) {
                console.error("Error fetching hours of operation:", err);
                setHours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHours();
    }, []);

    const renderHoursItem = (hour: HoursOfOperation) => {
        return (
            <div key={hour.id} className="bg-white p-8 rounded-4xl border-12 border-[#F0ECF8] shadow-sm transition-all duration-300 hover:shadow-md flex flex-col w-full max-w-[360px] mx-auto">
                {/* Title with Gradient Background like in image */}
                <div className="mb-6">
                    <div className="inline-block bg-linear-to-r from-indigo-600 to-pink-500 px-6 py-2 rounded-full shadow-md">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            {hour.category_title.replace(':', '')}
                        </h3>
                    </div>
                </div>

                {/* Divider line like in image */}
                <div className="w-full h-px bg-gray-300 mb-6"></div>

                {/* Hours List */}
                <ul className="grid grid-cols-2 gap-x-4 gap-y-4">
                    {hour.monday_friday_hours && (
                        <li className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Monday - Friday</span>
                            <span className="text-sm font-medium text-gray-700">{hour.monday_friday_hours}</span>
                        </li>
                    )}
                    {hour.saturday_hours && (
                        <li className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Saturday</span>
                            <span className="text-sm font-medium text-gray-700">{hour.saturday_hours}</span>
                        </li>
                    )}
                    {(hour.sunday_hours || hour.sunday_status) && (
                        <li className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Sunday</span>
                            <span className="text-sm font-medium text-gray-700">{hour.sunday_hours || hour.sunday_status}</span>
                        </li>
                    )}
                    {(hour.public_holidays_hours || hour.public_holidays_status) && (
                        <li className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Public Holidays</span>
                            <span className="text-sm font-medium text-gray-700">{hour.public_holidays_hours || hour.public_holidays_status}</span>
                        </li>
                    )}
                </ul>
            </div>
        );
    };

    return (
        <section className="w-full bg-[#F0EFEB] pt-12 pb-12 relative z-10 flex justify-center">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <h2 className="text-center text-3xl font-bold text-gray-900 mb-16 relative">
                    {sectionTitle}
                    <span className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-16 h-1 bg-linear-to-r from-indigo-600 to-pink-500 rounded-full"></span>
                </h2>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading hours of operation...</p>
                    </div>
                ) : hours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 justify-items-center">
                        {hours.map((hour) => renderHoursItem(hour))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm font-medium">No hours of operation available.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
