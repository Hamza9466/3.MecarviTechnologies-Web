import { useState, useEffect } from "react";

interface SupportSection {
    id: number;
    section_title: string;
    title: string;
    description: string;
    call_icon: string | null | File;
    call_title: string;
    call_description: string;
    call_phone: string;
    email_icon: string | null | File;
    email_title: string;
    email_description: string;
    email_address: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface SupportResponse {
    success: boolean;
    data: {
        support_sections?: SupportSection[];
        support_section?: SupportSection;
    };
    message?: string;
    errors?: Record<string, string[]>;
}

export const useSupportSections = () => {
    const [supportSections, setSupportSections] = useState<SupportSection[]>([]);
    const [currentSupportSection, setCurrentSupportSection] = useState<SupportSection | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch all support sections (public endpoint - no auth required)
    const fetchSupportSections = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("Fetching support sections from API...");
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/v1/support-sections", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            console.log("API Response status:", response.status);
            console.log("API Response ok:", response.ok);

            if (response.ok) {
                const data: SupportResponse = await response.json();
                console.log("=== API Response ===");
                console.log("Full response:", JSON.stringify(data, null, 2));
                console.log("data.success:", data.success);
                console.log("data.data:", data.data);
                console.log("data.data?.support_sections:", data.data?.support_sections);

                if (data.success && data.data?.support_sections) {
                    console.log("Found support sections:", data.data.support_sections);
                    console.log("Number of sections:", data.data.support_sections.length);
                    setSupportSections(data.data.support_sections);
                    // Set current support section to the first one
                    if (data.data.support_sections.length > 0) {
                        const firstSection = data.data.support_sections[0];
                        console.log("Setting current support section to:", firstSection);
                        console.log("First section ID:", firstSection.id);
                        console.log("First section title:", firstSection.title);
                        console.log("First section section_title:", firstSection.section_title);
                        setCurrentSupportSection(firstSection);
                    } else {
                        // No data found - set to null
                        console.log("No support sections found in array");
                        setCurrentSupportSection(null);
                    }
                } else {
                    console.error("API response structure unexpected:");
                    console.error("- data.success:", data.success);
                    console.error("- data.data:", data.data);
                    console.error("- data.data?.support_sections:", data.data?.support_sections);
                    console.error("Full response:", JSON.stringify(data, null, 2));
                    // API request failed - set to null
                    console.warn("API request failed - unexpected response structure");
                    setCurrentSupportSection(null);
                }
            } else {
                console.log("API request failed with status:", response.status);
                if (response.status === 401) {
                    console.error("API authentication error - User is not authenticated or token is invalid");
                    console.log("This means the support sections endpoint requires authentication");
                } else if (response.status === 500) {
                    console.error("API server error - The Laravel backend has an issue with the support-sections endpoint");
                    console.log("This is a backend issue that needs to be fixed in the Laravel API");
                }
                // API request failed - set to null
                console.warn("API request failed");
                setCurrentSupportSection(null);
            }
        } catch (err) {
            console.error("Error fetching support sections:", err);
            // Network error or other issue - set to null
            setCurrentSupportSection(null);
            setError("Failed to fetch support sections");
        } finally {
            setLoading(false);
        }
    };

    // Fetch specific support section by ID (public endpoint - no auth required)
    const fetchSupportSection = async (id: number) => {
        try {
            setLoading(true);
            setError("");

            console.log(`Fetching support section ${id} from API...`);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/support-sections/${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: SupportResponse = await response.json();
                console.log("API Response data:", data);

                if (data.success && data.data?.support_section) {
                    console.log("Found support section:", data.data.support_section);
                    setCurrentSupportSection(data.data.support_section);
                    return data.data.support_section;
                } else {
                    throw new Error("Support section not found");
                }
            } else {
                throw new Error("Failed to fetch support section");
            }
        } catch (err) {
            console.error("Error fetching support section:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch support section");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Create new support section (admin only - requires auth)
    const handleCreateSupportSection = async (supportData: Partial<SupportSection>) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            let response: Response;

            // Send as JSON if no image, FormData if image present
            if (supportData.call_icon instanceof File || supportData.email_icon instanceof File) {
                const formData = new FormData();

                // Append all fields
                if (supportData.section_title) formData.append("section_title", supportData.section_title);
                if (supportData.title) formData.append("title", supportData.title);
                if (supportData.description) formData.append("description", supportData.description);
                if (supportData.call_icon instanceof File) formData.append("call_icon", supportData.call_icon);
                if (supportData.call_title) formData.append("call_title", supportData.call_title);
                if (supportData.call_description) formData.append("call_description", supportData.call_description);
                if (supportData.call_phone) formData.append("call_phone", supportData.call_phone);
                if (supportData.email_icon instanceof File) formData.append("email_icon", supportData.email_icon);
                if (supportData.email_title) formData.append("email_title", supportData.email_title);
                if (supportData.email_description) formData.append("email_description", supportData.email_description);
                if (supportData.email_address) formData.append("email_address", supportData.email_address);
                if (supportData.is_active !== undefined) formData.append("is_active", supportData.is_active.toString());
                if (supportData.sort_order !== undefined) formData.append("sort_order", supportData.sort_order.toString());

                response = await fetch("http://localhost:8000/api/v1/support-sections", {
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
                    section_title: supportData.section_title || "Contact Support",
                    title: supportData.title || "Get in Touch",
                    description: supportData.description || "We're here to help you with any questions or concerns.",
                    call_icon: supportData.call_icon || null,
                    call_title: supportData.call_title || "Call Us",
                    call_description: supportData.call_description || "Available Monday to Friday, 9 AM to 6 PM",
                    call_phone: supportData.call_phone || "+1-234-567-8900",
                    email_icon: supportData.email_icon || null,
                    email_title: supportData.email_title || "Email Us",
                    email_description: supportData.email_description || "We'll respond within 24 hours",
                    email_address: supportData.email_address || "support@example.com",
                    is_active: supportData.is_active ?? true,
                    sort_order: supportData.sort_order ?? 1,
                };

                response = await fetch("http://localhost:8000/api/v1/support-sections", {
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
                const data: SupportResponse = await response.json();
                console.log("Support section created successfully:", data);

                if (data.success && data.data?.support_section) {
                    setSupportSections(prev => [...prev, data.data!.support_section!]);
                    setCurrentSupportSection(data.data.support_section);
                    setSuccess(data.message || "Support section created successfully");
                    return data.data.support_section;
                } else {
                    throw new Error("Failed to create support section");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Create error response:", errorData);
                throw new Error(errorData.message || "Failed to create support section");
            }
        } catch (err) {
            console.error("Error creating support section:", err);
            setError(err instanceof Error ? err.message : "Failed to create support section");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update support section (admin only - requires auth)
    const handleUpdateSupportSection = async (id: number, supportData: Partial<SupportSection>) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            let response: Response;

            // Send as JSON if no image, FormData if image present
            if (supportData.call_icon instanceof File || supportData.email_icon instanceof File) {
                const formData = new FormData();

                // Append all fields
                if (supportData.section_title) formData.append("section_title", supportData.section_title);
                if (supportData.title) formData.append("title", supportData.title);
                if (supportData.description) formData.append("description", supportData.description);
                if (supportData.call_icon instanceof File) formData.append("call_icon", supportData.call_icon);
                if (supportData.call_title) formData.append("call_title", supportData.call_title);
                if (supportData.call_description) formData.append("call_description", supportData.call_description);
                if (supportData.call_phone) formData.append("call_phone", supportData.call_phone);
                if (supportData.email_icon instanceof File) formData.append("email_icon", supportData.email_icon);
                if (supportData.email_title) formData.append("email_title", supportData.email_title);
                if (supportData.email_description) formData.append("email_description", supportData.email_description);
                if (supportData.email_address) formData.append("email_address", supportData.email_address);
                if (supportData.is_active !== undefined) formData.append("is_active", supportData.is_active.toString());
                if (supportData.sort_order !== undefined) formData.append("sort_order", supportData.sort_order.toString());

                response = await fetch(`http://localhost:8000/api/v1/support-sections/${id}`, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                });
            } else {
                // Send as JSON when no image
                const jsonData = {
                    section_title: supportData.section_title,
                    title: supportData.title,
                    description: supportData.description,
                    call_icon: supportData.call_icon,
                    call_title: supportData.call_title,
                    call_description: supportData.call_description,
                    call_phone: supportData.call_phone,
                    email_icon: supportData.email_icon,
                    email_title: supportData.email_title,
                    email_description: supportData.email_description,
                    email_address: supportData.email_address,
                    is_active: supportData.is_active,
                    sort_order: supportData.sort_order,
                };

                response = await fetch(`http://localhost:8000/api/v1/support-sections/${id}`, {
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
                const data: SupportResponse = await response.json();
                console.log("Support section updated successfully:", data);

                if (data.success && data.data?.support_section) {
                    setSupportSections(prev =>
                        prev.map(section => section.id === id ? data.data!.support_section! : section)
                    );
                    setCurrentSupportSection(data.data.support_section);
                    setSuccess(data.message || "Support section updated successfully");
                    return data.data.support_section;
                } else {
                    throw new Error("Failed to update support section");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Update error response:", errorData);
                throw new Error(errorData.message || "Failed to update support section");
            }
        } catch (err) {
            console.error("Error updating support section:", err);
            setError(err instanceof Error ? err.message : "Failed to update support section");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete support section (admin only - requires auth)
    const handleDeleteSupportSection = async (id: number) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/support-sections/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: SupportResponse = await response.json();
                console.log("Support section deleted successfully:", data);

                if (data.success) {
                    setSupportSections(prev => prev.filter(section => section.id !== id));
                    if (currentSupportSection?.id === id) {
                        setCurrentSupportSection(null);
                    }
                    setSuccess(data.message || "Support section deleted successfully");
                } else {
                    throw new Error("Failed to delete support section");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Delete error response:", errorData);
                throw new Error(errorData.message || "Failed to delete support section");
            }
        } catch (err) {
            console.error("Error deleting support section:", err);
            setError(err instanceof Error ? err.message : "Failed to delete support section");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete specific field from support section (admin only - requires auth)
    const handleDeleteSupportField = async (id: number, field: string) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/support-sections/${id}/field/${field}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: SupportResponse = await response.json();
                console.log("Support section field deleted successfully:", data);

                if (data.success && data.data?.support_section) {
                    setSupportSections(prev =>
                        prev.map(section => section.id === id ? data.data!.support_section! : section)
                    );
                    if (currentSupportSection?.id === id) {
                        setCurrentSupportSection(data.data.support_section);
                    }
                    setSuccess(data.message || "Field deleted successfully");
                    return data.data.support_section;
                } else {
                    throw new Error("Failed to delete field");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Delete field error response:", errorData);
                throw new Error(errorData.message || "Failed to delete field");
            }
        } catch (err) {
            console.error("Error deleting support section field:", err);
            setError(err instanceof Error ? err.message : "Failed to delete field");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear success and error messages
    const clearMessages = () => {
        setSuccess("");
        setError("");
    };

    return {
        supportSections,
        currentSupportSection,
        loading,
        error,
        success,
        fetchSupportSections,
        fetchSupportSection,
        handleCreateSupportSection,
        handleUpdateSupportSection,
        handleDeleteSupportSection,
        handleDeleteSupportField,
        clearMessages,
    };
};
