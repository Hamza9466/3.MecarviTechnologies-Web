"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface HomePageData {
  title: string;
  buttonText: string;
  buttonUrl: string;
  description: string;
  background_image: string | null;
  secondary_image: string | null;
}

export default function Hero() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      setError("");

      let response: Response;
      try {
        response = await fetch("http://localhost:8000/api/v1/home-page", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
      } catch (fetchError: any) {
        // Network error (backend not reachable, CORS, etc.)
        console.warn("Cannot connect to API, using default content:", fetchError.message);
        // Set default data and continue - don't show error to user
        setData({
          title: "A Complete\nSoftware Based\nWebsite",
          buttonText: "Discover More",
          buttonUrl: "/discover",
          description: "Integrating and automating workflows simplifies operations, reduces manual effort, and boosts efficiency. Seamless integration connects various.",
          background_image: null,
          secondary_image: null,
        });
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch home page data");
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError);
        // Set default data on parse error
        setData({
          title: "A Complete\nSoftware Based\nWebsite",
          buttonText: "Discover More",
          buttonUrl: "/discover",
          description: "Integrating and automating workflows simplifies operations, reduces manual effort, and boosts efficiency. Seamless integration connects various.",
          background_image: null,
          secondary_image: null,
        });
        setLoading(false);
        return;
      }

      if (result.success && result.data?.home_page) {
        const homePage = result.data.home_page;
        setData({
          title: homePage.title || "",
          buttonText: homePage.button_text || "Discover More",
          buttonUrl: homePage.button_url || "/discover",
          description: homePage.description || "",
          background_image: homePage.background_image || null,
          secondary_image: homePage.secondary_image || null,
        });
      }
    } catch (err: any) {
      console.error("Error fetching home page data:", err);
      // Set default data on error - don't show error to user, just use defaults
      setData({
        title: "A Complete\nSoftware Based\nWebsite",
        buttonText: "Discover More",
        buttonUrl: "/discover",
        description: "Integrating and automating workflows simplifies operations, reduces manual effort, and boosts efficiency. Seamless integration connects various.",
        background_image: null,
        secondary_image: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Default data while loading or as fallback
  const displayData = data || {
    title: "A Complete\nSoftware Based\nWebsite",
    buttonText: "Discover More",
    buttonUrl: "/discover",
    description: "Integrating and automating workflows simplifies operations, reduces manual effort, and boosts efficiency. Seamless integration connects various.",
    background_image: null,
    secondary_image: null,
  };

  // Split title by newlines to preserve formatting, or display as single line
  const titleLines = displayData.title ? displayData.title.split("\n").filter(line => line.trim()) : [];

  return (
    <section 
      className="min-h-[120vh] sm:min-h-[130vh] md:min-h-screen flex items-center justify-center px-1 sm:px-2 md:px-4 lg:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 relative overflow-visible"
    >
      {/* Background Image or Gradient */}
      {displayData.background_image ? (
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(http://localhost:8000${displayData.background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            left: 0,
            right: 0,
          }}
        />
      ) : (
        /* Default Gradient Background */
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          style={{ zIndex: 0, overflow: 'hidden' }}
        >
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C6EC" />
              <stop offset="100%" stopColor="#0040EA" />
            </linearGradient>
          </defs>
          <path 
            d="M0,0 L1440,0 L1440,800 L0,800 Z"
            fill="url(#blueGradient)"
          />
        </svg>
      )}

      {/* Vector5 Image - Top Left */}
      <div 
        className="absolute top-0 left-0 pointer-events-none"
        style={{ 
          zIndex: 1,
          width: '400px',
          height: '400px',
          maxWidth: '40%',
          maxHeight: '50%',
        }}
      >
        <img
          src="/assets/images/Vector5.png"
          alt="Vector decoration"
          className="w-full h-full object-contain opacity-10"
          style={{
            filter: 'brightness(-10) invert(1)',
            mixBlendMode: 'normal',
          }}
        />
      </div>

      {/* Vector6 Image - Top Right */}
      <div 
        className="absolute top-0 right-0 pointer-events-none"
        style={{ 
          zIndex: 1,
          width: '400px',
          height: '400px',
          maxWidth: '40%',
          maxHeight: '50%',
        }}
      >
        <img
          src="/assets/images/Vector6.png"
          alt="Vector decoration"
          className="w-full h-full object-contain opacity-80"
          style={{
            filter: 'brightness(-20) invert(1)',
            mixBlendMode: 'normal',
          }}
        />
      </div>
      
      <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-[50%_50%] gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center w-full relative z-10">
        {/* Left Content */}
        <div className="text-white space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 text-center md:text-left order-2 md:order-1 px-2 sm:px-0">
          {loading ? (
            <div className="space-y-4">
              <div className="h-12 sm:h-16 bg-white/20 rounded animate-pulse"></div>
              <div className="h-20 sm:h-24 bg-white/20 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                {titleLines.map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xl mx-auto md:mx-0 leading-relaxed px-2 sm:px-0">
                {displayData.description}
              </p>
            </>
          )}
          <div className="flex justify-center md:justify-start pt-2">
            <Link
              href={displayData.buttonUrl || "/discover"}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:from-orange-600 hover:to-yellow-500 transition-all shadow-lg"
            >
              {displayData.buttonText || "Discover More"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Content - Image in Laptop Frame */}
        <div className="relative flex items-center justify-center order-1 md:order-2 px-2 sm:px-0 ml-4 sm:ml-6 md:ml-8 lg:ml-15 w-full md:w-auto mb-12 sm:mb-0" style={{ overflow: 'visible', maxWidth: '100%', flex: '1 1 50%' }}>
          <div className="relative w-full max-w-[320px] sm:max-w-4xl md:max-w-6xl lg:max-w-7xl xl:max-w-[90rem] transform scale-75 sm:scale-100 -rotate-3 md:rotate-0 hover:scale-105 transition-transform duration-300 md:top-[80px] mt-0 sm:mt-8" style={{ marginBottom: '-4rem' }}>
            {loading ? (
              <div className="relative bg-white rounded-2xl p-3 sm:p-4" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video animate-pulse"></div>
              </div>
            ) : (
              <div className="relative bg-white rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 mr-4 sm:mr-6 md:mr-8 lg:mr-10" style={{ overflow: 'visible', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ overflow: 'visible', width: '100%', height: '100%' }}>
                  {displayData.secondary_image ? (
                    <img
                      src={`http://localhost:8000${displayData.secondary_image}`}
                      alt={displayData.title || "Hero image"}
                      className="object-cover rounded-lg"
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to default image if API image fails
                        e.currentTarget.src = "/assets/images/08.jpg";
                      }}
                    />
                  ) : (
                    <Image
                      src="/assets/images/08.jpg"
                      alt="Software dashboard illustration"
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover rounded-lg "
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      priority
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

