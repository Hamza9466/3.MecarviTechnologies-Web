import { useState, useCallback } from 'react';

export interface ContactPageCard {
    id: number;
    card_type: 'call' | 'fax' | 'email' | 'visit' | 'store_hours' | 'online_hours';
    badge_title: string | null;
    secondary_badge: string | null;
    label: string | null;
    phone_number_1: string | null;
    phone_number_2: string | null;
    fax_number: string | null;
    email_address: string | null;
    street_address: string | null;
    state_postal_code: string | null;
    country: string | null;
    monday_friday_hours: string | null;
    saturday_hours: string | null;
    sunday_hours: string | null;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export function useContactPageCards() {
    const [cards, setCards] = useState<ContactPageCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = useCallback(async () => {
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

            const response = await fetch("http://localhost:8000/api/v1/contact-page-cards", {
                method: "GET",
                headers,
            });

            console.log("Contact cards API response status:", response.status);
            console.log("Contact cards API response ok:", response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log("Contact cards API response data:", data);
                if (data.success && data.data?.contact_cards) {
                    setCards(data.data.contact_cards);
                } else {
                    setCards([]);
                }
            } else if (response.status === 401) {
                // Try without auth for public endpoint
                const publicResponse = await fetch("http://localhost:8000/api/v1/contact-page-cards", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (publicResponse.ok) {
                    const data = await publicResponse.json();
                    if (data.success && data.data?.contact_cards) {
                        setCards(data.data.contact_cards);
                    } else {
                        setCards([]);
                    }
                } else {
                    let errorData: { message?: string; error?: string } = {};
                    let errorText = '';
                    try {
                        errorText = await publicResponse.text().catch(() => '');
                        console.error("Contact cards API error (public):", publicResponse.status, errorText);
                        errorData = errorText ? (JSON.parse(errorText) as { message?: string; error?: string }) : {};
                    } catch (e) {
                        console.error("Error parsing public response:", e);
                        errorData = { message: `Failed to fetch contact cards (${publicResponse.status})` };
                    }
                    const errorMessage = errorData.message || errorData.error || `Failed to fetch contact cards (${publicResponse.status})`;
                    setError(errorMessage);
                    setCards([]);
                }
            } else {
                let errorData: { message?: string; error?: string } = {};
                let errorText = '';
                try {
                    errorText = await response.text().catch(() => '');
                    console.error("Contact cards API error:", response.status, errorText);
                    errorData = errorText ? (JSON.parse(errorText) as { message?: string; error?: string }) : {};
                } catch (e) {
                    console.error("Error parsing response:", e);
                    errorData = { message: `Server error (${response.status}). Please check the server logs.` };
                }
                let errorMessage = errorData.message || errorData.error ||
                    (response.status === 500
                        ? "Internal server error (500). Please check the server logs or contact support."
                        : `Failed to fetch contact cards (${response.status})`);

                // Check if it's a database table missing error
                if (errorData.error && errorData.error.includes('does not exist') && errorData.error.includes('contact_cards')) {
                    errorMessage = "Database table 'contact_cards' does not exist. Please run database migrations on the backend server.";
                }

                setError(errorMessage);
                setCards([]);
            }
        } catch (err: any) {
            console.error("Error fetching contact cards:", err);
            setError(err.message || "Error loading contact cards. Please check your connection.");
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCard = useCallback(async (cardData: Partial<ContactPageCard>, iconFile?: File | null) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const formData = new FormData();

            // Add required card_type field
            if (cardData.card_type) {
                formData.append('card_type', cardData.card_type);
            }

            // Add optional fields only if they have values (not empty strings)
            if (cardData.badge_title && cardData.badge_title.trim()) {
                formData.append('badge_title', cardData.badge_title.trim());
            }
            if (cardData.secondary_badge && cardData.secondary_badge.trim()) {
                formData.append('secondary_badge', cardData.secondary_badge.trim());
            }
            if (cardData.label && cardData.label.trim()) {
                formData.append('label', cardData.label.trim());
            }
            if (cardData.phone_number_1 && cardData.phone_number_1.trim()) {
                formData.append('phone_number_1', cardData.phone_number_1.trim());
            }
            if (cardData.phone_number_2 && cardData.phone_number_2.trim()) {
                formData.append('phone_number_2', cardData.phone_number_2.trim());
            }
            if (cardData.fax_number && cardData.fax_number.trim()) {
                formData.append('fax_number', cardData.fax_number.trim());
            }
            if (cardData.email_address && cardData.email_address.trim()) {
                formData.append('email_address', cardData.email_address.trim());
            }
            if (cardData.street_address && cardData.street_address.trim()) {
                formData.append('street_address', cardData.street_address.trim());
            }
            if (cardData.state_postal_code && cardData.state_postal_code.trim()) {
                formData.append('state_postal_code', cardData.state_postal_code.trim());
            }
            if (cardData.country && cardData.country.trim()) {
                formData.append('country', cardData.country.trim());
            }
            if (cardData.monday_friday_hours && cardData.monday_friday_hours.trim()) {
                formData.append('monday_friday_hours', cardData.monday_friday_hours.trim());
            }
            if (cardData.saturday_hours && cardData.saturday_hours.trim()) {
                formData.append('saturday_hours', cardData.saturday_hours.trim());
            }
            if (cardData.sunday_hours && cardData.sunday_hours.trim()) {
                formData.append('sunday_hours', cardData.sunday_hours.trim());
            }
            if (cardData.is_active !== undefined) {
                // Send as string "true" or "false" as Laravel expects these exact values
                formData.append('is_active', cardData.is_active ? 'true' : 'false');
            }
            if (cardData.sort_order !== undefined) {
                formData.append('sort_order', cardData.sort_order.toString());
            }

            // Add icon file if provided
            if (iconFile) {
                formData.append('icon', iconFile);
            }

            const response = await fetch("http://localhost:8000/api/v1/contact-page-cards", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const responseData = await response.json().catch(() => ({}));
            console.log("Create card response data:", responseData);

            if (response.ok) {
                if (responseData.success && responseData.data?.contact_card) {
                    setCards((prev) => [...prev, responseData.data.contact_card]);
                    return { success: true, card: responseData.data.contact_card };
                } else {
                    const errorMsg = responseData.message || "Failed to create card";
                    const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    ).join('; ') : '';
                    throw new Error(validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg);
                }
            } else {
                const errorMsg = responseData.message || `Failed to create card (${response.status})`;
                const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                    `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                ).join('; ') : '';
                const fullError = validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg;
                console.error("Create card error:", response.status, responseData);
                throw new Error(fullError);
            }
        } catch (err: any) {
            console.error("Error creating contact card:", err);
            setError(err.message || "Error creating contact card");
            throw err;
        }
    }, []);

    const updateCard = useCallback(async (id: number, cardData: Partial<ContactPageCard>, iconFile?: File | null) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const formData = new FormData();

            // Laravel Method Spoofing for PUT request with files
            formData.append('_method', 'PUT');

            // Add card_type if provided (for updates, it's optional)
            if (cardData.card_type) {
                formData.append('card_type', cardData.card_type);
            }

            // Add optional fields only if they have values (not empty strings or null)
            // For updates, we only send fields that have actual values
            if (cardData.badge_title !== undefined && cardData.badge_title !== null && cardData.badge_title.trim()) {
                formData.append('badge_title', cardData.badge_title.trim());
            }
            if (cardData.secondary_badge !== undefined && cardData.secondary_badge !== null && cardData.secondary_badge.trim()) {
                formData.append('secondary_badge', cardData.secondary_badge.trim());
            }
            if (cardData.label !== undefined && cardData.label !== null && cardData.label.trim()) {
                formData.append('label', cardData.label.trim());
            }
            if (cardData.phone_number_1 !== undefined && cardData.phone_number_1 !== null && cardData.phone_number_1.trim()) {
                formData.append('phone_number_1', cardData.phone_number_1.trim());
            }
            if (cardData.phone_number_2 !== undefined && cardData.phone_number_2 !== null && cardData.phone_number_2.trim()) {
                formData.append('phone_number_2', cardData.phone_number_2.trim());
            }
            if (cardData.fax_number !== undefined && cardData.fax_number !== null && cardData.fax_number.trim()) {
                formData.append('fax_number', cardData.fax_number.trim());
            }
            if (cardData.email_address !== undefined && cardData.email_address !== null && cardData.email_address.trim()) {
                formData.append('email_address', cardData.email_address.trim());
            }
            if (cardData.street_address !== undefined && cardData.street_address !== null && cardData.street_address.trim()) {
                formData.append('street_address', cardData.street_address.trim());
            }
            if (cardData.state_postal_code !== undefined && cardData.state_postal_code !== null && cardData.state_postal_code.trim()) {
                formData.append('state_postal_code', cardData.state_postal_code.trim());
            }
            if (cardData.country !== undefined && cardData.country !== null && cardData.country.trim()) {
                formData.append('country', cardData.country.trim());
            }
            if (cardData.monday_friday_hours !== undefined && cardData.monday_friday_hours !== null && cardData.monday_friday_hours.trim()) {
                formData.append('monday_friday_hours', cardData.monday_friday_hours.trim());
            }
            if (cardData.saturday_hours !== undefined && cardData.saturday_hours !== null && cardData.saturday_hours.trim()) {
                formData.append('saturday_hours', cardData.saturday_hours.trim());
            }
            if (cardData.sunday_hours !== undefined && cardData.sunday_hours !== null && cardData.sunday_hours.trim()) {
                formData.append('sunday_hours', cardData.sunday_hours.trim());
            }
            if (cardData.is_active !== undefined) {
                // Send as string "true" or "false" as Laravel expects these exact values
                formData.append('is_active', cardData.is_active ? 'true' : 'false');
            }
            if (cardData.sort_order !== undefined) {
                formData.append('sort_order', cardData.sort_order.toString());
            }

            // Add icon file if provided
            if (iconFile) {
                formData.append('icon', iconFile);
            }

            console.log(`Updating card ${id} - FormData entries:`);
            for (const [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? value.name : value);
            }

            const response = await fetch(`http://localhost:8000/api/v1/contact-page-cards/${id}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            console.log("Update card response status:", response.status);
            const responseData = await response.json().catch(() => ({}));
            console.log("Update card response data:", responseData);

            if (response.ok) {
                if (responseData.success && responseData.data?.contact_card) {
                    setCards((prev) =>
                        prev.map((card) => (card.id === id ? responseData.data.contact_card : card))
                    );
                    return { success: true, card: responseData.data.contact_card };
                } else {
                    const errorMsg = responseData.message || "Failed to update card";
                    const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    ).join('; ') : '';
                    throw new Error(validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg);
                }
            } else {
                const errorMsg = responseData.message || `Failed to update card (${response.status})`;
                const validationErrors = responseData.errors ? Object.entries(responseData.errors).map(([field, errors]: [string, any]) =>
                    `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                ).join('; ') : '';
                const fullError = validationErrors ? `${errorMsg} - ${validationErrors}` : errorMsg;
                console.error("Update card error:", response.status, responseData);
                throw new Error(fullError);
            }
        } catch (err: any) {
            console.error("Error updating contact card:", err);
            setError(err.message || "Error updating contact card");
            throw err;
        }
    }, []);

    const deleteCard = useCallback(async (id: number) => {
        try {
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await fetch(`http://localhost:8000/api/v1/contact-page-cards/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setCards((prev) => prev.filter((card) => card.id !== id));
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete card (${response.status})`);
            }
        } catch (err: any) {
            console.error("Error deleting contact card:", err);
            setError(err.message || "Error deleting contact card");
            throw err;
        }
    }, []);

    return {
        cards,
        loading,
        error,
        fetchCards,
        createCard,
        updateCard,
        deleteCard,
    };
}

