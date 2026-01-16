"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroSectionData {
  title_part_1: string;
  title_part_2: string;
  description_1: string;
  description_2: string;
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
            description_1: section.description_1 || "",
            description_2: section.description_2 || "",
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
    description_1: "Leading the industry with innovation, quality, and exceptional service since 1989.",
    description_2: "We create exceptional signage solutions that help businesses stand out. With over 35 years of experience, we combine cutting-edge technology with traditional craftsmanship to deliver results that exceed expectations.",
    hero_background_image: null,
    hero_image: null,
  };

  return (
    <section 
      className="bg-white min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 pt-24 pb-16 relative"
      style={displayData.hero_background_image ? {
        backgroundImage: `url(${displayData.hero_background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center w-full mt-8 sm:mt-10 md:mt-12 relative z-10">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            {displayData.title_part_1} <span className="text-pink-500">{displayData.title_part_2}</span>
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed">
            {displayData.description_1}
          </p>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
            {displayData.description_2}
          </p>
        </div>

        {/* Right Content - Image */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-xl">
            {displayData.hero_image ? (
              <img
                src={displayData.hero_image}
                alt="About Mecarvi Technologies"
                className="w-full h-auto object-contain"
                style={{ maxHeight: '600px' }}
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/qioBaPBkCKqAHtwu1747656560.png";
                }}
              />
            ) : (
            <Image
              src="/assets/images/qioBaPBkCKqAHtwu1747656560.png"
              alt="About Mecarvi Technologies"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
