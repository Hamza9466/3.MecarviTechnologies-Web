import { useState, useEffect } from "react";

interface ContactFormSubmission {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    job_location: string | null;
    preferred_contact_method: string | null;
    best_time_to_contact: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

interface ContactFormResponse {
    success: boolean;
    data: {
        contact_form_submissions: ContactFormSubmission[];
        pagination: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number;
            to: number;
        };
        unread_count: number;
    };
    message?: string;
    errors?: Record<string, string[]>;
}

interface ContactFormStatsResponse {
    success: boolean;
    data: {
        statistics: {
            total_submissions: number;
            unread_submissions: number;
            read_submissions: number;
            last_30_days: number;
        };
    };
}

export const useContactFormSubmissions = () => {
    const [contactSubmissions, setContactSubmissions] = useState<ContactFormSubmission[]>([]);
    const [statistics, setStatistics] = useState({
        total_submissions: 0,
        unread_submissions: 0,
        read_submissions: 0,
        last_30_days: 0,
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

    // Fetch all contact form submissions
    const fetchContactSubmissions = async (page = 1, status?: string, search?: string) => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: "15",
            });

            if (status) {
                // Convert status to is_read boolean
                if (status === "read") {
                    params.append("is_read", "true");
                } else if (status === "unread") {
                    params.append("is_read", "false");
                }
            }
            if (search) params.append("search", search);

            const response = await fetch(`http://localhost:8000/api/v1/contact-form-submissions?${params}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: ContactFormResponse = await response.json();
                console.log("Contact submissions API response:", data);
                if (data.success && data.data) {
                    const submissions = data.data.contact_form_submissions || [];
                    const paginationData = data.data.pagination || {
                        current_page: 1,
                        last_page: 1,
                        per_page: 15,
                        total: 0,
                        from: 0,
                        to: 0,
                    };
                    console.log("Contact submissions found:", submissions.length);
                    setContactSubmissions(submissions);
                    setPagination(paginationData);
                } else {
                    console.error("API returned success=false or missing data:", data);
                    // Set empty state instead of throwing error
                    setContactSubmissions([]);
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
                console.error("Contact submissions API error:", response.status, errorText);
                // Set empty state instead of throwing error
                setContactSubmissions([]);
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
            console.error("Error fetching contact submissions:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch contact submissions");
        } finally {
            setLoading(false);
        }
    };

    // Fetch contact form statistics
    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/v1/contact-form-submissions/stats", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data: ContactFormStatsResponse = await response.json();
                if (data.success) {
                    setStatistics(data.data.statistics);
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
            const response = await fetch(`http://localhost:8000/api/v1/contact-form-submissions/${id}/mark-read`, {
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
                    // Update local state
                    setContactSubmissions(prev =>
                        prev.map(submission =>
                            submission.id === id ? { ...submission, is_read: true } : submission
                        )
                    );
                    // Update statistics
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
            const response = await fetch(`http://localhost:8000/api/v1/contact-form-submissions/${id}/mark-unread`, {
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
                    // Update local state
                    setContactSubmissions(prev =>
                        prev.map(submission =>
                            submission.id === id ? { ...submission, is_read: false } : submission
                        )
                    );
                    // Update statistics
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
            const response = await fetch(`http://localhost:8000/api/v1/contact-form-submissions/${id}`, {
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
                    // Remove from local state
                    setContactSubmissions(prev => prev.filter(submission => submission.id !== id));
                    // Update statistics
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

    // Clear messages
    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    return {
        contactSubmissions,
        statistics,
        pagination,
        loading,
        error,
        success,
        fetchContactSubmissions,
        fetchStatistics,
        markAsRead,
        markAsUnread,
        deleteSubmission,
        clearMessages,
    };
};
