"use client";

import { useState, useEffect } from "react";

interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  order: number;
}

const colorSchemes = [
  { bgColor: "bg-pink-500", borderColor: "border-pink-500", textColor: "text-pink-500" },
  { bgColor: "bg-yellow-500", borderColor: "border-yellow-500", textColor: "text-yellow-500" },
  { bgColor: "bg-green-600", borderColor: "border-green-600", textColor: "text-green-600" },
  { bgColor: "bg-orange-500", borderColor: "border-orange-500", textColor: "text-orange-500" },
  { bgColor: "bg-purple-500", borderColor: "border-purple-500", textColor: "text-purple-500" },
  { bgColor: "bg-red-500", borderColor: "border-red-500", textColor: "text-red-500" },
  { bgColor: "bg-teal-500", borderColor: "border-teal-500", textColor: "text-teal-500" },
  { bgColor: "bg-slate-500", borderColor: "border-slate-500", textColor: "text-slate-500" },
  { bgColor: "bg-pink-600", borderColor: "border-pink-600", textColor: "text-pink-600" },
];

interface CoreValuesSection {
  section_title: string;
  section_description: string;
}

export default function CoreValues() {
  const [values, setValues] = useState<CoreValue[]>([]);
  const [section, setSection] = useState<CoreValuesSection>({ section_title: "", section_description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoreValues();
    fetchCoreValuesSection();
  }, []);

  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/storage")) return `http://localhost:8000${url}`;
    return `http://localhost:8000/storage/${url}`;
  };

  const fetchCoreValuesSection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/core-values-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.core_values_section) {
          const s = data.data.core_values_section;
          setSection({
            section_title: s.section_title ?? "",
            section_description: s.section_description ?? "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching core values section:", err);
    }
  };

  const fetchCoreValues = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/core-values", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const valuesData = Array.isArray(result.data) 
            ? result.data 
            : (result.data.core_values || []);
          
          const sortedValues = valuesData
            .map((cv: any) => ({
              id: cv.id,
              title: cv.title || "",
              description: cv.description || "",
              icon: getImageUrl(cv.icon),
              order: cv.order ?? 0,
            }))
            .sort((a: CoreValue, b: CoreValue) => a.order - b.order);

          setValues(sortedValues);
        }
      }
    } catch (err) {
      console.error("Error fetching core values:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white pt-0 pb-8 sm:pb-12 md:pb-16 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="max-w-[95%] mx-auto">
          <div className="text-gray-600 text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (values.length === 0) {
    return null;
  }

  return (
    <section className="bg-white pt-0 pb-8 sm:pb-12 md:pb-16 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Section title and description */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 text-center mb-6 md:mb-8" data-aos="fade-up">
          {section.section_title || "Core Values"}
        </h2>
        {section.section_description && (
          <p className="text-gray-600 text-base md:text-lg lg:text-xl text-center w-full mb-6 md:mb-8" data-aos="fade-up">
            {section.section_description}
          </p>
        )}

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8" data-aos="fade-up">
          {values.map((value, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];
            return (
              <div
                key={value.id}
                className={`relative border-2 rounded-lg overflow-hidden bg-white ${colorScheme.borderColor}`}
              >
                {/* Left vertical bar with number */}
                <div className={`absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center ${colorScheme.bgColor}`}>
                  <span className="text-white font-bold text-2xl md:text-3xl lg:text-4xl">{index + 1}</span>
                </div>

                {/* Content area */}
                <div className="pl-16 pr-4 py-5">
                  {/* Icon */}
                  <div className={`mb-3 ${colorScheme.textColor}`}>
                    {value.icon ? (
                      <img
                        src={value.icon}
                        alt={value.title}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
                      </svg>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-2 ${colorScheme.textColor}`}>
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
