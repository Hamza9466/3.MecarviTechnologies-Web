"use client";

import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="relative h-screen pt-24 overflow-hidden rounded-t-3xl rounded-b-3xl">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/images/gallery-1.webp')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
            </div>

            {/* Content */}
         <div className="relative z-10 h-full flex items-center justify-end">
    <div className="w-full px-6 md:px-20 lg:pr-32">
        <div className="text-white max-w-3xl ml-auto text-left">

            {/* Small heading */}
            <p className="text-sm md:text-base ps-15 font-light tracking-wider mb-4 text-gray-200 uppercase">
                YOU THINK WE BUILT YOUR VISION
            </p>

            {/* Main heading */}
            <h1 className="text-3xl md:text-5xl ps-15 lg:text-5xl font-bold mb-4 leading-tight">
                Elevating Your Business
            </h1>

            {/* Outlined heading */}
            <h2
                className="text-3xl md:text-5xl ps-15 lg:text-5xl font-bold mb-6 leading-tight text-transparent"
                style={{ WebkitTextStroke: '2px white' }}
            >
                With Industry Experts
            </h2>

            {/* Description */}
            <p className="text-base ps-15 md:text-lg mb-8 text-gray-100 leading-relaxed">
                We are dedicated to building long-term partnerships with our clients, ensuring their success.
            </p>

            {/* Background Text */}
            <div className="relative mb-8">
                <h2
                    className="text-5xl md:text-5xl ps-15 font-bold leading-tight text-transparent"
                    style={{ WebkitTextStroke: '2px #676B78' }}
                >
                    IT SOLUTION
                </h2>
            </div>

            {/* CTA */}
            <button className="bg-purple-600 ms-15 hover:bg-purple-700 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
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
