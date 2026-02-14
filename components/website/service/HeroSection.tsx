"use client";

import React, { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

const SERVICE_SLIDES_CACHE_KEY = "service_hero_slides";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes – avoids 429 rate limit

interface ServicePageSlide {
    id: number;
    bg_image: string;
    small_text: string;
    main_heading: string;
    outlined_heading: string;
    description: string;
    background_text: string;
    button_text: string;
    button_url: string;
}

interface SlideData {
    id: number;
    image: string;
    smallText: string;
    mainHeading: string;
    outlinedHeading: string;
    description: string;
    backgroundText: string;
    buttonText: string;
    buttonUrl: string;
}

function getCachedSlides(): SlideData[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(SERVICE_SLIDES_CACHE_KEY);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw) as { data: SlideData[]; ts: number };
        if (Date.now() - ts > CACHE_TTL_MS) return null;
        return Array.isArray(data) ? data : null;
    } catch {
        return null;
    }
}

function setCachedSlides(data: SlideData[]) {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(SERVICE_SLIDES_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch {
        // ignore
    }
}

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = getCachedSlides();
        if (cached && cached.length > 0) {
            setSlides(cached);
            setLoading(false);
            return;
        }

        const fetchSlides = async () => {
            try {
                setLoading(true);

                const response = await fetch(apiUrl("/api/v1/service-page"), {
                    method: "GET",
                    headers: { Accept: "application/json" },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data?.service_pages?.length > 0) {
                        const serviceSlides = data.data.service_pages.map((page: ServicePageSlide) => ({
                            id: page.id,
                            image: page.bg_image?.startsWith("http") ? page.bg_image : apiUrl(page.bg_image?.startsWith("/") ? page.bg_image : `/${page.bg_image || ""}`),
                            smallText: page.small_text,
                            mainHeading: page.main_heading,
                            outlinedHeading: page.outlined_heading,
                            description: page.description,
                            backgroundText: page.background_text,
                            buttonText: page.button_text,
                            buttonUrl: page.button_url,
                        }));
                        setSlides(serviceSlides);
                        setCachedSlides(serviceSlides);
                    }
                } else if (response.status === 429) {
                    console.warn("Service slides: too many requests (429). Using cached or default.");
                    const fallback = getCachedSlides();
                    if (fallback?.length) setSlides(fallback);
                } else {
                    console.error("Failed to fetch service slides:", response.status);
                }
            } catch (err) {
                console.error("Error fetching service slides:", err);
                const fallback = getCachedSlides();
                if (fallback?.length) setSlides(fallback);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    const nextSlide = () => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }
    };

    const prevSlide = () => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }
    };

    const currentSlideData = slides[currentSlide] || null;

    if (loading) {
        return (
            <section className="relative h-[70vh] pt-24 overflow-hidden rounded-t-3xl rounded-b-3xl">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </section>
        );
    }

    if (!currentSlideData || slides.length === 0) {
        return (
            <section className="relative h-[70vh] pt-24 overflow-hidden rounded-t-3xl rounded-b-3xl">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                        <p>No slides available</p>
                    </div>
                </div>
            </section>
        );
    }

    return (


        <section className="relative h-[70vh] pt-24 overflow-hidden rounded-t-3xl rounded-b-3xl">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
                    style={{ backgroundImage: `url('${currentSlideData.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-end justify-end pb-15">
                <div className="w-full px-6 md:px-20 lg:pr-32 min-w-0">
                    <div className="text-white max-w-3xl ml-auto text-left min-w-0 break-words ps-12 md:ps-20 lg:ps-28" data-aos="fade-up">

                        {/* Small heading */}
                        <p className="text-xs md:text-sm ps-50 font-light tracking-wider mb-1 text-gray-200 uppercase">
                            {currentSlideData.smallText}
                        </p>

                        {/* Main heading */}
                        <h1 className="text-xl md:text-2xl lg:text-3xl ps-50 font-bold mb-1 leading-snug break-words">
                            {currentSlideData.mainHeading}
                        </h1>

                        {/* Outlined heading */}
                        <h2
                            className="text-xl md:text-2xl lg:text-3xl ps-50 font-bold mb-2 leading-snug text-transparent break-words"
                            style={{ WebkitTextStroke: '1.5px white' }}
                        >
                            {currentSlideData.outlinedHeading}
                        </h2>

                        {/* Description */}
                        <p className="text-xs ps-50 w-[95%] md:text-sm mb-4 text-gray-100 leading-relaxed">
                            {currentSlideData.description}
                        </p>

                        {/* Background Text */}
                        <div className="relative mb-4">
                            <h2
                                className="text-2xl md:text-3xl ps-50 font-bold leading-snug text-transparent break-words opacity-80"
                                style={{ WebkitTextStroke: '1px #676B78' }}
                            >
                                {currentSlideData.backgroundText}
                            </h2>
                        </div>

                        {/* CTA */}
                        <a
                            href={currentSlideData.buttonUrl || '/contact'}
                            className="bg-purple-600 ms-50 hover:bg-purple-700 text-white text-sm px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
                        >
                            {currentSlideData.buttonText || 'Get Started Now'}
                        </a>

                    </div>
                </div>
            </div>

            {/* Left Slider Button with Background Image */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
                <div
                    className="relative bg-contain bg-left bg-no-repeat shadow-xl"
                    style={{
                        backgroundImage: "url('/assets/images/shape-26.webp')",
                        width: "240px",
                        height: "240px"
                    }}
                >
                    <button
                        onClick={prevSlide}
                        className="absolute bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
                        style={{
                            top: "50%",
                            right: "160px",
                            transform: "translateY(-50%)"
                        }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Right Slider Button with Background Image */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
                <div
                    className="relative bg-contain bg-right bg-no-repeat shadow-xl"
                    style={{
                        backgroundImage: "url('/assets/images/shape-27.webp')",
                        width: "240px",
                        height: "240px"
                    }}
                >
                    <button
                        onClick={nextSlide}
                        className="absolute bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
                        style={{
                            top: "50%",
                            left: "160px",
                            transform: "translateY(-50%)"
                        }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
