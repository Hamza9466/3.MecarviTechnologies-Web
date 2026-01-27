"use client";

import { useState, useEffect } from "react";

interface FounderSectionData {
  founder_title: string;
  founder_description: string;
}

export default function AboutFounder() {
  const [data, setData] = useState<FounderSectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFounderData();
  }, []);

  const fetchFounderData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/about-founder-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.about_founder_section) {
          const section = result.data.about_founder_section;
          setData({
            founder_title: section.founder_title || "",
            founder_description: section.founder_description || "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching founder section:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white pt-8 sm:pt-12 md:pt-16 pb-0 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="max-w-[95%] mx-auto">
          <div className="text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }

  const displayData = data || {
    founder_title: "About the Founder",
    founder_description: "The first foundations were laid in 2012 by Kera Vazquez along with and her friends. She is the brain behind the name and possesses 17 years of industrie's experience. Kera had a vision of producing effective, compelling, targeted and accountable solutions for people and their businesses. She and her team built lasting relationships by exceeding each client expectations. Her ultimate goal was to provide impeccable services, the best quality, and value for money, with on time delivery guaranteed. This goal has been diligently pursued, and today, Mecarvi has a reputation for providing excellent products paired with personalized and dependable service. Through consistency, passion, teamwork and good fortune, we grew rapidly over the years and made special place in all our customer's heart. The early, pioneering spirit lives on today - and is reflected by our unique style of work. We ensure that you always feel more than welcome that there would always be someone with cutting edge experience and information to collaborate with you regarding your projects and who would invest their time and energy to know you and your business better. Kera believes that truly impactful brands inspire their audiences to action, to dream, to change; they leave an impression and wield genuine influence. Creating work like this is her passion, it's what brought us together, and it's what keeps us moving forward. we pride ourselves on our ability to respond and provide insight and value to each opportunity. Our customers count on us and you can too.",
  };

  return (
    <section className="bg-white pt-8 sm:pt-12 md:pt-16 pb-0 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto" data-aos="fade-up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 text-center mb-8 md:mb-12">
          {displayData.founder_title}
        </h2>
        <div className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed text-left max-w-[95%] mx-auto">
          <p className="mb-0">{displayData.founder_description}</p>
        </div>
      </div>
    </section>
  );
}
