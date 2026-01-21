"use client";

import { useState, useEffect } from "react";

interface HeroSection {
  id: number;
  heading: string;
  subheading: string;
  description: string;
  is_active: boolean;
}

export default function ContactHero() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        setLoading(true);
        console.log("Fetching contact hero section from API...");
        
        // Try with authentication token first
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
          "Accept": "application/json",
        };
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("http://localhost:8000/api/v1/contact-page-hero-sections", {
          method: "GET",
          headers,
        });

        console.log("Contact hero API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Contact hero API response data:", data);
          console.log("Response structure:", {
            success: data.success,
            hasData: !!data.data,
            hasHeroSections: !!data.data?.hero_sections,
            heroSectionsLength: data.data?.hero_sections?.length || 0,
            fullData: data
          });
          
          if (data.success && data.data?.hero_sections?.length > 0) {
            // Get the first active hero section or the first one
            const activeSection = data.data.hero_sections.find(
              (section: HeroSection) => section.is_active
            ) || data.data.hero_sections[0];
            console.log("Setting hero data:", activeSection);
            setHeroData(activeSection);
          } else {
            console.warn("No hero sections found in API response. Response:", data);
          }
        } else if (response.status === 401) {
          // API requires authentication - this is expected for public website views
          // The endpoint should be made public on the backend, but for now we'll use default content
          console.warn("Contact hero section API requires authentication. Using default content.");
          // Don't set heroData, let it use the default "Contact Us" text
        } else {
          const errorText = await response.text().catch(() => "Unknown error");
          console.error("Failed to fetch hero section:", response.status, errorText);
        }
      } catch (err) {
        console.error("Error fetching contact hero section:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSection();
  }, []);

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
            d="M0,110 L1440,0 L1440,650 L0,800 Z"
            fill="url(#careerCurveGradient)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
            className="w-full h-full"
          />
        </svg>
      </div>

      <div className="max-w-[95%] mx-auto relative z-10 pt-12 sm:pt-8 md:pt-12 flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:pt-[-15px] md:text-4xl lg:text-5xl font-bold text-white text-center w-full pt-16 sm:pt-12 md:pt-16 mb-6">
              {heroData?.heading || "Contact Us"}
            </h1>
          </>
        )}
      </div>
    </section>
  );
}
