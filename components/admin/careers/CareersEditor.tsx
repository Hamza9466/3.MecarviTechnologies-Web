"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef, ReactElement } from "react";
import Image from "next/image";
import { useFAQSections } from "./useFAQSections";
import { useJobSections } from "./useJobSections";
import { useSupportSections } from "./useSupportSections";
import { useContactFormSubmissions } from "./useContactFormSubmissions";

interface CareersEditorRef {
  handleSaveHeroSection: () => Promise<void>;
}

const CareersEditor = forwardRef<CareersEditorRef, {}>((props, ref): ReactElement => {
  const [activeTab, setActiveTab] = useState("Hero Section");
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editJobFormData, setEditJobFormData] = useState({
    title: "",
    description: "",
    type: "",
    company: "",
    experience: "",
    image: null as File | null,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [heroSectionId, setHeroSectionId] = useState<number | null>(null);
  const [sectionTitle, setSectionTitle] = useState("Career Benefits");
  const [careerCards, setCareerCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });

  // Job edit form functions
  const handleOpenEditForm = (job: any) => {
    setEditingJobId(job.id);
    setEditJobFormData({
      title: job.title,
      description: job.description,
      type: job.type,
      company: job.company,
      experience: job.experience,
      image: null,
    });
    console.log("Opening edit form for job:", job);
  };

  const handleCloseEditForm = () => {
    setEditingJobId(null);
    setEditJobFormData({
      title: "",
      description: "",
      type: "",
      company: "",
      experience: "",
      image: null,
    });
  };

  const handleSaveEditForm = async () => {
    if (!editingJobId) return;

    try {
      console.log("Saving edit form with data:", editJobFormData);
      await handleUpdateJobSection(editingJobId, {
        ...editJobFormData,
        is_active: true,
        sort_order: 1, // Add sort_order
      });
      handleCloseEditForm();
    } catch (err) {
      console.error("Error saving edit form:", err);
    }
  };
  const {
    jobs,
    jobsSectionTitle,
    jobsSectionDescription,
    setJobsSectionTitle,
    setJobsSectionDescription,
    loading: jobsLoading,
    success: jobsSuccess,
    error: jobsError,
    handleSaveJobSection,
    handleUpdateJobSection,
    handleDeleteJobSection,
    handleDeleteJobImage,
    handleImageChange,
    fetchJobSections,
  } = useJobSections();

  const {
    faqs,
    sectionTitle: faqSectionTitle,
    setSectionTitle: setFaqSectionTitle,
    loading: faqsLoading,
    success: faqsSuccess,
    error: faqsError,
    fetchFAQSections,
    handleCreateFAQSection,
    handleUpdateFAQSection,
    handleDeleteFAQSection,
    handleDeleteFAQField,
    clearMessages: clearFAQMessages,
  } = useFAQSections();

  const {
    currentSupportSection,
    loading: supportLoading,
    success: supportSuccess,
    error: supportError,
    fetchSupportSections,
    fetchSupportSection,
    handleCreateSupportSection,
    handleUpdateSupportSection,
    handleDeleteSupportSection,
    handleDeleteSupportField,
    clearMessages: clearSupportMessages,
  } = useSupportSections();

  const {
    contactSubmissions,
    statistics,
    pagination,
    loading: contactLoading,
    error: contactError,
    success: contactSuccess,
    fetchContactSubmissions,
    fetchStatistics,
    markAsRead,
    markAsUnread,
    deleteSubmission,
    clearMessages: clearContactMessages,
  } = useContactFormSubmissions();

  // Fetch career cards on component mount
  useEffect(() => {
    fetchCareerCards();
  }, []);

  // Fetch FAQ sections on component mount
  useEffect(() => {
    fetchFAQSections();
  }, []);

  // Fetch support sections on component mount
  useEffect(() => {
    fetchSupportSections();
  }, []);

  // Fetch contact form submissions and statistics on component mount
  useEffect(() => {
    fetchContactSubmissions();
    fetchStatistics();
  }, []);

  // Update support data when currentSupportSection changes
  useEffect(() => {
    if (currentSupportSection) {
      const updatedData = {
        sectionTitle: currentSupportSection.section_title || "",
        title: currentSupportSection.title || "",
        description: currentSupportSection.description || "",
        callIcon: currentSupportSection.call_icon ? `http://localhost:8000/storage/${currentSupportSection.call_icon}` : null,
        callTitle: currentSupportSection.call_title || "",
        callDescription: currentSupportSection.call_description || "",
        callPhone: currentSupportSection.call_phone || "",
        emailIcon: currentSupportSection.email_icon ? `http://localhost:8000/storage/${currentSupportSection.email_icon}` : null,
        emailTitle: currentSupportSection.email_title || "",
        emailDescription: currentSupportSection.email_description || "",
        emailAddress: currentSupportSection.email_address || "",
      };

      const currentData = {
        sectionTitle: supportData.sectionTitle,
        title: supportData.title,
        description: supportData.description,
        callIcon: supportData.callIcon,
        callTitle: supportData.callTitle,
        callDescription: supportData.callDescription,
        callPhone: supportData.callPhone,
        emailIcon: supportData.emailIcon,
        emailTitle: supportData.emailTitle,
        emailDescription: supportData.emailDescription,
        emailAddress: supportData.emailAddress,
      };

      const hasChanged = JSON.stringify(updatedData) !== JSON.stringify(currentData);

      if (hasChanged) {
        console.log("Data changed, updating supportData");
        setSupportData(updatedData);
      }
    } else {
      // No support section data - clear form
      setSupportData({
        sectionTitle: "",
        title: "",
        description: "",
        callIcon: null,
        callTitle: "",
        callDescription: "",
        callPhone: "",
        emailIcon: null,
        emailTitle: "",
        emailDescription: "",
        emailAddress: "",
      });
    }
  }, [currentSupportSection]);

  const fetchCareerCards = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/career-cards", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.career_cards) {
          const cards = data.data.career_cards;
          setCareerCards(cards.map((card: any) => ({
            id: card.id,
            title: card.title,
            description: card.description,
            section_title: card.section_title,
            imageUrl: card.image,
            is_active: card.is_active,
            sort_order: card.sort_order,
            image: null as File | null,
          })));

          // Set section title from the first card if available
          if (cards.length > 0 && cards[0].section_title) {
            setSectionTitle(cards[0].section_title);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching career cards:", err);
    }
  };

  const handleSaveCareerCard = async (cardId: number, cardData: any) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      // Validate required fields
      if (!cardData.title || !cardData.title.trim()) {
        setError("Title is required");
        return;
      }

      // Validate image size if present
      if (cardData.image && cardData.image.size > 2048 * 1024) {
        setError("Image size must not be greater than 2MB");
        return;
      }

      const formData = new FormData();
      formData.append("section_title", sectionTitle);
      formData.append("title", cardData.title);
      formData.append("description", cardData.description || "");
      if (cardData.image) {
        formData.append("image", cardData.image);
      }
      formData.append("is_active", cardData.is_active ? "true" : "false");
      formData.append("sort_order", cardData.sort_order || "1");

      console.log("Saving career card with data:", {
        section_title: sectionTitle,
        title: cardData.title,
        description: cardData.description,
        is_active: cardData.is_active,
        sort_order: cardData.sort_order,
        hasImage: !!cardData.image,
        imageSize: cardData.image ? `${(cardData.image.size / 1024 / 1024).toFixed(2)}MB` : 'No image'
      });

      const response = await fetch("http://localhost:8000/api/v1/career-cards", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      console.log("Save response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Save response data:", responseData);

        if (responseData.success) {
          setSuccess("Career card saved successfully!");
          setTimeout(() => setSuccess(""), 3000);
          fetchCareerCards(); // Refresh cards
        } else {
          throw new Error(responseData.message || "Failed to save career card");
        }
      } else {
        const errorText = await response.text();
        console.error("Save error response:", errorText);
        throw new Error(`Failed to save career card: ${errorText}`);
      }
    } catch (err) {
      console.error("Error saving career card:", err);
      setError(err instanceof Error ? err.message : "Failed to save career card");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCareerCard = async (cardId: number, cardData: any) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      // Validate required fields
      if (!cardData.title || !cardData.title.trim()) {
        setError("Title is required");
        return;
      }

      const formData = new FormData();
      formData.append("section_title", sectionTitle);
      formData.append("title", cardData.title);
      formData.append("description", cardData.description || "");
      if (cardData.image) {
        formData.append("image", cardData.image);
      }
      formData.append("is_active", cardData.is_active ? "true" : "false");
      formData.append("sort_order", cardData.sort_order || "1");
      formData.append("_method", "PUT"); // Laravel method spoofing

      console.log("Updating career card with data:", {
        id: cardId,
        section_title: sectionTitle,
        title: cardData.title,
        description: cardData.description,
        is_active: cardData.is_active,
        sort_order: cardData.sort_order,
        hasImage: !!cardData.image
      });

      const response = await fetch(`http://localhost:8000/api/v1/career-cards/${cardId}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      console.log("Update response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Update response data:", responseData);

        if (responseData.success) {
          setSuccess("Career card updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
          fetchCareerCards(); // Refresh cards
        } else {
          throw new Error(responseData.message || "Failed to update career card");
        }
      } else {
        const errorText = await response.text();
        console.error("Update error response:", errorText);
        throw new Error(`Failed to update career card: ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating career card:", err);
      setError(err instanceof Error ? err.message : "Failed to update career card");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCareerCard = async (cardId: number) => {
    if (!confirm("Are you sure you want to delete this career card?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8000/api/v1/career-cards/${cardId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setSuccess("Career card deleted successfully!");
          setTimeout(() => setSuccess(""), 3000);
          fetchCareerCards(); // Refresh cards
        }
      } else {
        throw new Error("Failed to delete career card");
      }
    } catch (err) {
      console.error("Error deleting career card:", err);
      setError(err instanceof Error ? err.message : "Failed to delete career card");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCardImage = async (cardId: number) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8000/api/v1/career-cards/${cardId}/field/image`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setSuccess("Card image deleted successfully!");
          setTimeout(() => setSuccess(""), 3000);
          fetchCareerCards(); // Refresh cards
        }
      } else {
        throw new Error("Failed to delete card image");
      }
    } catch (err) {
      console.error("Error deleting card image:", err);
      setError(err instanceof Error ? err.message : "Failed to delete card image");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = (card: any) => {
    console.log("Edit button clicked for card:", card);
    setEditingCard(card.id);
    setEditFormData({
      title: card.title,
      description: card.description,
      image: null as File | null,
    });
    console.log("Editing card set to:", card.id);
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setEditFormData({
      title: "",
      description: "",
      image: null as File | null,
    });
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setAddFormData({
      title: "",
      description: "",
      image: null as File | null,
    });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setAddFormData({
      title: "",
      description: "",
      image: null as File | null,
    });
  };

  const handleSaveAdd = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      // Validate required fields
      if (!addFormData.title || !addFormData.title.trim()) {
        setError("Title is required");
        return;
      }

      // Validate image size if present
      if (addFormData.image && addFormData.image.size > 2048 * 1024) {
        setError("Image size must not be greater than 2MB");
        return;
      }

      const formData = new FormData();
      formData.append("section_title", sectionTitle);
      formData.append("title", addFormData.title.trim());
      formData.append("description", addFormData.description || "");
      if (addFormData.image) {
        formData.append("image", addFormData.image);
      }
      formData.append("is_active", "true");
      formData.append("sort_order", (careerCards.length + 1).toString());

      console.log("Adding new career card with data:", {
        section_title: sectionTitle,
        title: addFormData.title,
        description: addFormData.description,
        hasImage: !!addFormData.image,
        imageSize: addFormData.image ? `${(addFormData.image.size / 1024 / 1024).toFixed(2)}MB` : 'No image'
      });

      const response = await fetch("http://localhost:8000/api/v1/career-cards", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      console.log("Add response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Add response data:", responseData);

        if (responseData.success) {
          setSuccess("Career card added successfully!");
          setTimeout(() => setSuccess(""), 3000);
          fetchCareerCards(); // Refresh cards
          handleCancelAdd(); // Close add form
        } else {
          throw new Error(responseData.message || "Failed to add career card");
        }
      } else {
        const errorText = await response.text();
        console.error("Add error response:", errorText);
        throw new Error(`Failed to add career card: ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding career card:", err);
      setError(err instanceof Error ? err.message : "Failed to add career card");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      // Validate required fields
      if (!editFormData.title || !editFormData.title.trim()) {
        setError("Title is required");
        return;
      }

      // Validate image size if present
      if (editFormData.image && editFormData.image.size > 2048 * 1024) {
        setError("Image size must not be greater than 2MB");
        return;
      }

      const formData = new FormData();
      formData.append("section_title", sectionTitle);
      formData.append("title", editFormData.title.trim());
      formData.append("description", editFormData.description || "");
      if (editFormData.image) {
        formData.append("image", editFormData.image);
      }
      formData.append("is_active", "true");
      formData.append("sort_order", "1");
      formData.append("_method", "PUT");

      console.log("Updating career card with data:", {
        id: editingCard,
        section_title: sectionTitle,
        title: editFormData.title,
        description: editFormData.description,
        hasImage: !!editFormData.image,
        imageSize: editFormData.image ? `${(editFormData.image.size / 1024 / 1024).toFixed(2)}MB` : 'No image'
      });

      const response = await fetch(`http://localhost:8000/api/v1/career-cards/${editingCard}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      console.log("Update response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Update response data:", responseData);

        if (responseData.success) {
          setSuccess("Career card updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
          fetchCareerCards(); // Refresh cards
          handleCancelEdit(); // Close edit form
        } else {
          throw new Error(responseData.message || "Failed to update career card");
        }
      } else {
        const errorText = await response.text();
        console.error("Update error response:", errorText);
        throw new Error(`Failed to update career card: ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating career card:", err);
      setError(err instanceof Error ? err.message : "Failed to update career card");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHeroImage = async () => {
    if (!heroSectionId) {
      setError("Hero section ID not found");
      return;
    }

    if (!confirm("Are you sure you want to delete the hero image?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8000/api/v1/career-page-hero-section/${heroSectionId}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          image: null, // Set image to null to delete it
        }),
      });

      if (response.ok) {
        setGeneralData({ ...generalData, imageUrl: null });
        setSuccess("Hero image deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("Failed to delete hero image");
      }
    } catch (err) {
      console.error("Error deleting hero image:", err);
      setError(err instanceof Error ? err.message : "Failed to delete hero image");
    }
  };

  const tabs = [
    "Hero Section",
    "Career Cards",
    "Procedure",
    "Jobs",
    "FAQ",
    "Support",
  ];

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Life Insurance Update",
      description: "We offer a variety of life insurance options which gives peace of mind & financial security to you a",
      imageUrl: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
      image: null as File | null,
    },
    {
      id: 2,
      name: "Life Insurance",
      description: "We offer a variety of life insurance options which gives peace of mind & financial security to you a",
      imageUrl: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
      image: null as File | null,
    },
    {
      id: 3,
      name: "Testttt",
      description: "We offer a variety of life insurance options which give peace of mind & financial security to you",
      imageUrl: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
      image: null as File | null,
    },
    {
      id: 4,
      name: "Life Insuran",
      description: "We offer a variety of insurance options which gives peace of mind & financial security to you",
      imageUrl: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
      image: null as File | null,
    },
    {
      id: 5,
      name: "Testing Final",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the",
      imageUrl: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
      image: null as File | null,
    },
  ]);

  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [editFaqFormData, setEditFaqFormData] = useState({
    section_title: "",
    question: "",
    answer: "",
    image: null as File | null,
  });

  // FAQ editing functions
  const handleOpenEditFaq = (faq: any) => {
    setEditingFaqId(faq.id);
    setEditFaqFormData({
      section_title: faq.section_title || "",
      question: faq.question || "",
      answer: faq.answer || "",
      image: null,
    });
  };

  const handleCloseEditFaq = () => {
    setEditingFaqId(null);
    setEditFaqFormData({
      section_title: "",
      question: "",
      answer: "",
      image: null,
    });
  };

  const handleSaveEditFaq = async () => {
    if (!editingFaqId) return;

    try {
      await handleUpdateFAQSection(editingFaqId, {
        ...editFaqFormData,
        is_active: true,
        sort_order: 1,
      });
      handleCloseEditFaq();
    } catch (err) {
      console.error("Error saving FAQ:", err);
    }
  };

  const handleAddNewFaq = async () => {
    console.log("Add FAQ button clicked!");
    console.log("Current faqSectionTitle:", faqSectionTitle);
    console.log("Current faqs length:", faqs.length);
    console.log("handleCreateFAQSection function:", typeof handleCreateFAQSection);

    try {
      const result = await handleCreateFAQSection({
        section_title: faqSectionTitle || "FAQ Section",
        question: "New Question",
        answer: "New answer here...",
        is_active: true,
        sort_order: faqs.length + 1,
      });
      console.log("FAQ created successfully:", result);
    } catch (err) {
      console.error("Error adding FAQ:", err);
    }
  };

  const handleSaveSupportSection = async () => {
    if (!currentSupportSection) {
      console.error("No support section to update");
      return;
    }

    try {
      // Convert full URLs back to relative paths for the API
      const convertImageUrl = (imageUrl: string | null) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('http://localhost:8000/storage/')) {
          return imageUrl.replace('http://localhost:8000/storage/', '');
        }
        return imageUrl;
      };

      const saveData = {
        section_title: supportData.sectionTitle,
        title: supportData.title,
        description: supportData.description,
        call_icon: convertImageUrl(supportData.callIcon),
        call_title: supportData.callTitle,
        call_description: supportData.callDescription,
        call_phone: supportData.callPhone,
        email_icon: convertImageUrl(supportData.emailIcon),
        email_title: supportData.emailTitle,
        email_description: supportData.emailDescription,
        email_address: supportData.emailAddress,
        is_active: true,
        sort_order: 1,
      };

      console.log("Saving support section with data:", saveData);

      let result;
      if (currentSupportSection.id === 0) {
        // Create new section if we have temporary ID
        result = await handleCreateSupportSection(saveData);
      } else {
        // Update existing section
        result = await handleUpdateSupportSection(currentSupportSection.id, saveData);
      }

      // After successful save, refresh the data to get the latest from database
      if (result) {
        console.log("Save successful, refreshing data...");
        await fetchSupportSections();
      }
    } catch (err) {
      console.error("Error saving support section:", err);
    }
  };


  const [factsData, setFactsData] = useState({
    yearsInBusiness: "15",
    subHeading: "years in business",
    buttonText: "Our Promise",
    description: "We help you scale your vision and services through thoughtful planning and consultation",
  });

  const [supportData, setSupportData] = useState({
    sectionTitle: "",
    title: "",
    description: "",
    callIcon: null as string | null,
    callTitle: "",
    callDescription: "",
    callPhone: "",
    emailIcon: null as string | null,
    emailTitle: "",
    emailDescription: "",
    emailAddress: "",
  });

  const [jobApplications, setJobApplications] = useState([
    {
      id: 1,
      full_name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      job_location: "New York",
      preferred_contact_method: "Email",
      best_time_to_contact: "Morning",
      message: "I am interested in the software developer position.",
    },
    {
      id: 2,
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      job_location: "San Francisco",
      preferred_contact_method: "Phone",
      best_time_to_contact: "Afternoon",
      message: "Looking forward to applying for the designer role.",
    },
  ]);

  const [facts, setFacts] = useState([
    {
      id: 1,
      label: "Satisfaction Rate",
      value: "99",
    },
    {
      id: 2,
      label: "Testing 2",
      value: "345",
    },
    {
      id: 3,
      label: "Testingg",
      value: "234",
    },
  ]);

  const [promisePoints, setPromisePoints] = useState([
    {
      id: 1,
      label: "Information Collection",
      value: "Excuse Deal say over contain performance from comparison new melancholy themselves.",
    },
    {
      id: 2,
      label: "Projection Report Analysis",
      value: "Excuse Deal say over contain performance from comparison new melancholy themselves.",
    },
    {
      id: 3,
      label: "Consultation Solution",
      value: "Excuse Deal say over contain performance from comparison new melancholy themselves.",
    },
  ]);

  const [generalData, setGeneralData] = useState({
    title: "Build Your Career With Us",
    subtitle: "Join our team and grow professionally",
    heading: "Career Opportunities",
    description: "Discover exciting career opportunities and join our dynamic team of professionals",
    image: null as File | null,
    imageUrl: null as string | null,
  });

  // Fetch hero section data on component mount
  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/career-page-hero-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.career_page_hero_section) {
          const heroData = data.data.career_page_hero_section;
          setHeroSectionId(heroData.id);
          setGeneralData({
            title: heroData.title || "Build Your Career With Us",
            subtitle: heroData.subtitle || "Join our team and grow professionally",
            heading: heroData.heading || "Career Opportunities",
            description: heroData.description || "Discover exciting career opportunities and join our dynamic team of professionals",
            image: null,
            imageUrl: heroData.image || null,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching hero section:", err);
      setError("Failed to load hero section data");
    }
  };

  const handleSaveHeroSection = async () => {
    console.log("handleSaveHeroSection called");
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", generalData.title);
      formDataToSend.append("subtitle", generalData.subtitle);
      formDataToSend.append("heading", generalData.heading);
      formDataToSend.append("description", generalData.description);

      // Only append image if it's a new file
      if (generalData.image) {
        formDataToSend.append("image", generalData.image);
        console.log("Image appended:", generalData.image.name);
        console.log("Image file details:", {
          name: generalData.image.name,
          size: generalData.image.size,
          type: generalData.image.type
        });
      }

      // Debug FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, { name: value.name, size: value.size, type: value.type });
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Determine the correct method and URL based on whether we have a heroSectionId
      const isUpdate = heroSectionId !== null;
      const url = isUpdate
        ? `http://localhost:8000/api/v1/career-page-hero-section/${heroSectionId}`
        : "http://localhost:8000/api/v1/career-page-hero-section";

      console.log("Save request:", { isUpdate, heroSectionId, url });

      const response = await fetch(url, {
        method: "POST", // Use POST for both create and update (Laravel style)
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (responseData.success && responseData.data?.career_page_hero_section) {
          const heroData = responseData.data.career_page_hero_section;

          // Update heroSectionId if this was a new record
          if (!isUpdate && heroData.id) {
            setHeroSectionId(heroData.id);
          }

          // Update form data with new image URL and clear file object
          setGeneralData((prev) => ({
            ...prev,
            image: null,
            imageUrl: heroData.image || prev.imageUrl,
          }));

          setSuccess("Hero section saved successfully!");
          setTimeout(() => setSuccess(""), 3000);
        }
      } else {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(errorData || "Failed to save hero section");
      }
    } catch (err) {
      console.error("Error saving hero section:", err);
      setError(err instanceof Error ? err.message : "Failed to save hero section");
    } finally {
      setLoading(false);
    }
  };

  const [procedures, setProcedures] = useState([
    {
      id: 1,
      name: "Apply Test",
      description: "Explain your requirements by selecting your preferred service and get quotation for your order. We",
      imageUrl: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
      image: null as File | null,
    },
    {
      id: 2,
      name: "Apply",
      description: "Explain your requirements by selecting your preferred service and get quotation for your order. We",
      imageUrl: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
      image: null as File | null,
    },
    {
      id: 3,
      name: "Test",
      description: "the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently wit",
      imageUrl: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
      image: null as File | null,
    },
  ]);


  // Expose the save method to parent component
  useImperativeHandle(ref, () => ({
    handleSaveHeroSection,
    saveJobsSection: async () => {
      // Save Jobs section title and description
      console.log("Saving Jobs section data:", {
        title: jobsSectionTitle,
        description: jobsSectionDescription
      });

      // Update all existing job sections with the new section title and description
      for (const job of jobs) {
        try {
          await handleUpdateJobSection(job.id, {
            title: job.title,
            description: job.description,
            type: job.type,
            company: job.company,
            experience: job.experience,
            image: job.image,
            is_active: true,
            sort_order: 1,
          });
        } catch (err) {
          console.error("Error updating job section:", job.id, err);
        }
      }
    },
  }));

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab
              ? "bg-pink-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === "Hero Section" && (
        <div>
          <h3 className="text-2xl font-bold text-pink-600 mb-6">Edit Career Hero Section</h3>

          {/* Success and Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={generalData.title}
                onChange={(e) => setGeneralData({ ...generalData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={generalData.subtitle}
                onChange={(e) => setGeneralData({ ...generalData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={generalData.heading}
                onChange={(e) => setGeneralData({ ...generalData, heading: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={generalData.description}
                onChange={(e) => setGeneralData({ ...generalData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <div className="flex flex-col gap-3">
                {/* Image Preview */}
                {(generalData.imageUrl || generalData.image) && (
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      {generalData.image ? (
                        <img
                          src={URL.createObjectURL(generalData.image)}
                          alt="Hero section preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : generalData.imageUrl ? (
                        <img
                          src={generalData.imageUrl.startsWith('http') ? generalData.imageUrl : `http://localhost:8000${generalData.imageUrl}`}
                          alt="Hero section"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : null}
                    </div>
                    <div className="text-sm text-gray-600">
                      {generalData.image ? "New image selected" : "Current image"}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setGeneralData({ ...generalData, image: e.target.files[0] });
                        }
                      }}
                    />
                    <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors">
                      Choose File
                    </span>
                  </label>
                  <span className="text-sm text-gray-600">
                    {generalData.image ? generalData.image.name : "No file chosen"}
                  </span>

                  {/* Delete Button */}
                  {generalData.imageUrl && (
                    <button
                      onClick={handleDeleteHeroImage}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Delete Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {activeTab === "Career Cards" && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Career Cards Section</h3>

          {/* Section Title Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Enter section title"
            />
          </div>

          {/* Success and Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Add New Career Card Button */}
          <div className="mb-6">
            <button
              onClick={handleShowAddForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add New Career Card
            </button>
          </div>

          {/* Add New Card Form */}
          {showAddForm && (
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Career Card</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={addFormData.title}
                    onChange={(e) => {
                      console.log("Title input changed:", e.target.value);
                      setAddFormData({ ...addFormData, title: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={addFormData.description}
                    onChange={(e) => {
                      console.log("Description input changed:", e.target.value);
                      setAddFormData({ ...addFormData, description: e.target.value });
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      console.log("File input changed:", e.target.files);
                      if (e.target.files && e.target.files[0]) {
                        console.log("Selected file:", e.target.files[0]);
                        setAddFormData({ ...addFormData, image: e.target.files[0] });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  {addFormData.image && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {addFormData.image.name} ({(addFormData.image.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Add Card button clicked, form data:", addFormData);
                      handleSaveAdd();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Card
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Cancel button clicked");
                      handleCancelAdd();
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Career Cards Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-b-pink-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerCards.map((card) => (
                <div key={card.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  {editingCard === card.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Career Card</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder="Enter title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                          placeholder="Enter description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setEditFormData({ ...editFormData, image: e.target.files[0] });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                        />
                        {editFormData.image && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {editFormData.image.name} ({(editFormData.image.size / 1024 / 1024).toFixed(2)}MB)
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {card.title}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              console.log("Edit button clicked, card:", card);
                              handleEditCard(card);
                            }}
                            className="w-6 h-6 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCareerCard(card.id)}
                            className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        {card.description}
                      </p>

                      {/* Card Image */}
                      <div className="flex justify-center mb-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleUpdateCareerCard(card.id, { ...card, image: e.target.files[0] });
                              }
                            }}
                          />
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                            {card.imageUrl ? (
                              <img
                                src={card.imageUrl.startsWith('http') ? card.imageUrl : `http://localhost:8000${card.imageUrl}`}
                                alt={card.title}
                                className="w-32 h-32 object-cover"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586 4.586a2 2 0 100-4 4.586L12 19a2 2 0 100-4 4.586L7.414 16a2 2 0 100-4 4.586z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* Delete Image Button */}
                      {card.imageUrl && (
                        <button
                          onClick={() => handleDeleteCardImage(card.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Delete Image
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "FAQ" && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">FAQ Section</h3>

          {/* FAQ Section Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={faqSectionTitle}
              onChange={(e) => setFaqSectionTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter FAQ section title"
            />
          </div>

          {/* Success/Error Messages */}
          {faqsSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {faqsSuccess}
            </div>
          )}
          {faqsError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {faqsError}
            </div>
          )}

          {/* FAQ Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                {editingFaqId === faq.id ? (
                  // Edit Form
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editFaqFormData.section_title}
                      onChange={(e) => setEditFaqFormData({ ...editFaqFormData, section_title: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Section Title"
                    />
                    <input
                      type="text"
                      value={editFaqFormData.question}
                      onChange={(e) => setEditFaqFormData({ ...editFaqFormData, question: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Question"
                    />
                    <textarea
                      value={editFaqFormData.answer}
                      onChange={(e) => setEditFaqFormData({ ...editFaqFormData, answer: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm h-20"
                      placeholder="Answer"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEditFaq}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCloseEditFaq}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-bold">
                        <span className="text-pink-600">FAQ #</span>
                        <span className="text-gray-900">{faq.id}</span>
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditFaq(faq)}
                          className="w-6 h-6 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteFAQSection(faq.id)}
                          className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Question */}
                    <h5 className="font-bold text-gray-900 mb-2">{faq.question}</h5>

                    {/* Answer */}
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </>
                )}
              </div>
            ))}

            {/* Add New FAQ Card */}
            <div
              onClick={(e) => {
                console.log("Plus button clicked!");
                e.preventDefault();
                e.stopPropagation();
                handleAddNewFaq();
              }}
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
      )}

      {activeTab === "Jobs" && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Jobs Section</h3>

          {/* Success and Error Messages */}
          {jobsSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {jobsSuccess}
            </div>
          )}
          {jobsError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {jobsError}
            </div>
          )}

          {/* Section Title and Description */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={jobsSectionTitle}
                onChange={(e) => setJobsSectionTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Enter section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
              <textarea
                value={jobsSectionDescription}
                onChange={(e) => setJobsSectionDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                placeholder="Enter section description"
              />
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                {editingJobId === job.id ? (
                  // Edit Form - Inline within card
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Job Position</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={editJobFormData.title}
                        onChange={(e) => setEditJobFormData({ ...editJobFormData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={editJobFormData.description}
                        onChange={(e) => setEditJobFormData({ ...editJobFormData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                        <input
                          type="text"
                          value={editJobFormData.type}
                          onChange={(e) => setEditJobFormData({ ...editJobFormData, type: e.target.value })}
                          placeholder="Full Time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                        <input
                          type="text"
                          value={editJobFormData.experience}
                          onChange={(e) => setEditJobFormData({ ...editJobFormData, experience: e.target.value })}
                          placeholder="2 Years"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={editJobFormData.company}
                        onChange={(e) => setEditJobFormData({ ...editJobFormData, company: e.target.value })}
                        placeholder="House of Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditJobFormData({ ...editJobFormData, image: e.target.files?.[0] || null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                      {editJobFormData.image && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected: {editJobFormData.image.name} ({(editJobFormData.image.size / 1024 / 1024).toFixed(2)}MB)
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEditForm}
                        disabled={jobsLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {jobsLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCloseEditForm}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-bold text-gray-900">
                        JOB #{job.id}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            console.log("Edit button clicked for job:", job.id);
                            handleOpenEditForm(job);
                          }}
                          className="w-6 h-6 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                          disabled={jobsLoading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteJobSection(job.id)}
                          className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                          disabled={jobsLoading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Job Image */}
                    <div className="flex justify-center mb-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageChange(job.id, e.target.files[0]);
                            }
                          }}
                        />
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                          {job.image ? (
                            <img
                              src={URL.createObjectURL(job.image)}
                              alt={job.title}
                              className="w-24 h-24 object-cover"
                            />
                          ) : job.imageUrl ? (
                            <img
                              src={job.imageUrl.startsWith('http') ? job.imageUrl : `http://localhost:8000${job.imageUrl}`}
                              alt={job.title}
                              className="w-24 h-24 object-cover"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Delete Image Button */}
                    {job.imageUrl && (
                      <div className="flex justify-center mb-2">
                        <button
                          onClick={() => handleDeleteJobImage(job.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          disabled={jobsLoading}
                        >
                          Delete Image
                        </button>
                      </div>
                    )}

                    {/* Job Title */}
                    <h5 className="font-bold text-gray-900 mb-2">{job.title}</h5>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-2">
                      {job.description}{" "}
                      {job.description.includes("servic") && (
                        <span className="text-blue-600 cursor-pointer">Read More</span>
                      )}
                    </p>

                    {/* Job Details */}
                    <div className="text-sm text-gray-700">
                      <span>{job.type}</span>
                      <span className="mx-1">|</span>
                      <span className="text-pink-600">[{job.company}]</span>
                      <span className="mx-1">|</span>
                      <span>{job.experience}</span>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Add New Job Card */}
            <div
              onClick={() => {
                console.log("Add button clicked");
                const jobData = {
                  title: "New Job Position",
                  description: "Job description here",
                  type: "Full Time",
                  company: "House of Code",
                  experience: "2 Years",
                  image: null,
                  is_active: true
                };
                console.log("Calling handleSaveJobSection with:", jobData);
                handleSaveJobSection(jobData);
              }}
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
      )}

      {activeTab === "Procedure" && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300">Procedure Section</h3>

          {/* Procedure Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {procedures.map((procedure) => (
              <div key={procedure.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-bold">
                    <span className="text-pink-600">SERVICE #</span>
                    <span className="text-gray-900">{procedure.id}</span>
                  </h4>
                  <div className="flex gap-2">
                    <button className="w-6 h-6 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Circular Image */}
                <div className="flex justify-center mb-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProcedures((prev) =>
                            prev.map((p) =>
                              p.id === procedure.id ? { ...p, image: e.target.files![0] } : p
                            )
                          );
                        }
                      }}
                    />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                      {procedure.image ? (
                        <Image
                          src={URL.createObjectURL(procedure.image)}
                          alt={procedure.name}
                          fill
                          className="object-cover"
                        />
                      ) : procedure.imageUrl ? (
                        <Image
                          src={procedure.imageUrl}
                          alt={procedure.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Service Name */}
                <h5 className="font-bold text-gray-900 mb-2 text-center">{procedure.name}</h5>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-2">
                  {procedure.description}{" "}
                  <span className="text-blue-600 cursor-pointer">Read More</span>
                </p>
              </div>
            ))}

            {/* Add New Service Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white shadow-sm flex items-center justify-center min-h-[300px] cursor-pointer hover:border-pink-500 transition-colors">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Support" && (
        <div className="space-y-8">
          {/* Success/Error Messages */}
          {supportSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {supportSuccess}
            </div>
          )}
          {supportError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {supportError}
            </div>
          )}

          {/* Support Section Header */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Support Section</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={supportData.sectionTitle}
                  onChange={(e) => {
                    console.log("Section Title changed to:", e.target.value);
                    setSupportData({ ...supportData, sectionTitle: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter support section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={supportData.title}
                  onChange={(e) => {
                    console.log("Title changed to:", e.target.value);
                    setSupportData({ ...supportData, title: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter main title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={supportData.description}
                  onChange={(e) => {
                    console.log("Description changed to:", e.target.value);
                    setSupportData({ ...supportData, description: e.target.value });
                  }}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  placeholder="Enter description"
                />
              </div>
            </div>
          </div>

          {/* Call Us Block */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Call Us Block</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Icon</label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                    {supportData.callIcon ? (
                      <img
                        src={supportData.callIcon}
                        alt="Call Icon"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setSupportData({ ...supportData, callIcon: event.target?.result as string });
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="call-icon-upload"
                    />
                    <label
                      htmlFor="call-icon-upload"
                      className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Upload Icon
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Title</label>
                <input
                  type="text"
                  value={supportData.callTitle}
                  onChange={(e) => setSupportData({ ...supportData, callTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter call title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Description</label>
                <textarea
                  value={supportData.callDescription}
                  onChange={(e) => setSupportData({ ...supportData, callDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  placeholder="Enter call description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Phone</label>
                <input
                  type="tel"
                  value={supportData.callPhone}
                  onChange={(e) => setSupportData({ ...supportData, callPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Email Us Block */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Email Us Block</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Icon</label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                    {supportData.emailIcon ? (
                      <img
                        src={supportData.emailIcon}
                        alt="Email Icon"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setSupportData({ ...supportData, emailIcon: event.target?.result as string });
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="email-icon-upload"
                    />
                    <label
                      htmlFor="email-icon-upload"
                      className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Upload Icon
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Title</label>
                <input
                  type="text"
                  value={supportData.emailTitle}
                  onChange={(e) => setSupportData({ ...supportData, emailTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter email title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Description</label>
                <textarea
                  value={supportData.emailDescription}
                  onChange={(e) => setSupportData({ ...supportData, emailDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  placeholder="Enter email description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={supportData.emailAddress}
                  onChange={(e) => setSupportData({ ...supportData, emailAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-start pt-2">
            <button
              onClick={handleSaveSupportSection}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>

          {/* Contact Form Submissions Table */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Contact Form Submissions</h3>
              <div className="flex gap-4 text-sm">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Total: {statistics.total_submissions}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  Unread: {statistics.unread_submissions}
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Read: {statistics.read_submissions}
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {(contactSuccess || contactError) && (
              <div className={`mb-4 p-4 rounded-lg ${contactSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {contactSuccess || contactError}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contactLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        Loading contact submissions...
                      </td>
                    </tr>
                  ) : contactSubmissions.length > 0 ? (
                    contactSubmissions.map((submission) => (
                      <tr key={submission.id} className={`hover:bg-gray-50 ${!submission.is_read ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${submission.is_read
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {submission.is_read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium">{submission.full_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.phone || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.company || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={submission.message}>
                            {submission.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {submission.is_read ? (
                              <button
                                onClick={() => markAsUnread(submission.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Mark as unread"
                              >
                                Mark Unread
                              </button>
                            ) : (
                              <button
                                onClick={() => markAsRead(submission.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Mark as read"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this contact submission?')) {
                                  deleteSubmission(submission.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Delete submission"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        No contact form submissions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <div>
                  Showing {pagination.from} to {pagination.to} of {pagination.total} submissions
                </div>
                <div className="flex gap-2">
                  {pagination.current_page > 1 && (
                    <button
                      onClick={() => fetchContactSubmissions(pagination.current_page - 1)}
                      className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}
                  {pagination.current_page < pagination.last_page && (
                    <button
                      onClick={() => fetchContactSubmissions(pagination.current_page + 1)}
                      className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab !== "Hero Section" && activeTab !== "Career Cards" && activeTab !== "FAQ" && activeTab !== "Jobs" && activeTab !== "Procedure" && activeTab !== "Support" && (
        <div className="text-gray-600">{activeTab} Editor - Coming Soon</div>
      )}
    </div>
  );

  // Expose the save method to parent component
  useImperativeHandle(ref, () => ({
    handleSaveHeroSection,
  }));
});

CareersEditor.displayName = "CareersEditor";

export default CareersEditor;

