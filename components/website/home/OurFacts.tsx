"use client";

import { useState, useEffect } from "react";

interface Fact {
  id: number;
  percentage: string;
  label: string;
  order: number;
}

interface ProcessStep {
  id: number;
  number: number;
  title: string;
  description: string;
  order: number;
}

interface SectionData {
  section_title: string;
  large_number: string;
  background_image: string | null;
}

interface PromiseData {
  title: string;
  description: string;
}

export default function OurFacts() {
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [promiseData, setPromiseData] = useState<PromiseData | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchSectionData(),
          fetchFactsData(),
          fetchPromiseData(),
          fetchProcessStepsData(),
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchSectionData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/our-facts-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.our_facts_section) {
          setSectionData({
            section_title: data.data.our_facts_section.section_title || "Our Facts",
            large_number: data.data.our_facts_section.large_number || "15+",
            background_image: data.data.our_facts_section.background_image || null,
          });
        } else {
          // Set defaults if no data
          setSectionData({
            section_title: "Our Facts",
            large_number: "15+",
            background_image: null,
          });
        }
      } else if (response.status === 404) {
        // Set defaults if endpoint returns 404
        setSectionData({
          section_title: "Our Facts",
          large_number: "15+",
          background_image: null,
        });
      }
    } catch (err) {
      console.error("Error fetching section data:", err);
      // Set defaults on error
      setSectionData({
        section_title: "Our Facts",
        large_number: "15+",
        background_image: null,
      });
    }
  };

  const fetchFactsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/our-facts", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const factsData = Array.isArray(data.data)
            ? data.data
            : data.data.facts || data.data.our_facts || [];
          const sortedFacts = factsData
            .map((fact: any) => ({
              id: fact.id,
              percentage: fact.percentage || "",
              label: fact.label || "",
              order: fact.order || 0,
            }))
            .sort((a: Fact, b: Fact) => a.order - b.order);
          setFacts(sortedFacts);
        }
      } else if (response.status === 404) {
        setFacts([]);
      }
    } catch (err) {
      console.error("Error fetching facts data:", err);
      setFacts([]);
    }
  };

  const fetchPromiseData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/our-promise", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.our_promise) {
          setPromiseData({
            title: data.data.our_promise.title || "Our Promise",
            description: data.data.our_promise.description || "",
          });
        } else {
          setPromiseData({
            title: "Our Promise",
            description: "We help you scale your vision and services through thoughtful planning and consultation.",
          });
        }
      } else if (response.status === 404) {
        setPromiseData({
          title: "Our Promise",
          description: "We help you scale your vision and services through thoughtful planning and consultation.",
        });
      }
    } catch (err) {
      console.error("Error fetching promise data:", err);
      setPromiseData({
        title: "Our Promise",
        description: "We help you scale your vision and services through thoughtful planning and consultation.",
      });
    }
  };

  const fetchProcessStepsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/process-steps", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const stepsData = Array.isArray(data.data)
            ? data.data
            : data.data.steps || data.data.process_steps || [];
          const sortedSteps = stepsData
            .map((step: any) => ({
              id: step.id,
              number: step.number || 1,
              title: step.title || "",
              description: step.description || "",
              order: step.order || 0,
            }))
            .sort((a: ProcessStep, b: ProcessStep) => a.order - b.order);
          setProcessSteps(sortedSteps);
        }
      } else if (response.status === 404) {
        setProcessSteps([]);
      }
    } catch (err) {
      console.error("Error fetching process steps data:", err);
      setProcessSteps([]);
    }
  };

  // Get image URL with proper formatting
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/storage") || imagePath.startsWith("/")) {
      return `http://localhost:8000${imagePath}`;
    }
    return imagePath;
  };

  const backgroundImageUrl = getImageUrl(sectionData?.background_image || null);

  // Fallback values
  const largeNumber = sectionData?.large_number || "15+";
  const sectionTitle = sectionData?.section_title || "Our Facts";
  const promiseTitle = promiseData?.title || "Our Promise";
  const promiseDescription =
    promiseData?.description ||
    "We help you scale your vision and services through thoughtful planning and consultation.";

  if (loading) {
    return (
      <section className="bg-white py-8 sm:py-10 md:py-12">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-white pt-0 pb-8 sm:pb-10 md:pb-12"
      style={
        backgroundImageUrl
          ? {
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
          : {}
      }
    >
      {/* Top Row - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full max-w-full overflow-hidden" data-aos="fade-up">
        {/* Top Left - Pink Background with Years */}
        <div className="p-8 md:p-12 lg:p-16 flex items-center justify-center min-h-[300px] md:min-h-[400px]" style={{ backgroundColor: '#E60F77' }} data-aos="fade-up">
          <div className="text-white text-center lg:text-left">
            <div className="text-7xl sm:text-8xl md:text-9xl lg:text-10xl xl:text-11xl font-bold pl-4 md:pl-8 lg:pl-12">
              {largeNumber}
            </div>
          </div>
        </div>

        {/* Top Right - Background with Circular Indicators */}
        <div className="p-8 md:p-12 lg:p-16 min-h-[300px] md:min-h-[400px] overflow-x-auto" style={{ backgroundColor: '#F3F4F6' }} data-aos="fade-up">
          <div className="w-full max-w-full">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-700 mb-6 md:mb-8">
              {sectionTitle}
            </h2>
            <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6 justify-center lg:justify-start">
              {facts.length > 0 ? (
                facts.map((fact) => {
                  // Parse percentage - handle both "99%" and "99" formats
                  const percentageValue = parseFloat(fact.percentage.replace(/[^0-9.]/g, '')) || 0;
                  const circumference = 2 * Math.PI * 54; // radius = 54
                  const offset = circumference - (percentageValue / 100) * circumference;
                  // Calculate dot position at end of progress arc
                  const angle = (percentageValue / 100) * 360 - 90; // -90 to start from top
                  const dotX = 60 + 54 * Math.cos((angle * Math.PI) / 180);
                  const dotY = 60 + 54 * Math.sin((angle * Math.PI) / 180);

                  // Format percentage for display - ensure it has % sign
                  const displayPercentage = fact.percentage.includes('%')
                    ? fact.percentage
                    : `${fact.percentage}%`;

                  return (
                    <div key={fact.id} className="relative flex-shrink-0 flex flex-col items-center">
                      <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-48 xl:h-48 relative">
                        {/* Circle Background */}
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 120 120"
                        >
                          {/* Inner Circle - Light Gray */}
                          <circle
                            cx="60"
                            cy="60"
                            r="48"
                            fill="#e5e7eb"
                          />
                          {/* Background Circle - Outer Ring */}
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#E2E8F2"
                            strokeWidth="2"
                          />
                          {/* Blue Dot */}
                          <circle
                            cx={dotX}
                            cy={dotY}
                            r="5"
                            fill="#2563EB"
                          />
                        </svg>
                        {/* Percentage Text - Centered */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black">
                            {displayPercentage}
                          </div>
                        </div>
                      </div>
                      {/* Label - Below Circle */}
                      <div className="text-center mt-2">
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
                          {fact.label}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 text-center w-full py-4">No facts available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Background with Overlay Card */}
      <div className="relative w-full" data-aos="fade-up">
        {/* Full Width Background */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[500px] w-full">
          <div style={{ backgroundColor: '#E60F77' }}></div>
          <div style={{ backgroundColor: '#F3F4F6' }}></div>
        </div>

        {/* Single White Card Overlay - Constrained */}
        <div className="absolute inset-0 flex items-center justify-center px-1 sm:px-2 md:px-4 lg:px-6 py-4 sm:py-6 md:py-8">
          <div className="max-w-[95%] w-full relative">
            <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 lg:p-16 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                {/* Left Side - Our Promise */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">
                    {promiseTitle}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                    {promiseDescription}
                  </p>
                </div>

                {/* Right Side - Process Steps */}
                <div className="flex flex-col w-full">
                  <div className="relative w-full">
                    <div className="flex flex-col gap-2 md:gap-3">
                      {processSteps.length > 0 ? (
                        processSteps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 sm:gap-4 py-1 sm:py-2">
                            {/* Light Pink Circular Number */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE8F4' }}>
                              <span className="font-bold text-base sm:text-lg md:text-xl" style={{ color: '#E60F77' }}>
                                {step.number}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                                {step.title}
                              </h4>
                              <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500">No process steps available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

