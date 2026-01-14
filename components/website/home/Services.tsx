"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ServiceCard {
  id: number;
  subtitle: string;
  description: string;
  image: string | null;
  order: number;
}

interface ServiceSectionData {
  subtitle: string;
  main_title: string;
  button_text: string;
  background_image: string | null;
}

export default function Services() {
  const [serviceSection, setServiceSection] = useState<ServiceSectionData | null>(null);
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service section and cards in parallel
      const [sectionResponse, cardsResponse] = await Promise.all([
        fetch("http://localhost:8000/api/v1/service-section", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }),
        fetch("http://localhost:8000/api/v1/service-cards", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }),
      ]);

      // Handle service section
      if (sectionResponse.ok) {
        const sectionData = await sectionResponse.json();
        if (sectionData.success && sectionData.data?.service_section) {
          setServiceSection(sectionData.data.service_section);
        }
      }

      // Handle service cards
      if (cardsResponse.ok) {
        const cardsData = await cardsResponse.json();
        if (cardsData.success && cardsData.data) {
          const cards = Array.isArray(cardsData.data) 
            ? cardsData.data 
            : (cardsData.data.service_cards || []);
          
          // Sort by order field
          const sortedCards = cards
            .map((card: any) => ({
              id: card.id,
              subtitle: card.subtitle || "",
              description: card.description || "",
              image: card.image || null,
              order: card.order || 0,
            }))
            .sort((a: ServiceCard, b: ServiceCard) => a.order - b.order);
          
          setServiceCards(sortedCards);
        }
      }
    } catch (err: any) {
      console.error("Error fetching service data:", err);
      setError(err.message || "Failed to load service data");
    } finally {
      setLoading(false);
    }
  };

  // Default/fallback content
  const defaultSection: ServiceSectionData = {
    subtitle: "Discover what we offer to help grow your business",
    main_title: "Our Services",
    button_text: "View Services",
    background_image: null,
  };

  const defaultCards: ServiceCard[] = [
    {
      id: 1,
      subtitle: "Reliable quality",
      description: "Make a lasting impression by using our industry leading tech, quality inks, and premium materials. 99.9% of our orders reach happy customers with no issues.",
      image: "/assets/images/1641335875step02.png",
      order: 1,
    },
    {
      id: 2,
      subtitle: "Smooth automation",
      description: "When customers buy from you, we receive and fulfill their orders automatically, so you can focus on running your business.",
      image: "/assets/images/1641335827step03.png",
      order: 2,
    },
    {
      id: 3,
      subtitle: "No order minimums",
      description: "Save money and avoid any leftover stock. The products you sell are created only when your customer places an order.",
      image: "/assets/images/1641335875step02.png",
      order: 3,
    },
    {
      id: 4,
      subtitle: "Fast turnaround",
      description: "We understand time is money. Our efficient production process ensures fast turnaround times without compromising quality, helping you meet your deadlines.",
      image: "/assets/images/1641335827step03.png",
      order: 4,
    },
  ];

  const section = serviceSection || defaultSection;
  const services = serviceCards.length > 0 ? serviceCards : defaultCards;

  if (loading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 relative overflow-hidden">
        <div className="max-w-[95%] mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded animate-pulse mb-4 mx-auto max-w-md"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto max-w-2xl"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md h-64 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 relative overflow-hidden"
      style={
        section.background_image
          ? {
              backgroundImage: `url(http://localhost:8000${section.background_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {/* Background color section - only show if no background image */}
      {!section.background_image && (
        <div 
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{ 
            height: '500px', 
            backgroundColor: '#CEEEFA',
            zIndex: 0
          }}
        >
          {/* Bottom curved overlay */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1200 500"
          >
            <path
              d="M 0 500 Q 300 450 600 470 Q 900 490 1200 750 L 1200 500 L 0 500 Z"
              fill="white"
              fillOpacity="1"
            />
          </svg>
        </div>
      )}
      
      <div className="max-w-[95%] mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {section.main_title}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            {section.subtitle}
          </p>
        </div>

        {/* Services Grid - 4 cards per row */}
        {services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-blue-100 flex flex-col items-center text-center group"
              >
                <div className="group-hover:scale-90 transition-transform duration-300 flex flex-col items-center w-full">
                  {/* Circular Icon Image */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500 flex items-center justify-center bg-white">
                      {service.image ? (
                        service.image.startsWith("http") || service.image.startsWith("/storage") ? (
                          <img
                            src={`http://localhost:8000${service.image}`}
                            alt={service.subtitle}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Image
                            src={service.image}
                            alt={service.subtitle}
                            width={80}
                            height={80}
                            className="object-contain p-2"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.subtitle}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Services Button */}
        {section.button_text && (
          <div className="flex justify-center">
            <Link
              href="/services"
              className="inline-block bg-pink-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-lg font-semibold text-base md:text-lg hover:bg-pink-600 transition-colors"
            >
              {section.button_text}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

