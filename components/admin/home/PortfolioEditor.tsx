"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface PortfolioItem {
  id: number;
  title: string;
  imageUrl: string | null;
  image: File | null;
  link: string;
  order: number;
}

interface PortfolioEditorRef {
  save: () => Promise<void>;
}

const PortfolioEditor = forwardRef<PortfolioEditorRef>((props, ref) => {
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    mainHeading: "PORTFOLIO",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, deserunt sed eligendi velit laboriosam suscipit, quisquam eveniet illo soluta adipisci necessitatibus officia id blanditiis voluptates eos. Ab alias inventore molestiae.",
  });

  const [backgroundImage, setBackgroundImage] = useState<{ image: File | null; imageUrl: string | null }>({
    image: null,
    imageUrl: null,
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingItem, setDeletingItem] = useState<number | null>(null);
  const [deletingImage, setDeletingImage] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchSectionData();
    fetchPortfolioItems();
  }, []);

  const fetchSectionData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/v1/portfolio-section", {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSectionId(null);
          setFormData({
            mainHeading: "PORTFOLIO",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, deserunt sed eligendi velit laboriosam suscipit, quisquam eveniet illo soluta adipisci necessitatibus officia id blanditiis voluptates eos. Ab alias inventore molestiae.",
          });
          setBackgroundImage({ image: null, imageUrl: null });
          setLoading(false);
          return;
        }
        const errorText = await response.text();
        let errorMessage = "Failed to fetch portfolio section data";
        try {
          const errorData = errorText ? JSON.parse(errorText) : {};
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success && data.data?.portfolio_section) {
        const section = data.data.portfolio_section;
        setSectionId(section.id);
        setFormData({
          mainHeading: section.main_heading || "PORTFOLIO",
          description: section.description || "",
        });
        setBackgroundImage({
          image: null,
          imageUrl: section.background_image || null,
        });
      }
    } catch (err: any) {
      console.error("Error fetching portfolio section data:", err);
      setError(err.message || "Failed to load portfolio section data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioItems = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Try GET first to fetch all items
      let response = await fetch("http://localhost:8000/api/v1/portfolio-items", {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // If GET doesn't work (405 Method Not Allowed), the backend might require POST with a list action
      // Or we might need to use a different endpoint like /api/v1/portfolio-items?list=true
      if (!response.ok && (response.status === 405 || response.status === 404)) {
        console.warn("GET method not supported, trying alternative approach...");
        // Try with query parameter
        response = await fetch("http://localhost:8000/api/v1/portfolio-items?list=true", {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
      }
      
      // If still doesn't work, try POST with _method=GET (Laravel style)
      if (!response.ok && (response.status === 405 || response.status === 404)) {
        const formData = new FormData();
        formData.append("_method", "GET");
        response = await fetch("http://localhost:8000/api/v1/portfolio-items", {
          method: "POST",
          headers: {
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        });
      }

      if (!response.ok) {
        if (response.status === 404) {
          setPortfolioItems([]);
          return;
        }
        const errorText = await response.text();
        let errorMessage = "Failed to fetch portfolio items";
        try {
          const errorData = errorText ? JSON.parse(errorText) : {};
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Portfolio items API response:", JSON.stringify(data, null, 2)); // Debug log

      // Handle different response formats
      let itemsData: any[] = [];
      
      // Check if this is a creation response (has "Portfolio item created successfully" message)
      // If so, we should fetch all items separately
      if (data.success && data.message && data.message.includes("created")) {
        console.warn("Received creation response instead of list. This might indicate POST is creating instead of fetching.");
        // Still try to extract the item from the creation response
        if (data.data?.portfolio_item) {
          itemsData = [data.data.portfolio_item];
        }
      } else if (Array.isArray(data)) {
        // Direct array response
        itemsData = data;
      } else if (data.success && data.data) {
        if (Array.isArray(data.data)) {
          // Array of items
          itemsData = data.data;
        } else if (data.data.portfolio_items && Array.isArray(data.data.portfolio_items)) {
          // Nested portfolio_items array
          itemsData = data.data.portfolio_items;
        } else if (data.data.portfolio_item) {
          // Single item - wrap in array (but this shouldn't happen when fetching all)
          console.warn("Received single item when expecting list. API might not support listing all items.");
          itemsData = [data.data.portfolio_item];
        }
      } else if (data.data && Array.isArray(data.data)) {
        itemsData = data.data;
      } else if (Array.isArray(data.portfolio_items)) {
        itemsData = data.portfolio_items;
      }

      console.log("Extracted items data:", JSON.stringify(itemsData, null, 2)); // Debug log

      const sortedItems = itemsData
        .map((item: any) => ({
          id: item.id,
          title: item.title || "",
          link: item.link || "",
          imageUrl: item.image || null,
          image: null,
          order: parseInt(item.order) || 0,
        }))
        .sort((a: PortfolioItem, b: PortfolioItem) => a.order - b.order);
      
      console.log("Sorted portfolio items:", JSON.stringify(sortedItems, null, 2)); // Debug log
      console.log("Setting portfolio items count:", sortedItems.length); // Debug log
      setPortfolioItems(sortedItems);
    } catch (err: any) {
      console.error("Error fetching portfolio items:", err);
      // Only set error if it's not a network error or if we want to show it
      if (err.message && !err.message.includes("fetch")) {
        setError(err.message || "Failed to load portfolio items");
      } else {
        // For network errors, set empty array and don't show error (might be offline)
        setPortfolioItems([]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage({ image: e.target.files[0], imageUrl: null });
    }
  };

  const handleRemoveBackgroundImage = async () => {
    if (!sectionId) {
      setBackgroundImage({ image: null, imageUrl: null });
      return;
    }

    if (!confirm("Are you sure you want to delete the background image?")) {
      return;
    }

    try {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const url = `http://localhost:8000/api/v1/portfolio-section/${sectionId}/field/background_image`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete background image");
      }

      setBackgroundImage({ image: null, imageUrl: null });
      setSuccess("Background image deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting background image:", err);
      setError(err.message || "Failed to delete background image");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handlePortfolioImageChange = (itemId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPortfolioItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, image: e.target.files![0], imageUrl: null } : item
        )
      );
    }
  };

  const handlePortfolioChange = (itemId: number, field: keyof PortfolioItem, value: string | number) => {
    setPortfolioItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddPortfolioItem = () => {
    const maxOrder = portfolioItems.length > 0 ? Math.max(...portfolioItems.map((item) => item.order || 0)) : 0;
    const newItem: PortfolioItem = {
      id: -(Date.now()), // Temporary negative ID for new items
      title: "New Portfolio Item",
      imageUrl: null,
      image: null,
      link: "",
      order: maxOrder + 1,
    };
    setPortfolioItems((prev) => [...prev, newItem]);
  };

  const handleDeletePortfolioItem = async (itemId: number) => {
    if (!itemId || itemId < 0) {
      // Just remove from state if it's a new item
      setPortfolioItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }

    if (!confirm("Are you sure you want to delete this portfolio item?")) {
      return;
    }

    try {
      setDeletingItem(itemId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingItem(null);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/portfolio-items/${itemId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete portfolio item");
      }

      setPortfolioItems((prev) => prev.filter((item) => item.id !== itemId));
      setSuccess("Portfolio item deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting portfolio item:", err);
      setError(err.message || "Failed to delete portfolio item");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingItem(null);
    }
  };

  const handleRemovePortfolioImage = async (itemId: number) => {
    const itemToUpdate = portfolioItems.find(item => item.id === itemId);
    if (!itemToUpdate || !itemToUpdate.id || itemToUpdate.id < 0) {
      // If it's a new item or no ID, just clear from state
      setPortfolioItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, image: null, imageUrl: null } : item
        )
      );
      return;
    }

    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setDeletingImage(itemId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingImage(null);
        return;
      }

      // For portfolio items, we can delete by setting image to null in update
      const itemFormData = new FormData();
      itemFormData.append("image", "delete");

      const response = await fetch(`http://localhost:8000/api/v1/portfolio-items/${itemId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: itemFormData,
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete image");
      }

      setPortfolioItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, image: null, imageUrl: null } : item
        )
      );
      setSuccess("Image deleted successfully!");
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
        setError("You must be logged in to save data");
        setSaving(false);
        return;
      }

      // Save main portfolio section data
      const sectionFormData = new FormData();
      sectionFormData.append("main_heading", formData.mainHeading || "");
      sectionFormData.append("description", formData.description || "");

      if (backgroundImage.image) {
        sectionFormData.append("background_image", backgroundImage.image);
      } else if (backgroundImage.imageUrl === null && sectionId) {
        // Explicitly delete if it was removed from UI and section exists
        sectionFormData.append("background_image", "delete");
      }

      const isSectionUpdate = !!sectionId;
      const sectionUrl = isSectionUpdate
        ? `http://localhost:8000/api/v1/portfolio-section/${sectionId}`
        : "http://localhost:8000/api/v1/portfolio-section";

      if (isSectionUpdate) {
        sectionFormData.append("_method", "POST"); // Laravel expects POST for PUT/PATCH with FormData
      }

      const sectionResponse = await fetch(sectionUrl, {
        method: "POST", // Always POST for FormData, use _method for PUT/PATCH
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: sectionFormData,
      });

      let sectionResponseData;
      const sectionText = await sectionResponse.text();
      sectionResponseData = sectionText ? JSON.parse(sectionText) : {};

      if (!sectionResponse.ok) {
        let errorMessage = "Failed to save portfolio section";
        if (sectionResponseData.errors) {
          const errorMessages = Object.values(sectionResponseData.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (sectionResponseData.message) {
          errorMessage = sectionResponseData.message;
        }
        throw new Error(errorMessage);
      }

      // Update section ID if it was created
      if (!sectionId && sectionResponseData.data?.portfolio_section?.id) {
        setSectionId(sectionResponseData.data.portfolio_section.id);
      }

      // Update background image URL from response
      const section = sectionResponseData.data?.portfolio_section || sectionResponseData.portfolio_section;
      if (section) {
        setBackgroundImage((prev) => ({
          image: null,
          imageUrl: section.background_image || prev.imageUrl,
        }));
      }

      // Save/update portfolio items
      for (const item of portfolioItems) {
        await savePortfolioItem(item, token);
      }

      // Refresh section data only
      // Don't refresh portfolio items here as it creates new items when using POST
      // Instead, the items are already updated in state from savePortfolioItem
      await fetchSectionData();
      
      // Only fetch items if we haven't saved any items yet (initial load scenario)
      // Otherwise items are already in state from the save operations

      setSuccess("Portfolio section saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error saving data:", err);
      setError(err.message || "Failed to save data");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const savePortfolioItem = async (item: PortfolioItem, token: string) => {
    const itemFormData = new FormData();
    itemFormData.append("title", item.title || "");
    itemFormData.append("link", item.link || "");
    itemFormData.append("order", item.order.toString());

    if (item.image) {
      itemFormData.append("image", item.image);
    } else if (item.imageUrl === null && item.id > 0) {
      // Explicitly delete if it was removed from UI and item exists
      itemFormData.append("image", "delete");
    }

    const isUpdate = !!item.id && item.id > 0;
    const url = isUpdate
      ? `http://localhost:8000/api/v1/portfolio-items/${item.id}`
      : "http://localhost:8000/api/v1/portfolio-items";

    if (isUpdate) {
      itemFormData.append("_method", "POST"); // Laravel expects POST for PUT/PATCH with FormData
    }

    const response = await fetch(url, {
      method: "POST", // Always POST for FormData, use _method for PUT/PATCH
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: itemFormData,
    });

    if (!response.ok) {
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {};
      throw new Error(responseData.message || "Failed to save portfolio item");
    }

    const responseData = await response.json();
    const savedItem = responseData.data?.portfolio_item || responseData.portfolio_item;

    // If we uploaded an image but backend returns null, keep the local file
    // This might indicate a backend processing issue
    if (item.image && !savedItem.image) {
      console.warn(`Image upload for portfolio item "${item.title}" may have failed. Backend returned null for image field.`);
    }

    // Update item with new ID if it was created, and update image URL
    if (!item.id || item.id < 0) {
      setPortfolioItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                id: savedItem.id,
                // Only update imageUrl if backend returned a valid image URL
                // Otherwise, keep the local image for preview (will be re-uploaded on next save)
                imageUrl: savedItem.image || (item.image ? i.imageUrl : null),
                image: savedItem.image ? null : item.image, // Keep local image if backend didn't save it
              }
            : i
        )
      );
    } else if (savedItem) {
      // Update existing item with new image URL
      setPortfolioItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                // Only update imageUrl if backend returned a valid image URL
                // Otherwise, keep the local image for preview (will be re-uploaded on next save)
                imageUrl: savedItem.image || (item.image ? i.imageUrl : null),
                image: savedItem.image ? null : item.image, // Keep local image if backend didn't save it
              }
            : i
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
        <div className="text-gray-600">Loading portfolio data...</div>
      </div>
    );
  }

  console.log("PortfolioEditor render - portfolioItems:", portfolioItems, "Count:", portfolioItems.length);

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

      {/* Portfolio Section Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Section</h3>
      
      {/* Main Form Section */}
      <div className="space-y-6 pb-6 border-b border-gray-200">
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
            placeholder="PORTFOLIO"
          />
        </div>

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
            placeholder="Enter description text..."
          />
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Background Image
          </label>
          <div className="space-y-3">
            {(backgroundImage.image || backgroundImage.imageUrl) && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                {backgroundImage.image ? (
                  <Image
                    src={URL.createObjectURL(backgroundImage.image)}
                    alt="Background preview"
                    fill
                    className="object-cover"
                  />
                ) : backgroundImage.imageUrl ? (
                  <img
                    src={
                      backgroundImage.imageUrl.startsWith("http") ||
                      backgroundImage.imageUrl.startsWith("/storage")
                        ? `http://localhost:8000${backgroundImage.imageUrl}`
                        : backgroundImage.imageUrl
                    }
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <button
                  onClick={handleRemoveBackgroundImage}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                  title="Remove background image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a background image for the portfolio section
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Portfolio Items Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Portfolio Items {portfolioItems.length > 0 && `(${portfolioItems.length})`}
          </h3>
          <button
            onClick={handleAddPortfolioItem}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            + Add Portfolio Item
          </button>
        </div>

        {portfolioItems.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No portfolio items found. Click "Add Portfolio Item" to create one.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioItems.map((item) => {
            console.log("Rendering portfolio item:", item); // Debug log
            return (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                {item.image ? (
                  <Image
                    src={URL.createObjectURL(item.image)}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : item.imageUrl ? (
                  <img
                    src={
                      item.imageUrl.startsWith("http") ||
                      item.imageUrl.startsWith("/storage")
                        ? item.imageUrl.startsWith("http")
                          ? item.imageUrl
                          : `http://localhost:8000${item.imageUrl}`
                        : item.imageUrl
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {(item.image || item.imageUrl) && (
                  <button
                    onClick={() => handleRemovePortfolioImage(item.id)}
                    disabled={deletingImage === item.id}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove image"
                  >
                    {deletingImage === item.id ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-bold text-pink-600">
                    PORTFOLIO #{item.order}
                  </h4>
                  <button
                    onClick={() => handleDeletePortfolioItem(item.id)}
                    disabled={deletingItem === item.id}
                    className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingItem === item.id ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    </button>
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handlePortfolioChange(item.id, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    placeholder="Portfolio item title"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={item.link}
                    onChange={(e) =>
                      handlePortfolioChange(item.id, "link", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link to project or external page
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePortfolioImageChange(item.id, e)}
                    className="w-full text-xs text-gray-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>
              </div>
            </div>
          );
          })}

          {/* Add New Portfolio Item */}
          <div
            onClick={handleAddPortfolioItem}
            className="border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm flex items-center justify-center min-h-[400px] cursor-pointer hover:border-pink-500 transition-colors"
          >
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PortfolioEditor.displayName = "PortfolioEditor";

export default PortfolioEditor;
