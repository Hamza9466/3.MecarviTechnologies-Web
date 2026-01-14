"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface Tab {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface WhyChooseUsEditorRef {
  save: () => Promise<void>;
}

const WhyChooseUsEditor = forwardRef<WhyChooseUsEditorRef>((props, ref) => {
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [sectionTitle, setSectionTitle] = useState("Why Choose Us");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [image1, setImage1] = useState<File | null>(null);
  const [image1Url, setImage1Url] = useState<string | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image2Url, setImage2Url] = useState<string | null>(null);

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingBackground, setDeletingBackground] = useState(false);
  const [deletingImage1, setDeletingImage1] = useState(false);
  const [deletingImage2, setDeletingImage2] = useState(false);
  const [deletingTab, setDeletingTab] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchSectionData();
    fetchTabsData();
  }, []);

  const fetchSectionData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8000/api/v1/why-choose-us-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSectionId(null);
          setSectionTitle("Why Choose Us");
          setBackgroundImageUrl(null);
          setImage1Url(null);
          setImage2Url(null);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch section data");
      }

      const data = await response.json();
      
      if (data.success && data.data?.why_choose_us_section) {
        const section = data.data.why_choose_us_section;
        setSectionId(section.id);
        setSectionTitle(section.section_title || "Why Choose Us");
        setBackgroundImageUrl(section.background_image || null);
        setImage1Url(section.image_1 || null);
        setImage2Url(section.image_2 || null);
      }
    } catch (err: any) {
      console.error("Error fetching section data:", err);
      setError(err.message || "Failed to load section data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTabsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/why-choose-us-tabs", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setTabs([]);
          return;
        }
        throw new Error("Failed to fetch tabs data");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const tabsData = Array.isArray(data.data) ? data.data : (data.data.tabs || data.data.why_choose_us_tabs || []);
        const sortedTabs = tabsData
          .map((tab: any) => ({
            id: tab.id,
            title: tab.title || "",
            description: tab.description || "",
            order: tab.order || 0,
          }))
          .sort((a: Tab, b: Tab) => a.order - b.order);
        
        setTabs(sortedTabs);
      }
    } catch (err: any) {
      console.error("Error fetching tabs data:", err);
      setError(err.message || "Failed to load tabs data");
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
      sectionFormData.append("section_title", sectionTitle || "");

      if (backgroundImage) {
        sectionFormData.append("background_image", backgroundImage);
      }
      if (image1) {
        sectionFormData.append("image_1", image1);
      }
      if (image2) {
        sectionFormData.append("image_2", image2);
      }

      const isSectionUpdate = !!sectionId;
      const sectionUrl = isSectionUpdate 
        ? `http://localhost:8000/api/v1/why-choose-us-section/${sectionId}`
        : "http://localhost:8000/api/v1/why-choose-us-section";
      
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
      if (!sectionId && sectionResponseData.data?.why_choose_us_section?.id) {
        setSectionId(sectionResponseData.data.why_choose_us_section.id);
      }

      // Update image URLs from response
      const section = sectionResponseData.data?.why_choose_us_section || sectionResponseData.why_choose_us_section;
      if (section) {
        if (section.background_image) {
          setBackgroundImageUrl(section.background_image);
          setBackgroundImage(null);
        }
        if (section.image_1) {
          setImage1Url(section.image_1);
          setImage1(null);
        }
        if (section.image_2) {
          setImage2Url(section.image_2);
          setImage2(null);
        }
      }

      // Save/update tabs
      for (const tab of tabs) {
        await saveTab(tab, token);
      }

      // Refresh data
      await fetchSectionData();
      await fetchTabsData();

      setSuccess("Why Choose Us section saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error saving data:", err);
      setError(err.message || "Failed to save data");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const saveTab = async (tab: Tab, token: string) => {
    const body = {
      title: tab.title || "",
      description: tab.description || "",
      order: tab.order || 0,
    };

    const isUpdate = !!tab.id;
    const url = isUpdate 
      ? `http://localhost:8000/api/v1/why-choose-us-tabs/${tab.id}`
      : "http://localhost:8000/api/v1/why-choose-us-tabs";
    
    const method = isUpdate ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {};
      throw new Error(responseData.message || "Failed to save tab");
    }

    const responseData = await response.json();
    const savedTab = responseData.data?.why_choose_us_tab || responseData.why_choose_us_tab;
    
    // Update tab with new ID if it was created
    if (!tab.id && savedTab?.id) {
      setTabs((prev) =>
        prev.map((t) =>
          t === tab ? { ...t, id: savedTab.id, order: savedTab.order || t.order } : t
        )
      );
    }
  };

  const handleDeleteBackgroundImage = async () => {
    if (!sectionId) {
      setError("Section ID not found");
      return;
    }

    if (!confirm("Are you sure you want to delete the background image?")) {
      return;
    }

    try {
      setDeletingBackground(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingBackground(false);
        return;
      }

      const url = `http://localhost:8000/api/v1/why-choose-us-section/${sectionId}/field/background_image`;

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
        throw new Error(responseData.message || "Failed to delete background image");
      }

      setBackgroundImage(null);
      setBackgroundImageUrl(null);
      await fetchSectionData();

      setSuccess("Background image deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting background image:", err);
      setError(err.message || "Failed to delete background image");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingBackground(false);
    }
  };

  const handleDeleteImage1 = async () => {
    if (!sectionId) {
      setError("Section ID not found");
      return;
    }

    if (!confirm("Are you sure you want to delete image 1?")) {
      return;
    }

    try {
      setDeletingImage1(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingImage1(false);
        return;
      }

      const url = `http://localhost:8000/api/v1/why-choose-us-section/${sectionId}/field/image_1`;

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
        throw new Error(responseData.message || "Failed to delete image 1");
      }

      setImage1(null);
      setImage1Url(null);
      await fetchSectionData();

      setSuccess("Image 1 deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting image 1:", err);
      setError(err.message || "Failed to delete image 1");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingImage1(false);
    }
  };

  const handleDeleteImage2 = async () => {
    if (!sectionId) {
      setError("Section ID not found");
      return;
    }

    if (!confirm("Are you sure you want to delete image 2?")) {
      return;
    }

    try {
      setDeletingImage2(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingImage2(false);
        return;
      }

      const url = `http://localhost:8000/api/v1/why-choose-us-section/${sectionId}/field/image_2`;

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
        throw new Error(responseData.message || "Failed to delete image 2");
      }

      setImage2(null);
      setImage2Url(null);
      await fetchSectionData();

      setSuccess("Image 2 deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting image 2:", err);
      setError(err.message || "Failed to delete image 2");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingImage2(false);
    }
  };

  const handleTabChange = (tabId: number, field: string, value: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, [field]: value } : tab
      )
    );
  };

  const handleImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage1(e.target.files[0]);
      setImage1Url(null);
    }
  };

  const handleImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage2(e.target.files[0]);
      setImage2Url(null);
    }
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
      setBackgroundImageUrl(null);
    }
  };

  const handleAddTab = () => {
    const maxOrder = tabs.length > 0 
      ? Math.max(...tabs.map((t) => t.order || 0))
      : 0;
    
    const newTab: Tab = {
      id: 0, // Temporary ID for new tabs
      title: "New Tab",
      description: "",
      order: maxOrder + 1,
    };
    
    setTabs((prev) => [...prev, newTab]);
  };

  const handleDeleteTab = async (tabId: number) => {
    if (!tabId || tabId === 0) {
      // Just remove from state if it's a new tab
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
      return;
    }

    if (!confirm("Are you sure you want to delete this tab?")) {
      return;
    }

    try {
      setDeletingTab(tabId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingTab(null);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/why-choose-us-tabs/${tabId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete tab");
      }

      // Remove from state
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));

      setSuccess("Tab deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting tab:", err);
      setError(err.message || "Failed to delete tab");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingTab(null);
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

      {/* Main Heading */}
      <h3 className="text-2xl font-bold text-pink-600 mb-6">Edit Why Choose Us Section</h3>

      {/* Section Title */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Section Settings</h3>
        <div>
          <label htmlFor="sectionTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            id="sectionTitle"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Why Choose Us"
          />
        </div>
      </div>

      {/* Background Image Section */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Background Image</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label className="inline-block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBackgroundImageChange}
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
                Choose File
              </span>
            </label>
            <span className="text-sm text-gray-600">
              {backgroundImage
                ? backgroundImage.name
                : backgroundImageUrl
                  ? "Existing image"
                  : "No file chosen"}
            </span>
          </div>
          {(backgroundImage || backgroundImageUrl) && (
            <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
              {backgroundImage ? (
                <Image
                  src={URL.createObjectURL(backgroundImage)}
                  alt="Background Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              ) : backgroundImageUrl ? (
                <img
                  src={backgroundImageUrl.startsWith("http") || backgroundImageUrl.startsWith("/storage")
                    ? `http://localhost:8000${backgroundImageUrl}`
                    : backgroundImageUrl}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              ) : null}
              {(backgroundImage || backgroundImageUrl) && (
                <button
                  onClick={() => {
                    if (backgroundImageUrl && sectionId) {
                      handleDeleteBackgroundImage();
                    } else {
                      setBackgroundImage(null);
                      setBackgroundImageUrl(null);
                    }
                  }}
                  disabled={deletingBackground}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete background image"
                >
                  {deletingBackground ? (
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Why Choose Us Images Section */}
      <div className="space-y-6 pb-6 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Why Choose Us Images</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image 1</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="inline-block">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImage1Change}
                  />
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                    Choose File
                  </span>
                </label>
                <span className="text-sm text-gray-600">
                  {image1
                    ? image1.name
                    : image1Url
                      ? "Existing image"
                      : "No file chosen"}
                </span>
                {image1Url && (
                  <button
                    onClick={handleDeleteImage1}
                    disabled={deletingImage1}
                    className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete image"
                  >
                    {deletingImage1 ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
              {(image1 || image1Url) && (
                <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
                  {image1 ? (
                  <Image
                    src={URL.createObjectURL(image1)}
                    alt="Image 1 Preview"
                    fill
                    className="object-cover"
                  />
                  ) : image1Url ? (
                    <img
                      src={image1Url.startsWith("http") || image1Url.startsWith("/storage")
                        ? `http://localhost:8000${image1Url}`
                        : image1Url}
                      alt="Image 1"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Image 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image 2</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="inline-block">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImage2Change}
                  />
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                    Choose File
                  </span>
                </label>
                <span className="text-sm text-gray-600">
                  {image2
                    ? image2.name
                    : image2Url
                      ? "Existing image"
                      : "No file chosen"}
                </span>
                {image2Url && (
                  <button
                    onClick={handleDeleteImage2}
                    disabled={deletingImage2}
                    className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete image"
                  >
                    {deletingImage2 ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
              {(image2 || image2Url) ? (
                <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
              {image2 ? (
                  <Image
                    src={URL.createObjectURL(image2)}
                    alt="Image 2 Preview"
                    fill
                    className="object-cover"
                  />
                  ) : image2Url ? (
                    <img
                      src={image2Url.startsWith("http") || image2Url.startsWith("/storage")
                        ? `http://localhost:8000${image2Url}`
                        : image2Url}
                      alt="Image 2"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              ) : (
                <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <span className="text-white text-lg font-medium">600 x 400</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* TABS Section */}
      <div>
        <h4 className="text-xl font-bold text-gray-900 mb-6">TABS</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tabs.map((tab) => (
            <div key={tab.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-sm font-bold text-gray-900">
                  TAB # {tab.id}
                </h5>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteTab(tab.id)}
                    disabled={deletingTab === tab.id}
                    className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingTab === tab.id ? (
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

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={tab.title}
                    onChange={(e) => handleTabChange(tab.id, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    value={tab.description}
                    onChange={(e) => handleTabChange(tab.id, "description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white text-sm scrollbar-hide overflow-y-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add New Tab Card */}
          <button
            onClick={handleAddTab}
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

WhyChooseUsEditor.displayName = "WhyChooseUsEditor";

export default WhyChooseUsEditor;

