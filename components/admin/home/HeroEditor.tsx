"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface HeroEditorRef {
  save: () => Promise<void>;
}

const HeroEditor = forwardRef<HeroEditorRef>((props, ref) => {
  const [formData, setFormData] = useState({
    title: "",
    buttonText: "",
    buttonUrl: "",
    description: "",
    backgroundImage: null as File | null,
    secondaryImage: null as File | null,
    backgroundImageUrl: null as string | null,
    secondaryImageUrl: null as string | null,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null); // Track which image is being deleted
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [homePageId, setHomePageId] = useState<number | null>(null);

  // Fetch home page data on mount
  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/v1/home-page", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("Hero Editor - Response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log("Hero Editor - No data found (404), using default values");
          // Use same default values as website component
          setFormData({
            title: "A Complete\nSoftware Based\nWebsite",
            buttonText: "Discover More",
            buttonUrl: "/discover",
            description: "Integrating and automating workflows simplifies operations, reduces manual effort, and boosts efficiency. Seamless integration connects various.",
            backgroundImage: null,
            secondaryImage: null,
            backgroundImageUrl: null,
            secondaryImageUrl: null,
          });
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch home page data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Hero Editor - API Response:", data);
      
      // Handle different response structures
      let homePage = null;
      if (data.success && data.data?.home_page) {
        homePage = data.data.home_page;
      } else if (data.data && !data.data.home_page) {
        // Try direct data structure
        homePage = data.data;
      } else if (data.home_page) {
        homePage = data.home_page;
      }
      
      if (homePage) {
        console.log("Hero Editor - Home page data found:", homePage);
        setHomePageId(homePage.id);
        setFormData({
          title: homePage.title || "",
          buttonText: homePage.button_text || "",
          buttonUrl: homePage.button_url || "",
          description: homePage.description || "",
          backgroundImage: null,
          secondaryImage: null,
          backgroundImageUrl: homePage.background_image || null,
          secondaryImageUrl: homePage.secondary_image || null,
        });
      } else {
        console.log("Hero Editor - No home page data in response, using default values");
        // Use same default values as website component
        setFormData({
          title: "A Complete\nSoftware Based\nWebsite",
          buttonText: "Discover More",
          buttonUrl: "/discover",
          description: "Integrating and automating workflows simplifies operations, reduces manual effort, and boosts efficiency. Seamless integration connects various.",
          backgroundImage: null,
          secondaryImage: null,
          backgroundImageUrl: null,
          secondaryImageUrl: null,
        });
      }
    } catch (err: any) {
      console.error("Error fetching home page data:", err);
      setError(`Failed to load home page data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("button_text", formData.buttonText);
      formDataToSend.append("button_url", formData.buttonUrl);
      formDataToSend.append("description", formData.description);

      // Only append files if they are new (File objects)
      if (formData.backgroundImage) {
        formDataToSend.append("background_image", formData.backgroundImage);
      }
      if (formData.secondaryImage) {
        formDataToSend.append("secondary_image", formData.secondaryImage);
      }

      const response = await fetch("http://localhost:8000/api/v1/home-page", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      let responseData;
      try {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        let errorMessage = "Failed to save home page";
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }

      if (responseData.success && responseData.data?.home_page) {
        const homePage = responseData.data.home_page;
        // Update form data with new URLs and clear file objects
        setFormData((prev) => ({
          ...prev,
          backgroundImage: null,
          secondaryImage: null,
          backgroundImageUrl: homePage.background_image || prev.backgroundImageUrl,
          secondaryImageUrl: homePage.secondary_image || prev.secondaryImageUrl,
        }));
        setSuccess("Home page saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      console.error("Error saving home page:", err);
      setError(err.message || "Failed to save home page");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Expose save method to parent component
  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: "background" | "secondary") => {
    if (e.target.files && e.target.files[0]) {
      if (imageType === "background") {
        setFormData((prev) => ({ ...prev, backgroundImage: e.target.files![0], backgroundImageUrl: null }));
      } else {
        setFormData((prev) => ({ ...prev, secondaryImage: e.target.files![0], secondaryImageUrl: null }));
      }
    }
  };

  const handleDeleteImage = async (imageType: "background" | "secondary") => {
    if (!homePageId) {
      setError("Home page ID not found");
      return;
    }

    if (!confirm(`Are you sure you want to delete the ${imageType} image?`)) {
      return;
    }

    try {
      setDeleting(imageType);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      // Try using FormData in the body for DELETE request
      const imageTypeParam = imageType === "background" ? "background_image" : "secondary_image";
      const formData = new FormData();
      formData.append("image_type", imageTypeParam);

      const response = await fetch(`http://localhost:8000/api/v1/home-page/${homePageId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      let responseData;
      try {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Parse error:", parseError);
        // If parsing fails, check if response is empty (204 No Content)
        if (response.status === 204 || response.ok) {
          responseData = { success: true };
        } else {
          throw new Error("Invalid response from server");
        }
      }

      if (!response.ok) {
        let errorMessage = `Failed to delete ${imageType} image`;
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }
        throw new Error(errorMessage);
      }

      // Update form data to remove the deleted image
      if (imageType === "background") {
        setFormData((prev) => ({
          ...prev,
          backgroundImage: null,
          backgroundImageUrl: null,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          secondaryImage: null,
          secondaryImageUrl: null,
        }));
      }

      // Refresh data from API to get updated state
      await fetchHomePageData();

      setSuccess(`${imageType === "background" ? "Background" : "Secondary"} image deleted successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error(`Error deleting ${imageType} image:`, err);
      setError(err.message || `Failed to delete ${imageType} image. Please check if the endpoint is correct.`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading home page data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Three fields in one row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        {/* Button Text */}
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
          />
        </div>

        {/* Button URL */}
        <div>
          <label htmlFor="buttonUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Button URL
          </label>
          <input
            type="url"
            id="buttonUrl"
            name="buttonUrl"
            value={formData.buttonUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>
      </div>

      {/* Description and Background Image in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
          />
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "background")}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {formData.backgroundImage 
                  ? formData.backgroundImage.name 
                  : formData.backgroundImageUrl 
                    ? "Existing image" 
                    : "No file chosen"}
              </span>
            </div>
            {(formData.backgroundImage || formData.backgroundImageUrl) ? (
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
                {formData.backgroundImage ? (
                  <Image
                    src={URL.createObjectURL(formData.backgroundImage)}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src={`http://localhost:8000${formData.backgroundImageUrl}`}
                    alt="Background"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load background image:", formData.backgroundImageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <button
                  onClick={() => handleDeleteImage("background")}
                  disabled={deleting === "background"}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete image"
                >
                  {deleting === "background" ? (
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
            ) : (
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Image
        </label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label className="inline-block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "secondary")}
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                Choose File
              </span>
            </label>
            <span className="text-sm text-gray-600">
              {formData.secondaryImage 
                ? formData.secondaryImage.name 
                : formData.secondaryImageUrl 
                  ? "Existing image" 
                  : "No file chosen"}
            </span>
          </div>
          {(formData.secondaryImage || formData.secondaryImageUrl) ? (
            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
              {formData.secondaryImage ? (
                <Image
                  src={URL.createObjectURL(formData.secondaryImage)}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <img
                  src={`http://localhost:8000${formData.secondaryImageUrl}`}
                  alt="Secondary"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load secondary image:", formData.secondaryImageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <button
                onClick={() => handleDeleteImage("secondary")}
                disabled={deleting === "secondary"}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete image"
              >
                {deleting === "secondary" ? (
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
          ) : (
            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {saving && (
        <div className="text-sm text-gray-600 text-center py-2">
          Saving...
        </div>
      )}
    </div>
  );
});

HeroEditor.displayName = "HeroEditor";

export default HeroEditor;
