"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CareerCards() {
  const [careerCards, setCareerCards] = useState<any[]>([]);
  const [sectionTitle, setSectionTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerCards();
  }, []);

  const fetchCareerCards = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/career-cards", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.career_cards) {
          const cards = data.data.career_cards;
          setCareerCards(cards);
          if (cards.length > 0 && cards[0].section_title) {
            setSectionTitle(cards[0].section_title);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching career cards:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="max-w-[95%] mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-b-pink-600"></div>
        </div>
      </section>
    );
  }

  if (careerCards.length === 0) {
    return null; // Don't show section if no cards
  }

  return (
    <section className="bg-white pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Section Title */}
        {sectionTitle && (
          <h2 className="text-gray-800 text-center text-xl sm:text-2xl md:text-3xl font-bold mb-12 md:mb-16" data-aos="fade-up">
            {sectionTitle}
          </h2>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8" data-aos="fade-up">
          {careerCards.map((card) => {
            // Split title into two lines if it contains "update"
            const titleParts = card.title.includes("update")
              ? card.title.split(" update")
              : card.title.length > 15
                ? [card.title.substring(0, card.title.length - 6), card.title.substring(card.title.length - 6)]
                : [card.title];

            return (
              <div
                key={card.id}
                className="bg-white rounded-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center"
              >
                {/* Circular Image */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden">
                    {card.image ? (
                      <img
                        src={card.image.startsWith('http') ? card.image : `http://localhost:8000${card.image}`}
                        alt={card.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title - Centered, can be split into two lines */}
                <h3 className="text-xl md:text-2xl font-bold text-pink-600 mb-3 md:mb-4 text-center">
                  {titleParts.length > 1 ? (
                    <>
                      {titleParts[0]}
                      <br />
                      {titleParts[1] ? ` ${titleParts[1]}` : "update"}
                    </>
                  ) : (
                    card.title
                  )}
                </h3>

                {/* Description - Centered */}
                <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

