import { useState } from "react";

interface QuoteFormSubmission {
    id: number;
    full_name: string;
    job_title: string | null;
    company_name: string | null;
    email: string;
    phone: string | null;
    preferred_contact_method: string | null;
    industry_sector: string | null;
    company_size: string | null;
    street_address: string | null;
    city: string | null;
    state_province: string | null;
    postal_code: string | null;
    country: string | null;
    business_website: string | null;
    services_required: string | null; // JSON string array
    frontend_technologies: string | null; // JSON string array
    backend_technologies: string | null; // JSON string array
    database_preference: string | null;
    domain_name_ownership: string | null;
    hosting_services_availability: string | null;
    ready_made_product_interest: string | null;
    custom_development_requirement: string | null;
    project_type: string | null;
    brief_project_description: string | null;
    primary_objective: string | null;
    estimated_timeline: string | null;
    estimated_budget_range: string | null;
    required_integrations: string | null;
    security_compliance_requirements: string | null; // JSON string array
    ongoing_maintenance_support: string | null;
    long_term_partnership: string | null;
    how_did_you_hear: string | null;
    uploaded_files: string | null; // JSON string array
    message: string | null;
    authorization_confirmation: boolean;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

interface QuoteFormResponse {
    success: boolean;
    data: {
        data: QuoteFormSubmission[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    message?: string;
    errors?: Record<string, string[]>;
}

interface QuoteFormStatsResponse {
    success: boolean;
    data: {
        total_submissions: number;
        unread_submissions: number;
        read_submissions: number;
        recent_submissions: number;
    };
}

export const useQuoteFormSubmissions = () => {
    const [quoteSubmissions, setQuoteSubmissions] = useState<QuoteFormSubmission[]>([]);
    const [statistics, setStatistics] = useState({
        total_submissions: 0,
        unread_submissions: 0,
        read_submissions: 0,
        recent_submissions: 0,
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch all quote form submissions
    const fetchQuoteSubmissions = async (page = 1, status?: string, search?: string) => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: "15",
            });

            if (status) {
                if (status === "read") {
                    params.append("is_read", "true");
                } else if (status === "unread") {
                    params.append("is_read", "false");
                }
            }
            if (search) params.append("search", search);

            const response = await fetch(`http://localhost:8000/api/v1/quote-form-submissions?${params}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: QuoteFormResponse = await response.json();
                console.log("Quote form submissions API response:", data);
                if (data.success && data.data) {
                    const submissions = data.data.data || [];
                    const paginationData = {
                        current_page: data.data.current_page || 1,
                        last_page: data.data.last_page || 1,
                        per_page: data.data.per_page || 15,
                        total: data.data.total || 0,
                        from: data.data.from || 0,
                        to: data.data.to || 0,
                    };
                    console.log("Quote form submissions found:", submissions.length);
                    setQuoteSubmissions(submissions);
                    setPagination(paginationData);
                } else {
                    console.error("API returned success=false or missing data:", data);
                    setQuoteSubmissions([]);
                    setPagination({
                        current_page: 1,
                        last_page: 1,
                        per_page: 15,
                        total: 0,
                        from: 0,
                        to: 0,
                    });
                }
            } else {
                const errorText = await response.text().catch(() => "Unknown error");
                console.error("Quote form submissions API error:", response.status, errorText);
                setQuoteSubmissions([]);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    per_page: 15,
                    total: 0,
                    from: 0,
                    to: 0,
                });
            }
        } catch (err) {
            console.error("Error fetching quote form submissions:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch quote form submissions");
        } finally {
            setLoading(false);
        }
    };

    // Fetch quote form statistics
    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/v1/quote-form-submissions/stats", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: QuoteFormStatsResponse = await response.json();
                if (data.success && data.data) {
                    setStatistics({
                        total_submissions: data.data.total_submissions || 0,
                        unread_submissions: data.data.unread_submissions || 0,
                        read_submissions: data.data.read_submissions || 0,
                        recent_submissions: data.data.recent_submissions || 0,
                    });
                }
            }
        } catch (err) {
            console.error("Error fetching statistics:", err);
        }
    };

    // Mark submission as read
    const markAsRead = async (id: number) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/quote-form-submissions/${id}/mark-read`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSuccess("Submission marked as read");
                    setQuoteSubmissions(prev =>
                        prev.map(submission =>
                            submission.id === id ? { ...submission, is_read: true } : submission
                        )
                    );
                    fetchStatistics();
                    setTimeout(() => setSuccess(""), 3000);
                    return data;
                } else {
                    throw new Error("Failed to mark as read");
                }
            } else {
                throw new Error("Failed to mark as read");
            }
        } catch (err) {
            console.error("Error marking as read:", err);
            setError(err instanceof Error ? err.message : "Failed to mark as read");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Mark submission as unread
    const markAsUnread = async (id: number) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/quote-form-submissions/${id}/mark-unread`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSuccess("Submission marked as unread");
                    setQuoteSubmissions(prev =>
                        prev.map(submission =>
                            submission.id === id ? { ...submission, is_read: false } : submission
                        )
                    );
                    fetchStatistics();
                    setTimeout(() => setSuccess(""), 3000);
                    return data;
                } else {
                    throw new Error("Failed to mark as unread");
                }
            } else {
                throw new Error("Failed to mark as unread");
            }
        } catch (err) {
            console.error("Error marking as unread:", err);
            setError(err instanceof Error ? err.message : "Failed to mark as unread");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete submission
    const deleteSubmission = async (id: number) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/quote-form-submissions/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSuccess("Submission deleted successfully");
                    setQuoteSubmissions(prev => prev.filter(submission => submission.id !== id));
                    fetchStatistics();
                    setTimeout(() => setSuccess(""), 3000);
                    return data;
                } else {
                    throw new Error("Failed to delete submission");
                }
            } else {
                throw new Error("Failed to delete submission");
            }
        } catch (err) {
            console.error("Error deleting submission:", err);
            setError(err instanceof Error ? err.message : "Failed to delete submission");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get specific submission
    const getSubmission = async (id: number) => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/v1/quote-form-submissions/${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Get submission API response:", data);
                if (data.success && data.data) {
                    console.log("Submission data:", data.data);
                    return data.data;
                } else {
                    console.error("API returned success=false or missing data:", data);
                    throw new Error("Failed to fetch submission");
                }
            } else {
                const errorText = await response.text().catch(() => "");
                console.error("Get submission API error:", response.status, errorText);
                throw new Error("Failed to fetch submission");
            }
        } catch (err) {
            console.error("Error fetching submission:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch submission");
            throw err;
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
        quoteSubmissions,
        statistics,
        pagination,
        loading,
        error,
        success,
        fetchQuoteSubmissions,
        fetchStatistics,
        markAsRead,
        markAsUnread,
        deleteSubmission,
        getSubmission,
        clearMessages,
    };
};

