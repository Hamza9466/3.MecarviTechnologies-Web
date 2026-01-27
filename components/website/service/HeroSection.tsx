"use client";

import React, { useState } from 'react';

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "/assets/images/gallery-1.webp",
            smallText: "YOU THINK WE BUILT YOUR VISION",
            mainHeading: "Elevating Your Business",
            outlinedHeading: "With Industry Experts",
            description: "We are dedicated to building long-term partnerships with our clients, ensuring their success.",
            backgroundText: "IT SOLUTION"
        },
        {
            image: "/assets/images/gallery-50.webp",
            smallText: "INNOVATION MEETS EXCELLENCE",
            mainHeading: "Transform Your Digital",
            outlinedHeading: "Presence Today",
            description: "Our cutting-edge solutions propel your business into the future of technology.",
            backgroundText: "DIGITAL TRANSFORM"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const currentSlideData = slides[currentSlide];

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
                <div className="w-full px-6 md:px-20 lg:pr-32">
                    <div className="text-white max-w-3xl ml-auto text-left" data-aos="fade-up">

                        {/* Small heading */}
                        <p className="text-sm md:text-base ps-50 font-light tracking-wider mb-2 text-gray-200 uppercase">
                            {currentSlideData.smallText}
                        </p>

                        {/* Main heading */}
                        <h1 className="text-2xl md:text-4xl ps-50 lg:text-4xl font-bold mb-2 leading-tight">
                            {currentSlideData.mainHeading}
                        </h1>

                        {/* Outlined heading */}
                        <h2
                            className="text-2xl md:text-4xl ps-50 lg:text-4xl font-bold mb-4 leading-tight text-transparent"
                            style={{ WebkitTextStroke: '2px white' }}
                        >
                            {currentSlideData.outlinedHeading}
                        </h2>

                        {/* Description */}
                        <p className="text-sm ps-50 w-[95%] md:text-base mb-6 text-gray-100 leading-relaxed">
                            {currentSlideData.description}
                        </p>

                        {/* Background Text */}
                        <div className="relative mb-6">
                            <h2
                                className="text-4xl md:text-4xl ps-50 font-bold leading-tight text-transparent"
                                style={{ WebkitTextStroke: '2px #676B78' }}
                            >
                                {currentSlideData.backgroundText}
                            </h2>
                        </div>

                        {/* CTA */}
                        <button className="bg-purple-600 ms-50 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                            Get Started Now
                        </button>

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
