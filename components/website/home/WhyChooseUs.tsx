"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Tab {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface SectionData {
  section_title: string;
  background_image: string | null;
  image_1: string | null;
  image_2: string | null;
}

export default function WhyChooseUs() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch section data
  useEffect(() => {
    fetchSectionData();
    fetchTabsData();
  }, []);

  const fetchSectionData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/why-choose-us-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.why_choose_us_section) {
          setSectionData({
            section_title: data.data.why_choose_us_section.section_title || "Why Choose Us",
            background_image: data.data.why_choose_us_section.background_image || null,
            image_1: data.data.why_choose_us_section.image_1 || null,
            image_2: data.data.why_choose_us_section.image_2 || null,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching section data:", err);
    }
  };

  const fetchTabsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/why-choose-us-tabs", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const tabsData = Array.isArray(data.data) 
            ? data.data 
            : (data.data.tabs || data.data.why_choose_us_tabs || []);
          
          const sortedTabs = tabsData
            .map((tab: any) => ({
              id: tab.id,
              title: tab.title || "",
              description: tab.description || "",
              order: tab.order || 0,
            }))
            .sort((a: Tab, b: Tab) => a.order - b.order);
          
          setTabs(sortedTabs);
        }
      }
    } catch (err) {
      console.error("Error fetching tabs data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Duplicate tabs for seamless scrolling
  const duplicatedTabs = tabs.length > 0 ? [...tabs, ...tabs] : [];

  // Auto-scroll feature boxes
  useEffect(() => {
    if (tabs.length === 0) return;

    const cardHeight = 180; // Approximate height of each card (including gap)
    const maxScroll = tabs.length * cardHeight;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 0.5; // Smooth scroll increment
        // Reset to 0 when we reach the end of first set for seamless loop
        if (newPosition >= maxScroll) {
          return 0;
        }
        return newPosition;
      });
    }, 16); // ~60fps smooth scrolling

    return () => clearInterval(interval);
  }, [tabs.length]);

  // Get image URLs with proper formatting
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/storage") || imagePath.startsWith("/")) {
      return `http://localhost:8000${imagePath}`;
    }
    return imagePath;
  };

  const image1Url = getImageUrl(sectionData?.image_1 || null);
  const image2Url = getImageUrl(sectionData?.image_2 || null);
  const backgroundImageUrl = getImageUrl(sectionData?.background_image || null);

  // Fallback data if API fails or no data
  const sectionTitle = sectionData?.section_title || "Why Choose Us";
  const fallbackImages = [
    "/assets/images/1704643966414629399_362025089872131_6843393301147201332_n.jpg",
    "/assets/images/1710846915Mecarvi-prints-login-n.png",
  ];

  if (loading) {
    return (
      <section className="bg-white pt-16 sm:pt-20 md:pt-24 pb-0 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="max-w-[95%] mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="bg-white pt-4 sm:pt-6 md:pt-8 pb-10 px-1 sm:px-2 md:px-4 lg:px-6"
      style={backgroundImageUrl ? {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
      
    >
      <div className="max-w-[95%] mx-auto" >
        {/* Title - Centered */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16" data-aos="fade-up">
          {sectionTitle}
        </h2>

        {/* Main Content Container */}
        <div className="overflow-hidden" data-aos="fade-up">
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center rounded-lg p-6 md:p-8 relative overflow-hidden" 
          >
            {/* Background Image Layer */}
            <div
              className="absolute inset-0 rounded-lg z-0"
              style={{
                backgroundImage: 'url(/assets/images/why-chose-us-bg.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            {/* Left Area - Composite Image Layout: second image overlaps first, same rounded edges */}
            <div className="order-2 lg:order-1 relative z-10">
              <div 
                className="relative w-full aspect-[3/2] max-w-4xl mx-auto rounded-2xl overflow-visible bg-transparent" 
                style={{ minHeight: '500px' }}
              >
                {/* First image - larger, behind */}
                {image1Url && (
                  <div className="absolute top-0 left-0 w-[65%] h-[60%] rounded-2xl overflow-hidden z-0 shadow-lg">
                    <img
                      src={image1Url}
                      alt="Why Choose Us"
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Second image - smaller, overlaps bottom-right of first, same rounded corners */}
                {image2Url ? (
                  <div className="absolute bottom-[4%] right-[4%] w-[45%] h-[50%] rounded-2xl overflow-hidden z-10 shadow-lg">
                    <img
                      src={image2Url}
                      alt="Why Choose Us"
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : image1Url && (
                  <div className="absolute bottom-[4%] right-[4%] w-[45%] h-[50%] rounded-2xl overflow-hidden z-10 shadow-lg">
                    <Image
                      src={fallbackImages[1]}
                      alt="Mecarvi Signs Logo"
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover rounded-2xl"
                    />
                  </div>
                )}
                
                {/* Fallback if no images from API */}
                {!image1Url && !image2Url && (
                  <>
                    <div className="absolute top-0 left-0 w-[65%] h-[60%] rounded-2xl overflow-hidden z-0 shadow-lg">
                      <Image
                        src={fallbackImages[0]}
                        alt="Sign Installation"
                        fill
                        sizes="(max-width: 768px) 100vw, 65vw"
                        className="object-cover rounded-2xl"
                      />
                    </div>
                    <div className="absolute bottom-[4%] right-[4%] w-[45%] h-[50%] rounded-2xl overflow-hidden z-10 shadow-lg">
                      <Image
                        src={fallbackImages[1]}
                        alt="Mecarvi Signs Logo"
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover rounded-2xl"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Area - Auto-scrolling Feature Cards with Red Borders */}
            <div className="order-1 lg:order-2 relative z-10 h-[600px] overflow-hidden">
              {tabs.length > 0 ? (
                <div
                  ref={scrollContainerRef}
                  className="space-y-6"
                  style={{
                    transform: `translateY(-${scrollPosition}px)`,
                    transition: "none", // Remove transition for smooth continuous scroll
                  }}
                >
                  {duplicatedTabs.map((tab, index) => (
                    <div
                      key={`${tab.id}-${index}`}
                      className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-500 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Red Star Icon */}
                        <div className="flex-shrink-0 mt-1">
                          <svg
                            className="w-6 h-6 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-red-500 mb-2 pb-2 border-b border-red-300">
                            {tab.title}
                          </h3>
                          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No content available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
