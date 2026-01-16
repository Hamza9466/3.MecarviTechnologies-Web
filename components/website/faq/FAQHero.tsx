"use client";

import { useState, useEffect } from "react";

export default function FAQHero() {
  const [heroTitle, setHeroTitle] = useState("Frequently Asked Question");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/faq-hero-section", {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.faq_hero_section?.hero_title) {
            setHeroTitle(data.data.faq_hero_section.hero_title);
          }
        }
      } catch (error) {
        console.error("Error fetching FAQ hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[400px] bg-white">
      {/* Background with curve */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <svg viewBox="0 0 1440 800" className="w-full h-full" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E03C3" />
              <stop offset="100%" stopColor="#BF03B5" />
            </linearGradient>
          </defs>
          <path
            d="M0,110 L1440,0 L1440,650 L0,800 Z"
            fill="url(#curveGradient)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
            className="w-full h-full"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-12 sm:pt-8 md:pt-12 flex flex-col items-center justify-center">
        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center w-full pt-16 sm:pt-12 md:pt-16">
          {loading ? "Loading..." : heroTitle}
        </h1>
      </div>
    </section>
  );
}

