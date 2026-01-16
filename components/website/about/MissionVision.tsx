"use client";

import { useState, useEffect } from "react";

interface MissionVisionData {
  mission_title: string;
  mission_description: string;
  vision_title: string;
  vision_description: string;
}

export default function MissionVision() {
  const [data, setData] = useState<MissionVisionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissionVisionData();
  }, []);

  const fetchMissionVisionData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/mission-vision-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.mission_vision_section) {
          const section = result.data.mission_vision_section;
          setData({
            mission_title: section.mission_title || "",
            mission_description: section.mission_description || "",
            vision_title: section.vision_title || "",
            vision_description: section.vision_description || "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching mission vision section:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white pb-16 sm:pb-20 md:pb-24 pt-0 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="max-w-[95%] mx-auto">
          <div className="text-gray-600 text-center">Loading...</div>
        </div>
      </section>
    );
  }

  const displayData = data || {
    mission_title: "Mission Statement",
    mission_description: "Our mission is to serve as our client's most trusted indispensable partner. We work in close liaison with customers to empower their brand value, fuel their growth and achieve their goals by providing fast innovative solutions that will lead to unprecedented results.",
    vision_title: "Vision Statement",
    vision_description: "Our mission is to serve as our client's most trusted indispensable partner. We work in close liaison with customers to empower their brand value, fuel their growth and achieve their goals by providing fast innovative solutions that will lead to unprecedented results.",
  };

  return (
    <section className="bg-white pb-16 sm:pb-20 md:pb-24 pt-0 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Mission Statement Card */}
          <div className="bg-teal-900 rounded-2xl p-8 md:p-10 lg:p-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 md:mb-8">
              {displayData.mission_title}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              {displayData.mission_description}
            </p>
          </div>

          {/* Vision Statement Card */}
          <div className="bg-teal-900 rounded-2xl p-8 md:p-10 lg:p-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 md:mb-8">
              {displayData.vision_title}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              {displayData.vision_description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
