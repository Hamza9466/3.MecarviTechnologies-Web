"use client";

import { useState, useEffect } from "react";

interface PortfolioItem {
  id: number;
  title: string;
  image: string | null;
  link: string;
  order: number;
}

interface SectionData {
  main_heading: string;
  description: string;
  background_image: string | null;
}

export default function Portfolio() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([fetchSectionData(), fetchPortfolioItems()]);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchSectionData = async () => {
    try {
      console.log("Portfolio - Fetching section data...");
      // Try GET first (standard for fetching data)
      let response = await fetch("http://localhost:8000/api/v1/portfolio-section", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Portfolio - Section data response status:", response.status);

      // If GET doesn't work, try POST
      if (!response.ok && response.status === 405) {
        console.log("Portfolio - GET not allowed, trying POST...");
        response = await fetch("http://localhost:8000/api/v1/portfolio-section", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Portfolio - Section data response:", data);
        if (data.success && data.data?.portfolio_section) {
          setSectionData(data.data.portfolio_section);
        } else {
          // Set defaults
          console.log("Portfolio - Using default section data");
          setSectionData({
            main_heading: "PORTFOLIO",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, deserunt sed eligendi velit laboriosam suscipit, quisquam eveniet illo soluta adipisci necessitatibus officia id blanditiis voluptates eos. Ab alias inventore molestiae.",
            background_image: null,
          });
        }
      } else if (response.status === 404) {
        console.log("Portfolio - Section data not found (404), using defaults");
        // Set defaults if endpoint returns 404
        setSectionData({
          main_heading: "PORTFOLIO",
          description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, deserunt sed eligendi velit laboriosam suscipit, quisquam eveniet illo soluta adipisci necessitatibus officia id blanditiis voluptates eos. Ab alias inventore molestiae.",
          background_image: null,
        });
      }
    } catch (err) {
      console.error("Portfolio - Error fetching section data:", err);
      // Set defaults on error
      setSectionData({
        main_heading: "PORTFOLIO",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, deserunt sed eligendi velit laboriosam suscipit, quisquam eveniet illo soluta adipisci necessitatibus officia id blanditiis voluptates eos. Ab alias inventore molestiae.",
        background_image: null,
      });
    }
  };

  const fetchPortfolioItems = async () => {
    try {
      console.log("Portfolio - Fetching portfolio items...");
      // Try GET first (standard for fetching data)
      let response = await fetch("http://localhost:8000/api/v1/portfolio-items", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Portfolio - Portfolio items response status:", response.status);

      // If GET doesn't work, try POST
      if (!response.ok && response.status === 405) {
        console.log("Portfolio - GET not allowed for items, trying POST...");
        response = await fetch("http://localhost:8000/api/v1/portfolio-items", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Portfolio - Portfolio items response:", data);

        // Handle different response formats
        let itemsData: any[] = [];
        console.log("Portfolio - Raw data structure:", {
          isArray: Array.isArray(data),
          keys: Object.keys(data),
          data: data
        });

        if (Array.isArray(data)) {
          itemsData = data;
        } else if (data.success && data.data) {
          if (Array.isArray(data.data)) {
            itemsData = data.data;
          } else if (data.data.portfolio_items && Array.isArray(data.data.portfolio_items)) {
            itemsData = data.data.portfolio_items;
          } else if (data.data.portfolio_item) {
            // Single item response
            itemsData = [data.data.portfolio_item];
          } else if (data.data.items && Array.isArray(data.data.items)) {
            itemsData = data.data.items;
          }
        } else if (data.data && Array.isArray(data.data)) {
          itemsData = data.data;
        } else if (Array.isArray(data.portfolio_items)) {
          itemsData = data.portfolio_items;
        } else if (data.items && Array.isArray(data.items)) {
          itemsData = data.items;
        }

        console.log("Portfolio - Parsed items data:", itemsData);

        const sortedItems = itemsData
          .map((item: any) => ({
            id: item.id,
            title: item.title || "",
            link: item.link || "",
            image: item.image || null,
            order: parseInt(item.order) || 0,
          }))
          .sort((a: PortfolioItem, b: PortfolioItem) => a.order - b.order);

        console.log("Portfolio - Sorted items:", sortedItems);
        setPortfolioItems(sortedItems);
      } else {
        console.log("Portfolio - Portfolio items not found (404), setting empty array");
        // Temporarily enable sample data for testing
        setPortfolioItems([
          {
            id: 1,
            title: "Sample Project 1",
            link: "#",
            image: null,
            order: 1
          },
          {
            id: 2,
            title: "Sample Project 2",
            link: "#",
            image: null,
            order: 2
          }
        ]);

        // Set empty array for production:
        // setPortfolioItems([]);
      }
    } catch (err) {
      console.error("Portfolio - Error fetching portfolio items:", err);
      console.log("Portfolio - Setting empty array due to error");
      setPortfolioItems([]);

      // Uncomment to test with sample data when API fails:
      /*
      setPortfolioItems([
        {
          id: 1,
          title: "Sample Project 1",
          link: "#",
          image: null,
          order: 1
        },
        {
          id: 2,
          title: "Sample Project 2", 
          link: "#",
          image: null,
          order: 2
        }
      ]);
      */
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

  // Get portfolio items with images only
  const portfolioItemsWithImages = portfolioItems.filter((item) => {
    const imageUrl = getImageUrl(item.image);
    return imageUrl !== null && imageUrl !== undefined;
  });

  // Get portfolio images from items
  const portfolioImages = portfolioItemsWithImages
    .map((item) => getImageUrl(item.image)!)
    .filter(Boolean);

  // Create duplicated array for seamless infinite loop
  const duplicatedImages = portfolioImages.length > 0
    ? [...portfolioImages, ...portfolioImages, ...portfolioImages]
    : [];

  // Auto-slide functionality - moves one image at a time
  useEffect(() => {
    if (portfolioImages.length === 0) {
      setCurrentIndex(0);
      return;
    }

    // Start at 0 to show images immediately
    setCurrentIndex(0);
    setIsTransitioning(true);

    // Move to middle set after images are visible for seamless infinite loop
    const initTimeout = setTimeout(() => {
      setCurrentIndex(portfolioImages.length);
    }, 500);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // When we reach the end of the second set, reset to start of second set
        if (nextIndex >= portfolioImages.length * 2) {
          setTimeout(() => {
            setIsTransitioning(false);
            setCurrentIndex(portfolioImages.length);
            setTimeout(() => {
              setIsTransitioning(true);
            }, 50);
          }, 1000);
          return nextIndex;
        }
        return nextIndex;
      });
    }, 2000); // Move one image every 2 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(initTimeout);
    };
  }, [portfolioImages.length]);

  const goToPrevious = () => {
    if (portfolioImages.length === 0) return;
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex < portfolioImages.length) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(portfolioImages.length * 2 - 1);
          setTimeout(() => {
            setIsTransitioning(true);
          }, 50);
        }, 1000);
        return newIndex;
      }
      return newIndex;
    });
  };

  const goToNext = () => {
    if (portfolioImages.length === 0) return;
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= portfolioImages.length * 2) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(portfolioImages.length);
          setTimeout(() => {
            setIsTransitioning(true);
          }, 50);
        }, 1000);
        return nextIndex;
      }
      return nextIndex;
    });
  };

  // Get background image URL
  const backgroundImageUrl = sectionData?.background_image
    ? getImageUrl(sectionData.background_image)
    : null;

  // Fallback values
  const mainHeading = sectionData?.main_heading || "PORTFOLIO";
  const description = sectionData?.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, deserunt sed eligendi velit laboriosam suscipit, quisquam eveniet illo soluta adipisci necessitatibus officia id blanditiis voluptates eos. Ab alias inventore molestiae.";

  if (loading) {
    return (
      <section className="bg-white relative">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading portfolio...</div>
        </div>
      </section>
    );
  }

  console.log("Portfolio Component Debug:", {
    loading,
    portfolioItemsLength: portfolioItems.length,
    portfolioImagesLength: portfolioImages.length,
    portfolioItems,
    portfolioImages,
  });

  // Don't render if no portfolio items at all
  if (portfolioItems.length === 0) {
    return (
      <section className="bg-white relative py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-gray-900 uppercase mb-4">PORTFOLIO</h2>
          <p className="text-center text-gray-600 mb-8">No portfolio items available yet. Please add portfolio items through the admin panel.</p>
        </div>
      </section>
    );
  }

  // If no items have images, show a message
  if (portfolioImages.length === 0 && portfolioItems.length > 0) {
    return (
      <section className="bg-white relative py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-gray-900 uppercase mb-4">PORTFOLIO</h2>
          <p className="text-center text-gray-600 mb-8">Portfolio items exist but no images are available. Please add images to portfolio items through the admin panel.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-white relative"
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
      {/* Header Section */}
      <div className="relative bg-white px-1 sm:px-2 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5">
        <div className="max-w-[95%] mx-auto relative z-10 px-2 sm:px-0" data-aos="fade-up">
          {/* PORTFOLIO Title */}
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 uppercase mb-2 sm:mb-3">
            {mainHeading}
          </h2>

          {/* Description Text */}
          <p className="text-center text-gray-600 text-xs sm:text-sm md:text-base max-w-6xl mx-auto leading-relaxed px-2 sm:px-0">
            {description}
          </p>
        </div>
      </div>

      {/* Photo Collage Section - Full Width Auto Slide */}
      <div className="relative w-full" style={{ minHeight: '400px', height: '400px', overflow: 'hidden', backgroundColor: '#fce7f3' }} data-aos="fade-up">
        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 z-20 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-2 sm:p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-110"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          aria-label="Previous slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
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
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 z-20 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-2 sm:p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-110"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          aria-label="Next slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
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

        <div
          className="flex flex-nowrap"
          style={{
            transform: `translateX(-${currentIndex * 350}px)`,
            transition: isTransitioning ? "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            height: '400px',
            width: `${duplicatedImages.length * 350}px`,
            willChange: 'transform',
          }}
        >
          {duplicatedImages.map((imageUrl, index) => {
            // Calculate which portfolio item this image corresponds to
            const baseIndex = index % portfolioImages.length;
            const item = portfolioItemsWithImages[baseIndex];

            if (!imageUrl) {
              return null;
            }

            const imageContent = (
              <div
                key={`img-${index}`}
                className="relative overflow-hidden flex-shrink-0"
                style={{
                  width: '350px',
                  minWidth: '350px',
                  maxWidth: '350px',
                  height: '400px',
                  flexShrink: 0,
                  padding: '0',
                }}
              >
                <img
                  src={imageUrl}
                  alt={item?.title || `Portfolio ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    console.error("Image failed to load:", imageUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            );

            // Wrap in link if item has a link
            if (item?.link) {
              return (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {imageContent}
                </a>
              );
            }

            return <div key={index}>{imageContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
