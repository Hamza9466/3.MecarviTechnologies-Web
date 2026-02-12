"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface CategoryTab {
  id: number;
  category_name: string;
  order: number;
}

interface Tab {
  id: number;
  tab_title: string;
  tag_label: string;
  main_heading: string;
  description: string;
  features: string[];
  button_text: string;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
  order: number;
  category_tab_id: number;
}

interface SectionData {
  section_title: string;
  background_image: string | null;
}

export default function WhatWeCreate() {
  const [categories, setCategories] = useState<CategoryTab[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  // Fetch section data and categories on mount
  useEffect(() => {
    fetchSectionData();
    fetchCategories();
  }, []);

  // Fetch tabs when category is selected
  useEffect(() => {
    setSelectedTabId(null);
    
    if (selectedCategoryId) {
      fetchTabsForCategory(selectedCategoryId);
    } else {
      setTabs([]);
      setSelectedTabId(null);
    }
  }, [selectedCategoryId]);

  // Select first tab when tabs are loaded (fallback mechanism)
  useEffect(() => {
    if (tabs.length > 0 && selectedCategoryId) {
      const currentTabExists = tabs.some(tab => tab.id === selectedTabId);
      if (!selectedTabId || !currentTabExists) {
        console.log(`useEffect fallback: Selecting first tab ${tabs[0].id} from ${tabs.length} tabs`);
        setSelectedTabId(tabs[0].id);
      }
    } else if (tabs.length === 0 && selectedCategoryId) {
      // If category is selected but no tabs, make sure selectedTabId is null
      setSelectedTabId(null);
    }
  }, [tabs, selectedCategoryId, selectedTabId]);

  const fetchSectionData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/what-we-create-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.what_we_create_section) {
          const section = data.data.what_we_create_section;
          setSectionData({
            section_title: section.section_title || "What We Create",
            background_image: section.background_image || null,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching section data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/category-tabs", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const categoriesData = Array.isArray(data.data) ? data.data : (data.data.category_tabs || []);
          const sortedCategories = categoriesData
            .map((cat: any) => ({
              id: cat.id,
              category_name: cat.category_name || "",
              order: cat.order || 0,
            }))
            .sort((a: CategoryTab, b: CategoryTab) => a.order - b.order);
          
          setCategories(sortedCategories);
          
          // Auto-select first category
          if (sortedCategories.length > 0) {
            setSelectedCategoryId(sortedCategories[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabsForCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/what-we-create-tabs?category_tab_id=${categoryId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Tabs API Response:", data);
        
        if (data.success && data.data) {
          const tabsData = Array.isArray(data.data) 
            ? data.data 
            : (data.data.tabs || data.data.what_we_create_tabs || []);
          
          console.log(`Processing ${tabsData.length} tabs for category ${categoryId}:`, tabsData);
          
          const sortedTabs = tabsData
            .map((tab: any) => ({
              id: tab.id,
              tab_title: tab.tab_title || tab.title || "",
              tag_label: tab.tag_label || tab.tag || "",
              main_heading: tab.main_heading || tab.heading || "",
              description: tab.description || "",
              features: Array.isArray(tab.features) 
                ? tab.features 
                : (typeof tab.features === 'string' 
                  ? (tab.features.startsWith('[') || tab.features.startsWith('{') 
                    ? JSON.parse(tab.features) 
                    : [tab.features])
                  : (tab.features ? [tab.features] : [])),
              button_text: tab.button_text || tab.buttonText || "Learn More",
              image_1: tab.image_1 || null,
              image_2: tab.image_2 || null,
              image_3: tab.image_3 || null,
              order: tab.order || 0,
              category_tab_id: tab.category_tab_id || categoryId,
            }))
            .sort((a: Tab, b: Tab) => a.order - b.order);
          
          console.log(`Sorted tabs (${sortedTabs.length}):`, sortedTabs);
          
          // Set tabs and select first tab
          if (sortedTabs.length > 0) {
            const firstTabId = sortedTabs[0].id;
            console.log(`Setting tabs (${sortedTabs.length}) and selecting first tab: ${firstTabId} (${sortedTabs[0].tab_title})`);
            // Set both at the same time to avoid race conditions
            setTabs(sortedTabs);
            setSelectedTabId(firstTabId);
          } else {
            console.log("No tabs found, clearing tabs and selectedTabId");
            setTabs([]);
            setSelectedTabId(null);
          }
        } else {
          console.log("Response OK but no data or success:", data);
          setTabs([]);
          setSelectedTabId(null);
        }
      } else {
        console.error("Failed to fetch tabs, status:", response.status);
        setTabs([]);
        setSelectedTabId(null);
      }
    } catch (error) {
      console.error("Error fetching tabs:", error);
      setTabs([]);
    }
  };

  const selectedTab = tabs.find(tab => tab.id === selectedTabId);

  // Debug logging
  console.log('WhatWeCreate Render State:', {
    selectedCategoryId,
    tabsCount: tabs.length,
    tabs: tabs.map(t => ({ id: t.id, title: t.tab_title })),
    selectedTabId,
    selectedTab: selectedTab ? { id: selectedTab.id, title: selectedTab.tab_title } : null,
  });

  // Get image for display - only from selected tab, 1 image
  const displayImages = selectedTab 
    ? (selectedTab.image_1 ? [selectedTab.image_1] : [])
    : [];
  
  console.log('Display Images:', {
    selectedTabId,
    selectedTabTitle: selectedTab?.tab_title,
    imageCount: displayImages.length,
    images: displayImages
  });

  // Background image style
  const backgroundStyle = sectionData?.background_image
    ? {
        backgroundImage: `url(http://localhost:8000${sectionData.background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  if (loading) {
    return (
      <section className="pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 md:pb-8 px-1 sm:px-2 md:px-4 lg:px-6 relative overflow-hidden min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; // Don't render if no categories
  }

  return (
    <section 
      className="py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 relative overflow-hidden min-h-screen bg-white"
      style={backgroundStyle}
    >
      {/* Wave Shape with Gradient - Only show if no background image */}
      {!sectionData?.background_image && (
        <svg 
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#663AFF" />
              <stop offset="100%" stopColor="#30B4FE" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q720,50 1440,0 L1440,900 L0,900 Z"
            fill="url(#waveGradient)"
          />
        </svg>
      )}
      
      <div className="max-w-[95%] mx-auto relative z-10">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-12 md:mb-16" data-aos="fade-up">
          {sectionData?.section_title || "What We Create"}
        </h1>

        {/* Main Content - Single White Container */}
        <div className="bg-white rounded-2xl pt-0 pb-8 md:pb-10 px-8 md:px-10 shadow-2xl relative" data-aos="fade-up">
          {/* Navigation Tabs - At Top of White Container */}
          <div className="flex items-center justify-center gap-3 mb-8 md:mb-12">
            {/* Left Arrow */}
            <button
              onClick={() => {
                if (tabsScrollRef.current) {
                  tabsScrollRef.current.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  });
                }
              }}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{ background: 'linear-gradient(to right, #5859FD, #3F91FE)' }}
              aria-label="Previous"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Tabs Container */}
            <div 
              ref={tabsScrollRef}
              className="rounded-b-2xl px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1 max-w-3xl"
              style={{ background: 'linear-gradient(to right, #5859FD, #3F91FE)' }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`flex-shrink-0 px-6 py-2 rounded-lg font-semibold text-sm md:text-base transition-colors whitespace-nowrap ${
                    selectedCategoryId === category.id
                      ? "bg-yellow-400 text-black"
                      : "text-white hover:opacity-80"
                  }`}
                >
                  {category.category_name}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => {
                if (tabsScrollRef.current) {
                  tabsScrollRef.current.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  });
                }
              }}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{ background: 'linear-gradient(to right, #5859FD, #3F91FE)' }}
              aria-label="Next"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>


          {/* Content Area */}
          {selectedTab ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start" >
              {/* Left Column - Dashboard Images */}
              <div className="order-2 lg:order-1 -ml-8 md:-ml-10 -mb-8 md:-mb-10">
                <div className="relative w-full aspect-[4/5]">
                  {displayImages.length > 0 ? (
                    displayImages.map((imageUrl, index) => (
                      <div 
                        key={`${selectedTab?.id}-img-${index}`} 
                        className="absolute inset-0 w-full h-full"
                      >
                        <img
                          src={`http://localhost:8000${imageUrl}`}
                          alt={`${selectedTab?.tag_label || 'Image'} - Image ${index + 1}`}
                          className="w-full h-full object-contain rounded-lg"
                          style={{ 
                            width: '100%', 
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block'
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No images available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Content */}
              <div key={selectedTab.id} className="order-1 lg:order-2 space-y-6">
                {/* Yellow Tag - Show Category Name */}
                {(() => {
                  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
                  return selectedCategory?.category_name && (
                    <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      {selectedCategory.category_name}
                    </span>
                  );
                })()}

                {/* Main Heading */}
                {selectedTab.main_heading && (
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 mb-6">
                    {selectedTab.main_heading}
                  </h2>
                )}

                {/* Description */}
                {selectedTab.description && (
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
                    {selectedTab.description}
                  </p>
                )}

                {/* Features List with Blue Checkmarks */}
                {selectedTab.features && selectedTab.features.length > 0 && (
                  <ul className="space-y-4 mb-8">
                    {selectedTab.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: '#1248D4' }}>
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-base md:text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button - Blue */}
                {selectedTab.button_text && (
                  <Link
                    href="/services"
                    className="inline-block text-white px-8 py-4 rounded-lg font-semibold text-base transition-colors"
                    style={{ backgroundColor: '#1248D4' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0E3AA0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1248D4'}
                  >
                    {selectedTab.button_text}
                  </Link>
                )}
              </div>
            </div>
          ) : tabs.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>No content available for this category.</p>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>Select a tab above to view content.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Convex Wave Divider */}
      <svg 
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        style={{ zIndex: 0 }}
      >
        <path
          d="M0,100 Q720,50 1440,100 L1440,100 L0,100 Z"
          fill="white"
        />
      </svg>
    </section>
  );
}
