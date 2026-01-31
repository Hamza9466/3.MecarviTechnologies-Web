"use client";

import { useState, useEffect } from "react";

interface HeroSection {
  id: number;
  heading: string;
  subheading: string;
  description: string;
  is_active: boolean;
}

export default function ServiceHero() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        setLoading(true);
        console.log("Fetching service hero section from API...");

        // Try with authentication token first
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
          "Accept": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("http://localhost:8000/api/v1/service-page", {
          method: "GET",
          headers,
        });

        console.log("Service hero API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Service hero API response data:", data);
          console.log("Response structure:", {
            success: data.success,
            hasData: !!data.data,
            hasServicePages: !!data.data?.service_pages,
            servicePagesLength: data.data?.service_pages?.length || 0,
            fullData: data
          });

          if (data.success && data.data?.service_pages?.length > 0) {
            // Get the first service page for the heading
            const firstPage = data.data.service_pages[0];
            const heading = firstPage.page_heading?.replace(' - Slide 1', '') || 'Our Services';
            console.log("Setting hero data from service page:", { heading, page: firstPage });
            setHeroData({
              id: firstPage.id,
              heading: heading,
              subheading: firstPage.small_text || '',
              description: firstPage.description || '',
              is_active: true
            });
          } else {
            console.warn("No service pages found in API response. Response:", data);
          }
        } else if (response.status === 401) {
          // API requires authentication - this is expected for public website views
          // The endpoint should be made public on the backend, but for now we'll use default content
          console.warn("Service hero section API requires authentication. Using default content.");
          // Don't set heroData, let it use the default "Our Services" text
        } else {
          const errorText = await response.text().catch(() => "Unknown error");
          console.error("Failed to fetch hero section:", response.status, errorText);
        }
      } catch (err) {
        console.error("Error fetching service hero section:", err);
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
            <linearGradient id="serviceCurveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E03C3" />
              <stop offset="100%" stopColor="#BF03B5" />
            </linearGradient>
          </defs>
          <path
            d="M0,110 L1440,0 L1440,650 L0,800 Z"
            fill="url(#serviceCurveGradient)"
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center w-full pt-20 sm:pt-24 md:pt-28 mb-8" data-aos="fade-up">
              {heroData?.heading || "Our Services"}
            </h1>
          </>
        )}
      </div>
    </section>
  );
}
