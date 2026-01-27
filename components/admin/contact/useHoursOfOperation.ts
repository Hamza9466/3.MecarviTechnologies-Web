import { useState, useCallback } from 'react';

export interface HoursOfOperation {
    id: number;
    section_title: string | null;
    category_title: string;
    monday_friday_hours: string | null;
    saturday_hours: string | null;
    sunday_hours: string | null;
    sunday_status: string | null;
    public_holidays_hours: string | null;
    public_holidays_status: string | null;
    description_1: string | null;
    description_2: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export function useHoursOfOperation() {
    const [hours, setHours] = useState<HoursOfOperation[]>([]);
    const [sectionTitle, setSectionTitle] = useState<string>("Hours of Operation");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHours = useCallback(async () => {
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

            const response = await fetch("http://localhost:8000/api/v1/hours-of-operation", {
                method: "GET",
                headers,
            });

            console.log("Hours of operation API response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Hours of operation API response data:", data);

                if (data.success && data.data) {
                    if (data.data.section_title) {
                        setSectionTitle(data.data.section_title);
                    }
                    if (data.data.hours_of_operation) {
                        const activeHours = data.data.hours_of_operation
                            .filter((hour: HoursOfOperation) => hour.is_active)
                            .sort((a: HoursOfOperation, b: HoursOfOperation) => a.sort_order - b.sort_order);
                        setHours(activeHours);
                    } else {
                        setHours([]);
                    }
                } else {
                    setHours([]);
                }
            } else {
                let errorData = {};
                let errorText = '';
                try {
                    errorText = await response.text().catch(() => '');
                    console.error("Hours of operation API error:", response.status, errorText);
                    errorData = errorText ? JSON.parse(errorText) : {};
                } catch (e) {
                    console.error("Error parsing response:", e);
                    errorData = { message: `Server error (${response.status}). Please check the server logs.` };
                }
                let errorMessage = errorData.message || errorData.error ||
                    (response.status === 500
                        ? "Internal server error (500). Please check the server logs or contact support."
                        : `Failed to fetch hours of operation (${response.status})`);

                // Check if it's a database table missing error
                if (errorData.error && errorData.error.includes('does not exist') && errorData.error.includes('hours_of_operation')) {
                    errorMessage = "Database table 'hours_of_operation' does not exist. Please run database migrations on the backend server.";
                }

                setError(errorMessage);
                setHours([]);
            }
        } catch (err: any) {
            console.error("Error fetching hours of operation:", err);
            setError(err.message || "Error loading hours of operation. Please check your connection.");
            setHours([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createHours = useCallback(async (hoursData: Partial<HoursOfOperation>) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await fetch("http://localhost:8000/api/v1/hours-of-operation", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(hoursData),
            });

            console.log("Create hours response status:", response.status);
            const responseData = await response.json().catch(() => ({}));
            console.log("Create hours response data:", responseData);

            if (response.ok) {
                if (responseData.success && responseData.data?.hours_of_operation) {
                    setHours((prev) => [...prev, responseData.data.hours_of_operation]);
                    return { success: true, hours: responseData.data.hours_of_operation };
                } else {
                    const errorMsg = responseData.message || "Failed to create hours of operation";
                    const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    ).join('; ') : '';
                    throw new Error(validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg);
                }
            } else {
                const errorMsg = responseData.message || `Failed to create hours of operation (${response.status})`;
                const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                    `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                ).join('; ') : '';
                const fullError = validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg;
                console.error("Create hours error:", response.status, responseData);
                throw new Error(fullError);
            }
        } catch (err: any) {
            console.error("Error creating hours of operation:", err);
            setError(err.message || "Error creating hours of operation");
            throw err;
        }
    }, []);

    const updateHours = useCallback(async (id: number, hoursData: Partial<HoursOfOperation>) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await fetch(`http://localhost:8000/api/v1/hours-of-operation/${id}/update`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(hoursData),
            });

            console.log("Update hours response status:", response.status);
            const responseData = await response.json().catch(() => ({}));
            console.log("Update hours response data:", responseData);

            if (response.ok) {
                if (responseData.success && responseData.data?.hours_of_operation) {
                    setHours((prev) =>
                        prev.map((hour) => (hour.id === id ? responseData.data.hours_of_operation : hour))
                    );
                    return { success: true, hours: responseData.data.hours_of_operation };
                } else {
                    const errorMsg = responseData.message || "Failed to update hours of operation";
                    const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    ).join('; ') : '';
                    throw new Error(validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg);
                }
            } else {
                const errorMsg = responseData.message || `Failed to update hours of operation (${response.status})`;
                const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                    `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                ).join('; ') : '';
                const fullError = validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg;
                console.error("Update hours error:", response.status, responseData);
                throw new Error(fullError);
            }
        } catch (err: any) {
            console.error("Error updating hours of operation:", err);
            setError(err.message || "Error updating hours of operation");
            throw err;
        }
    }, []);

    const deleteHours = useCallback(async (id: number) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await fetch(`http://localhost:8000/api/v1/hours-of-operation/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                setHours((prev) => prev.filter((hour) => hour.id !== id));
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete hours of operation (${response.status})`);
            }
        } catch (err: any) {
            console.error("Error deleting hours of operation:", err);
            setError(err.message || "Error deleting hours of operation");
            throw err;
        }
    }, []);

    return {
        hours,
        sectionTitle,
        loading,
        error,
        fetchHours,
        createHours,
        updateHours,
        deleteHours,
    };
}

