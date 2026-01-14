"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface ServiceCard {
  id: number;
  subtitle: string;
  description: string;
  image: File | null;
  imageUrl: string | null;
  order: number;
}

interface ServicesEditorRef {
  save: () => Promise<void>;
}

const ServicesEditor = forwardRef<ServicesEditorRef>((props, ref) => {
  const [formData, setFormData] = useState({
    subtitle: "",
    mainTitle: "",
    buttonText: "",
    backgroundImage: null as File | null,
    backgroundImageUrl: null as string | null,
  });

  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serviceSectionId, setServiceSectionId] = useState<number | null>(null);
  const [deletingCard, setDeletingCard] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [deletingBackground, setDeletingBackground] = useState(false);

  // Fetch service section data on mount
  useEffect(() => {
    fetchServiceSectionData();
    fetchServiceCards();
  }, []);

  const fetchServiceSectionData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8000/api/v1/service-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No data exists yet, use defaults
          setServiceSectionId(null);
          setFormData({
            subtitle: "Discover what we offer to help grow your business",
            mainTitle: "Our Services",
            buttonText: "View Services",
            backgroundImage: null,
            backgroundImageUrl: null,
          });
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch service section data");
      }

      const data = await response.json();
      
      if (data.success && data.data?.service_section) {
        const section = data.data.service_section;
        setServiceSectionId(section.id);
        
        setFormData({
          subtitle: section.subtitle || "",
          mainTitle: section.main_title || "",
          buttonText: section.button_text || "",
          backgroundImage: null,
          backgroundImageUrl: section.background_image || null,
        });
      }
    } catch (err: any) {
      console.error("Error fetching service section data:", err);
      setError(err.message || "Failed to load service section data");
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceCards = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/service-cards", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch service cards");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const cards = Array.isArray(data.data) ? data.data : (data.data.service_cards || []);
        setServiceCards(
          cards.map((card: any) => ({
            id: card.id,
            subtitle: card.subtitle || "",
            description: card.description || "",
            image: null,
            imageUrl: card.image || null,
            order: card.order || 0,
          }))
        );
      }
    } catch (err: any) {
      console.error("Error fetching service cards:", err);
      // Don't set error here, just log it
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to save service section data");
        setSaving(false);
        return;
      }

      // Save service section
      const formDataToSend = new FormData();
      formDataToSend.append("subtitle", formData.subtitle || "");
      formDataToSend.append("main_title", formData.mainTitle || "");
      formDataToSend.append("button_text", formData.buttonText || "");

      if (formData.backgroundImage) {
        formDataToSend.append("background_image", formData.backgroundImage);
      }

      const isUpdate = !!serviceSectionId;
      const url = isUpdate 
        ? `http://localhost:8000/api/v1/service-section/${serviceSectionId}`
        : "http://localhost:8000/api/v1/service-section";
      
      if (isUpdate) {
        formDataToSend.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      let responseData;
      const text = await response.text();
      responseData = text ? JSON.parse(text) : {};

      if (!response.ok) {
        let errorMessage = "Failed to save service section";
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }

      // Update service section ID if it was a create operation
      if (!serviceSectionId && responseData.data?.service_section?.id) {
        setServiceSectionId(responseData.data.service_section.id);
      }

      // Update background image URL from response
      const section = responseData.data?.service_section || responseData.service_section;
      if (section?.background_image) {
        setFormData((prev) => ({
          ...prev,
          backgroundImage: null,
          backgroundImageUrl: section.background_image,
        }));
      }

      // Save/update service cards
      for (const card of serviceCards) {
        await saveServiceCard(card, token);
      }

      // Refresh data
      await fetchServiceSectionData();
      await fetchServiceCards();

      setSuccess("Service section saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error saving service section:", err);
      setError(err.message || "Failed to save service section");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const saveServiceCard = async (card: ServiceCard, token: string) => {
    const formDataToSend = new FormData();
    formDataToSend.append("subtitle", card.subtitle || "");
    formDataToSend.append("description", card.description || "");
    formDataToSend.append("order", card.order.toString());

    if (card.image) {
      formDataToSend.append("image", card.image);
    }

    const isUpdate = !!card.id;
    const url = isUpdate 
      ? `http://localhost:8000/api/v1/service-cards/${card.id}`
      : "http://localhost:8000/api/v1/service-cards";
    
    if (isUpdate) {
      formDataToSend.append("_method", "PUT");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {};
      throw new Error(responseData.message || "Failed to save service card");
    }

    const responseData = await response.json();
    const savedCard = responseData.data?.service_card || responseData.service_card;
    
    // Update card with new ID if it was created
    if (!card.id && savedCard?.id) {
      setServiceCards((prev) =>
        prev.map((c) =>
          c === card ? { ...c, id: savedCard.id, image: null, imageUrl: savedCard.image || null } : c
        )
      );
    } else if (savedCard?.image) {
      // Update image URL if changed
      setServiceCards((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, image: null, imageUrl: savedCard.image } : c
        )
      );
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

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        backgroundImage: e.target.files![0],
        backgroundImageUrl: null,
      }));
    }
  };

  const handleCardChange = (cardId: number, field: string, value: string) => {
    setServiceCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    );
  };

  const handleCardImageChange = (cardId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setServiceCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, image: e.target.files![0], imageUrl: null } : card
        )
      );
    }
  };

  const handleAddCard = () => {
    const maxOrder = serviceCards.length > 0 
      ? Math.max(...serviceCards.map((c) => c.order || 0))
      : 0;
    
    setServiceCards((prev) => [
      ...prev,
      {
        id: 0, // Temporary ID for new cards
        subtitle: "",
        description: "",
        image: null,
        imageUrl: null,
        order: maxOrder + 1,
      },
    ]);
  };

  const handleDeleteBackgroundImage = async () => {
    if (!serviceSectionId) {
      setError("Service section ID not found");
      return;
    }

    if (!confirm("Are you sure you want to delete the background image?")) {
      return;
    }

    try {
      setDeletingBackground(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingBackground(false);
        return;
      }

      const url = `http://localhost:8000/api/v1/service-section/${serviceSectionId}/field/background_image`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      let responseData;
      const responseText = await response.text();
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        if (response.status === 204 || response.ok) {
          responseData = { success: true };
        } else {
          throw new Error("Invalid response from server");
        }
      }

      if (!response.ok) {
        let errorMessage = "Failed to delete background image";
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
      setFormData((prev) => ({
        ...prev,
        backgroundImage: null,
        backgroundImageUrl: null,
      }));

      // Refresh data from API to get updated state
      await fetchServiceSectionData();

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

  const handleDeleteCard = async (cardId: number) => {
    if (!cardId || cardId === 0) {
      // Just remove from state if it's a new card
      setServiceCards((prev) => prev.filter((c) => c.id !== cardId));
      return;
    }

    if (!confirm("Are you sure you want to delete this service card?")) {
      return;
    }

    try {
      setDeletingCard(cardId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingCard(null);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/service-cards/${cardId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete service card");
      }

      // Remove from state
      setServiceCards((prev) => prev.filter((c) => c.id !== cardId));
      setSuccess("Service card deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting service card:", err);
      setError(err.message || "Failed to delete service card");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingCard(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading service section data...</div>
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

      {/* Main Form Section */}
      <div className="space-y-6 pb-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Discover what we offer to help grow your business"
            />
          </div>

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
              placeholder="Our Services"
            />
          </div>
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
            placeholder="View Services"
          />
        </div>

        {/* Background Image Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image (Optional)
          </label>
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
                {formData.backgroundImage 
                  ? formData.backgroundImage.name 
                  : formData.backgroundImageUrl 
                    ? "Existing image" 
                    : "No file chosen"}
              </span>
            </div>
            {(formData.backgroundImage || formData.backgroundImageUrl) && (
              <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
                {formData.backgroundImage ? (
                  <Image
                    src={URL.createObjectURL(formData.backgroundImage)}
                    alt="Background Preview"
                    fill
                    className="object-cover"
                  />
                ) : formData.backgroundImageUrl ? (
                  <img
                    src={formData.backgroundImageUrl.startsWith("http") || formData.backgroundImageUrl.startsWith("/storage") 
                      ? `http://localhost:8000${formData.backgroundImageUrl}` 
                      : formData.backgroundImageUrl}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                ) : null}
                {(formData.backgroundImage || formData.backgroundImageUrl) && (
                  <button
                    onClick={() => {
                      if (formData.backgroundImageUrl && serviceSectionId) {
                        handleDeleteBackgroundImage();
                      } else {
                        // Just clear from state if it's a new upload
                        setFormData((prev) => ({
                          ...prev,
                          backgroundImage: null,
                          backgroundImageUrl: null,
                        }));
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
      </div>

      {/* Service Cards Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Service Cards</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {serviceCards.map((card) => (
            <div key={card.id || `temp-${card.order}`} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-pink-600">
                  SERVICE #{card.id || card.order}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    disabled={deletingCard === card.id}
                    className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingCard === card.id ? (
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

              {/* Icon/Image - Circular with pink border */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-pink-500 bg-white flex items-center justify-center overflow-hidden">
                  {card.image ? (
                    <Image
                      src={URL.createObjectURL(card.image)}
                      alt={card.subtitle}
                      width={60}
                      height={60}
                      className="object-contain p-2"
                    />
                  ) : card.imageUrl ? (
                    card.imageUrl.startsWith("http") || card.imageUrl.startsWith("/storage") ? (
                      <img
                        src={`http://localhost:8000${card.imageUrl}`}
                        alt={card.subtitle}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Image
                        src={card.imageUrl}
                        alt={card.subtitle}
                        width={60}
                        height={60}
                        className="object-contain p-2"
                        unoptimized
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCardImageChange(card.id, e)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>

              {/* Subtitle */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={card.subtitle}
                  onChange={(e) => handleCardChange(card.id, "subtitle", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={card.description}
                  onChange={(e) => handleCardChange(card.id, "description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white text-sm"
                />
              </div>
            </div>
          ))}

          {/* Add New Service Card */}
          <button
            onClick={handleAddCard}
            className="border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm flex items-center justify-center min-h-[300px] cursor-pointer hover:border-pink-500 transition-colors"
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

ServicesEditor.displayName = "ServicesEditor";

export default ServicesEditor;
