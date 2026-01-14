"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface Review {
  id: number;
  name: string;
  designation: string;
  rating: number;
  description: string;
  imageUrl: string | null;
  image: File | null;
  order: number;
}

interface ReviewsEditorRef {
  save: () => Promise<void>;
}

const ReviewsEditor = forwardRef<ReviewsEditorRef>((props, ref) => {
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    mainHeading: "WHAT OUR CLIENT SAY",
    averageRating: "4.9",
    clientLabel: "Our Client",
    reviewCount: "5k+",
    heading: "Customer experiences that speak for themselves",
    buttonText: "Book Now",
    buttonUrl: "",
  });

  const [clientAvatars, setClientAvatars] = useState<
    Array<{ image: File | null; imageUrl: string | null }>
  >([
    { image: null, imageUrl: null },
    { image: null, imageUrl: null },
    { image: null, imageUrl: null },
    { image: null, imageUrl: null },
  ]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingAvatar, setDeletingAvatar] = useState<number | null>(null);
  const [deletingReview, setDeletingReview] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchSectionData();
    fetchReviewsData();
  }, []);

  const fetchSectionData = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:8000/api/v1/reviews-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSectionId(null);
          setFormData({
            mainHeading: "WHAT OUR CLIENT SAY",
            averageRating: "4.9",
            clientLabel: "Our Client",
            reviewCount: "5k+",
            heading: "Customer experiences that speak for themselves",
            buttonText: "Book Now",
            buttonUrl: "",
          });
          setClientAvatars([
            { image: null, imageUrl: null },
            { image: null, imageUrl: null },
            { image: null, imageUrl: null },
            { image: null, imageUrl: null },
          ]);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch section data");
      }

      const data = await response.json();

      if (data.success && data.data?.reviews_section) {
        const section = data.data.reviews_section;
        setSectionId(section.id);
        setFormData({
          mainHeading: section.main_heading || "WHAT OUR CLIENT SAY",
          averageRating: section.average_rating || "4.9",
          clientLabel: section.client_label || "Our Client",
          reviewCount: section.review_count || "5k+",
          heading: section.call_to_action_text || "Customer experiences that speak for themselves",
          buttonText: section.button_text || "Book Now",
          buttonUrl: section.button_url || "",
        });
        setClientAvatars([
          { image: null, imageUrl: section.avatar_1 || null },
          { image: null, imageUrl: section.avatar_2 || null },
          { image: null, imageUrl: section.avatar_3 || null },
          { image: null, imageUrl: section.avatar_4 || null },
        ]);
      }
    } catch (err: any) {
      console.error("Error fetching section data:", err);
      setError(err.message || "Failed to load section data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/reviews", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setReviews([]);
          return;
        }
        throw new Error("Failed to fetch reviews data");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const reviewsData = Array.isArray(data.data) ? data.data : (data.data.reviews || []);
        const sortedReviews = reviewsData
          .map((review: any) => ({
            id: review.id,
            name: review.name || "",
            designation: review.designation || "",
            rating: parseFloat(review.rating) || 0,
            description: review.review_quote || review.description || "",
            imageUrl: review.avatar || null,
            image: null,
            order: review.order || 0,
          }))
          .sort((a: Review, b: Review) => a.order - b.order);

        setReviews(sortedReviews);
      }
    } catch (err: any) {
      console.error("Error fetching reviews data:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewChange = (reviewId: number, field: string, value: string | number) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, [field]: value } : review
      )
    );
  };

  const handleReviewImageChange = (reviewId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, image: e.target.files![0], imageUrl: null } : review
        )
      );
    }
  };

  const handleClientAvatarChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setClientAvatars((prev) => {
        const newAvatars = [...prev];
        newAvatars[index] = { image: e.target.files![0], imageUrl: null };
        return newAvatars;
      });
    }
  };

  const handleRemoveClientAvatar = async (index: number) => {
    const avatar = clientAvatars[index];
    if (!avatar.imageUrl && !avatar.image) {
      return;
    }

    // If it's a new image, just remove from state
    if (avatar.image && !avatar.imageUrl) {
      setClientAvatars((prev) => {
        const newAvatars = [...prev];
        newAvatars[index] = { image: null, imageUrl: null };
        return newAvatars;
      });
      return;
    }

    // If it's an existing image from API, delete via API
    if (!sectionId || !avatar.imageUrl) {
      return;
    }

    if (!confirm(`Are you sure you want to delete avatar ${index + 1}?`)) {
      return;
    }

    try {
      setDeletingAvatar(index);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingAvatar(null);
        return;
      }

      const avatarField = `avatar_${index + 1}`;
      const url = `http://localhost:8000/api/v1/reviews-section/${sectionId}/field/${avatarField}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete avatar");
      }

      setClientAvatars((prev) => {
        const newAvatars = [...prev];
        newAvatars[index] = { image: null, imageUrl: null };
        return newAvatars;
      });
      await fetchSectionData();

      setSuccess(`Avatar ${index + 1} deleted successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting avatar:", err);
      setError(err.message || "Failed to delete avatar");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingAvatar(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAddReview = () => {
    const maxOrder = reviews.length > 0 ? Math.max(...reviews.map((r) => r.order || 0)) : 0;
    const newReview: Review = {
      id: -Date.now(), // Negative ID for new reviews
      name: "New Client",
      designation: "Designation",
      rating: 5,
      description: "",
      imageUrl: null,
      image: null,
      order: maxOrder + 1,
    };
    setReviews((prev) => [...prev, newReview]);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!reviewId || reviewId < 0) {
      // Just remove from state if it's a new review
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      return;
    }

    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setDeletingReview(reviewId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingReview(null);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete review");
      }

      // Remove from state
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));

      setSuccess("Review deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting review:", err);
      setError(err.message || "Failed to delete review");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingReview(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to save data");
        setSaving(false);
        return;
      }

      // Save section
      const sectionFormData = new FormData();
      sectionFormData.append("main_heading", formData.mainHeading || "");
      sectionFormData.append("average_rating", formData.averageRating || "");
      sectionFormData.append("call_to_action_text", formData.heading || "");
      sectionFormData.append("client_label", formData.clientLabel || "");
      sectionFormData.append("review_count", formData.reviewCount || "");
      sectionFormData.append("button_text", formData.buttonText || "");
      sectionFormData.append("button_url", formData.buttonUrl || "");

      // Append avatars
      clientAvatars.forEach((avatar, index) => {
        if (avatar.image) {
          sectionFormData.append(`avatar_${index + 1}`, avatar.image);
        }
      });

      const isSectionUpdate = !!sectionId;
      const sectionUrl = isSectionUpdate
        ? `http://localhost:8000/api/v1/reviews-section/${sectionId}`
        : "http://localhost:8000/api/v1/reviews-section";

      if (isSectionUpdate) {
        sectionFormData.append("_method", "PUT");
      }

      const sectionResponse = await fetch(sectionUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: sectionFormData,
      });

      let sectionResponseData;
      const sectionText = await sectionResponse.text();
      sectionResponseData = sectionText ? JSON.parse(sectionText) : {};

      if (!sectionResponse.ok) {
        let errorMessage = "Failed to save section";
        if (sectionResponseData.errors) {
          const errorMessages = Object.values(sectionResponseData.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (sectionResponseData.message) {
          errorMessage = sectionResponseData.message;
        }
        throw new Error(errorMessage);
      }

      // Update section ID if it was created
      if (!sectionId && sectionResponseData.data?.reviews_section?.id) {
        setSectionId(sectionResponseData.data.reviews_section.id);
      }

      // Update avatar URLs from response
      const section = sectionResponseData.data?.reviews_section || sectionResponseData.reviews_section;
      if (section) {
        setClientAvatars((prev) => [
          { image: null, imageUrl: section.avatar_1 || prev[0].imageUrl },
          { image: null, imageUrl: section.avatar_2 || prev[1].imageUrl },
          { image: null, imageUrl: section.avatar_3 || prev[2].imageUrl },
          { image: null, imageUrl: section.avatar_4 || prev[3].imageUrl },
        ]);
      }

      // Save/update reviews
      for (const review of reviews) {
        await saveReview(review, token);
      }

      // Refresh data
      await fetchSectionData();
      await fetchReviewsData();

      setSuccess("Reviews section saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error saving data:", err);
      setError(err.message || "Failed to save data");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const saveReview = async (review: Review, token: string) => {
    const formData = new FormData();
    formData.append("review_quote", review.description || "");
    formData.append("name", review.name || "");
    formData.append("designation", review.designation || "");
    formData.append("rating", review.rating.toString());
    formData.append("order", review.order.toString());

    if (review.image) {
      formData.append("avatar", review.image);
    }

    const isUpdate = !!review.id && review.id > 0;
    const url = isUpdate
      ? `http://localhost:8000/api/v1/reviews/${review.id}`
      : "http://localhost:8000/api/v1/reviews";

    if (isUpdate) {
      formData.append("_method", "PUT");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {};
      throw new Error(responseData.message || "Failed to save review");
    }

    const responseData = await response.json();
    const savedReview = responseData.data?.review || responseData.review;

    // Update review with new ID if it was created
    if (!review.id || review.id < 0) {
      if (savedReview?.id) {
        setReviews((prev) =>
          prev.map((r) =>
            r === review
              ? {
                  ...r,
                  id: savedReview.id,
                  order: savedReview.order || r.order,
                  imageUrl: savedReview.avatar || r.imageUrl,
                  image: null,
                }
              : r
          )
        );
      }
    } else if (savedReview) {
      // Update existing review with new avatar URL
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? {
                ...r,
                order: savedReview.order || r.order,
                imageUrl: savedReview.avatar || r.imageUrl,
                image: null,
              }
            : r
        )
      );
    }
  };

  // Expose save method to parent component
  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading section data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Reviews Section Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Reviews Section</h3>
      
      {/* Main Form Section */}
      <div className="space-y-6 pb-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="mainHeading" className="block text-sm font-medium text-gray-700 mb-2">
                Main Heading
              </label>
              <input
                type="text"
                id="mainHeading"
                name="mainHeading"
                value={formData.mainHeading}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="WHAT OUR CLIENT SAY"
              />
            </div>

            <div>
              <label htmlFor="averageRating" className="block text-sm font-medium text-gray-700 mb-2">
                Average Rating (Large Number)
              </label>
              <input
                type="text"
                id="averageRating"
                name="averageRating"
                value={formData.averageRating}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="4.9"
              />
              <p className="text-xs text-gray-500 mt-1">This will be displayed as a large number in the left panel</p>
            </div>

            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-2">
                Call to Action Text
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Customer experiences that speak for themselves"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="clientLabel" className="block text-sm font-medium text-gray-700 mb-2">
                Client Label
              </label>
              <input
                type="text"
                id="clientLabel"
                name="clientLabel"
                value={formData.clientLabel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Our Client"
              />
              <p className="text-xs text-gray-500 mt-1">Will appear as: "Our Client (5k+ Reviews)"</p>
            </div>

            <div>
              <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700 mb-2">
                Review Count
              </label>
              <input
                type="text"
                id="reviewCount"
                name="reviewCount"
                value={formData.reviewCount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="5k+"
              />
              <p className="text-xs text-gray-500 mt-1">Example: 5k+, 100+, etc.</p>
            </div>

            <div>
              <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                id="buttonText"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Book Now"
              />
            </div>

            <div>
              <label htmlFor="buttonUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Button URL (Optional)
              </label>
              <input
                type="text"
                id="buttonUrl"
                name="buttonUrl"
                value={formData.buttonUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="https://example.com/book"
              />
            </div>
          </div>
        </div>

        {/* Client Avatars Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Client Avatars (Left Panel)</h4>
          <p className="text-sm text-gray-600 mb-4">
            Upload up to 4 client avatar images to display in the left panel (arranged horizontally with overlap)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clientAvatars.map((avatar, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Avatar {index + 1}
                </label>
                <div className="relative">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex-shrink-0 mx-auto">
                    {avatar.image ? (
                      <Image
                        src={URL.createObjectURL(avatar.image)}
                        alt={`Client Avatar ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : avatar.imageUrl ? (
                      <img
                        src={
                          avatar.imageUrl.startsWith("http") || avatar.imageUrl.startsWith("/storage")
                            ? `http://localhost:8000${avatar.imageUrl}`
                            : avatar.imageUrl
                        }
                        alt={`Client Avatar ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200 text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label className="block mt-2">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleClientAvatarChange(index, e)}
                    />
                    <span className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg cursor-pointer inline-block font-medium transition-colors text-xs w-full text-center">
                      Choose File
                    </span>
                  </label>
                  {(avatar.image || avatar.imageUrl) && (
                    <button
                      onClick={() => handleRemoveClientAvatar(index)}
                      disabled={deletingAvatar === index}
                      className="mt-1 w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg cursor-pointer font-medium transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingAvatar === index ? "Deleting..." : "Remove"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Review Cards Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Review Cards</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-pink-600">
                  REVIEW #{review.id > 0 ? review.id : 'NEW'}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deletingReview === review.id}
                    className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingReview === review.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Review Quote/Description - First (matching image layout) */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Review Quote/Description
                </label>
                <textarea
                  value={review.description}
                  onChange={(e) => handleReviewChange(review.id, "description", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white text-sm"
                  placeholder="Enter the review quote/testimonial..."
                />
              </div>

              {/* Client Info - Below Quote */}
              <div className="flex items-start gap-4">
                {/* Profile Picture */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex-shrink-0">
                  {review.image ? (
                    <Image
                      src={URL.createObjectURL(review.image)}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  ) : review.imageUrl ? (
                    <img
                      src={
                        review.imageUrl.startsWith("http") || review.imageUrl.startsWith("/storage")
                          ? `http://localhost:8000${review.imageUrl}`
                          : review.imageUrl
                      }
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-blue-400 text-white font-bold text-lg">
                      {getInitials(review.name)}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleReviewImageChange(review.id, e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {/* Name and Designation */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={review.name}
                    onChange={(e) => handleReviewChange(review.id, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm font-medium mb-2"
                    placeholder="Client Name"
                  />
                  <label className="block text-xs font-medium text-gray-600 mb-1">Designation/Title</label>
                  <input
                    type="text"
                    value={review.designation}
                    onChange={(e) => handleReviewChange(review.id, "designation", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm mb-2"
                    placeholder="CEO, Manager, etc."
                  />
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
                    {renderStars(Math.floor(review.rating))}
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={review.rating}
                      onChange={(e) => handleReviewChange(review.id, "rating", parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm w-20 text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* Add New Review Card */}
          <button
            onClick={handleAddReview}
            className="border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm flex items-center justify-center min-h-[200px] cursor-pointer hover:border-pink-500 transition-colors"
          >
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
});

ReviewsEditor.displayName = "ReviewsEditor";

export default ReviewsEditor;

