"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

const CACHE_KEY = "service_hero_section";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes – avoids 429 rate limit

interface HeroSection {
  id: number;
  heading: string;
  subheading: string;
  description: string;
  is_active: boolean;
}

function getCached(): HeroSection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: HeroSection; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(data: HeroSection) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // ignore
  }
}

export default function ServiceHero() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setHeroData(cached);
      setLoading(false);
      return;
    }

    const fetchHeroSection = async () => {
      try {
        setLoading(true);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers: HeadersInit = { Accept: "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(apiUrl("/api/v1/service-page"), {
          method: "GET",
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.service_pages?.length > 0) {
            const firstPage = data.data.service_pages[0];
            const heading = firstPage.page_heading?.replace(" - Slide 1", "") || "Our Services";
            const hero: HeroSection = {
              id: firstPage.id,
              heading,
              subheading: firstPage.small_text || "",
              description: firstPage.description || "",
              is_active: true,
            };
            setHeroData(hero);
            setCache(hero);
          }
        } else if (response.status === 401) {
          // Use default content when API requires auth
        } else if (response.status === 429) {
          console.warn("Service hero: too many requests (429). Using cached or default content.");
          const fallback = getCached();
          if (fallback) setHeroData(fallback);
        } else {
          console.error("Failed to fetch hero section:", response.status);
        }
      } catch (err) {
        console.error("Error fetching service hero section:", err);
        const fallback = getCached();
        if (fallback) setHeroData(fallback);
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
            d="M0,0 L1440,0 L1440,650 L0,800 Z"
            fill="url(#serviceCurveGradient)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
            className="w-full h-full"
          />
        </svg>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* Main Title - centered on x and y */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center w-full mb-8" data-aos="fade-up">
              {heroData?.heading || "Our Services"}
            </h1>
          </>
        )}
      </div>
    </section>
  );
}
