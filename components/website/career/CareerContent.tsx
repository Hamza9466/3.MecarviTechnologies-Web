"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CareerContent() {
  const [contentData, setContentData] = useState({
    heading: null,
    description: null,
    image: null as string | null,
  });

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
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
          const content = data.data.career_page_hero_section;
          setContentData({
            heading: content.heading || null,
            description: content.description || null,
            image: content.image || null,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching content data:", err);
    }
  };

  return (
    <section className="bg-white pt-16 sm:pt-20 md:pt-24 pb-0 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 items-center">
          {/* Text Content */}
          <div className="w-full space-y-6 text-center" data-aos="fade-up">
            {contentData.heading && (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 leading-tight">
                {contentData.heading}
              </h2>
            )}
            {contentData.description && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {contentData.description}
              </p>
            )}
          </div>

          {/* Image */}
          {contentData.image && (
            <div className="w-full max-w-3xl relative" data-aos="fade-up">
              <div className="relative w-full  h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={contentData.image.startsWith('http') ? contentData.image : `http://localhost:8000${contentData.image}`}
                  alt="Career content"
                  className="w-full h-full  object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
