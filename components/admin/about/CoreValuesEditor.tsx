"use client";

import { useState, useEffect } from "react";

interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: File | null;
  iconUrl: string | null;
  order: number;
}

interface CoreValuesSection {
  id?: number;
  section_title: string;
  section_description: string;
}

export default function CoreValuesEditor() {
  const [section, setSection] = useState<CoreValuesSection>({ section_title: "", section_description: "" });
  const [sectionSaving, setSectionSaving] = useState(false);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null);

  useEffect(() => {
    fetchCoreValues();
    fetchCoreValuesSection();
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

  const fetchCoreValuesSection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/core-values-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.core_values_section) {
          const s = data.data.core_values_section;
          setSection({
            id: s.id,
            section_title: s.section_title ?? "",
            section_description: s.section_description ?? "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching core values section:", err);
    }
  };

  const handleSaveSection = async () => {
    const token = getToken();
    if (!token) {
      setError("Please login to save changes");
      return;
    }
    try {
      setSectionSaving(true);
      setError("");
      const response = await fetch("http://localhost:8000/api/v1/core-values-section", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section_title: section.section_title,
          section_description: section.section_description,
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save section");
      }
      setSuccess("Core Values section saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save section");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSectionSaving(false);
    }
  };

  const fetchCoreValues = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/core-values", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const values = Array.isArray(data.data) ? data.data : (data.data.core_values || []);
          const sortedValues = values
            .map((cv: any) => ({
              id: cv.id,
              title: cv.title || "",
              description: cv.description || "",
              icon: null,
              iconUrl: getImageUrl(cv.icon),
              order: cv.order || 0,
            }))
            .sort((a: CoreValue, b: CoreValue) => a.order - b.order);
          setCoreValues(sortedValues);
        }
      }
    } catch (err) {
      console.error("Error fetching core values:", err);
      setError("Failed to load core values");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (value: CoreValue) => {
    setEditingId(value.id);
    setEditingValue({ ...value });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue(null);
  };

  const handleSaveValue = async (value: CoreValue) => {
    const token = getToken();
    if (!token) {
      setError("Please login to save changes");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      const formDataToSend = new FormData();
      
      if (value.icon) {
        formDataToSend.append("icon", value.icon);
      } else if (value.iconUrl === null && value.id > 0) {
        formDataToSend.append("icon", "null");
      }

      formDataToSend.append("title", value.title || "");
      formDataToSend.append("description", value.description || "");
      formDataToSend.append("order", value.order.toString());

      const isUpdate = value.id > 0;
      const url = isUpdate
        ? `http://localhost:8000/api/v1/core-values/${value.id}`
        : "http://localhost:8000/api/v1/core-values";

      if (isUpdate) {
        formDataToSend.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save core value");
      }

      const data = await response.json();
      if (data.success) {
        const savedValue = data.data?.core_value || data.core_value;
        
        if (isUpdate) {
          setCoreValues((prev) =>
            prev.map((cv) =>
              cv.id === value.id
                ? {
                    ...cv,
                    title: savedValue.title || cv.title,
                    description: savedValue.description || cv.description,
                    iconUrl: getImageUrl(savedValue.icon) || cv.iconUrl,
                    icon: null,
                    order: savedValue.order || cv.order,
                  }
                : cv
            )
          );
        } else {
          setCoreValues((prev) => [
            ...prev,
            {
              id: savedValue.id,
              title: savedValue.title || "",
              description: savedValue.description || "",
              icon: null,
              iconUrl: getImageUrl(savedValue.icon),
              order: savedValue.order || prev.length + 1,
            },
          ]);
        }

        setSuccess("Core value saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setEditingId(null);
        setEditingValue(null);
      }
    } catch (err: any) {
      console.error("Error saving core value:", err);
      setError(err.message || "Failed to save core value");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this core value?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please login to delete");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`http://localhost:8000/api/v1/core-values/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete core value");
      }

      setCoreValues((prev) => prev.filter((cv) => cv.id !== id));
      setSuccess("Core value deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting core value:", err);
      setError(err.message || "Failed to delete core value");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    const maxOrder = coreValues.length > 0 ? Math.max(...coreValues.map((cv) => cv.order)) : 0;
    const newValue: CoreValue = {
      id: -Date.now(), // Temporary negative ID
      title: "Innovation",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, vitae consequuntur, laborum quas labore...",
      icon: null,
      iconUrl: null,
      order: maxOrder + 1,
    };
    setCoreValues((prev) => [...prev, newValue]);
    setEditingId(newValue.id);
    setEditingValue({ ...newValue });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading core values...</div>
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

      {/* Core Values Section (title + description above the list) */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Core Values Section (heading above the list)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={section.section_title}
              onChange={(e) => setSection((prev) => ({ ...prev, section_title: e.target.value }))}
              placeholder="e.g. Our Core Values"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
              style={{ color: "#111827", WebkitTextFillColor: "#111827", caretColor: "#111827" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Section Description</label>
            <input
              type="text"
              value={section.section_description}
              onChange={(e) => setSection((prev) => ({ ...prev, section_description: e.target.value }))}
              placeholder="e.g. These principles guide everything we do."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
              style={{ color: "#111827", WebkitTextFillColor: "#111827", caretColor: "#111827" }}
            />
          </div>
        </div>
        <button
          onClick={handleSaveSection}
          disabled={sectionSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
        >
          {sectionSaving ? "Saving..." : "Save Section"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coreValues.map((value, index) => (
          <div key={value.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            {editingId === value.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingValue?.title || ""}
                    onChange={(e) =>
                      setEditingValue((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                    style={{ 
                      color: '#111827', 
                      WebkitTextFillColor: '#111827',
                      caretColor: '#111827'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingValue?.description || ""}
                    onChange={(e) =>
                      setEditingValue((prev) => (prev ? { ...prev, description: e.target.value } : null))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                    style={{ 
                      color: '#111827', 
                      WebkitTextFillColor: '#111827',
                      caretColor: '#111827'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
                  <div className="flex items-center gap-2">
                    <label className="inline-block">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,image/svg+xml"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setEditingValue((prev) =>
                              prev ? { ...prev, icon: e.target.files![0], iconUrl: null } : null
                            );
                          }
                        }}
                      />
                      <span className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs cursor-pointer inline-block font-medium transition-colors">
                        Choose Icon
                      </span>
                    </label>
                    {(editingValue?.icon || editingValue?.iconUrl) && (
                      <div className="relative w-12 h-12 border border-gray-300 rounded overflow-hidden bg-gray-200">
                        <img
                          src={
                            editingValue.icon
                              ? URL.createObjectURL(editingValue.icon)
                              : editingValue.iconUrl || ""
                          }
                          alt="Icon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {editingValue?.iconUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingValue((prev) => (prev ? { ...prev, iconUrl: null, icon: null } : null))
                        }
                        className="text-red-600 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editingValue && handleSaveValue(editingValue)}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold">
                    <span className="text-pink-600">CORE VALUE #</span>
                    <span className="text-gray-900">{index + 1}</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(value)}
                      className="w-6 h-6 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(value.id)}
                      className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {value.iconUrl && (
                    <div className="relative w-16 h-16 border border-gray-300 rounded overflow-hidden bg-gray-200">
                      <img src={value.iconUrl} alt="Icon" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h4 className="font-bold text-gray-900">{value.title}</h4>
                  <p className="text-sm text-gray-700">{value.description}</p>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add New Card */}
        <div
          onClick={handleAddNew}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white shadow-sm flex items-center justify-center min-h-[200px] cursor-pointer hover:border-pink-500 transition-colors"
        >
          <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

