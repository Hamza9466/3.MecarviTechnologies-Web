"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface LeftPanelImage {
  image: File | null;
  imageUrl: string | null;
}

interface TabContent {
  tag: string;
  heading: string;
  description: string;
  features: string[];
  buttonText: string;
  leftPanelImages: LeftPanelImage[];
}

interface Tab {
  id: number;
  title: string;
  content: TabContent;
  order: number;
  categoryTabId: number | null;
}

interface CategoryTab {
  id: number;
  category_name: string;
  order: number;
}

interface WhatWeDoEditorRef {
  save: () => Promise<void>;
}

const WhatWeDoEditor = forwardRef<WhatWeDoEditorRef>((props, ref) => {
  const [sectionTitle, setSectionTitle] = useState("What We Create");
  const [sectionBackgroundImage, setSectionBackgroundImage] = useState<File | null>(null);
  const [sectionBackgroundImageUrl, setSectionBackgroundImageUrl] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<number | null>(null);
  
  const [categoryTabs, setCategoryTabs] = useState<CategoryTab[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingBackground, setDeletingBackground] = useState(false);
  const [deletingTab, setDeletingTab] = useState<number | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<number | null>(null);

  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchSectionData();
    fetchCategoryTabs();
  }, []);

  // Fetch tabs when category is selected
  useEffect(() => {
    // Always reset selected tab when category changes
    setSelectedTab(null);
    
    if (selectedCategoryId) {
      console.log(`Category selected: ${selectedCategoryId}, fetching tabs...`);
      fetchTabsData(selectedCategoryId);
    } else {
      // If no category selected, you can optionally fetch all tabs
      // For now, we'll clear tabs when no category is selected
      setTabs([]);
      setSelectedTab(null);
    }
  }, [selectedCategoryId]);

  // Create empty tab when category has no tabs - allows direct editing without "Add New Tab" button
  useEffect(() => {
    if (selectedCategoryId && tabs.length === 0 && !loading) {
      const emptyTab = {
        id: 0, // Temporary ID for new tabs
        title: "New Tab",
        order: 1,
        categoryTabId: selectedCategoryId,
        content: {
          tag: "",
          heading: "",
          description: "",
          features: [""],
          buttonText: "Learn More",
          leftPanelImages: [
            { image: null, imageUrl: null },
          ],
        },
      };
      console.log("Creating empty tab for new category:", emptyTab);
      setTabs([emptyTab]);
      setSelectedTab(emptyTab.id);
    }
  }, [selectedCategoryId, tabs.length, loading]);

  const fetchSectionData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8000/api/v1/what-we-create-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSectionId(null);
          setSectionTitle("What We Create");
          setSectionBackgroundImageUrl(null);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch section data");
      }

      const data = await response.json();
      
      if (data.success && data.data?.what_we_create_section) {
        const section = data.data.what_we_create_section;
        setSectionId(section.id);
        setSectionTitle(section.section_title || "What We Create");
        setSectionBackgroundImageUrl(section.background_image || null);
      }
    } catch (err: any) {
      console.error("Error fetching section data:", err);
      setError(err.message || "Failed to load section data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryTabs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/category-tabs", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category tabs");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const categories = Array.isArray(data.data) ? data.data : (data.data.category_tabs || []);
        const sortedCategories = categories
          .map((cat: any) => ({
            id: cat.id,
            category_name: cat.category_name || "",
            order: cat.order || 0,
          }))
          .sort((a: CategoryTab, b: CategoryTab) => a.order - b.order);
        
        setCategoryTabs(sortedCategories);
        
        // Auto-select first category if available
        if (sortedCategories.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(sortedCategories[0].id);
        }
      }
    } catch (err: any) {
      console.error("Error fetching category tabs:", err);
    }
  };

  const fetchTabsData = async (categoryId?: number | null) => {
    try {
      setLoading(true);
      
      // Build URL with optional category filter
      const url = categoryId 
        ? `http://localhost:8000/api/v1/what-we-create-tabs?category_tab_id=${categoryId}`
        : `http://localhost:8000/api/v1/what-we-create-tabs`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        // If 404, return empty array (no tabs yet)
        if (response.status === 404) {
          setTabs([]);
          setSelectedTab(null);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch tabs data");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const tabsData = Array.isArray(data.data) ? data.data : (data.data.tabs || data.data.what_we_create_tabs || []);
        
        // Sort by order
        const sortedTabs = tabsData
          .map((tab: any) => ({
            id: tab.id,
            title: tab.tab_title || tab.title || "",
            order: tab.order || 0,
            categoryTabId: tab.category_tab_id || categoryId || null,
            content: {
              tag: tab.tag_label || tab.tag || "",
              heading: tab.main_heading || tab.heading || "",
              description: tab.description || "",
              features: Array.isArray(tab.features) 
                ? tab.features 
                : (typeof tab.features === 'string' 
                  ? (tab.features.startsWith('[') || tab.features.startsWith('{') 
                    ? JSON.parse(tab.features) 
                    : [tab.features])
                  : (tab.features ? [tab.features] : [])),
              buttonText: tab.button_text || tab.buttonText || "",
              leftPanelImages: [
                { image: null, imageUrl: tab.image_1 || null },
              ],
            },
          }))
          .sort((a: Tab, b: Tab) => a.order - b.order);
        
        // Since we're filtering by category_tab_id in the API query, all returned tabs should belong to this category
        // But let's double-check to ensure data integrity
        const filteredTabs = categoryId 
          ? sortedTabs.filter((tab: Tab) => (tab.categoryTabId === categoryId) || (!tab.categoryTabId && categoryId))
          : sortedTabs;
        
        console.log(`Fetched ${filteredTabs.length} tabs for category ${categoryId}:`, filteredTabs);
        
        setTabs(filteredTabs);
        // Always select first tab if tabs exist, or null if no tabs
        if (filteredTabs.length > 0) {
          // Check if currently selected tab belongs to this category
          const selectedTabBelongsToCategory = filteredTabs.some((tab: Tab) => tab.id === selectedTab);
          if (!selectedTabBelongsToCategory || !selectedTab) {
            setSelectedTab(filteredTabs[0].id);
          }
        } else {
          setSelectedTab(null);
        }
      } else {
        setTabs([]);
        setSelectedTab(null);
      }
    } catch (err: any) {
      console.error("Error fetching tabs data:", err);
      setError(err.message || "Failed to load tabs data");
      setTabs([]);
      setSelectedTab(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tabs (for reference or management)
  const fetchAllTabs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/what-we-create-tabs", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error("Failed to fetch all tabs");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const tabsData = Array.isArray(data.data) ? data.data : (data.data.tabs || data.data.what_we_create_tabs || []);
        return tabsData.map((tab: any) => ({
          id: tab.id,
          title: tab.tab_title || "",
          order: tab.order || 0,
          categoryTabId: tab.category_tab_id || null,
        }));
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching all tabs:", err);
      return [];
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

      if (sectionBackgroundImage) {
        sectionFormData.append("background_image", sectionBackgroundImage);
      }

      const isSectionUpdate = !!sectionId;
      const sectionUrl = isSectionUpdate 
        ? `http://localhost:8000/api/v1/what-we-create-section/${sectionId}`
        : "http://localhost:8000/api/v1/what-we-create-section";
      
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
      if (!sectionId && sectionResponseData.data?.what_we_create_section?.id) {
        setSectionId(sectionResponseData.data.what_we_create_section.id);
      }

      // Update background image URL from response
      const section = sectionResponseData.data?.what_we_create_section || sectionResponseData.what_we_create_section;
      if (section?.background_image) {
        setSectionBackgroundImageUrl(section.background_image);
        setSectionBackgroundImage(null);
      }

      // Save/update category tabs
      for (const category of categoryTabs) {
        await saveCategoryTab(category, token);
      }

      // Save/update tabs for selected category
      if (selectedCategoryId) {
        for (const tab of tabs) {
          console.log(`Saving tab for category ${selectedCategoryId}:`, tab);
          await saveTab(tab, selectedCategoryId, token);
        }
      }

      // Refresh data
      await fetchSectionData();
      await fetchCategoryTabs();
      
      // Always refresh tabs for the currently selected category after save
      if (selectedCategoryId) {
        console.log(`Refreshing tabs for category ${selectedCategoryId} after save`);
        await fetchTabsData(selectedCategoryId);
      } else {
        // If no category selected, fetch all tabs
        await fetchTabsData(null);
      }

      setSuccess("What We Create section saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error saving data:", err);
      setError(err.message || "Failed to save data");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const saveCategoryTab = async (category: CategoryTab, token: string) => {
    const body = {
      category_name: category.category_name || "",
      order: category.order,
    };

    const isUpdate = !!category.id;
    const url = isUpdate 
      ? `http://localhost:8000/api/v1/category-tabs/${category.id}`
      : "http://localhost:8000/api/v1/category-tabs";
    
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
      throw new Error(responseData.message || "Failed to save category tab");
    }

    const responseData = await response.json();
    const savedCategory = responseData.data?.category_tab || responseData.category_tab;
    
    // Update category with new ID if it was created
    if (!category.id && savedCategory?.id) {
      setCategoryTabs((prev) =>
        prev.map((c) =>
          c === category ? { ...c, id: savedCategory.id } : c
        )
      );
    }
  };

  const saveTab = async (tab: Tab, categoryId: number, token: string) => {
    const formData = new FormData();
    formData.append("category_tab_id", categoryId.toString());
    formData.append("tab_title", tab.title || "");
    formData.append("tag_label", tab.content.tag || "");
    formData.append("main_heading", tab.content.heading || "");
    formData.append("description", tab.content.description || "");
    formData.append("button_text", tab.content.buttonText || "");
    formData.append("order", tab.order.toString());

    // Append features as JSON string
    formData.append("features", JSON.stringify(tab.content.features.filter(f => f.trim() !== "")));

    // Append image if it exists
    if (tab.content.leftPanelImages[0]?.image) {
      formData.append("image_1", tab.content.leftPanelImages[0].image);
    }

    const isUpdate = !!tab.id;
    const url = isUpdate 
      ? `http://localhost:8000/api/v1/what-we-create-tabs/${tab.id}`
      : "http://localhost:8000/api/v1/what-we-create-tabs";
    
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
      throw new Error(responseData.message || "Failed to save tab");
    }

    const responseData = await response.json();
    const savedTab = responseData.data?.what_we_create_tab || responseData.what_we_create_tab;
    
    console.log(`Tab saved successfully:`, savedTab);
    
    // Update tab with new ID if it was created, and update image URLs
    if (!tab.id && savedTab?.id) {
      setTabs((prev) =>
        prev.map((t) =>
          t === tab ? {
            ...t,
            id: savedTab.id,
            order: savedTab.order || t.order,
            categoryTabId: savedTab.category_tab_id || categoryId,
            content: {
              ...t.content,
              leftPanelImages: [
                { image: null, imageUrl: savedTab.image_1 || null },
              ],
            },
          } : t
        )
      );
    } else if (savedTab) {
      // Update existing tab with new image URLs and ensure categoryTabId is correct
      setTabs((prev) =>
        prev.map((t) =>
          t.id === tab.id ? {
            ...t,
            order: savedTab.order || t.order,
            categoryTabId: savedTab.category_tab_id || categoryId,
            content: {
              ...t.content,
              leftPanelImages: [
                { image: null, imageUrl: savedTab.image_1 || t.content.leftPanelImages[0]?.imageUrl || null },
              ],
            },
          } : t
        )
      );
    }
  };

  // Expose save method to parent component
  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  const handleCategoryNameChange = (categoryId: number, value: string) => {
    setCategoryTabs((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, category_name: value } : cat))
    );
  };

  const handleAddCategory = () => {
    const maxOrder = categoryTabs.length > 0 
      ? Math.max(...categoryTabs.map((c) => c.order || 0))
      : 0;
    
    setCategoryTabs((prev) => [
      ...prev,
      {
        id: 0, // Temporary ID
        category_name: "New Category",
        order: maxOrder + 1,
      },
    ]);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (categoryTabs.length <= 1) {
      alert("You must have at least one category");
      return;
    }

    if (!categoryId || categoryId === 0) {
      // Just remove from state if it's a new category
      setCategoryTabs((prev) => prev.filter((cat) => cat.id !== categoryId));
      if (selectedCategoryId === categoryId) {
        const remainingCategories = categoryTabs.filter((c) => c.id !== categoryId);
        setSelectedCategoryId(remainingCategories.length > 0 ? remainingCategories[0].id : null);
      }
      return;
    }

    if (!confirm("Are you sure you want to delete this category? This will also delete all associated tabs.")) {
      return;
    }

    try {
      setDeletingCategory(categoryId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingCategory(null);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/category-tabs/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete category");
      }

      // Remove from state
      setCategoryTabs((prev) => prev.filter((cat) => cat.id !== categoryId));
      if (selectedCategoryId === categoryId) {
        const remainingCategories = categoryTabs.filter((c) => c.id !== categoryId);
        setSelectedCategoryId(remainingCategories.length > 0 ? remainingCategories[0].id : null);
      }

      setSuccess("Category deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setError(err.message || "Failed to delete category");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingCategory(null);
    }
  };

  const handleTabTitleChange = (tabId: number, value: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, title: value } : tab))
    );
  };

  const handleContentChange = (tabId: number, field: keyof TabContent, value: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              content: { ...tab.content, [field]: value },
            }
          : tab
      )
    );
  };

  const handleFeatureChange = (tabId: number, index: number, value: string) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === tabId) {
          const newFeatures = [...tab.content.features];
          newFeatures[index] = value;
          return {
            ...tab,
            content: { ...tab.content, features: newFeatures },
          };
        }
        return tab;
      })
    );
  };

  const handleAddFeature = (tabId: number) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === tabId) {
          return {
            ...tab,
            content: {
              ...tab.content,
              features: [...tab.content.features, ""],
            },
          };
        }
        return tab;
      })
    );
  };

  const handleRemoveFeature = (tabId: number, index: number) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === tabId) {
          const newFeatures = tab.content.features.filter((_, i) => i !== index);
          return {
            ...tab,
            content: { ...tab.content, features: newFeatures },
          };
        }
        return tab;
      })
    );
  };

  const handleLeftPanelImageChange = (tabId: number, imageIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === tabId) {
            const newImages = [...tab.content.leftPanelImages];
            newImages[imageIndex] = {
              image: e.target.files![0],
              imageUrl: null,
            };
            return {
              ...tab,
              content: {
                ...tab.content,
                leftPanelImages: newImages,
              },
            };
          }
          return tab;
        })
      );
    }
  };

  const handleSectionBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSectionBackgroundImage(e.target.files[0]);
      setSectionBackgroundImageUrl(null);
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

      const url = `http://localhost:8000/api/v1/what-we-create-section/${sectionId}/field/background_image`;

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

      setSectionBackgroundImage(null);
      setSectionBackgroundImageUrl(null);
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

  const handleDeleteTabImage = async (tabId: number, imageIndex: number) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab || !tab.id) {
      // Just clear from state if it's a new tab
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === tabId) {
            const newImages = [...t.content.leftPanelImages];
            newImages[imageIndex] = { image: null, imageUrl: null };
            return {
              ...t,
              content: { ...t.content, leftPanelImages: newImages },
            };
          }
          return t;
        })
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete this image?`)) {
      return;
    }

    try {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const imageField = `image_${imageIndex + 1}`;
      const url = `http://localhost:8000/api/v1/what-we-create-tabs/${tab.id}/field/${imageField}`;

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
        throw new Error(responseData.message || "Failed to delete image");
      }

      // Update state
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === tabId) {
            const newImages = [...t.content.leftPanelImages];
            newImages[imageIndex] = { image: null, imageUrl: null };
            return {
              ...t,
              content: { ...t.content, leftPanelImages: newImages },
            };
          }
          return t;
        })
      );

      // Refresh tabs data
      if (selectedCategoryId) {
        await fetchTabsData(selectedCategoryId);
      } else {
        await fetchTabsData(null);
      }

      setSuccess(`Image ${imageIndex + 1} deleted successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting image:", err);
      setError(err.message || "Failed to delete image");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleAddTab = () => {
    if (!selectedCategoryId) {
      alert("Please select a category first");
      return;
    }

    const maxOrder = tabs.length > 0 
      ? Math.max(...tabs.map((t) => t.order || 0))
      : 0;
    
    const newTab = {
      id: 0, // Temporary ID for new tabs
      title: "New Tab",
      order: maxOrder + 1,
      categoryTabId: selectedCategoryId,
      content: {
        tag: "",
        heading: "",
        description: "",
        features: [""],
        buttonText: "Learn More",
        leftPanelImages: [
          { image: null, imageUrl: null },
          { image: null, imageUrl: null },
          { image: null, imageUrl: null },
        ],
      },
    };
    
    setTabs((prev) => [...prev, newTab]);
    // Automatically select the newly created tab
    setSelectedTab(newTab.id);
  };

  const handleDeleteTab = async (tabId: number) => {
    if (tabs.length <= 1) {
      alert("You must have at least one tab");
      return;
    }

    if (!tabId || tabId === 0) {
      // Just remove from state if it's a new tab
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
      if (selectedTab === tabId) {
        const remainingTabs = tabs.filter((t) => t.id !== tabId);
        setSelectedTab(remainingTabs.length > 0 ? remainingTabs[0].id : null);
      }
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

      const response = await fetch(`http://localhost:8000/api/v1/what-we-create-tabs/${tabId}`, {
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
      if (selectedTab === tabId) {
        const remainingTabs = tabs.filter((t) => t.id !== tabId);
        setSelectedTab(remainingTabs.length > 0 ? remainingTabs[0].id : null);
      }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading section data...</div>
      </div>
    );
  }

  const selectedTabData = tabs.find((tab) => tab.id === selectedTab);

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
            placeholder="What We Create"
          />
        </div>
      </div>

      {/* Section Background Image */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Section Background Image</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label className="inline-block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleSectionBackgroundImageChange}
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
                Choose File
              </span>
            </label>
            <span className="text-sm text-gray-600">
              {sectionBackgroundImage
                ? sectionBackgroundImage.name
                : sectionBackgroundImageUrl
                  ? "Existing image"
                  : "No file chosen"}
            </span>
          </div>
          {(sectionBackgroundImage || sectionBackgroundImageUrl) && (
            <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
              {sectionBackgroundImage ? (
                <Image
                  src={URL.createObjectURL(sectionBackgroundImage)}
                  alt="Background Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              ) : sectionBackgroundImageUrl ? (
                <img
                  src={sectionBackgroundImageUrl.startsWith("http") || sectionBackgroundImageUrl.startsWith("/storage")
                    ? `http://localhost:8000${sectionBackgroundImageUrl}`
                    : sectionBackgroundImageUrl}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              ) : null}
              {(sectionBackgroundImage || sectionBackgroundImageUrl) && (
                <button
                  onClick={() => {
                    if (sectionBackgroundImageUrl && sectionId) {
                      handleDeleteBackgroundImage();
                    } else {
                      setSectionBackgroundImage(null);
                      setSectionBackgroundImageUrl(null);
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

      {/* Category Tabs Section */}
      <div className="space-y-6 pb-6 border-b border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 text-center mb-6">CATEGORY TABS</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTabs.map((category) => (
            <div key={category.id || `temp-${category.order}`} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-sm font-bold">
                  <span className="text-gray-900">CATEGORY # </span>
                  <span className="text-red-600">{category.id || category.order}</span>
                </h5>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={deletingCategory === category.id}
                    className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingCategory === category.id ? (
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

              <div>
                <input
                  type="text"
                  value={category.category_name}
                  onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm font-medium"
                  placeholder="Category Name"
                />
              </div>
            </div>
          ))}

          {/* Add New Category Card */}
          <button
            onClick={handleAddCategory}
            className="border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm flex items-center justify-center min-h-[120px] cursor-pointer hover:border-pink-500 transition-colors"
          >
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Category Selection */}
      {categoryTabs.length > 0 && (
        <div className="space-y-4 pb-6 border-b border-gray-200">
          <h4 className="text-xl font-bold text-gray-900 text-center mb-4">SELECT CATEGORY TO MANAGE TABS</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryTabs.map((category) => (
              <button
                key={category.id || `temp-${category.order}`}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategoryId === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.category_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TABS CONTENT Section */}
      {selectedCategoryId && (
        <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 text-center mb-6">TABS CONTENT</h4>


            {/* Tab Selection Buttons - Only show if more than one tab */}
            {tabs.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id || `temp-${tab.order}`}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTab === tab.id
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            )}

            {/* Content Area for Selected Tab or Empty Form */}
            {selectedTabData ? (
              <div className="space-y-6 border border-gray-200 rounded-lg p-6 bg-white">
                {/* Tag/Pill Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag / Pill Label
                  </label>
                  <input
                    type="text"
                    value={selectedTabData.content.tag}
                    onChange={(e) => handleContentChange(selectedTab!, "tag", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="See Visualization"
                  />
                </div>

                {/* Main Heading */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Heading
                  </label>
                  <input
                    type="text"
                    value={selectedTabData.content.heading}
                    onChange={(e) => handleContentChange(selectedTab!, "heading", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Insights drive action with confidence"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={selectedTabData.content.description}
                    onChange={(e) => handleContentChange(selectedTab!, "description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                    placeholder="Enter description text..."
                  />
                </div>

                {/* Features List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (Bullet Points)
                  </label>
                  <div className="space-y-2">
                    {selectedTabData.content.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(selectedTab!, index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder={`Feature ${index + 1}`}
                        />
                        <button
                          onClick={() => handleRemoveFeature(selectedTab!, index)}
                          className="w-8 h-8 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddFeature(selectedTab!)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={selectedTabData.content.buttonText}
                    onChange={(e) => handleContentChange(selectedTab!, "buttonText", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Learn More"
                  />
                </div>

                {/* Left Panel Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Left Panel Image (Visualization/Dashboard)
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedTabData.content.leftPanelImages.map((leftPanelImage, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-medium text-gray-600">
                            Image
                          </label>
                          {leftPanelImage.imageUrl && (
                            <button
                              onClick={() => handleDeleteTabImage(selectedTab!, index)}
                              className="text-red-600 hover:text-red-700 text-xs font-medium"
                              title="Delete image"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <label className="inline-block flex-1">
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleLeftPanelImageChange(selectedTab!, index, e)}
                              />
                              <span className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg cursor-pointer inline-block font-medium transition-colors text-xs w-full text-center">
                                Choose File
                              </span>
                            </label>
                          </div>
                          <span className="text-xs text-gray-600 text-center block">
                            {leftPanelImage.image
                              ? leftPanelImage.image.name
                              : leftPanelImage.imageUrl
                                ? "Existing image"
                                : "No file chosen"}
                          </span>
                          {(leftPanelImage.image || leftPanelImage.imageUrl) && (
                            <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200">
                              {leftPanelImage.image ? (
                                <Image
                                  src={URL.createObjectURL(leftPanelImage.image)}
                                  alt={`Left Panel Image ${index + 1} Preview`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover"
                                />
                              ) : leftPanelImage.imageUrl ? (
                                <img
                                  src={leftPanelImage.imageUrl.startsWith("http") || leftPanelImage.imageUrl.startsWith("/storage")
                                    ? `http://localhost:8000${leftPanelImage.imageUrl}`
                                    : leftPanelImage.imageUrl}
                                  alt={`Left Panel Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm flex flex-col items-center justify-center min-h-[400px] p-8">
                <div className="flex flex-col items-center gap-4">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-gray-600 text-lg">Select a tab above to edit its content</p>
                </div>
              </div>
            )}
          </div>
      )}

      {!selectedCategoryId && categoryTabs.length > 0 && (
        <div className="text-center py-8 text-gray-600">
          Please select a category above to manage its tabs
        </div>
      )}
    </div>
  );
});

WhatWeDoEditor.displayName = "WhatWeDoEditor";

export default WhatWeDoEditor;
