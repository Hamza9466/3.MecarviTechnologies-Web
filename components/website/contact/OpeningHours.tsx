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
            <div key={hour.id} className="px-6 lg:border-l lg:border-white/40 first:border-l-0">
                <h3 className="font-semibold mb-4">{hour.category_title}:</h3>
                <ul className="space-y-2 text-sm opacity-90">
                    {hour.monday_friday_hours && (
                        <li>Monday - Friday: {hour.monday_friday_hours}</li>
                    )}
                    {hour.saturday_hours && (
                        <li>Saturday: {hour.saturday_hours}</li>
                    )}
                    {hour.sunday_hours ? (
                        <li>Sunday: {hour.sunday_hours}</li>
                    ) : hour.sunday_status ? (
                        <li>Sunday: {hour.sunday_status}</li>
                    ) : null}
                    {hour.public_holidays_hours ? (
                        <li>Public Holidays: {hour.public_holidays_hours}</li>
                    ) : hour.public_holidays_status ? (
                        <li>Public Holidays: {hour.public_holidays_status}</li>
                    ) : null}
                </ul>
            </div>
        );
    };

    return (
        <section className="w-full bg-gradient-to-r from-pink-600 to-pink-500 h-[550px] ms-15  lg:w-[92%] ">
            <div className=" mx-auto px-6 py-24 text-white">

                {/* Title */}
                <h2 className="text-center text-2xl font-semibold mb-12">
                    {sectionTitle}:
                </h2>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="mt-4 text-white/80">Loading hours of operation...</p>
                    </div>
                ) : hours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {hours.map((hour) => renderHoursItem(hour))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-white/80">
                        <p>No hours of operation available.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
