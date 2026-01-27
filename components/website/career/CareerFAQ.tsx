"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface FAQSection {
  id: number;
  section_title: string;
  question: string;
  answer: string;
  image?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface FAQResponse {
  success: boolean;
  data: {
    faq_sections?: FAQSection[];
    faq_section?: FAQSection;
  };
  message?: string;
}

export default function CareerFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("Frequently Asked Questions");

  // Fetch FAQ sections from API
  const fetchFAQSections = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/faq-sections", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data: FAQResponse = await response.json();
        if (data.success && data.data?.faq_sections) {
          setFaqs(data.data.faq_sections);
          // Set section title from the first FAQ item
          if (data.data.faq_sections.length > 0) {
            setSectionTitle(data.data.faq_sections[0].section_title || "Frequently Asked Questions");
          }
        }
      } else {
        console.error("Failed to fetch FAQ sections");
      }
    } catch (err) {
      console.error("Error fetching FAQ sections:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFAQSections();
  }, []);

  return (
    <section className="bg-white px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            {sectionTitle}
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-b-green-600"></div>
            <p className="mt-4 text-gray-600">Loading FAQ...</p>
          </div>
        ) : (
          <>
            {/* FAQ Items - Two Column Layout */}
            {faqs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" data-aos="fade-up">
                {faqs
                  .filter(faq => faq.is_active) // Only show active FAQs
                  .sort((a, b) => a.sort_order - b.sort_order) // Sort by sort_order
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className="border-b border-gray-200 pb-4 cursor-pointer"
                      onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base md:text-lg font-medium pr-4 ${openFAQ === faq.id ? "text-green-700" : "text-gray-700"
                          }`}>
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          <svg
                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openFAQ === faq.id ? "rotate-180" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      {openFAQ === faq.id && (
                        <div className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No FAQ sections available at the moment.</p>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
