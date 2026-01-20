import { useState, useEffect } from "react";

interface FAQSection {
    id: number;
    section_title: string;
    question: string;
    answer: string;
    image?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface FAQResponse {
    success: boolean;
    data: {
        faq_sections?: FAQSection[];
        faq_section?: FAQSection;
    };
    message?: string;
    errors?: Record<string, string[]>;
}

export const useFAQSections = () => {
    const [faqs, setFaqs] = useState<FAQSection[]>([]);
    const [sectionTitle, setSectionTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch all FAQ sections
    const fetchFAQSections = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/v1/faq-sections", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: FAQResponse = await response.json();
                if (data.success && data.data?.faq_sections) {
                    setFaqs(data.data.faq_sections);
                    // Set section title from the first FAQ item
                    if (data.data.faq_sections.length > 0) {
                        setSectionTitle(data.data.faq_sections[0].section_title || "");
                    }
                }
            } else {
                throw new Error("Failed to fetch FAQ sections");
            }
        } catch (err) {
            console.error("Error fetching FAQ sections:", err);
            setError("Failed to fetch FAQ sections");
        } finally {
            setLoading(false);
        }
    };

    // Create new FAQ section
    const handleCreateFAQSection = async (faqData: Partial<FAQSection>) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            let response: Response;

            // Send as JSON if no image, FormData if image present
            if (faqData.image) {
                const formData = new FormData();

                // Append all fields
                if (faqData.section_title) formData.append("section_title", faqData.section_title);
                if (faqData.question) formData.append("question", faqData.question);
                if (faqData.answer) formData.append("answer", faqData.answer);
                if (faqData.image) formData.append("image", faqData.image);
                // Always send is_active as boolean
                formData.append("is_active", (faqData.is_active ?? true).toString());
                if (faqData.sort_order !== undefined) {
                    formData.append("sort_order", faqData.sort_order.toString());
                }

                response = await fetch("http://localhost:8000/api/v1/faq-sections", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                });
            } else {
                // Send as JSON when no image
                const jsonData = {
                    section_title: faqData.section_title || "FAQ Section",
                    question: faqData.question || "New Question",
                    answer: faqData.answer || "New answer here...",
                    is_active: faqData.is_active ?? true,
                    sort_order: faqData.sort_order ?? 1,
                };

                response = await fetch("http://localhost:8000/api/v1/faq-sections", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(jsonData),
                });
            }

            if (response.ok) {
                const data: FAQResponse = await response.json();
                if (data.success) {
                    setSuccess("FAQ section created successfully!");
                    fetchFAQSections(); // Refresh list
                    setTimeout(() => setSuccess(""), 3000);
                    return data.data?.faq_section;
                } else {
                    throw new Error(data.message || "Failed to create FAQ section");
                }
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(", ");
                    throw new Error(errorMessages);
                }
                throw new Error("Failed to create FAQ section");
            }
        } catch (err) {
            console.error("Error creating FAQ section:", err);
            setError(err instanceof Error ? err.message : "Failed to create FAQ section");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update FAQ section
    const handleUpdateFAQSection = async (id: number, faqData: Partial<FAQSection>) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            let response: Response;

            // Send as JSON if no image, FormData if image present
            if (faqData.image) {
                const formData = new FormData();

                // Append all fields
                if (faqData.section_title) formData.append("section_title", faqData.section_title);
                if (faqData.question) formData.append("question", faqData.question);
                if (faqData.answer) formData.append("answer", faqData.answer);
                if (faqData.image) formData.append("image", faqData.image);
                // Always send is_active as boolean
                formData.append("is_active", (faqData.is_active ?? true).toString());
                if (faqData.sort_order !== undefined) {
                    formData.append("sort_order", faqData.sort_order.toString());
                }

                // Add method spoofing for Laravel
                formData.append("_method", "PUT");

                response = await fetch(`http://localhost:8000/api/v1/faq-sections/${id}`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                });
            } else {
                // Send as JSON when no image
                const jsonData = {
                    section_title: faqData.section_title,
                    question: faqData.question,
                    answer: faqData.answer,
                    is_active: faqData.is_active ?? true,
                    sort_order: faqData.sort_order ?? 1,
                };

                response = await fetch(`http://localhost:8000/api/v1/faq-sections/${id}`, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(jsonData),
                });
            }

            if (response.ok) {
                const data: FAQResponse = await response.json();
                if (data.success) {
                    setSuccess("FAQ section updated successfully!");
                    fetchFAQSections(); // Refresh list
                    setTimeout(() => setSuccess(""), 3000);
                    return data.data?.faq_section;
                } else {
                    throw new Error(data.message || "Failed to update FAQ section");
                }
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(", ");
                    throw new Error(errorMessages);
                }
                throw new Error("Failed to update FAQ section");
            }
        } catch (err) {
            console.error("Error updating FAQ section:", err);
            setError(err instanceof Error ? err.message : "Failed to update FAQ section");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete FAQ section
    const handleDeleteFAQSection = async (id: number) => {
        if (!confirm("Are you sure you want to delete this FAQ section?")) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/faq-sections/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: FAQResponse = await response.json();
                if (data.success) {
                    setSuccess("FAQ section deleted successfully!");
                    fetchFAQSections(); // Refresh list
                    setTimeout(() => setSuccess(""), 3000);
                } else {
                    throw new Error(data.message || "Failed to delete FAQ section");
                }
            } else {
                throw new Error("Failed to delete FAQ section");
            }
        } catch (err) {
            console.error("Error deleting FAQ section:", err);
            setError(err instanceof Error ? err.message : "Failed to delete FAQ section");
        } finally {
            setLoading(false);
        }
    };

    // Delete specific field
    const handleDeleteFAQField = async (id: number, field: string) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/faq-sections/${id}/field/${field}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: FAQResponse = await response.json();
                if (data.success) {
                    setSuccess(`${field} deleted successfully!`);
                    fetchFAQSections(); // Refresh list
                    setTimeout(() => setSuccess(""), 3000);
                } else {
                    throw new Error(data.message || `Failed to delete ${field}`);
                }
            } else {
                throw new Error(`Failed to delete ${field}`);
            }
        } catch (err) {
            console.error(`Error deleting ${field}:`, err);
            setError(err instanceof Error ? err.message : `Failed to delete ${field}`);
        } finally {
            setLoading(false);
        }
    };

    // Clear messages
    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    return {
        faqs,
        sectionTitle,
        setSectionTitle,
        loading,
        error,
        success,
        fetchFAQSections,
        handleCreateFAQSection,
        handleUpdateFAQSection,
        handleDeleteFAQSection,
        handleDeleteFAQField,
        clearMessages,
    };
};
