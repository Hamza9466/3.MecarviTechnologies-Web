"use client";

import { useState, useEffect } from "react";

export default function CareerHero() {
  const [heroData, setHeroData] = useState({
    title: null,
    subtitle: null,
    heading: null,
    description: null,
    image: null as string | null,
  });

  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/career-page-hero-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.career_page_hero_section) {
          const hero = data.data.career_page_hero_section;
          setHeroData({
            title: hero.title || null,
            subtitle: hero.subtitle || null,
            heading: hero.heading || null,
            description: hero.description || null,
            image: hero.image || null,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching hero section:", err);
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[400px] bg-white">
      {/* Background with curve */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <svg viewBox="0 0 1440 800" className="w-full h-full" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="careerCurveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E03C3" />
              <stop offset="100%" stopColor="#BF03B5" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L1440,0 L1440,650 L0,800 Z"
            fill="url(#careerCurveGradient)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
            className="w-full h-full"
          />
        </svg>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        {/* Title and Subtitle - centered on x and y */}
        {heroData.title && heroData.subtitle && (
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center w-full mb-6">
              {heroData.title}
            </h1>
            <p className="text-white lg:pb-10 text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-4xl">
              {heroData.subtitle}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
