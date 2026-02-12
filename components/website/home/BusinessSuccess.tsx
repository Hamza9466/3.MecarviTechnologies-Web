"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface AboutSectionData {
  id: number;
  main_title: string;
  main_description: string;
  background_image: string | null;
  tab1_title: string;
  tab1_subtitle: string;
  tab1_description: string;
  tab1_image: string | null;
  tab2_title: string;
  tab2_subtitle: string;
  tab2_description: string;
  tab2_image: string | null;
  experience_years: string;
  experience_description: string;
  about_image_1: string | null;
  about_image_2: string | null;
}

export default function BusinessSuccess() {
  const [activeTab, setActiveTab] = useState("award");
  const [data, setData] = useState<AboutSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutSectionData();
  }, []);

  const fetchAboutSectionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8000/api/v1/about-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No data exists yet, use defaults
          setData(null);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch about section data");
      }

      const responseData = await response.json();
      
      if (responseData.success && responseData.data?.about_section) {
        setData(responseData.data.about_section);
      } else {
        setData(null);
      }
    } catch (err: any) {
      console.error("Error fetching about section data:", err);
      setError(err.message || "Failed to load about section");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Default/fallback content
  const defaultData: AboutSectionData = {
    id: 0,
    main_title: "Synergistically incentivize effective imperatives through fully researched",
    main_description: "Synergistically incentivize effective imperatives through fully researched intellectual capital. Appropriately fashion client-based",
    background_image: null,
    tab1_title: "Award Index",
    tab1_subtitle: "An Award-Winning Company.",
    tab1_description: "An Award-Winning Company. Monotonically matrix extensible applications and go forward communities. Synergistically extend client-based manufactured.",
    tab1_image: "/assets/images/yqMS5qrWhHsVPL5l1747744517.jpg",
    tab2_title: "Technology Index",
    tab2_subtitle: "Technology Innovations",
    tab2_description: "Our technology index drives new possibilities for the future, enabling seamless integration and high-performance solutions.",
    tab2_image: "/assets/images/cnRu3VHkjbFgrLdL1747746044.png",
    experience_years: "35+",
    experience_description: "Years of Experience",
    about_image_1: "/assets/images/BW8QVSBRcBLItUoc1747748716.jpg",
    about_image_2: "/assets/images/65G1VK9uRjWOnnjJ1747748716.jpg",
  };

  const content = data || defaultData;

  if (loading) {
    return (
      <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="max-w-[95%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="aspect-[3/3] bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 overflow-visible"
      style={
        content.background_image
          ? {
              backgroundImage: `url(http://localhost:8000${content.background_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      <div className="max-w-[95%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center" >
        {/* Left Content */}
        <div className="space-y-6 md:space-y-8" data-aos="fade-up">
          {/* Main Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-pink-500 leading-tight" data-aos="fade-up">
            {content.main_title}
          </h2>

          {/* Sub-paragraph */}
          <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl">
            {content.main_description}
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-0 relative flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setActiveTab("award")}
              className={`relative px-4 sm:px-8 md:px-12 lg:px-20 py-2.5 sm:py-3 rounded-l-lg font-semibold text-white transition-colors flex-1 sm:flex-none sm:min-w-[140px] md:min-w-[180px] text-xs sm:text-sm md:text-base ${
                activeTab === "award"
                  ? "bg-pink-700"
                  : "bg-pink-500"
              }`}
            >
              {content.tab1_title || "Award Index"}
              {activeTab === "award" && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-pink-700"></div>
                </div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("technology")}
              className={`relative px-4 sm:px-8 md:px-12 lg:px-20 py-2.5 sm:py-3 rounded-r-lg font-semibold text-white transition-colors flex-1 sm:flex-none sm:min-w-[140px] md:min-w-[180px] text-xs sm:text-sm md:text-base ${
                activeTab === "technology"
                  ? "bg-pink-700"
                  : "bg-pink-500"
              }`}
            >
              {content.tab2_title || "Technology Index"}
              {activeTab === "technology" && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-pink-700"></div>
                </div>
              )}
            </button>
          </div>

          {/* Content Section - Changes based on active tab */}
          {activeTab === "award" ? (
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo Card - White square */}
              {content.tab1_image && (
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-64 lg:h-64 rounded-xl bg-white shadow-2xl flex items-center justify-center p-4 relative overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                    {content.tab1_image.startsWith("http") || content.tab1_image.startsWith("/storage") ? (
                      <img
                        src={`http://localhost:8000${content.tab1_image}`}
                        alt={content.tab1_subtitle || "Award-Winning Company Logo"}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Image
                        src={content.tab1_image}
                        alt={content.tab1_subtitle || "Award-Winning Company Logo"}
                        fill
                        sizes="(max-width: 768px) 80px, 120px"
                        className="object-contain p-2"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Text Content - On dark background */}
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900">
                  {content.tab1_subtitle}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {content.tab1_description}
                </p>
                <Link
                  href="/about"
                  className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-pink-600 transition-colors"
                >
                  About More
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Technology Logo - Hexagonal */}
              {content.tab2_image && (
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 relative flex items-center justify-center">
                    {content.tab2_image.startsWith("http") || content.tab2_image.startsWith("/storage") ? (
                      <img
                        src={`http://localhost:8000${content.tab2_image}`}
                        alt={content.tab2_subtitle || "Technology Innovations Logo"}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={content.tab2_image}
                        alt={content.tab2_subtitle || "Technology Innovations Logo"}
                        fill
                        sizes="(max-width: 768px) 80px, 120px"
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Text Content - Technology Innovations */}
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900">
                  {content.tab2_subtitle}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {content.tab2_description}
                </p>
                <Link
                  href="/about"
                  className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-pink-600 transition-colors"
                >
                  About More
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Content - Images */}
        <div className="relative" data-aos="fade-up">
          {/* Main Image Container */}
          <div className="relative overflow-visible">
            {/* Main Portrait Image */}
            {content.about_image_1 && (
              <div className="aspect-[3/3] relative max-h-[560px] rounded-2xl overflow-hidden shadow-2xl mt-12 sm:mt-16 md:mt-20 lg:mt-24" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                {content.about_image_1.startsWith("http") || content.about_image_1.startsWith("/storage") ? (
                  <img
                    src={`http://localhost:8000${content.about_image_1}`}
                    alt="Business professional"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Image
                    src={content.about_image_1}
                    alt="Business professional"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover rounded-2xl"
                    priority
                  />
                )}

                {/* Experience Badge - Bottom Center, Overlapping the main image */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 z-10 whitespace-nowrap">
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                  >
                    <path d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2l0 82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9l0-107.2c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
                  </svg>
                  <div>
                    <p className="font-bold text-xl md:text-2xl">{content.experience_years}</p>
                    <p className="text-sm md:text-base">{content.experience_description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Inset Image Overlay - Upper Right, Overlapping the main image */}
            {content.about_image_2 && (
              <div className="absolute top-12 sm:top-16 md:top-20 right-[-8%] sm:right-[-6%] md:right-[-4%] w-[42%] sm:w-[38%] md:w-[36%] aspect-[3/4] rounded-xl border-4 border-white overflow-hidden z-10" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                {content.about_image_2.startsWith("http") || content.about_image_2.startsWith("/storage") ? (
                  <img
                    src={`http://localhost:8000${content.about_image_2}`}
                    alt="Office team"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={content.about_image_2}
                    alt="Office team"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

