"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

interface QuoteEditorRef {
  save: () => Promise<void>;
}

const QuoteEditor = forwardRef<QuoteEditorRef>((props, ref) => {
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    request_quote_title: "Start Your Project",
    request_quote_subtitle: "Get the Signs You Need, at the Right Price",
    description: "We're here to help. Take the first step by sharing a few details about your project, and We'll provide a tailored estimate that's accurate, fair, and aligned with your budget.",
    button_text: "Quote Request",
    title_1: "Start Now, Pay Later",
    paragraph_1: "Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain.",
    title_2: "Start Now, Pay Later",
    paragraph_2: "Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain.",
  });

  const [images, setImages] = useState<{
    image_1: { file: File | null; url: string | null };
    image_2: { file: File | null; url: string | null };
  }>({
    image_1: { file: null, url: null },
    image_2: { file: null, url: null },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchSectionData();
  }, []);

  const fetchSectionData = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/quote-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSectionId(null);
          setFormData({
            request_quote_title: "Start Your Project",
            request_quote_subtitle: "Get the Signs You Need, at the Right Price",
            description: "We're here to help. Take the first step by sharing a few details about your project, and We'll provide a tailored estimate that's accurate, fair, and aligned with your budget.",
            button_text: "Quote Request",
            title_1: "Start Now, Pay Later",
            paragraph_1: "Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain.",
            title_2: "Start Now, Pay Later",
            paragraph_2: "Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain.",
          });
          setImages({
            image_1: { file: null, url: null },
            image_2: { file: null, url: null },
          });
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch section data");
      }

      const data = await response.json();

      if (data.success && data.data?.quote_section) {
        const section = data.data.quote_section;
        setSectionId(section.id);
        setFormData({
          request_quote_title: section.request_quote_title || "",
          request_quote_subtitle: section.request_quote_subtitle || "",
          description: section.description || "",
          button_text: section.button_text || "",
          title_1: section.title_1 || "",
          paragraph_1: section.paragraph_1 || "",
          title_2: section.title_2 || "",
          paragraph_2: section.paragraph_2 || "",
        });

        // Set image URLs
        const getImageUrl = (imagePath: string | null) => {
          if (!imagePath) return null;
          if (imagePath.startsWith("http")) return imagePath;
          if (imagePath.startsWith("/storage") || imagePath.startsWith("/")) {
            return `http://localhost:8000${imagePath}`;
          }
          return imagePath;
        };

        setImages({
          image_1: { file: null, url: getImageUrl(section.image_1) },
          image_2: { file: null, url: getImageUrl(section.image_2) },
        });
      }
    } catch (err: any) {
      console.error("Error fetching section data:", err);
      setError(err.message || "Failed to fetch section data");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image_1' | 'image_2') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImages((prev) => ({
        ...prev,
        [imageKey]: { file, url: URL.createObjectURL(file) },
      }));
    }
  };

  const handleRemoveImage = async (imageKey: 'image_1' | 'image_2') => {
    // If it's a new file (not saved yet), just remove from state
    if (images[imageKey].file && !images[imageKey].url?.startsWith('http://localhost:8000')) {
      // Revoke the blob URL if it exists
      if (images[imageKey].url && images[imageKey].url.startsWith('blob:')) {
        URL.revokeObjectURL(images[imageKey].url);
      }
      setImages((prev) => ({
        ...prev,
        [imageKey]: { file: null, url: null },
      }));
      return;
    }

    // If it's an existing image from API, delete via API
    if (!sectionId || !images[imageKey].url) {
      return;
    }

    if (!confirm(`Are you sure you want to delete ${imageKey}?`)) {
      return;
    }

    try {
      setDeletingImage(imageKey);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingImage(null);
        return;
      }

      const url = `http://localhost:8000/api/v1/quote-section/${sectionId}/field/${imageKey}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete image");
      }

      setImages((prev) => ({
        ...prev,
        [imageKey]: { file: null, url: null },
      }));

      setSuccess(`${imageKey} deleted successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting image:", err);
      setError(err.message || "Failed to delete image");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingImage(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const formDataToSend = new FormData();

      // Add all text fields (always send all fields for updates)
      Object.entries(formData).forEach(([key, value]) => {
        // Always append, even if empty string, to ensure API receives all fields
        const fieldValue = value !== null && value !== undefined ? value.toString() : "";
        formDataToSend.append(key, fieldValue);
        console.log(`Adding field ${key}:`, fieldValue);
      });

      // Add image files if they exist (new uploads)
      if (images.image_1.file) {
        formDataToSend.append("image_1", images.image_1.file);
        console.log("Adding image_1 file");
      }
      if (images.image_2.file) {
        formDataToSend.append("image_2", images.image_2.file);
        console.log("Adding image_2 file");
      }
      
      // Log FormData contents for debugging
      console.log("FormData entries:", Array.from(formDataToSend.entries()));

      const url = sectionId
        ? `http://localhost:8000/api/v1/quote-section/${sectionId}`
        : "http://localhost:8000/api/v1/quote-section";

      let response: Response;
      
      if (sectionId) {
        // For updates with file uploads, use POST with _method=PUT (Laravel style)
        formDataToSend.append("_method", "PUT");
        response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Use POST for creation
        response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      if (!response.ok) {
        const text = await response.text();
        console.error("Save error response:", text, "Status:", response.status);
        let errorMessage = "Failed to save quote section";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || errorMessage;
          // Log validation errors if present
          if (errorData.errors) {
            console.error("Validation errors:", errorData.errors);
          }
        } catch {
          if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Save response:", data);

      if (data.success && data.data?.quote_section) {
        const section = data.data.quote_section;
        
        // Update sectionId if it exists
        if (section.id) {
          setSectionId(section.id);
        }

        // Update formData with response data
        setFormData({
          request_quote_title: section.request_quote_title || "",
          request_quote_subtitle: section.request_quote_subtitle || "",
          description: section.description || "",
          button_text: section.button_text || "",
          title_1: section.title_1 || "",
          paragraph_1: section.paragraph_1 || "",
          title_2: section.title_2 || "",
          paragraph_2: section.paragraph_2 || "",
        });

        // Update image URLs
        const getImageUrl = (imagePath: string | null) => {
          if (!imagePath) return null;
          if (imagePath.startsWith("http")) return imagePath;
          if (imagePath.startsWith("/storage") || imagePath.startsWith("/")) {
            // Add cache busting parameter to force image refresh
            const separator = imagePath.includes('?') ? '&' : '?';
            return `http://localhost:8000${imagePath}${separator}t=${Date.now()}`;
          }
          return imagePath;
        };

        // Revoke old blob URLs if they exist
        if (images.image_1.url && images.image_1.url.startsWith('blob:')) {
          URL.revokeObjectURL(images.image_1.url);
        }
        if (images.image_2.url && images.image_2.url.startsWith('blob:')) {
          URL.revokeObjectURL(images.image_2.url);
        }

        setImages({
          image_1: { file: null, url: getImageUrl(section.image_1) },
          image_2: { file: null, url: getImageUrl(section.image_2) },
        });

        setSuccess(data.message || "Quote section saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(data.message || "Failed to save quote section");
      }
    } catch (err: any) {
      console.error("Error saving quote section:", err);
      setError(err.message || "Failed to save quote section");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Expose save method to parent
  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading quote section data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Request Quote Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Request Quote Title
        </label>
        <input
          type="text"
          name="request_quote_title"
          value={formData.request_quote_title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
        />
      </div>

      {/* Request Quote Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Request Quote Subtitle
        </label>
        <input
          type="text"
          name="request_quote_subtitle"
          value={formData.request_quote_subtitle}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
        />
      </div>

      {/* Button Text and Title 1 in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text
          </label>
          <input
            type="text"
            name="button_text"
            value={formData.button_text}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title 1
          </label>
          <input
            type="text"
            name="title_1"
            value={formData.title_1}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>
      </div>

      {/* Paragraph 1 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paragraph 1
        </label>
        <textarea
          name="paragraph_1"
          value={formData.paragraph_1}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
        />
      </div>

      {/* Title 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title 2
        </label>
        <input
          type="text"
          name="title_2"
          value={formData.title_2}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
        />
      </div>

      {/* Paragraph 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paragraph 2
        </label>
        <textarea
          name="paragraph_2"
          value={formData.paragraph_2}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
        />
      </div>

      {/* Image 1 and Image 2 in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image 1
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image_1')}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {images.image_1.file ? images.image_1.file.name : images.image_1.url ? "Image uploaded" : "No file chosen"}
              </span>
            </div>
            {(images.image_1.url || images.image_1.file) && (
              <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                <img
                  key={images.image_1.url || images.image_1.file?.name}
                  src={images.image_1.url || (images.image_1.file ? URL.createObjectURL(images.image_1.file) : '')}
                  alt="Image 1 Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image 1 failed to load:", images.image_1.url);
                  }}
                />
                <button
                  onClick={() => handleRemoveImage('image_1')}
                  disabled={deletingImage === 'image_1'}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors disabled:opacity-50"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image 2
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image_2')}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {images.image_2.file ? images.image_2.file.name : images.image_2.url ? "Image uploaded" : "No file chosen"}
              </span>
            </div>
            {(images.image_2.url || images.image_2.file) && (
              <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                <img
                  key={images.image_2.url || images.image_2.file?.name}
                  src={images.image_2.url || (images.image_2.file ? URL.createObjectURL(images.image_2.file) : '')}
                  alt="Image 2 Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image 2 failed to load:", images.image_2.url);
                  }}
                />
                <button
                  onClick={() => handleRemoveImage('image_2')}
                  disabled={deletingImage === 'image_2'}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors disabled:opacity-50"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

QuoteEditor.displayName = "QuoteEditor";

export default QuoteEditor;
