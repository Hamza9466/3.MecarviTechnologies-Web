"use client";

import React from "react";

const ShowcaseSection: React.FC = () => {
    return (
        <section
            className="py-20 relative overflow-hidden h-[600px]"
        >
            {/* Background Shape */}
            <div
                className="absolute inset-0 opacity-180"
                style={{
                    backgroundImage: "url('/assets/images/shape-5.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>

            <div className="container mx-auto px-4 w-[95%] relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT SIDE (EMPTY) */}
                    <div></div>

                    {/* RIGHT IMAGE */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative max-w-xl w-full">
                            {/* Background Shape */}
                            <div
                                className="absolute inset-0 h-[40%] left-70 top-25 opacity-120"
                                style={{
                                    backgroundImage: "url('/assets/images/shape-3.webp')",
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
                                    src="/assets/images/gallery-8.webp"
                                    alt="Showcase"
                                    className="w-full h-auto object-cover scale-120 relative z-10"
                                />
                            </div>

                            {/* Empty Overlay */}
                            <div className="absolute inset-0"></div>

                            {/* Floating Badge */}

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
