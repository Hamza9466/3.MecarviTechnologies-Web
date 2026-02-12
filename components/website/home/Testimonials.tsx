"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  name: string;
  designation: string;
  rating: number;
  review_quote: string;
  avatar: string | null;
  order: number;
}

interface SectionData {
  main_heading: string;
  average_rating: string;
  client_label: string;
  review_count: string;
  call_to_action_text: string;
  avatar_1: string | null;
  avatar_2: string | null;
  avatar_3: string | null;
  avatar_4: string | null;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([fetchSectionData(), fetchReviewsData()]);
      } catch (err) {
        console.error("Error fetching testimonials data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Reset slider index when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      setCurrentIndex(0);
    }
  }, [reviews.length]);

  const fetchSectionData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/reviews-section", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.reviews_section) {
          setSectionData(data.data.reviews_section);
        } else {
          // Set defaults
          setSectionData({
            main_heading: "WHAT OUR CLIENT SAY",
            average_rating: "4.9",
            client_label: "Our Client",
            review_count: "5k+",
            call_to_action_text: "Customer experiences that speak for themselves",
            avatar_1: null,
            avatar_2: null,
            avatar_3: null,
            avatar_4: null,
          });
        }
      } else if (response.status === 404) {
        // Set defaults if endpoint returns 404
        setSectionData({
          main_heading: "WHAT OUR CLIENT SAY",
          average_rating: "4.9",
          client_label: "Our Client",
          review_count: "5k+",
          call_to_action_text: "Customer experiences that speak for themselves",
          avatar_1: null,
          avatar_2: null,
          avatar_3: null,
          avatar_4: null,
        });
      }
    } catch (err) {
      console.error("Error fetching section data:", err);
      // Set defaults on error
      setSectionData({
        main_heading: "WHAT OUR CLIENT SAY",
        average_rating: "4.9",
        client_label: "Our Client",
        review_count: "5k+",
        call_to_action_text: "Customer experiences that speak for themselves",
        avatar_1: null,
        avatar_2: null,
        avatar_3: null,
        avatar_4: null,
      });
    }
  };

  const fetchReviewsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/reviews", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const reviewsData = Array.isArray(data.data) ? data.data : data.data.reviews || [];
          const sortedReviews = reviewsData
            .map((review: any) => ({
              id: review.id,
              name: review.name || "",
              designation: review.designation || "",
              rating: parseFloat(review.rating) || 0,
              review_quote: review.review_quote || "",
              avatar: review.avatar || null,
              order: review.order || 0,
            }))
            .sort((a: Review, b: Review) => a.order - b.order);
          setReviews(sortedReviews);
        }
      } else if (response.status === 404) {
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews data:", err);
      setReviews([]);
    }
  };

  const nextTestimonial = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev + 2) % reviews.length);
    }
  };

  const prevTestimonial = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev - 2 + reviews.length) % reviews.length);
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

  // Get client avatars
  const clientAvatars = sectionData
    ? [
        sectionData.avatar_1,
        sectionData.avatar_2,
        sectionData.avatar_3,
        sectionData.avatar_4,
      ].filter(Boolean)
    : [];

  // Fallback values
  const mainHeading = sectionData?.main_heading || "WHAT OUR CLIENT SAY";
  const averageRating = sectionData?.average_rating || "4.9";
  const clientLabel = sectionData?.client_label || "Our Client";
  const reviewCount = sectionData?.review_count || "5k+";
  const heading = sectionData?.call_to_action_text || "Customer experiences that speak for themselves";

  if (loading) {
    return (
      <section className="bg-white pt-0 pb-4 sm:pb-6 md:pb-8 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }

  // Don't render if no reviews
  if (reviews.length === 0) {
    return null;
  }

  // Ensure currentIndex is valid
  const validIndex = currentIndex >= 0 && currentIndex < reviews.length ? currentIndex : 0;
  const currentReview = reviews[validIndex];
  const nextReviewIndex = reviews.length > 1 ? (validIndex + 1) % reviews.length : validIndex;
  const nextReview = reviews[nextReviewIndex];

  return (
    <section className="bg-white pt-0 pb-4 sm:pb-6 md:pb-8 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-7">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold uppercase tracking-wide" style={{ color: '#E60F77' }} data-aos="fade-up">
            {mainHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6 sm:gap-8 md:gap-12 lg:gap-12">
          {/* Left Side - Stats Card */}
          <div className="rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl h-full flex flex-col" style={{ backgroundColor: '#FDE7F3' }} data-aos="fade-up">
            {/* Rating */}
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-black mb-4 sm:mb-6 text-center" >
              {averageRating}
            </div>

            {/* Client Avatars and Review Count */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              {/* Overlapping Avatars */}
              {clientAvatars.length > 0 && (
                <div className="flex -space-x-2 sm:-space-x-3">
                  {clientAvatars.map((avatar, index) => {
                    const avatarUrl = getImageUrl(avatar);
                    if (!avatarUrl) return null;
                    return (
                      <div
                        key={index}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 relative flex-shrink-0 border-2 border-white rounded-full overflow-hidden bg-gray-200"
                      >
                        <img
                          src={avatarUrl}
                          alt={`Client ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Review Count */}
              <div>
                <p className="text-black font-semibold text-xs sm:text-sm">
                  {clientLabel}
                </p>
                <p className="text-black text-[10px] sm:text-xs">
                  ({reviewCount} Reviews)
                </p>
              </div>
            </div>

            {/* Heading */}
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg font-bold text-black mb-4 sm:mb-6 text-center">
              {heading}
            </h3>
          </div>

          {/* Right Side - Testimonials */}
          <div className="h-full flex flex-col lg:mr-6 xl:mr-8" data-aos="fade-up">
            {/* Single Card with Two Testimonials and Center Line */}
            <div className="bg-gradient-to-b from-blue-100 to-purple-100 rounded-2xl px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 shadow-lg w-full relative flex flex-col h-full" data-aos="fade-up">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 relative flex-1">
                {/* Left Testimonial */}
                <div className="flex-1" >
                  {/* Testimonial Text */}
                  <p className="text-black text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mb-4 sm:mb-6 leading-relaxed line-clamp-3 min-h-[3.75rem] sm:min-h-[4.5rem] md:min-h-[4.875rem] lg:min-h-[5rem] xl:min-h-[5.25rem]">
                    "{currentReview.review_quote}"
                  </p>

                  {/* User Profile */}
                  <div className="mb-4">
                    {/* Top Row: Profile Image and Name/Title */}
                    <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3">
                      {/* Circular Profile Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                        {currentReview.avatar ? (
                          <img
                            src={getImageUrl(currentReview.avatar) || ''}
                            alt={currentReview.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-blue-400 text-white font-bold text-lg sm:text-xl md:text-2xl">
                            {currentReview.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </div>
                        )}
                      </div>

                      {/* Name and Designation */}
                      <div className="pt-1 ml-1 sm:ml-2 md:ml-3 mt-1 sm:mt-2 flex-1">
                        <h4 className="text-blue-800 font-bold text-base sm:text-lg md:text-xl mb-0.5">
                          {currentReview.name}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {currentReview.designation}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Rating and Stars */}
                    <div className="flex items-center gap-2">
                      <span className="text-black font-bold text-lg sm:text-xl md:text-2xl">
                        {currentReview.rating.toFixed(1)}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                              star <= Math.floor(currentReview.rating)
                                ? "text-purple-600 fill-current"
                                : "text-gray-300 fill-current"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Vertical Line with Top and Bottom Dots - Hidden on mobile */}
                <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-between py-4">
                  {/* Top Dot */}
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  {/* Vertical Line */}
                  <div className="w-0.5 h-full bg-gray-300"></div>
                  {/* Bottom Dot */}
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>

                {/* Horizontal Divider - Visible on mobile only */}
                <div className="lg:hidden w-full h-0.5 bg-gray-300 my-2 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="absolute right-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>

                {/* Right Testimonial */}
                <div className="flex-1">
                  {/* Testimonial Text */}
                  <p className="text-black text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mb-4 sm:mb-6 leading-relaxed line-clamp-3 min-h-[3.75rem] sm:min-h-[4.5rem] md:min-h-[4.875rem] lg:min-h-[5rem] xl:min-h-[5.25rem]">
                    "{nextReview.review_quote}"
                  </p>

                  {/* User Profile */}
                  <div className="mb-4">
                    <div className="flex items-start gap-2 sm:gap-4 flex-col sm:flex-row">
                      {/* Name and Designation */}
                      <div className="flex-1 pt-1 mt-1 sm:mt-2">
                        <h4 className="text-blue-800 font-bold text-base sm:text-lg md:text-xl mb-0.5">
                          {nextReview.name}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {nextReview.designation}
                        </p>
                      </div>

                      {/* Profile Image and Rating Container */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                        {/* Circular Profile Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative flex-shrink-0 rounded-full overflow-hidden sm:mb-2 sm:ml-auto bg-gray-200">
                          {nextReview.avatar ? (
                            <img
                              src={getImageUrl(nextReview.avatar) || ''}
                              alt={nextReview.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-blue-400 text-white font-bold text-lg sm:text-xl md:text-2xl">
                              {nextReview.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                            </div>
                          )}
                        </div>

                        {/* Rating and Stars */}
                        <div className="flex items-center gap-2">
                          <span className="text-black font-bold text-lg sm:text-xl md:text-2xl">
                            {nextReview.rating.toFixed(1)}
                          </span>
                          <div className="flex gap-0.5 mr-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                                  star <= Math.floor(nextReview.rating)
                                    ? "text-purple-600 fill-current"
                                    : "text-gray-300 fill-current"
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <div className="flex gap-2 items-center justify-center mt-4 sm:mt-6">
              <button
                onClick={prevTestimonial}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
                aria-label="Previous testimonial"
              >
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 12H6M6 12L11 17M6 12L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
                aria-label="Next testimonial"
              >
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
