"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface QuoteSectionData {
  id?: number;
  request_quote_title?: string;
  request_quote_subtitle?: string;
  description?: string;
  button_text?: string;
  title_1?: string;
  paragraph_1?: string;
  title_2?: string;
  paragraph_2?: string;
  image_1?: string | null;
  image_2?: string | null;
}

export default function StartYourProject() {
  const [sectionData, setSectionData] = useState<QuoteSectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSectionData();
  }, []);

  const fetchSectionData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/quote-section", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.quote_section) {
          setSectionData(data.data.quote_section);
        }
      } else if (response.status === 404) {
        // Section doesn't exist yet, use fallback values
        setSectionData(null);
      }
    } catch (err) {
      console.error("Error fetching quote section data:", err);
      // Use fallback values on error
      setSectionData(null);
    } finally {
      setLoading(false);
    }
  };

  // Get image URL with proper formatting
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/storage") || imagePath.startsWith("/")) {
      return `http://localhost:8000${imagePath}`;
    }
    return imagePath;
  };

  // Fallback values
  const requestQuoteTitle = sectionData?.request_quote_title || "Start Your Project";
  const requestQuoteSubtitle = sectionData?.request_quote_subtitle || "Get the Signs You Need, at the Right Price";
  const description = sectionData?.description || "We're here to help. Take the first step by sharing a few details about your project, and We'll provide a tailored estimate that's accurate, fair, and aligned with your budget.";
  const buttonText = sectionData?.button_text || "Quote Request";
  const title1 = sectionData?.title_1 || "Start Now, Pay Later";
  const paragraph1 = sectionData?.paragraph_1 || "Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain.";
  const title2 = sectionData?.title_2 || "Start Now, Pay Later";
  const paragraph2 = sectionData?.paragraph_2 || "Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain.";

  const image1Url = getImageUrl(sectionData?.image_1);
  const image2Url = getImageUrl(sectionData?.image_2);

  if (loading) {
    return (
      <section className="pt-16 sm:pt-20 md:pt-24 pb-0 px-1 sm:px-2 md:px-4 lg:px-6" style={{ background: 'linear-gradient(to bottom, #1e3a8a, #000000)' }}>
        <div className="max-w-[95%] mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-16 sm:pt-20 md:pt-24 pb-0 px-1 sm:px-2 md:px-4 lg:px-6" style={{ background: 'linear-gradient(to bottom, #1e3a8a, #000000)' }}>
      <div className="max-w-[95%] mx-auto">
        {/* Top Section */}
        <div className="text-center mb-12 md:mb-16">
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pink-500 mb-4">
            {requestQuoteTitle}
          </h2>
          
          {/* Sub-heading */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white mb-8">
            {requestQuoteSubtitle}
          </p>

          {/* Descriptive Paragraph */}
          <div className="max-w-[95%] mx-auto text-left mb-8">
            <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/quote"
            className="inline-block bg-pink-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-lg font-semibold text-base md:text-lg hover:bg-pink-600 transition-colors"
          >
            {buttonText}
          </Link>
        </div>

        {/* Two Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-12 md:mt-16">
          {/* Left Card - Dark Green */}
          <div className="bg-[#2d5016] p-8 md:p-10 lg:p-12 text-white">
            {/* Icon/Image */}
            <div className="flex justify-center mb-6">
              {image1Url ? (
                <img
                  src={image1Url}
                  alt={title1}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              ) : (
                <Image
                  src="/assets/images/GiA4NqVyqXzhHKCZ1747744517.png"
                  alt="Rocket icon"
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              )}
            </div>

            {/* Headline */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6">
              {title1}
            </h3>

            {/* Body Text */}
            <p className="text-sm md:text-base leading-relaxed text-center">
              {paragraph1}
            </p>
          </div>

          {/* Right Card - Pink/Magenta */}
          <div className="bg-[#E60F77] p-8 md:p-10 lg:p-12 text-white">
            {/* Icon/Image */}
            <div className="flex justify-center mb-6">
              {image2Url ? (
                <img
                  src={image2Url}
                  alt={title2}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              ) : (
                <Image
                  src="/assets/images/GiA4NqVyqXzhHKCZ1747744517.png"
                  alt="Rocket icon"
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              )}
            </div>

            {/* Headline */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6">
              {title2}
            </h3>

            {/* Body Text */}
            <p className="text-sm md:text-base leading-relaxed text-center">
              {paragraph2}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
