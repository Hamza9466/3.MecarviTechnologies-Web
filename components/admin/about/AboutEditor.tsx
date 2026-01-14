"use client";

import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";

interface AboutEditorRef {
  save: () => Promise<void>;
}

const AboutEditor = forwardRef<AboutEditorRef>((props, ref) => {
  // Section IDs
  const [heroSectionId, setHeroSectionId] = useState<number | null>(null);
  const [founderSectionId, setFounderSectionId] = useState<number | null>(null);
  const [companySectionId, setCompanySectionId] = useState<number | null>(null);
  const [missionVisionSectionId, setMissionVisionSectionId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    // Hero Section
    heroBackgroundImage: null as File | null,
    heroBackgroundImageUrl: null as string | null,
    heroTitlePart1: "",
    heroTitlePart2: "",
    heroDescription1: "",
    heroDescription2: "",
    heroImage: null as File | null,
    heroImageUrl: null as string | null,
    
    // About the Founder
    founderTitle: "",
    founderDescription: "",
    
    // About our Company
    companyTitle: "",
    companyDescription: "",
    companyImage: null as File | null,
    companyImageUrl: null as string | null,
    
    // Mission Statement
    missionTitle: "",
    missionDescription: "",
    
    // Vision Statement
    visionTitle: "",
    visionDescription: "",
    
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render key
  
  // Track which images were explicitly removed (to prevent refresh from restoring them)
  const [removedImages, setRemovedImages] = useState<Set<string>>(new Set());
  const removedImagesRef = useRef<Set<string>>(new Set());
  
  // Refs for file inputs to clear them when removing images
  const heroBackgroundImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const companyImageInputRef = useRef<HTMLInputElement>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/storage")) return `http://localhost:8000${url}`;
    return `http://localhost:8000/storage/${url}`;
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchHeroSection(),
        fetchFounderSection(),
        fetchCompanySection(),
        fetchMissionVisionSection(),
      ]);
    } catch (err) {
      console.error("Error fetching about page data:", err);
      setError("Failed to load about page data");
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroSection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/hero-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.hero_section) {
          const section = data.data.hero_section;
          setHeroSectionId(section.id);
          setFormData((prev) => ({
            ...prev,
            heroTitlePart1: section.title_part_1 || "",
            heroTitlePart2: section.title_part_2 || "",
            heroDescription1: section.description_1 || "",
            heroDescription2: section.description_2 || "",
            // Only update image URLs if they weren't explicitly removed (use ref for current value)
            heroBackgroundImageUrl: removedImagesRef.current.has("heroBackgroundImageUrl") ? null : (getImageUrl(section.hero_background_image) || prev.heroBackgroundImageUrl),
            heroImageUrl: removedImagesRef.current.has("heroImageUrl") ? null : (getImageUrl(section.hero_image) || prev.heroImageUrl),
          }));
        }
      } else if (response.status === 404) {
        // Section doesn't exist yet, keep empty values
        setHeroSectionId(null);
      }
    } catch (err) {
      console.error("Error fetching hero section:", err);
    }
  };

  const fetchFounderSection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/about-founder-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.about_founder_section) {
          const section = data.data.about_founder_section;
          setFounderSectionId(section.id);
          setFormData((prev) => ({
            ...prev,
            founderTitle: section.founder_title || "",
            founderDescription: section.founder_description || "",
          }));
        }
      } else if (response.status === 404) {
        // Section doesn't exist yet, keep empty values
        setFounderSectionId(null);
      }
    } catch (err) {
      console.error("Error fetching founder section:", err);
    }
  };

  const fetchCompanySection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/about-company-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.about_company_section) {
          const section = data.data.about_company_section;
          setCompanySectionId(section.id);
          setFormData((prev) => ({
            ...prev,
            companyTitle: section.company_title || "",
            companyDescription: section.company_description || "",
            // Only update image URL if it wasn't explicitly removed (use ref for current value)
            companyImageUrl: removedImagesRef.current.has("companyImageUrl") ? null : (getImageUrl(section.company_image) || prev.companyImageUrl),
          }));
        }
      } else if (response.status === 404) {
        // Section doesn't exist yet, keep empty values
        setCompanySectionId(null);
      }
    } catch (err) {
      console.error("Error fetching company section:", err);
    }
  };

  const fetchMissionVisionSection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/mission-vision-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.mission_vision_section) {
          const section = data.data.mission_vision_section;
          setMissionVisionSectionId(section.id);
          setFormData((prev) => ({
            ...prev,
            missionTitle: section.mission_title || "",
            missionDescription: section.mission_description || "",
            visionTitle: section.vision_title || "",
            visionDescription: section.vision_description || "",
          }));
        }
      } else if (response.status === 404) {
        // Section doesn't exist yet, keep empty values
        setMissionVisionSectionId(null);
      }
    } catch (err) {
      console.error("Error fetching mission vision section:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const urlFieldName = `${fieldName}Url` as keyof typeof formData;
      
      // Remove from removedImages set since user is adding a new image
      setRemovedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(urlFieldName);
        removedImagesRef.current = newSet; // Update ref immediately
        console.log(`Removed ${urlFieldName} from removedImages set. Remaining:`, Array.from(newSet));
        return newSet;
      });
      
      setFormData((prev) => ({ 
        ...prev, 
        [fieldName]: e.target.files![0],
        [urlFieldName]: null // Clear the URL when a new file is selected
      }));
      
      console.log(`New file selected for ${fieldName}:`, e.target.files[0].name);
    }
  };

  const handleRemoveImage = (fieldName: string, urlFieldName: string, inputRef?: React.RefObject<HTMLInputElement>) => {
    console.log(`=== REMOVING IMAGE ===`);
    console.log(`Field: ${fieldName}, URL Field: ${urlFieldName}`);
    console.log(`Current state BEFORE removal:`, {
      [fieldName]: formData[fieldName as keyof typeof formData],
      [urlFieldName]: formData[urlFieldName as keyof typeof formData]
    });
    
    // Clear the file input if ref is provided
    if (inputRef?.current) {
      inputRef.current.value = "";
      console.log(`✓ Cleared file input for ${fieldName}`);
    }
    
    // Mark this image as removed
    setRemovedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(urlFieldName);
      removedImagesRef.current = newSet; // Update ref immediately
      console.log(`Marked ${urlFieldName} as removed. Removed images:`, Array.from(newSet));
      return newSet;
    });
    
    // Update state - use functional update to ensure we have the latest state
    setFormData((prev) => {
      // Create a brand new object with all fields explicitly set
      const updated = {
        ...prev,
        [fieldName]: null,
        [urlFieldName]: null,
      };
      
      console.log(`State AFTER removal:`, {
        [fieldName]: updated[fieldName as keyof typeof updated],
        [urlFieldName]: updated[urlFieldName as keyof typeof updated]
      });
      console.log(`Will image preview show? ${updated[fieldName as keyof typeof updated] || updated[urlFieldName as keyof typeof updated] ? 'YES' : 'NO'}`);
      
      return updated;
    });
    
    // Force a re-render by updating refresh key
    setRefreshKey(prev => {
      const newKey = prev + 1;
      console.log(`Refresh key updated: ${prev} -> ${newKey}`);
      return newKey;
    });
    
    console.log(`=== REMOVAL COMPLETE ===`);
  };

  const handleSave = async () => {
    console.log("handleSave called in AboutEditor");
    setSaving(true);
    setError("");
    setSuccess("");
    const token = getToken();

    if (!token) {
      const errorMsg = "Please login to save changes";
      console.error(errorMsg);
      setError(errorMsg);
      setSaving(false);
      return;
    }

    // Test API connection first
    try {
      const testResponse = await fetch("http://localhost:8000/api/v1/hero-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      console.log("API connection test:", testResponse.status);
    } catch (testError: any) {
      console.error("API connection test failed:", testError);
      setError("Cannot connect to API server. Please make sure the Laravel API server is running on http://localhost:8000");
      setSaving(false);
      return;
    }

    console.log("Token found, starting save process...");
    console.log("Form data:", formData);
    console.log("Section IDs:", { heroSectionId, founderSectionId, companySectionId, missionVisionSectionId });

    try {
      console.log("Starting Promise.allSettled for all sections...");
      const results = await Promise.allSettled([
        saveHeroSection(token).catch(err => {
          console.error("saveHeroSection error:", err);
          throw err;
        }),
        saveFounderSection(token).catch(err => {
          console.error("saveFounderSection error:", err);
          throw err;
        }),
        saveCompanySection(token).catch(err => {
          console.error("saveCompanySection error:", err);
          throw err;
        }),
        saveMissionVisionSection(token).catch(err => {
          console.error("saveMissionVisionSection error:", err);
          throw err;
        }),
      ]);

      console.log("All promises settled:", results);

      // Check for any failures
      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        console.error("Some sections failed to save:", failures);
        const errorMessages = failures
          .map((f) => (f.status === "rejected" ? f.reason?.message || "Unknown error" : ""))
          .filter(Boolean);
        const errorMsg = errorMessages.join("; ");
        console.error("Combined error message:", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("All sections saved successfully!");
      setSuccess("All sections saved successfully!");
      setTimeout(() => setSuccess(""), 5000);
      
      // Refresh data after save
      console.log("Refreshing data...");
      await fetchAllData();
      console.log("Data refreshed");
    } catch (err: any) {
      console.error("Error saving about page:", err);
      const errorMsg = err.message || "Failed to save about page";
      setError(errorMsg);
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
      console.log("Save process completed");
    }
  };

  const saveHeroSection = async (token: string) => {
    console.log("Saving hero section...");
    const formDataToSend = new FormData();
    
    if (formData.heroBackgroundImage) {
      formDataToSend.append("hero_background_image", formData.heroBackgroundImage);
    } else if ((formData.heroBackgroundImageUrl === null || removedImagesRef.current.has("heroBackgroundImageUrl")) && heroSectionId) {
      // Send empty string to remove the image
      formDataToSend.append("hero_background_image", "");
      console.log("Sending hero_background_image deletion request");
    }
    
    if (formData.heroImage) {
      formDataToSend.append("hero_image", formData.heroImage);
    } else if ((formData.heroImageUrl === null || removedImagesRef.current.has("heroImageUrl")) && heroSectionId) {
      // Send empty string to remove the image
      formDataToSend.append("hero_image", "");
      console.log("Sending hero_image deletion request");
    }

    formDataToSend.append("title_part_1", formData.heroTitlePart1 || "");
    formDataToSend.append("title_part_2", formData.heroTitlePart2 || "");
    formDataToSend.append("description_1", formData.heroDescription1 || "");
    formDataToSend.append("description_2", formData.heroDescription2 || "");

    const url = heroSectionId 
      ? `http://localhost:8000/api/v1/hero-section/${heroSectionId}`
      : "http://localhost:8000/api/v1/hero-section";
    
    const method = "POST";
    if (heroSectionId) {
      formDataToSend.append("_method", "PUT");
    }

    console.log(`Saving hero section to: ${url}, method: ${method}, isUpdate: ${!!heroSectionId}`);

    let response;
    try {
      response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
    } catch (fetchError: any) {
      console.error("Network error saving hero section:", fetchError);
      throw new Error(`Network error: ${fetchError.message || "Failed to connect to server. Please check if the API server is running."}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to save hero section" };
      }
      console.error("Hero section save error:", errorData);
      throw new Error(errorData.message || `Failed to save hero section (${response.status})`);
    }

    const data = await response.json();
    console.log("Hero section save response:", data);
    if (data.success && data.data?.hero_section) {
      const section = data.data.hero_section;
      if (!heroSectionId) {
        setHeroSectionId(section.id);
      }
      setFormData((prev) => ({
        ...prev,
        // Only update image URLs if they weren't explicitly removed (use ref for current value)
        heroBackgroundImageUrl: removedImagesRef.current.has("heroBackgroundImageUrl") ? null : (getImageUrl(section.hero_background_image) || prev.heroBackgroundImageUrl),
        heroImageUrl: removedImagesRef.current.has("heroImageUrl") ? null : (getImageUrl(section.hero_image) || prev.heroImageUrl),
        heroBackgroundImage: null,
        heroImage: null,
      }));
    }
  };

  const saveFounderSection = async (token: string) => {
    console.log("Saving founder section...");
    const url = founderSectionId 
      ? `http://localhost:8000/api/v1/about-founder-section/${founderSectionId}`
      : "http://localhost:8000/api/v1/about-founder-section";
    
    const body = {
      founder_title: formData.founderTitle || "",
      founder_description: formData.founderDescription || "",
    };

    console.log(`Saving founder section to: ${url}, method: ${founderSectionId ? "PUT" : "POST"}`);

    let response;
    try {
      response = await fetch(url, {
        method: founderSectionId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (fetchError: any) {
      console.error("Network error saving founder section:", fetchError);
      throw new Error(`Network error: ${fetchError.message || "Failed to connect to server. Please check if the API server is running."}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to save founder section" };
      }
      console.error("Founder section save error:", errorData);
      throw new Error(errorData.message || `Failed to save founder section (${response.status})`);
    }

    const data = await response.json();
    console.log("Founder section save response:", data);
    if (data.success && data.data?.about_founder_section) {
      const section = data.data.about_founder_section;
      if (!founderSectionId) {
        setFounderSectionId(section.id);
      }
    }
  };

  const saveCompanySection = async (token: string) => {
    console.log("Saving company section...");
    const formDataToSend = new FormData();
    
    if (formData.companyImage) {
      formDataToSend.append("company_image", formData.companyImage);
    } else if ((formData.companyImageUrl === null || removedImagesRef.current.has("companyImageUrl")) && companySectionId) {
      // Send empty string to remove the image
      formDataToSend.append("company_image", "");
      console.log("Sending company_image deletion request");
    }

    formDataToSend.append("company_title", formData.companyTitle || "");
    formDataToSend.append("company_description", formData.companyDescription || "");

    const url = companySectionId 
      ? `http://localhost:8000/api/v1/about-company-section/${companySectionId}`
      : "http://localhost:8000/api/v1/about-company-section";
    
    const method = "POST";
    if (companySectionId) {
      formDataToSend.append("_method", "PUT");
    }

    console.log(`Saving company section to: ${url}, method: ${method}, isUpdate: ${!!companySectionId}`);

    let response;
    try {
      response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
    } catch (fetchError: any) {
      console.error("Network error saving company section:", fetchError);
      throw new Error(`Network error: ${fetchError.message || "Failed to connect to server. Please check if the API server is running."}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to save company section" };
      }
      console.error("Company section save error:", errorData);
      throw new Error(errorData.message || `Failed to save company section (${response.status})`);
    }

    const data = await response.json();
    console.log("Company section save response:", data);
    if (data.success && data.data?.about_company_section) {
      const section = data.data.about_company_section;
      if (!companySectionId) {
        setCompanySectionId(section.id);
      }
      setFormData((prev) => ({
        ...prev,
        // Only update image URL if it wasn't explicitly removed (use ref for current value)
        companyImageUrl: removedImagesRef.current.has("companyImageUrl") ? null : (getImageUrl(section.company_image) || prev.companyImageUrl),
        companyImage: null,
      }));
    }
  };

  const saveMissionVisionSection = async (token: string) => {
    console.log("Saving mission vision section...");
    const url = missionVisionSectionId 
      ? `http://localhost:8000/api/v1/mission-vision-section/${missionVisionSectionId}`
      : "http://localhost:8000/api/v1/mission-vision-section";
    
    const body = {
      mission_title: formData.missionTitle || "",
      mission_description: formData.missionDescription || "",
      vision_title: formData.visionTitle || "",
      vision_description: formData.visionDescription || "",
    };

    console.log(`Saving mission vision section to: ${url}, method: ${missionVisionSectionId ? "PUT" : "POST"}`);

    let response;
    try {
      response = await fetch(url, {
        method: missionVisionSectionId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (fetchError: any) {
      console.error("Network error saving mission vision section:", fetchError);
      throw new Error(`Network error: ${fetchError.message || "Failed to connect to server. Please check if the API server is running."}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to save mission vision section" };
      }
      console.error("Mission vision section save error:", errorData);
      throw new Error(errorData.message || `Failed to save mission vision section (${response.status})`);
    }

    const data = await response.json();
    console.log("Mission vision section save response:", data);
    if (data.success && data.data?.mission_vision_section) {
      const section = data.data.mission_vision_section;
      if (!missionVisionSectionId) {
        setMissionVisionSectionId(section.id);
      }
    }
  };

  // Expose save method to parent
  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading about page data...</div>
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
      {saving && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving changes...</span>
        </div>
      )}
      {/* Hero Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Hero Section</h3>
      <div className="space-y-4">
          {/* Hero Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Background Image
            </label>
            <div className="flex items-center gap-4">
              <label className="inline-block">
                <input
                  ref={heroBackgroundImageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange("heroBackgroundImage")}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {formData.heroBackgroundImage ? formData.heroBackgroundImage.name : formData.heroBackgroundImageUrl ? "Image uploaded" : "No file chosen"}
              </span>
              {(formData.heroBackgroundImage || formData.heroBackgroundImageUrl) ? (
                <div className="flex items-center gap-2" key={`hero-bg-${refreshKey}`}>
                  <div className="relative w-16 h-16 border border-gray-300 rounded-lg overflow-hidden bg-gray-200">
                    {formData.heroBackgroundImage ? (
                      <img
                        src={URL.createObjectURL(formData.heroBackgroundImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : formData.heroBackgroundImageUrl ? (
                      <img
                        src={formData.heroBackgroundImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Remove button clicked for heroBackgroundImage");
                      handleRemoveImage("heroBackgroundImage", "heroBackgroundImageUrl", heroBackgroundImageInputRef);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Hero Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title Part 1 (Black)
              </label>
              <input
                type="text"
                name="heroTitlePart1"
                value={formData.heroTitlePart1}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title Part 2 (Pink)
              </label>
              <input
                type="text"
                name="heroTitlePart2"
                value={formData.heroTitlePart2}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Hero Description 1 (Tagline) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Description 1 (Tagline)
          </label>
          <input
            type="text"
              name="heroDescription1"
              value={formData.heroDescription1}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

          {/* Hero Description 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description 2
            </label>
            <textarea
              name="heroDescription2"
              value={formData.heroDescription2}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
            />
          </div>

          {/* Hero Image (Laptop) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image (Laptop)
            </label>
            <div className="flex items-center gap-4">
              <label className="inline-block">
                <input
                  ref={heroImageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange("heroImage")}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {formData.heroImage ? formData.heroImage.name : formData.heroImageUrl ? "Image uploaded" : "No file chosen"}
              </span>
              {(formData.heroImage || formData.heroImageUrl) ? (
                <div className="flex items-center gap-2" key={`hero-img-${refreshKey}`}>
                  <div className="relative w-16 h-16 border border-gray-300 rounded-lg overflow-hidden bg-gray-200">
                    {formData.heroImage ? (
                      <img
                        src={URL.createObjectURL(formData.heroImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : formData.heroImageUrl ? (
                      <img
                        src={formData.heroImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveImage("heroImage", "heroImageUrl", heroImageInputRef);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* About the Founder Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">About the Founder Section</h3>
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Founder Title
            </label>
            <input
              type="text"
              name="founderTitle"
              value={formData.founderTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Founder Description
            </label>
            <textarea
              name="founderDescription"
              value={formData.founderDescription}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
            />
          </div>
          </div>
        </div>

      {/* About our Company Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">About our Company Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Title
            </label>
            <input
              type="text"
              name="companyTitle"
              value={formData.companyTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Image
            </label>
            <div className="flex items-center gap-4">
              <label className="inline-block">
                <input
                  ref={companyImageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange("companyImage")}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {formData.companyImage ? formData.companyImage.name : formData.companyImageUrl ? "Image uploaded" : "No file chosen"}
              </span>
              {(formData.companyImage || formData.companyImageUrl) ? (
                <div className="flex items-center gap-2" key={`company-img-${refreshKey}`}>
                  <div className="relative w-16 h-16 border border-gray-300 rounded-lg overflow-hidden bg-gray-200">
                    {formData.companyImage ? (
                      <img
                        src={URL.createObjectURL(formData.companyImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : formData.companyImageUrl ? (
                      <img
                        src={formData.companyImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Remove button clicked for companyImage");
                      handleRemoveImage("companyImage", "companyImageUrl", companyImageInputRef);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mission and Vision Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Mission and Vision Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Title
            </label>
            <input
              type="text"
              name="missionTitle"
              value={formData.missionTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Description
            </label>
            <textarea
              name="missionDescription"
              value={formData.missionDescription}
              onChange={handleInputChange}
                rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
            />
          </div>
        </div>
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision Title
            </label>
            <input
              type="text"
              name="visionTitle"
              value={formData.visionTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision Description
            </label>
            <textarea
              name="visionDescription"
              value={formData.visionDescription}
              onChange={handleInputChange}
                rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
            />
          </div>
          </div>
        </div>
      </div>

    </div>
  );
});

AboutEditor.displayName = "AboutEditor";

export default AboutEditor;

