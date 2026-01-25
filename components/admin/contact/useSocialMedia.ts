import { useState, useCallback } from 'react';

export interface SocialMediaSection {
    id: number;
    heading: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SocialLink {
    id: number;
    platform_name: string;
    platform_url: string;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export function useSocialMedia() {
    const [section, setSection] = useState<SocialMediaSection | null>(null);
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSocialMedia = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            const headers: HeadersInit = {
                "Accept": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("http://localhost:8000/api/v1/social-media", {
                method: "GET",
                headers,
            });

            console.log("Social media API response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Social media API response data:", data);
                
                if (data.success && data.data) {
                    if (data.data.social_media_section) {
                        setSection(data.data.social_media_section);
                    }
                    if (data.data.social_links) {
                        const activeLinks = data.data.social_links
                            .filter((link: SocialLink) => link.is_active)
                            .sort((a: SocialLink, b: SocialLink) => a.sort_order - b.sort_order);
                        setLinks(activeLinks);
                    } else {
                        setLinks([]);
                    }
                } else {
                    setSection(null);
                    setLinks([]);
                }
            } else {
                let errorData = {};
                let errorText = '';
                try {
                    errorText = await response.text().catch(() => '');
                    console.error("Social media API error:", response.status, errorText);
                    errorData = errorText ? JSON.parse(errorText) : {};
                } catch (e) {
                    console.error("Error parsing response:", e);
                    errorData = { message: `Server error (${response.status}). Please check the server logs.` };
                }
                let errorMessage = errorData.message || errorData.error || 
                    (response.status === 500 
                        ? "Internal server error (500). Please check the server logs or contact support." 
                        : `Failed to fetch social media (${response.status})`);
                
                // Check if it's a database table missing error
                if (errorData.error && errorData.error.includes('does not exist')) {
                    errorMessage = "Database table does not exist. Please run database migrations on the backend server.";
                }
                
                setError(errorMessage);
                setSection(null);
                setLinks([]);
            }
        } catch (err: any) {
            console.error("Error fetching social media:", err);
            setError(err.message || "Error loading social media. Please check your connection.");
            setSection(null);
            setLinks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveSection = useCallback(async (sectionData: Partial<SocialMediaSection>) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await fetch("http://localhost:8000/api/v1/social-media/section", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(sectionData),
            });

            console.log("Save section response status:", response.status);
            const responseData = await response.json().catch(() => ({}));
            console.log("Save section response data:", responseData);
            
            if (response.ok) {
                if (responseData.success && responseData.data?.social_media_section) {
                    setSection(responseData.data.social_media_section);
                    return { success: true, section: responseData.data.social_media_section };
                } else {
                    const errorMsg = responseData.message || "Failed to save social media section";
                    const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) => 
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    ).join('; ') : '';
                    throw new Error(validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg);
                }
            } else {
                const errorMsg = responseData.message || `Failed to save social media section (${response.status})`;
                const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) => 
                    `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                ).join('; ') : '';
                const fullError = validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg;
                console.error("Save section error:", response.status, responseData);
                throw new Error(fullError);
            }
        } catch (err: any) {
            console.error("Error saving social media section:", err);
            setError(err.message || "Error saving social media section");
            throw err;
        }
    }, []);

    const createLink = useCallback(async (linkData: Partial<SocialLink>, iconFile?: File) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const formData = new FormData();
            
            // Only append fields that have non-empty, non-null values
            if (linkData.platform_name && linkData.platform_name.trim()) {
                formData.append('platform_name', linkData.platform_name.trim());
            }
            if (linkData.platform_url && linkData.platform_url.trim()) {
                formData.append('platform_url', linkData.platform_url.trim());
            }
            if (linkData.is_active !== undefined) {
                formData.append('is_active', linkData.is_active ? 'true' : 'false');
            }
            if (linkData.sort_order !== undefined) {
                formData.append('sort_order', linkData.sort_order.toString());
            }
            if (iconFile) {
                formData.append('icon', iconFile);
            }

            const response = await fetch("http://localhost:8000/api/v1/social-links", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
                body: formData,
            });

            console.log("Create link response status:", response.status);
            const responseData = await response.json().catch(() => ({}));
            console.log("Create link response data:", responseData);
            
            if (response.ok) {
                if (responseData.success && responseData.data?.social_link) {
                    setLinks((prev) => [...prev, responseData.data.social_link]);
                    return { success: true, link: responseData.data.social_link };
                } else {
                    const errorMsg = responseData.message || "Failed to create social link";
                    const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) => 
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    ).join('; ') : '';
                    throw new Error(validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg);
                }
            } else {
                const errorMsg = responseData.message || `Failed to create social link (${response.status})`;
                const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) => 
                    `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                ).join('; ') : '';
                const fullError = validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg;
                console.error("Create link error:", response.status, responseData);
                throw new Error(fullError);
            }
        } catch (err: any) {
            console.error("Error creating social link:", err);
            setError(err.message || "Error creating social link");
            throw err;
        }
    }, []);

    const updateLink = useCallback(async (id: number, linkData: Partial<SocialLink>, iconFile?: File) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const formData = new FormData();
            
            // Laravel Method Spoofing for PUT request with files
            formData.append('_method', 'PUT');
            
            // Only append fields that have non-empty, non-null values
            if (linkData.platform_name && linkData.platform_name.trim()) {
                formData.append('platform_name', linkData.platform_name.trim());
            }
            if (linkData.platform_url && linkData.platform_url.trim()) {
                formData.append('platform_url', linkData.platform_url.trim());
            }
            if (linkData.is_active !== undefined) {
                formData.append('is_active', linkData.is_active ? 'true' : 'false');
            }
            if (linkData.sort_order !== undefined) {
                formData.append('sort_order', linkData.sort_order.toString());
            }
            if (iconFile) {
                formData.append('icon', iconFile);
            }

            const response = await fetch(`http://localhost:8000/api/v1/social-links/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
                body: formData,
            });

            console.log("Update link response status:", response.status);
            const responseData = await response.json().catch(() => ({}));
            console.log("Update link response data:", responseData);
            
            if (response.ok) {
                if (responseData.success && responseData.data?.social_link) {
                    setLinks((prev) =>
                        prev.map((link) => (link.id === id ? responseData.data.social_link : link))
                    );
                    return { success: true, link: responseData.data.social_link };
                } else {
                    const errorMsg = responseData.message || "Failed to update social link";
                    const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) => 
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    ).join('; ') : '';
                    throw new Error(validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg);
                }
            } else {
                const errorMsg = responseData.message || `Failed to update social link (${response.status})`;
                const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) => 
                    `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                ).join('; ') : '';
                const fullError = validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg;
                console.error("Update link error:", response.status, responseData);
                throw new Error(fullError);
            }
        } catch (err: any) {
            console.error("Error updating social link:", err);
            setError(err.message || "Error updating social link");
            throw err;
        }
    }, []);

    const deleteLink = useCallback(async (id: number) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await fetch(`http://localhost:8000/api/v1/social-links/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                setLinks((prev) => prev.filter((link) => link.id !== id));
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete social link (${response.status})`);
            }
        } catch (err: any) {
            console.error("Error deleting social link:", err);
            setError(err.message || "Error deleting social link");
            throw err;
        }
    }, []);

    return {
        section,
        links,
        loading,
        error,
        fetchSocialMedia,
        saveSection,
        createLink,
        updateLink,
        deleteLink,
    };
}

