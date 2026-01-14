"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface AboutEditorRef {
  save: () => Promise<void>;
}

const AboutEditor = forwardRef<AboutEditorRef>((props, ref) => {
  const [formData, setFormData] = useState({
    mainTitle: "",
    mainDescription: "",
    backgroundImage: null as File | null,
    backgroundImageUrl: null as string | null,
    tab1Title: "",
    tab1Subtitle: "",
    tab1Description: "",
    tab1Image: null as File | null,
    tab1ImageUrl: null as string | null,
    tab2Title: "",
    tab2Subtitle: "",
    tab2Description: "",
    tab2Image: null as File | null,
    tab2ImageUrl: null as string | null,
    experienceYears: "",
    experienceDescription: "",
    aboutImage1: null as File | null,
    aboutImage1Url: null as string | null,
    aboutImage2: null as File | null,
    aboutImage2Url: null as string | null,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingSection, setDeletingSection] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [aboutSectionId, setAboutSectionId] = useState<number | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0); // Key to reset file inputs

  // Fetch about section data on mount
  useEffect(() => {
    fetchAboutSectionData();
  }, []);

  const fetchAboutSectionData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError("");
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/v1/about-section", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        // If no data exists yet, that's okay - user can create new
        if (response.status === 404) {
          if (showLoading) {
            setLoading(false);
          }
          return;
        }
        throw new Error("Failed to fetch about section data");
      }

      const data = await response.json();
      
      if (data.success && data.data?.about_section) {
        const aboutSection = data.data.about_section;
        setAboutSectionId(aboutSection.id);
        
        // Helper function to handle empty strings and null values
        const getValue = (value: any) => {
          if (value === null || value === undefined || value === "") return null;
          return value;
        };
        
        setFormData({
          mainTitle: aboutSection.main_title || "",
          mainDescription: aboutSection.main_description || "",
          backgroundImage: null,
          backgroundImageUrl: getValue(aboutSection.background_image),
          tab1Title: aboutSection.tab1_title || "",
          tab1Subtitle: aboutSection.tab1_subtitle || "",
          tab1Description: aboutSection.tab1_description || "",
          tab1Image: null,
          tab1ImageUrl: getValue(aboutSection.tab1_image),
          tab2Title: aboutSection.tab2_title || "",
          tab2Subtitle: aboutSection.tab2_subtitle || "",
          tab2Description: aboutSection.tab2_description || "",
          tab2Image: null,
          tab2ImageUrl: getValue(aboutSection.tab2_image),
          experienceYears: aboutSection.experience_years || "",
          experienceDescription: aboutSection.experience_description || "",
          aboutImage1: null,
          aboutImage1Url: getValue(aboutSection.about_image_1 || aboutSection.about_image1),
          aboutImage2: null,
          aboutImage2Url: getValue(aboutSection.about_image_2 || aboutSection.about_image2),
        });
        
        // Debug log to check if images are being loaded
        console.log("About section data loaded:");
        console.log("  about_image_1:", aboutSection.about_image_1, "(type:", typeof aboutSection.about_image_1, ")");
        console.log("  about_image_2:", aboutSection.about_image_2, "(type:", typeof aboutSection.about_image_2, ")");
        console.log("  aboutImage1Url_after getValue:", getValue(aboutSection.about_image_1 || aboutSection.about_image1));
        console.log("  aboutImage2Url_after getValue:", getValue(aboutSection.about_image_2 || aboutSection.about_image2));
        console.log("  Full section:", JSON.stringify(aboutSection, null, 2));
      }
    } catch (err: any) {
      console.error("Error fetching about section data:", err);
      if (showLoading) {
        setError("Failed to load about section data");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    console.log("=== SAVE STARTED ===");
    console.log("🔥 AboutEditor.save() called from parent component");
    console.log("Current formData state before save:", {
      mainTitle: formData.mainTitle,
      aboutImage1: formData.aboutImage1 ? `File: ${formData.aboutImage1.name} (${formData.aboutImage1.size} bytes)` : "null",
      aboutImage2: formData.aboutImage2 ? `File: ${formData.aboutImage2.name} (${formData.aboutImage2.size} bytes)` : "null",
      aboutImage1Url: formData.aboutImage1Url || "null",
      aboutImage2Url: formData.aboutImage2Url || "null",
    });
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to save about section data");
        setSaving(false);
        return;
      }

      // Debug: Log current formData state to verify files are present
      console.log("=== SAVE STARTED ===");
      console.log("Current formData state:", {
        hasBackgroundImage: !!formData.backgroundImage,
        hasTab1Image: !!formData.tab1Image,
        hasTab2Image: !!formData.tab2Image,
        hasAboutImage1: !!formData.aboutImage1,
        hasAboutImage2: !!formData.aboutImage2,
        aboutImage1: formData.aboutImage1 ? {
          name: formData.aboutImage1.name,
          size: formData.aboutImage1.size,
          type: formData.aboutImage1.type,
        } : null,
        aboutImage2: formData.aboutImage2 ? {
          name: formData.aboutImage2.name,
          size: formData.aboutImage2.size,
          type: formData.aboutImage2.type,
        } : null,
      });

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("main_title", formData.mainTitle || "");
      formDataToSend.append("main_description", formData.mainDescription || "");
      formDataToSend.append("tab1_title", formData.tab1Title || "");
      formDataToSend.append("tab1_subtitle", formData.tab1Subtitle || "");
      formDataToSend.append("tab1_description", formData.tab1Description || "");
      formDataToSend.append("tab2_title", formData.tab2Title || "");
      formDataToSend.append("tab2_subtitle", formData.tab2Subtitle || "");
      formDataToSend.append("tab2_description", formData.tab2Description || "");
      formDataToSend.append("experience_years", formData.experienceYears || "");
      formDataToSend.append("experience_description", formData.experienceDescription || "");

      // Only append files if they are new (File objects)
      // Check for files before creating FormData
      console.log("Checking for files to upload:");
      console.log("  backgroundImage:", formData.backgroundImage ? `File: ${formData.backgroundImage.name}` : "null");
      console.log("  tab1Image:", formData.tab1Image ? `File: ${formData.tab1Image.name}` : "null");
      console.log("  tab2Image:", formData.tab2Image ? `File: ${formData.tab2Image.name}` : "null");
      console.log("  aboutImage1:", formData.aboutImage1 ? `File: ${formData.aboutImage1.name}` : "null");
      console.log("  aboutImage2:", formData.aboutImage2 ? `File: ${formData.aboutImage2.name}` : "null");
      
      let fileCount = 0;
      
      if (formData.backgroundImage) {
        formDataToSend.append("background_image", formData.backgroundImage);
        console.log("✓ Appending background_image:", formData.backgroundImage.name, `(${formData.backgroundImage.size} bytes)`);
        fileCount++;
      }
      if (formData.tab1Image) {
        formDataToSend.append("tab1_image", formData.tab1Image);
        console.log("✓ Appending tab1_image:", formData.tab1Image.name, `(${formData.tab1Image.size} bytes)`);
        fileCount++;
      }
      if (formData.tab2Image) {
        formDataToSend.append("tab2_image", formData.tab2Image);
        console.log("✓ Appending tab2_image:", formData.tab2Image.name, `(${formData.tab2Image.size} bytes)`);
        fileCount++;
      }
      if (formData.aboutImage1) {
        formDataToSend.append("about_image_1", formData.aboutImage1);
        console.log("✓ Appending about_image_1:", formData.aboutImage1.name, `(${formData.aboutImage1.size} bytes)`);
        fileCount++;
      }
      if (formData.aboutImage2) {
        formDataToSend.append("about_image_2", formData.aboutImage2);
        console.log("✓ Appending about_image_2:", formData.aboutImage2.name, `(${formData.aboutImage2.size} bytes)`);
        fileCount++;
      }
      
      if (fileCount === 0) {
        console.warn("⚠️ No image files detected in formData. Make sure you've selected files before saving.");
        console.warn("This is normal if you're only updating text fields without changing images.");
      } else {
        console.log(`✓ ${fileCount} file(s) will be uploaded to the server`);
      }
      
      // Debug: Log all FormData entries
      console.log("FormData entries being sent:");
      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      console.log(`Total files in FormData: ${fileCount}`);

      // Use POST for create, PUT for update
      const isUpdate = !!aboutSectionId;
      const url = isUpdate 
        ? `http://localhost:8000/api/v1/about-section/${aboutSectionId}`
        : "http://localhost:8000/api/v1/about-section";
      
      // For Laravel, we may need to use POST with _method=PUT for FormData
      if (isUpdate) {
        formDataToSend.append("_method", "PUT");
      }
      
      console.log(`Saving about section - ${isUpdate ? 'Update (ID: ' + aboutSectionId + ')' : 'Create (new)'}`);
      console.log(`Using URL: ${url}`);
      console.log(`Using method: ${isUpdate ? 'PUT (via POST with _method)' : 'POST'}`);

      // Important: Do NOT set Content-Type when sending FormData
      // The browser will automatically set it with the correct boundary
      const headers: HeadersInit = {
        "Accept": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      console.log("Sending request with headers:", headers);
      console.log("FormData has files:", fileCount > 0);
      
      const response = await fetch(url, {
        method: "POST", // Always use POST for FormData
        headers: headers,
        body: formDataToSend,
      });

      let responseData;
      try {
        const text = await response.text();
        console.log("Raw response text:", text);
        responseData = text ? JSON.parse(text) : {};
        console.log("Parsed response data:", responseData);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        console.error("Response status:", response.status);
        console.error("Response headers:", response.headers);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        console.error("Save failed - Response not OK:");
        console.error("Status:", response.status);
        console.error("Status text:", response.statusText);
        console.error("Response data:", responseData);
        
        let errorMessage = "Failed to save about section";
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

      // Handle both response formats
      const aboutSection = responseData.data?.about_section || responseData.about_section || responseData.data;
      
      if (responseData.success || aboutSection) {
        
        // Set the ID if this was a create operation, or update if it was an update
        if (!aboutSectionId && aboutSection?.id) {
          console.log("About section created successfully with ID:", aboutSection.id);
          setAboutSectionId(aboutSection.id);
        } else if (aboutSectionId && aboutSection?.id) {
          console.log("About section updated successfully");
        } else if (aboutSection?.id) {
          // If we have an ID in response but not in state, set it
          setAboutSectionId(aboutSection.id);
        }
        
        // Helper function to handle empty strings and null values
        const getImageUrl = (value: any) => {
          if (value === null || value === undefined || value === "") return null;
          return String(value); // Ensure it's a string
        };
        
        // Debug log to check response BEFORE updating
        console.log("About section saved - API Response:");
        console.log("  Section ID:", aboutSection?.id);
        console.log("  about_image_1:", aboutSection?.about_image_1, "(type:", typeof aboutSection?.about_image_1, ")");
        console.log("  about_image_2:", aboutSection?.about_image_2, "(type:", typeof aboutSection?.about_image_2, ")");
        console.log("  about_image1 (fallback):", aboutSection?.about_image1, "(type:", typeof aboutSection?.about_image1, ")");
        console.log("  about_image2 (fallback):", aboutSection?.about_image2, "(type:", typeof aboutSection?.about_image2, ")");
        console.log("  Full section:", JSON.stringify(aboutSection, null, 2));
        
        // Update form data with new URLs and clear file objects
        // Only clear file objects if API confirms they were saved, otherwise keep them for retry
        if (aboutSection) {
          setFormData((prev) => {
            // Get new URLs from API response (if provided)
            // API uses about_image_1 and about_image_2 (with underscores)
            const newBackgroundUrl = getImageUrl(aboutSection.background_image);
            const newTab1Url = getImageUrl(aboutSection.tab1_image);
            const newTab2Url = getImageUrl(aboutSection.tab2_image);
            const newAboutImage1Url = getImageUrl(aboutSection.about_image_1 || aboutSection.about_image1);
            const newAboutImage2Url = getImageUrl(aboutSection.about_image_2 || aboutSection.about_image2);
          
          console.log("Updating formData - BEFORE:");
          console.log("  prev.aboutImage1Url:", prev.aboutImage1Url);
          console.log("  prev.aboutImage2Url:", prev.aboutImage2Url);
          console.log("  prev.aboutImage1 (file):", prev.aboutImage1 ? `File: ${prev.aboutImage1.name}` : "null");
          console.log("  prev.aboutImage2 (file):", prev.aboutImage2 ? `File: ${prev.aboutImage2.name}` : "null");
          console.log("  newAboutImage1Url from API:", newAboutImage1Url);
          console.log("  newAboutImage2Url from API:", newAboutImage2Url);
          
          // Check if files were uploaded but API returned null (backend issue)
          const hadAboutImage1File = !!prev.aboutImage1;
          const hadAboutImage2File = !!prev.aboutImage2;
          const aboutImage1UploadFailed = hadAboutImage1File && newAboutImage1Url === null;
          const aboutImage2UploadFailed = hadAboutImage2File && newAboutImage2Url === null;
          
          if (aboutImage1UploadFailed) {
            console.warn("⚠️ aboutImage1 file was sent but API returned null - backend may not have saved it");
          }
          if (aboutImage2UploadFailed) {
            console.warn("⚠️ aboutImage2 file was sent but API returned null - backend may not have saved it");
          }
          
          const updated = {
            ...prev,
            // Clear file objects only if API confirmed they were saved, otherwise keep them for retry
            backgroundImage: (prev.backgroundImage && newBackgroundUrl !== null) ? null : prev.backgroundImage,
            tab1Image: (prev.tab1Image && newTab1Url !== null) ? null : prev.tab1Image,
            tab2Image: (prev.tab2Image && newTab2Url !== null) ? null : prev.tab2Image,
            aboutImage1: aboutImage1UploadFailed ? prev.aboutImage1 : (prev.aboutImage1 && newAboutImage1Url !== null ? null : prev.aboutImage1),
            aboutImage2: aboutImage2UploadFailed ? prev.aboutImage2 : (prev.aboutImage2 && newAboutImage2Url !== null ? null : prev.aboutImage2),
            // Update URLs: use new URL from API if provided, otherwise keep existing
            backgroundImageUrl: newBackgroundUrl !== null ? newBackgroundUrl : prev.backgroundImageUrl,
            tab1ImageUrl: newTab1Url !== null ? newTab1Url : prev.tab1ImageUrl,
            tab2ImageUrl: newTab2Url !== null ? newTab2Url : prev.tab2ImageUrl,
            // For about images: Always use the API response if available, otherwise keep existing
            // This ensures newly uploaded images are displayed immediately
            // Always update with API response URLs - they are the source of truth
            aboutImage1Url: newAboutImage1Url !== null ? newAboutImage1Url : (prev.aboutImage1Url || null),
            aboutImage2Url: newAboutImage2Url !== null ? newAboutImage2Url : (prev.aboutImage2Url || null),
          };
          
          console.log("Updating formData - AFTER:");
          console.log("  updated.aboutImage1Url:", updated.aboutImage1Url, "(truthy:", !!updated.aboutImage1Url, ")");
          console.log("  updated.aboutImage2Url:", updated.aboutImage2Url, "(truthy:", !!updated.aboutImage2Url, ")");
          console.log("  Full URL for aboutImage1:", updated.aboutImage1Url ? `http://localhost:8000${updated.aboutImage1Url}` : "N/A");
          console.log("  Full URL for aboutImage2:", updated.aboutImage2Url ? `http://localhost:8000${updated.aboutImage2Url}` : "N/A");
          console.log("  updated.aboutImage1 (file still exists):", updated.aboutImage1 ? `File: ${updated.aboutImage1.name}` : "null");
          console.log("  updated.aboutImage2 (file still exists):", updated.aboutImage2 ? `File: ${updated.aboutImage2.name}` : "null");
          
          // Show warning if files failed to upload
          if (aboutImage1UploadFailed || aboutImage2UploadFailed) {
            const failedImages: string[] = [];
            if (aboutImage1UploadFailed) failedImages.push("About Image 1");
            if (aboutImage2UploadFailed) failedImages.push("About Image 2");
            setTimeout(() => {
              setError(`⚠️ Warning: ${failedImages.join(" and ")} ${failedImages.length > 1 ? "were" : "was"} not saved by the server. The file${failedImages.length > 1 ? "s" : ""} ${failedImages.length > 1 ? "are" : "is"} still selected - please try saving again. If this persists, check the backend file upload handling for PUT requests.`);
            }, 100);
          }
          
            return updated;
          });
        }
        
        // State has already been updated from the API response above
        // We don't need to refetch since we already have the latest data from the save response
        console.log("Save successful! State updated from API response.");
        
        // Reset file inputs to allow selecting the same file again if needed
        setFileInputKey(prev => prev + 1);
        
        // Optional: Refresh from API after a delay to ensure consistency (non-blocking)
        // Only do this if we want to double-check, but it's not necessary since we already updated from response
        setTimeout(async () => {
          try {
            await fetchAboutSectionData(false);
          } catch (refreshError) {
            // Non-critical - we already updated state from the response
            console.warn("Background refresh after save (non-critical):", refreshError);
          }
        }, 500);
        
        const successMessage = aboutSectionId 
          ? "About section updated successfully!" 
          : "About section created successfully!";
        setSuccess(successMessage);
        setTimeout(() => setSuccess(""), 3000);
        console.log("=== SAVE COMPLETED ===");
      } else {
        console.error("Invalid response structure:", responseData);
        console.error("Response does not contain success or about_section data");
        setError("Unexpected response format from server. Please check the console for details.");
      }
    } catch (err: any) {
      console.error("Error saving about section:", err);
      setError(err.message || "Failed to save about section");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const urlKey = `${imageType}Url` as keyof typeof formData;
      console.log(`File selected for ${imageType}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setFormData((prev) => ({ 
        ...prev, 
        [imageType]: file,
        [urlKey]: null 
      }));
      console.log(`File stored in formData.${imageType}`);
    } else {
      console.warn(`No file selected for ${imageType}`);
    }
  };

  const handleDeleteImage = async (imageType: string) => {
    if (!aboutSectionId) {
      setError("About section ID not found");
      return;
    }

    if (!confirm(`Are you sure you want to delete this image?`)) {
      return;
    }

    try {
      setDeleting(imageType);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      // Map image type to API field name
      const imageTypeMap: { [key: string]: string } = {
        backgroundImage: "background_image",
        tab1Image: "tab1_image",
        tab2Image: "tab2_image",
        aboutImage1: "about_image_1",
        aboutImage2: "about_image_2",
      };

      const apiImageField = imageTypeMap[imageType];
      if (!apiImageField) {
        throw new Error("Invalid image type");
      }

      // Use the field-specific delete endpoint
      const url = `http://localhost:8000/api/v1/about-section/${aboutSectionId}/field/${apiImageField}`;

      console.log(`Deleting image: ${apiImageField} from section ${aboutSectionId}`);
      console.log(`URL: ${url}`);

      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // Check response status and log for debugging
      console.log(`Response status: ${response.status}`);
      
      let responseData;
      try {
        const text = await response.text();
        console.log(`Response text: ${text}`);
        responseData = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Parse error:", parseError);
        if (response.status === 204 || response.ok) {
          responseData = { success: true };
        } else {
          throw new Error("Invalid response from server");
        }
      }
      
      console.log("Response data:", responseData);

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

      // Check if the section still exists after deletion
      if (responseData.success && responseData.data?.about_section) {
        // Section still exists - just update the image field
        const aboutSection = responseData.data.about_section;
        const urlKey = `${imageType}Url` as keyof typeof formData;
        
        setFormData((prev) => ({
          ...prev,
          [imageType]: null,
          [urlKey]: null,
        }));
        
        // Update the aboutSectionId in case it changed
        if (aboutSection.id) {
          setAboutSectionId(aboutSection.id);
        }
        
        setSuccess(`${imageType} image deleted successfully!`);
        setTimeout(() => setSuccess(""), 3000);
      } else if (response.ok) {
        // Image deleted successfully but no section data returned
        // Just clear the image from form data
        const urlKey = `${imageType}Url` as keyof typeof formData;
        setFormData((prev) => ({
          ...prev,
          [imageType]: null,
          [urlKey]: null,
        }));
        
        // Try to refresh data - but handle 404 gracefully
        try {
          await fetchAboutSectionData(false);
        } catch (refreshError) {
          console.warn("Could not refresh after image deletion:", refreshError);
          // If refresh fails with 404, the section might have been deleted
          if (aboutSectionId) {
            setError("Warning: The section may have been deleted. Please refresh the page.");
            // Clear the section ID so user can create new
            setAboutSectionId(null);
          }
        }
        
        setSuccess(`${imageType} image deleted successfully!`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      console.error(`Error deleting ${imageType} image:`, err);
      setError(err.message || `Failed to delete ${imageType} image. Please check if the endpoint is correct.`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteSection = async () => {
    if (!aboutSectionId) {
      setError("About section ID not found. Nothing to delete.");
      return;
    }

    if (!confirm(`Are you sure you want to delete the entire about section? This action cannot be undone and will delete all images and content.`)) {
      return;
    }

    try {
      setDeletingSection(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to delete about section");
        setDeletingSection(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/about-section/${aboutSectionId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
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
        let errorMessage = "Failed to delete about section";
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

      // Clear all form data and reset state
      setFormData({
        mainTitle: "",
        mainDescription: "",
        backgroundImage: null,
        backgroundImageUrl: null,
        tab1Title: "",
        tab1Subtitle: "",
        tab1Description: "",
        tab1Image: null,
        tab1ImageUrl: null,
        tab2Title: "",
        tab2Subtitle: "",
        tab2Description: "",
        tab2Image: null,
        tab2ImageUrl: null,
        experienceYears: "",
        experienceDescription: "",
        aboutImage1: null,
        aboutImage1Url: null,
        aboutImage2: null,
        aboutImage2Url: null,
      });
      
      setAboutSectionId(null);
      setSuccess("About section deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting about section:", err);
      setError(err.message || "Failed to delete about section. Please check if the endpoint is correct.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingSection(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading about section data...</div>
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

      {/* Delete Section Button - Only show if section exists */}
      {aboutSectionId && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDeleteSection}
            disabled={deletingSection}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deletingSection ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete About Section
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Title & Main Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mainTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Main Title
          </label>
          <input
            type="text"
            id="mainTitle"
            name="mainTitle"
            value={formData.mainTitle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label htmlFor="mainDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Main Description
          </label>
          <input
            type="text"
            id="mainDescription"
            name="mainDescription"
            value={formData.mainDescription}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>
      </div>

      {/* Background Image Section */}
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
                onChange={(e) => handleFileChange(e, "backgroundImage")}
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
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
          {(formData.backgroundImage || formData.backgroundImageUrl) && (
            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
              {formData.backgroundImage ? (
                <Image
                  src={URL.createObjectURL(formData.backgroundImage)}
                  alt="Background Preview"
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
                onClick={() => handleDeleteImage("backgroundImage")}
                disabled={deleting === "backgroundImage"}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete image"
              >
                {deleting === "backgroundImage" ? (
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
          )}
        </div>
      </div>

      {/* Tab 1 Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tab 1 Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tab1Title" className="block text-sm font-medium text-gray-700 mb-2">
              Tab 1 Title
            </label>
            <input
              type="text"
              id="tab1Title"
              name="tab1Title"
              value={formData.tab1Title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label htmlFor="tab1Subtitle" className="block text-sm font-medium text-gray-700 mb-2">
              Tab 1 Subtitle
            </label>
            <input
              type="text"
              id="tab1Subtitle"
              name="tab1Subtitle"
              value={formData.tab1Subtitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tab1Description" className="block text-sm font-medium text-gray-700 mb-2">
            Tab 1 Description
          </label>
          <input
            type="text"
            id="tab1Description"
            name="tab1Description"
            value={formData.tab1Description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tab 1 Image
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "tab1Image")}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {formData.tab1Image 
                  ? formData.tab1Image.name 
                  : formData.tab1ImageUrl 
                    ? "Existing image" 
                    : "No file chosen"}
              </span>
            </div>
            {(formData.tab1Image || formData.tab1ImageUrl) && (
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
                {formData.tab1Image ? (
                  <Image
                    src={URL.createObjectURL(formData.tab1Image)}
                    alt="Tab 1 Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src={`http://localhost:8000${formData.tab1ImageUrl}`}
                    alt="Tab 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load tab1 image:", formData.tab1ImageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <button
                  onClick={() => handleDeleteImage("tab1Image")}
                  disabled={deleting === "tab1Image"}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete image"
                >
                  {deleting === "tab1Image" ? (
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
            )}
          </div>
        </div>
      </div>

      {/* Tab 2 Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tab 2 Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tab2Title" className="block text-sm font-medium text-gray-700 mb-2">
              Tab 2 Title
            </label>
            <input
              type="text"
              id="tab2Title"
              name="tab2Title"
              value={formData.tab2Title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label htmlFor="tab2Subtitle" className="block text-sm font-medium text-gray-700 mb-2">
              Tab 2 Subtitle
            </label>
            <input
              type="text"
              id="tab2Subtitle"
              name="tab2Subtitle"
              value={formData.tab2Subtitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tab2Description" className="block text-sm font-medium text-gray-700 mb-2">
            Tab 2 Description
          </label>
          <input
            type="text"
            id="tab2Description"
            name="tab2Description"
            value={formData.tab2Description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tab 2 Image
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "tab2Image")}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
                  Choose File
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {formData.tab2Image 
                  ? formData.tab2Image.name 
                  : formData.tab2ImageUrl 
                    ? "Existing image" 
                    : "No file chosen"}
              </span>
            </div>
            {(formData.tab2Image || formData.tab2ImageUrl) && (
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
                {formData.tab2Image ? (
                  <Image
                    src={URL.createObjectURL(formData.tab2Image)}
                    alt="Tab 2 Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src={`http://localhost:8000${formData.tab2ImageUrl}`}
                    alt="Tab 2"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load tab2 image:", formData.tab2ImageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <button
                  onClick={() => handleDeleteImage("tab2Image")}
                  disabled={deleting === "tab2Image"}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete image"
                >
                  {deleting === "tab2Image" ? (
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
            )}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">
            Experience Years
          </label>
          <input
            type="text"
            id="experienceYears"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label htmlFor="experienceDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Experience Description
          </label>
          <textarea
            id="experienceDescription"
            name="experienceDescription"
            value={formData.experienceDescription}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
          />
        </div>
      </div>

      {/* About Images Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Images Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Image 1
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="inline-block">
                  <input
                    key={`aboutImage1-${fileInputKey}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "aboutImage1")}
                  />
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
                    Choose File
                  </span>
                </label>
                <span className="text-sm text-gray-600">
                  {formData.aboutImage1 
                    ? formData.aboutImage1.name 
                    : formData.aboutImage1Url 
                      ? "Existing image" 
                      : "No file chosen"}
                </span>
              </div>
              <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
                {(() => {
                  console.log("Rendering About Image 1 - hasFile:", !!formData.aboutImage1, "hasUrl:", !!formData.aboutImage1Url, "urlValue:", formData.aboutImage1Url);
                  return null;
                })()}
                {formData.aboutImage1 ? (
                  <Image
                    src={URL.createObjectURL(formData.aboutImage1)}
                    alt="About Image 1 Preview"
                    fill
                    className="object-cover"
                  />
                ) : formData.aboutImage1Url ? (
                  <img
                    key={`about-img-1-${formData.aboutImage1Url}`}
                    src={`http://localhost:8000${formData.aboutImage1Url}`}
                    alt="About Image 1"
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log("About Image 1 loaded successfully:", formData.aboutImage1Url);
                    }}
                    onError={(e) => {
                      console.error("Failed to load aboutImage1:", {
                        url: formData.aboutImage1Url,
                        fullUrl: `http://localhost:8000${formData.aboutImage1Url}`,
                      });
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm">No image selected</span>
                  </div>
                )}
                {(formData.aboutImage1 || formData.aboutImage1Url) && (
                  <button
                    onClick={() => handleDeleteImage("aboutImage1")}
                    disabled={deleting === "aboutImage1"}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete image"
                  >
                    {deleting === "aboutImage1" ? (
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
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Image 2
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="inline-block">
                  <input
                    key={`aboutImage2-${fileInputKey}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "aboutImage2")}
                  />
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
                    Choose File
                  </span>
                </label>
                <span className="text-sm text-gray-600">
                  {formData.aboutImage2 
                    ? formData.aboutImage2.name 
                    : formData.aboutImage2Url 
                      ? "Existing image" 
                      : "No file chosen"}
                </span>
              </div>
              <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
                {(() => {
                  console.log("Rendering About Image 2 - hasFile:", !!formData.aboutImage2, "hasUrl:", !!formData.aboutImage2Url, "urlValue:", formData.aboutImage2Url);
                  return null;
                })()}
                {formData.aboutImage2 ? (
                  <Image
                    src={URL.createObjectURL(formData.aboutImage2)}
                    alt="About Image 2 Preview"
                    fill
                    className="object-cover"
                  />
                ) : formData.aboutImage2Url ? (
                  <img
                    key={`about-img-2-${formData.aboutImage2Url}`}
                    src={`http://localhost:8000${formData.aboutImage2Url}`}
                    alt="About Image 2"
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log("About Image 2 loaded successfully:", formData.aboutImage2Url);
                    }}
                    onError={(e) => {
                      console.error("Failed to load aboutImage2:", {
                        url: formData.aboutImage2Url,
                        fullUrl: `http://localhost:8000${formData.aboutImage2Url}`,
                      });
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm">No image selected</span>
                  </div>
                )}
                {(formData.aboutImage2 || formData.aboutImage2Url) && (
                  <button
                    onClick={() => handleDeleteImage("aboutImage2")}
                    disabled={deleting === "aboutImage2"}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete image"
                  >
                    {deleting === "aboutImage2" ? (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AboutEditor.displayName = "AboutEditor";

export default AboutEditor;