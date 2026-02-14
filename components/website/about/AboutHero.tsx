"use client";

import { useState, useEffect } from "react";

interface HeroSectionData {
  title_part_1: string;
  title_part_2: string;
  description_1: string | null;
  description_2: string | null;
  hero_background_image: string | null;
  hero_image: string | null;
}

export default function AboutHero() {
  const [data, setData] = useState<HeroSectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/storage")) return `http://localhost:8000${url}`;
    return `http://localhost:8000/storage/${url}`;
  };

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/hero-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.hero_section) {
          const section = result.data.hero_section;
          setData({
            title_part_1: section.title_part_1 || "",
            title_part_2: section.title_part_2 || "",
            description_1: section.description_1 || null,
            description_2: section.description_2 || null,
            hero_background_image: getImageUrl(section.hero_background_image),
            hero_image: getImageUrl(section.hero_image),
          });
        }
      }
    } catch (err) {
      console.error("Error fetching hero section:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 pt-24 pb-16">
        <div className="text-gray-600">Loading...</div>
      </section>
    );
  }

  const displayData = data || {
    title_part_1: "About",
    title_part_2: "Mecarvi Technologies",
    description_1: null,
    description_2: null,
    hero_background_image: null,
    hero_image: null,
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[400px] bg-white">
      {/* Background with curve */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <svg viewBox="0 0 1440 800" className="w-full h-full" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="aboutCurveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E03C3" />
              <stop offset="100%" stopColor="#BF03B5" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L1440,0 L1440,650 L0,800 Z"
            fill="url(#aboutCurveGradient)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
            className="w-full h-full"
          />
        </svg>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        {/* Content - centered on x and y */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center leading-tight" data-aos="fade-up">
          {displayData.title_part_1}
        </h1>
      </div>
    </section>
  );
}
