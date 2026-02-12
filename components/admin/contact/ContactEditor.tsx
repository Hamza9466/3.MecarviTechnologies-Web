"use client";

import { useState, useEffect } from "react";
import { useContactPageCards, ContactPageCard } from "./useContactPageCards";
import { useHoursOfOperation, HoursOfOperation } from "./useHoursOfOperation";
import { useSocialMedia, SocialLink, SocialMediaSection } from "./useSocialMedia";
import CardFormRenderer from "./CardFormRenderer";

export default function ContactEditor() {
    const [heroSectionData, setHeroSectionData] = useState<{
        id: number | null;
        heading: string;
        subheading: string;
        description: string;
        is_active: boolean;
    } | null>(null);
    const [heroLoading, setHeroLoading] = useState(false);
    const [heroSaving, setHeroSaving] = useState(false);
    const [heroSuccess, setHeroSuccess] = useState("");
    const [heroError, setHeroError] = useState("");

    // Contact Cards
    const {
        cards: contactCards,
        loading: cardsLoading,
        error: cardsError,
        fetchCards,
        createCard,
        updateCard,
        deleteCard,
    } = useContactPageCards();

    // Hours of Operation
    const {
        hours: hoursOfOperation,
        sectionTitle: hoursSectionTitle,
        loading: hoursLoading,
        error: hoursError,
        fetchHours,
        createHours,
        updateHours,
        deleteHours,
    } = useHoursOfOperation();

    // Social Media
    const {
        section: socialMediaSection,
        links: socialLinks,
        loading: socialMediaLoading,
        error: socialMediaError,
        fetchSocialMedia,
        saveSection: saveSocialMediaSection,
        createLink: createSocialLink,
        updateLink: updateSocialLink,
        deleteLink: deleteSocialLink,
    } = useSocialMedia();

    // Contact Form Submissions
    interface ContactFormSubmission {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string | null;
        company: string | null;
        message: string;
        is_read: boolean;
        created_at: string;
        updated_at: string;
    }

    const [formSubmissions, setFormSubmissions] = useState<ContactFormSubmission[]>([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [submissionsError, setSubmissionsError] = useState("");
    const [submissionsPage, setSubmissionsPage] = useState(1);
    const [submissionsPagination, setSubmissionsPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
    });
    const [submissionActions, setSubmissionActions] = useState<{ [key: number]: boolean }>({});

    // Team Management
    interface TeamMember {
        id: number;
        first_name: string;
        last_name: string;
        role: string;
        email: string;
        picture: string | null;
        order: number;
        created_at: string;
        updated_at: string;
    }

    const [showTeamModal, setShowTeamModal] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);
    const [teamMembersError, setTeamMembersError] = useState("");
    const [currentTeamMember, setCurrentTeamMember] = useState<{
        first_name: string;
        last_name: string;
        role: string;
        email: string;
        picture: File | null;
        order?: number;
    }>({
        first_name: '',
        last_name: '',
        role: '',
        email: '',
        picture: null,
    });
    const [editingTeamMemberId, setEditingTeamMemberId] = useState<number | null>(null);
    const [teamMemberSaving, setTeamMemberSaving] = useState(false);
    const [teamMemberSuccess, setTeamMemberSuccess] = useState("");
    const [teamMemberError, setTeamMemberError] = useState("");

    const [cardSaving, setCardSaving] = useState<{ [key: number | string]: boolean }>({});
    const [cardSuccess, setCardSuccess] = useState<{ [key: number | string]: string }>({});
    const [cardErrors, setCardErrors] = useState<{ [key: number | string]: string }>({});

    // Hours of Operation form data state
    const [hoursData, setHoursData] = useState<{ [key: number]: Partial<HoursOfOperation> }>({});
    const [hoursSaving, setHoursSaving] = useState<{ [key: number | string]: boolean }>({});
    const [hoursSuccess, setHoursSuccess] = useState<{ [key: number | string]: string }>({});
    const [hoursErrors, setHoursErrors] = useState<{ [key: number | string]: string }>({});
    const [editableSectionTitle, setEditableSectionTitle] = useState<string>("Hours of Operation");
    const [sectionTitleSaving, setSectionTitleSaving] = useState(false);
    const [sectionTitleSuccess, setSectionTitleSuccess] = useState("");
    const [sectionTitleError, setSectionTitleError] = useState("");
    const [newHoursData, setNewHoursData] = useState<Partial<HoursOfOperation>>({
        section_title: hoursSectionTitle,
        category_title: '',
        monday_friday_hours: '',
        saturday_hours: '',
        sunday_hours: '',
        sunday_status: '',
        public_holidays_hours: '',
        public_holidays_status: '',
        description_1: '',
        description_2: '',
        is_active: true,
        sort_order: 0,
    });

    const [formData, setFormData] = useState({
        // General Information
        heading: "Contact Us",
        subheading: "We're always here for you!",
        description: "We'd love to hear from you! Our world-class customer service team is always here to assist with any questions or concerns. You can reach us via phone, email, live chat, or SMS during business hours. Alternatively, complete the contact form below and we'll get back to you within one business day.",

        // Call Card
        callBadge: "Call",
        callLabel: "Call Us",
        phoneNumber1: "+1 234 567 890",
        phoneNumber2: "+1 987 654 321",
        callIcon: null as File | null,

        // Fax Card
        faxBadge: "Fax",
        faxLabel: "Fax",
        faxNumber: "1-770-347-7149",
        faxIcon: null as File | null,

        // Email Card
        emailBadge: "Email",
        emailSecondaryBadge: "Team",
        emailLabel: "Email Us",
        emailAddress: "contact@mecarvi.com",
        emailIcon: null as File | null,

        // Visit Card
        visitBadge: "Visit",
        visitLabel: "Address",
        streetAddress: "123 Main St, City",
        statePostalCode: "State 12345",
        country: "Country",
        visitIcon: null as File | null,

        // Hours of Operation
        sectionTitle: "Hours of Operation",
        storeHoursBadge: "Store Hours",
        storeHoursLabel: "Hours of Operation",
        storeMonFri: "9am – 6pm",
        storeSaturday: "10am – 4pm",
        storeSunday: "Closed",
        storeHoursIcon: null as File | null,

        // Customer Care
        customerCareTitle: "Customer Care",
        customerCareMonFri: "8am – 8pm",
        customerCareSaturday: "10am – 5pm",
        customerCareSunday: "Closed",
        customerCarePublicHolidays: "Closed",

        // Sales
        salesTitle: "Sales",
        salesMonFri: "9am – 6pm",
        salesSaturday: "11am – 4pm",
        salesSunday: "Closed",
        salesPublicHolidays: "Closed",

        // Technical Support Standard
        techSupportStandardTitle: "Technical Support (Standard)",
        techSupportStandardMonFri: "8am – 10pm",
        techSupportStandardSaturday: "9am – 8pm",
        techSupportStandardSunday: "11am – 7pm",
        techSupportStandardPublicHolidays: "10am – 7pm",

        // Technical Support Platinum
        techSupportPlatinumTitle: "Technical Support (Platinum)",
        techSupportPlatinumMonFri: "7am – 4am",
        techSupportPlatinumSaturday: "8am – 2am",
        techSupportPlatinumSunday: "8am – 11pm",
        techSupportPlatinumPublicHolidays: "8am – 2am",
    });

    // Fetch hero section data, contact cards, hours of operation, and social media on component mount
    useEffect(() => {
        fetchHeroSection();
        fetchCards();
        fetchHours();
        fetchSocialMedia();
    }, [fetchCards, fetchHours, fetchSocialMedia]);

    // Update form data when hero section data is loaded
    useEffect(() => {
        if (heroSectionData) {
            setFormData((prev) => ({
                ...prev,
                heading: heroSectionData.heading || prev.heading,
                subheading: heroSectionData.subheading || prev.subheading,
                description: heroSectionData.description || prev.description,
            }));
        }
    }, [heroSectionData]);

    const fetchHeroSection = async () => {
        try {
            setHeroLoading(true);
            setHeroError("");
            
            // Try with authentication token first
            const token = localStorage.getItem("token");
            const headers: HeadersInit = {
                "Accept": "application/json",
            };
            
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("http://localhost:8000/api/v1/contact-page-hero-sections", {
                method: "GET",
                headers,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Hero section API response:", data);
                if (data.success && data.data?.hero_sections?.length > 0) {
                    // Get the first active hero section or the first one
                    const activeSection = data.data.hero_sections.find(
                        (section: any) => section.is_active
                    ) || data.data.hero_sections[0];
                    setHeroSectionData(activeSection);
                } else {
                    // No hero section found, create a new one
                    setHeroSectionData(null);
                }
            } else if (response.status === 401) {
                // If 401, try without auth (in case endpoint is public but token is invalid)
                console.warn("401 error, trying without authentication");
                const publicResponse = await fetch("http://localhost:8000/api/v1/contact-page-hero-sections", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });
                
                if (publicResponse.ok) {
                    const data = await publicResponse.json();
                    if (data.success && data.data?.hero_sections?.length > 0) {
                        const activeSection = data.data.hero_sections.find(
                            (section: any) => section.is_active
                        ) || data.data.hero_sections[0];
                        setHeroSectionData(activeSection);
                    } else {
                        setHeroSectionData(null);
                    }
                } else {
                    console.error("Failed to fetch hero section (public):", publicResponse.status);
                    setHeroError("Authentication may be required. Please log in to view hero section data.");
                }
            } else {
                console.error("Failed to fetch hero section:", response.status);
                setHeroError("Failed to load hero section data");
            }
        } catch (err) {
            console.error("Error fetching hero section:", err);
            setHeroError("Error loading hero section data. Please check your connection.");
        } finally {
            setHeroLoading(false);
        }
    };

    const handleSaveHeroSection = async () => {
        try {
            setHeroSaving(true);
            setHeroError("");
            setHeroSuccess("");

            const token = localStorage.getItem("token");
            if (!token) {
                setHeroError("Authentication required. Please log in.");
                return;
            }

            const payload = {
                heading: formData.heading,
                subheading: formData.subheading,
                description: formData.description,
                is_active: true,
            };

            let response: Response;
            if (heroSectionData?.id) {
                // Update existing hero section - using POST method
                response = await fetch(
                    `http://localhost:8000/api/v1/contact-page-hero-sections/${heroSectionData.id}/update`,
                    {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );
            } else {
                // Create new hero section
                response = await fetch("http://localhost:8000/api/v1/contact-page-hero-sections", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
            }

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setHeroSuccess("Hero section saved successfully!");
                    // Update hero section data with the response
                    if (data.data?.hero_section) {
                        setHeroSectionData(data.data.hero_section);
                    }
                    // Refresh to get updated data
                    await fetchHeroSection();
                    setTimeout(() => setHeroSuccess(""), 3000);
                } else {
                    setHeroError(data.message || "Failed to save hero section");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                setHeroError(errorData.message || `Failed to save hero section (${response.status})`);
            }
        } catch (err) {
            console.error("Error saving hero section:", err);
            setHeroError("Error saving hero section. Please try again.");
        } finally {
            setHeroSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, [fieldName]: file }));
    };

    // Helper function to get image URL
    const getImageUrl = (iconPath: string | null | undefined): string | null => {
        if (!iconPath) return null;
        if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
            // Fix localhost URLs that might be missing port
            if (iconPath.startsWith('http://localhost/storage/') || iconPath.startsWith('http://localhost/')) {
                return iconPath.replace('http://localhost/', 'http://localhost:8000/');
            }
            return iconPath;
        }
        // Remove leading '/storage/' or 'storage/' if present to avoid double paths
        let cleanPath = iconPath;
        if (cleanPath.startsWith('/storage/')) {
            cleanPath = cleanPath.substring(9); // Remove '/storage/'
        } else if (cleanPath.startsWith('storage/')) {
            cleanPath = cleanPath.substring(8); // Remove 'storage/'
        }
        // Remove leading slash if present
        cleanPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
        return `http://localhost:8000/storage/${cleanPath}`;
    };

    // Get card by type
    const getCardByType = (cardType: ContactPageCard['card_type']): ContactPageCard | null => {
        return contactCards.find((card) => card.card_type === cardType) || null;
    };

    // Card data state for each card type
    const [cardData, setCardData] = useState<{
        [key: string]: {
            badge_title: string;
            secondary_badge?: string;
            label: string;
            phone_number_1?: string;
            phone_number_2?: string;
            fax_number?: string;
            email_address?: string;
            street_address?: string;
            state_postal_code?: string;
            country?: string;
            monday_friday_hours?: string;
            saturday_hours?: string;
            sunday_hours?: string;
            iconFile: File | null;
        };
    }>({});

    // Initialize card data when cards are loaded
    useEffect(() => {
        if (contactCards.length > 0) {
            const newCardData: typeof cardData = {};
            contactCards.forEach((card) => {
                newCardData[card.card_type] = {
                    badge_title: card.badge_title || '',
                    secondary_badge: card.secondary_badge || '',
                    label: card.label || '',
                    phone_number_1: card.phone_number_1 || '',
                    phone_number_2: card.phone_number_2 || '',
                    fax_number: card.fax_number || '',
                    email_address: card.email_address || '',
                    street_address: card.street_address || '',
                    state_postal_code: card.state_postal_code || '',
                    country: card.country || '',
                    monday_friday_hours: card.monday_friday_hours || '',
                    saturday_hours: card.saturday_hours || '',
                    sunday_hours: card.sunday_hours || '',
                    iconFile: null,
                };
            });
            setCardData(newCardData);
        }
    }, [contactCards]);

    const handleCardInputChange = (cardType: string, field: string, value: string) => {
        setCardData((prev) => ({
            ...prev,
            [cardType]: {
                ...prev[cardType],
                [field]: value,
            },
        }));
    };

    const handleCardFileChange = (cardType: string, file: File | null) => {
        setCardData((prev) => ({
            ...prev,
            [cardType]: {
                ...prev[cardType],
                iconFile: file,
            },
        }));
    };

    const handleSaveCard = async (cardType: ContactPageCard['card_type']) => {
        try {
            const card = getCardByType(cardType);
            const data = cardData[cardType];
            
            if (!data) {
                setCardErrors((prev) => ({
            ...prev,
                    [cardType]: 'Card data not found',
                }));
                return;
            }

            setCardSaving((prev) => ({ ...prev, [cardType]: true }));
            setCardErrors((prev) => ({ ...prev, [cardType]: '' }));
            setCardSuccess((prev) => ({ ...prev, [cardType]: '' }));

            // Build payload - only include fields with actual values
            const cardPayload: Partial<ContactPageCard> = {
                card_type: cardType,
                is_active: true,
            };

            // Add optional fields only if they have values
            if (data.badge_title && data.badge_title.trim()) {
                cardPayload.badge_title = data.badge_title.trim();
            }
            if (data.label && data.label.trim()) {
                cardPayload.label = data.label.trim();
            }
            if (card?.sort_order !== undefined) {
                cardPayload.sort_order = card.sort_order;
            } else {
                cardPayload.sort_order = 0;
            }

            // Add type-specific fields only if they have values
            if (cardType === 'call') {
                if (data.phone_number_1 && data.phone_number_1.trim()) {
                    cardPayload.phone_number_1 = data.phone_number_1.trim();
                }
                if (data.phone_number_2 && data.phone_number_2.trim()) {
                    cardPayload.phone_number_2 = data.phone_number_2.trim();
                }
            } else if (cardType === 'fax') {
                if (data.fax_number && data.fax_number.trim()) {
                    cardPayload.fax_number = data.fax_number.trim();
                }
            } else if (cardType === 'email') {
                if (data.secondary_badge && data.secondary_badge.trim()) {
                    cardPayload.secondary_badge = data.secondary_badge.trim();
                }
                if (data.email_address && data.email_address.trim()) {
                    cardPayload.email_address = data.email_address.trim();
                }
            } else if (cardType === 'visit') {
                if (data.street_address && data.street_address.trim()) {
                    cardPayload.street_address = data.street_address.trim();
                }
                if (data.state_postal_code && data.state_postal_code.trim()) {
                    cardPayload.state_postal_code = data.state_postal_code.trim();
                }
                if (data.country && data.country.trim()) {
                    cardPayload.country = data.country.trim();
                }
            }

            console.log(`Saving ${cardType} card:`, cardPayload);
            console.log(`Icon file:`, data.iconFile);

            if (card) {
                // Update existing card
                console.log(`Updating card ID: ${card.id}`);
                const result = await updateCard(card.id, cardPayload, data.iconFile || undefined);
                if (result?.success) {
                    setCardSuccess((prev) => ({ ...prev, [cardType]: 'Card updated successfully!' }));
                }
            } else {
                // Create new card
                console.log(`Creating new ${cardType} card`);
                const result = await createCard(cardPayload, data.iconFile || undefined);
                if (result?.success) {
                    setCardSuccess((prev) => ({ ...prev, [cardType]: 'Card created successfully!' }));
                }
            }

            // Refresh cards
            await fetchCards();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setCardSuccess((prev) => ({ ...prev, [cardType]: '' }));
            }, 3000);
        } catch (err: any) {
            console.error(`Error saving ${cardType} card:`, err);
            const errorMessage = err.message || 'Failed to save card';
            setCardErrors((prev) => ({
                ...prev,
                [cardType]: errorMessage,
            }));
        } finally {
            setCardSaving((prev) => ({ ...prev, [cardType]: false }));
        }
    };

    const handleDeleteCard = async (cardType: ContactPageCard['card_type']) => {
        const card = getCardByType(cardType);
        if (!card) return;

        if (!confirm(`Are you sure you want to delete the ${cardType} card?`)) {
            return;
        }

        try {
            await deleteCard(card.id);
            await fetchCards();
        } catch (err: any) {
            setCardErrors((prev) => ({
                ...prev,
                [cardType]: err.message || 'Failed to delete card',
            }));
        }
    };

    // Initialize hours data when hours are loaded
    useEffect(() => {
        if (hoursOfOperation.length > 0) {
            const newHoursData: { [key: number]: Partial<HoursOfOperation> } = {};
            hoursOfOperation.forEach((hour) => {
                newHoursData[hour.id] = {
                    section_title: hour.section_title || hoursSectionTitle,
                    category_title: hour.category_title || '',
                    monday_friday_hours: hour.monday_friday_hours || '',
                    saturday_hours: hour.saturday_hours || '',
                    sunday_hours: hour.sunday_hours || '',
                    sunday_status: hour.sunday_status || '',
                    public_holidays_hours: hour.public_holidays_hours || '',
                    public_holidays_status: hour.public_holidays_status || '',
                    description_1: hour.description_1 || '',
                    description_2: hour.description_2 || '',
                    is_active: hour.is_active,
                    sort_order: hour.sort_order,
                };
            });
            setHoursData(newHoursData);
        }
    }, [hoursOfOperation, hoursSectionTitle]);

    // Update newHoursData when sectionTitle changes
    useEffect(() => {
        setNewHoursData((prev) => ({
            ...prev,
            section_title: hoursSectionTitle,
        }));
        setEditableSectionTitle(hoursSectionTitle);
    }, [hoursSectionTitle]);

    const handleHoursInputChange = (hourId: number | 'new', field: keyof HoursOfOperation, value: string | boolean | number) => {
        if (hourId === 'new') {
            setNewHoursData((prev) => ({
                ...prev,
                [field]: value,
            }));
        } else {
            setHoursData((prev) => ({
                ...prev,
                [hourId]: {
                    ...prev[hourId],
                    [field]: value,
                },
            }));
        }
    };

    const handleSaveHours = async (hourId: number | 'new') => {
        try {
            const data = hourId === 'new' ? newHoursData : hoursData[hourId];
            
            if (!data) {
                setHoursErrors((prev) => ({
                    ...prev,
                    [hourId]: 'Hours data not found',
                }));
                return;
            }

            setHoursSaving((prev) => ({ ...prev, [hourId]: true }));
            setHoursErrors((prev) => ({ ...prev, [hourId]: '' }));
            setHoursSuccess((prev) => ({ ...prev, [hourId]: '' }));

            // Build payload - only include fields with actual values
            const payload: Partial<HoursOfOperation> = {};
            if (data.section_title && data.section_title.trim()) payload.section_title = data.section_title.trim();
            if (data.category_title && data.category_title.trim()) payload.category_title = data.category_title.trim();
            if (data.monday_friday_hours && data.monday_friday_hours.trim()) payload.monday_friday_hours = data.monday_friday_hours.trim();
            if (data.saturday_hours && data.saturday_hours.trim()) payload.saturday_hours = data.saturday_hours.trim();
            if (data.sunday_hours && data.sunday_hours.trim()) payload.sunday_hours = data.sunday_hours.trim();
            if (data.sunday_status && data.sunday_status.trim()) payload.sunday_status = data.sunday_status.trim();
            if (data.public_holidays_hours && data.public_holidays_hours.trim()) payload.public_holidays_hours = data.public_holidays_hours.trim();
            if (data.public_holidays_status && data.public_holidays_status.trim()) payload.public_holidays_status = data.public_holidays_status.trim();
            if (data.description_1 && data.description_1.trim()) payload.description_1 = data.description_1.trim();
            if (data.description_2 && data.description_2.trim()) payload.description_2 = data.description_2.trim();
            if (data.is_active !== undefined) payload.is_active = data.is_active;
            if (data.sort_order !== undefined) payload.sort_order = data.sort_order;

            if (hourId === 'new') {
                // Use editable section title if provided, otherwise use the one from API
                if (editableSectionTitle.trim()) {
                    payload.section_title = editableSectionTitle.trim();
                }
                await createHours(payload);
                setHoursSuccess((prev) => ({ ...prev, [hourId]: 'Hours of operation created successfully!' }));
                // Reset new hours form
                setNewHoursData({
                    section_title: editableSectionTitle || hoursSectionTitle,
                    category_title: '',
                    monday_friday_hours: '',
                    saturday_hours: '',
                    sunday_hours: '',
                    sunday_status: '',
                    public_holidays_hours: '',
                    public_holidays_status: '',
                    description_1: '',
                    description_2: '',
                    is_active: true,
                    sort_order: hoursOfOperation.length,
                });
            } else {
                await updateHours(hourId, payload);
                setHoursSuccess((prev) => ({ ...prev, [hourId]: 'Hours of operation updated successfully!' }));
            }

            // Refresh hours
            await fetchHours();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setHoursSuccess((prev) => ({ ...prev, [hourId]: '' }));
            }, 3000);
        } catch (err: any) {
            console.error(`Error saving hours ${hourId}:`, err);
            const errorMessage = err.message || 'Failed to save hours of operation';
            setHoursErrors((prev) => ({
                ...prev,
                [hourId]: errorMessage,
            }));
        } finally {
            setHoursSaving((prev) => ({ ...prev, [hourId]: false }));
        }
    };

    const handleDeleteHours = async (hourId: number) => {
        try {
            const hour = hoursOfOperation.find((h) => h.id === hourId);
            if (!hour) return;

            if (confirm(`Are you sure you want to delete "${hour.category_title}"?`)) {
                await deleteHours(hourId);
                await fetchHours();
            }
        } catch (err: any) {
            setHoursErrors((prev) => ({
                ...prev,
                [hourId]: err.message || 'Failed to delete hours of operation',
            }));
        }
    };

    const handleSaveAllCards = async () => {
        const cardTypes: ContactPageCard['card_type'][] = ['call', 'fax', 'email', 'visit'];
        let successCount = 0;
        let errorCount = 0;

        for (const cardType of cardTypes) {
            try {
                await handleSaveCard(cardType);
                successCount++;
            } catch (err) {
                errorCount++;
                console.error(`Failed to save ${cardType} card:`, err);
            }
        }

        if (successCount > 0) {
            setCardSuccess((prev) => ({
                ...prev,
                _all: `${successCount} card(s) saved successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
            }));
            setTimeout(() => {
                setCardSuccess((prev) => {
                    const newSuccess = { ...prev };
                    delete newSuccess._all;
                    return newSuccess;
                });
            }, 5000);
        }

        if (errorCount > 0 && successCount === 0) {
            setCardErrors((prev) => ({
                ...prev,
                _all: `Failed to save ${errorCount} card(s). Please check individual card errors.`,
            }));
        }
    };

    const handleSaveAllHours = async () => {
        let successCount = 0;
        let errorCount = 0;

        // Save all existing hours
        for (const hour of hoursOfOperation) {
            try {
                await handleSaveHours(hour.id);
                successCount++;
            } catch (err) {
                errorCount++;
                console.error(`Failed to save hours ${hour.id}:`, err);
            }
        }

        if (successCount > 0) {
            setHoursSuccess((prev) => ({
                ...prev,
                _all: `${successCount} hour(s) saved successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
            }));
            setTimeout(() => {
                setHoursSuccess((prev) => {
                    const newSuccess = { ...prev };
                    delete newSuccess._all;
                    return newSuccess;
                });
            }, 5000);
        }

        if (errorCount > 0 && successCount === 0) {
            setHoursErrors((prev) => ({
                ...prev,
                _all: `Failed to save ${errorCount} hour(s). Please check individual hour errors.`,
            }));
        }
    };

    const handleSaveSectionTitle = async () => {
        if (!editableSectionTitle.trim()) {
            setSectionTitleError("Section title cannot be empty");
            return;
        }

        try {
            setSectionTitleSaving(true);
            setSectionTitleError("");
            setSectionTitleSuccess("");

            if (hoursOfOperation.length === 0) {
                // No hours yet: create one default entry with this section title so it gets saved
                try {
                    await createHours({
                        section_title: editableSectionTitle.trim(),
                        category_title: "General",
                        monday_friday_hours: null,
                        saturday_hours: null,
                        sunday_hours: null,
                        sunday_status: null,
                        public_holidays_hours: null,
                        public_holidays_status: null,
                        description_1: null,
                        description_2: null,
                        is_active: true,
                        sort_order: 0,
                    });
                    setSectionTitleSuccess("Section title saved. One default hour entry was created—you can edit or add more below.");
                    await fetchHours();
                    setTimeout(() => setSectionTitleSuccess(""), 5000);
                } catch (err: any) {
                    setSectionTitleError(err?.message || "Failed to save section title. Please try again.");
                }
                return;
            }

            // Update section title for all existing hours entries
            let successCount = 0;
            let errorCount = 0;
            let lastErrorMessage = "";

            for (const hour of hoursOfOperation) {
                try {
                    const payload: Partial<HoursOfOperation> = {
                        section_title: editableSectionTitle.trim(),
                    };
                    await updateHours(hour.id, payload);
                    successCount++;
                } catch (err: any) {
                    errorCount++;
                    lastErrorMessage = err?.message || String(err);
                    console.error(`Failed to update section title for hour ${hour.id}:`, err);
                }
            }

            if (successCount > 0) {
                setSectionTitleSuccess(`Section title updated successfully for ${successCount} hour(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
                await fetchHours();
                setTimeout(() => setSectionTitleSuccess(""), 3000);
            } else {
                setSectionTitleError(lastErrorMessage || "Failed to update section title for all hours. Please try again.");
            }
        } catch (err: any) {
            console.error("Error saving section title:", err);
            setSectionTitleError(err.message || "Failed to save section title");
        } finally {
            setSectionTitleSaving(false);
        }
    };

    // Social Media Section state
    const [socialSectionData, setSocialSectionData] = useState<{
        heading: string;
        description: string;
    }>({
        heading: "",
        description: "",
    });
    const [socialSectionSaving, setSocialSectionSaving] = useState(false);
    const [socialSectionSuccess, setSocialSectionSuccess] = useState("");
    const [socialSectionError, setSocialSectionError] = useState("");

    // Social Links state
    const [socialLinkData, setSocialLinkData] = useState<{ [key: number]: Partial<SocialLink & { iconFile: File | null }> }>({});
    const [newSocialLinkData, setNewSocialLinkData] = useState<Partial<SocialLink & { iconFile: File | null }>>({
                    platform_name: "",
        platform_url: "",
        iconFile: null,
        is_active: true,
        sort_order: 0,
    });
    const [socialLinkSaving, setSocialLinkSaving] = useState<Record<string | number, boolean>>({});
    const [socialLinkSuccess, setSocialLinkSuccess] = useState<Record<string | number, string>>({});
    const [socialLinkErrors, setSocialLinkErrors] = useState<Record<string | number, string>>({});

    // Initialize social media section data when loaded
    useEffect(() => {
        if (socialMediaSection) {
            setSocialSectionData({
                heading: socialMediaSection.heading || "",
                description: socialMediaSection.description || "",
            });
        }
    }, [socialMediaSection]);

    // Initialize social link data when links are loaded
    useEffect(() => {
        if (socialLinks.length > 0) {
            const newLinkData: typeof socialLinkData = {};
            socialLinks.forEach((link) => {
                newLinkData[link.id] = {
                    platform_name: link.platform_name || "",
                    platform_url: link.platform_url || "",
                    iconFile: null,
                    is_active: link.is_active,
                    sort_order: link.sort_order,
                };
            });
            setSocialLinkData(newLinkData);
        }
    }, [socialLinks]);

    const handleSaveSocialSection = async () => {
        try {
            setSocialSectionSaving(true);
            setSocialSectionError("");
            setSocialSectionSuccess("");

            await saveSocialMediaSection({
                heading: socialSectionData.heading.trim() || null,
                description: socialSectionData.description.trim() || null,
                is_active: true,
            });

            setSocialSectionSuccess("Social media section saved successfully!");
            await fetchSocialMedia();
            setTimeout(() => setSocialSectionSuccess(""), 3000);
        } catch (err: any) {
            console.error("Error saving social media section:", err);
            setSocialSectionError(err.message || "Failed to save social media section");
        } finally {
            setSocialSectionSaving(false);
        }
    };

    const handleSocialLinkInputChange = (linkId: number | 'new', field: keyof SocialLink, value: string | boolean | number) => {
        if (linkId === 'new') {
            setNewSocialLinkData((prev) => ({
                ...prev,
                [field]: value,
            }));
        } else {
            setSocialLinkData((prev) => ({
                ...prev,
                [linkId]: {
                    ...prev[linkId],
                    [field]: value,
                },
            }));
        }
    };

    const handleSocialLinkFileChange = (linkId: number | 'new', file: File | null) => {
        if (linkId === 'new') {
            setNewSocialLinkData((prev) => ({
            ...prev,
                iconFile: file,
            }));
        } else {
            setSocialLinkData((prev) => ({
                ...prev,
                [linkId]: {
                    ...prev[linkId],
                    iconFile: file,
                },
            }));
        }
    };

    const handleSaveSocialLink = async (linkId: number | 'new') => {
        try {
            const data = linkId === 'new' ? newSocialLinkData : socialLinkData[linkId];
            
            if (!data) {
                setSocialLinkErrors((prev) => ({
                    ...prev,
                    [linkId]: 'Link data not found',
                }));
                return;
            }

            if (!data.platform_name?.trim() || !data.platform_url?.trim()) {
                setSocialLinkErrors((prev) => ({
                    ...prev,
                    [linkId]: 'Platform name and URL are required',
                }));
                return;
            }

            setSocialLinkSaving((prev) => ({ ...prev, [linkId]: true }));
            setSocialLinkErrors((prev) => ({ ...prev, [linkId]: '' }));
            setSocialLinkSuccess((prev) => ({ ...prev, [linkId]: '' }));

            const payload: Partial<SocialLink> = {
                platform_name: data.platform_name.trim(),
                platform_url: data.platform_url.trim(),
                is_active: data.is_active ?? true,
                sort_order: data.sort_order ?? 0,
            };

            if (linkId === 'new') {
                const result = await createSocialLink(payload, data.iconFile || undefined);
                if (result?.success) {
                    setSocialLinkSuccess((prev) => ({ ...prev, [linkId]: 'Social link created successfully!' }));
                    // Reset new link form
                    setNewSocialLinkData({
                        platform_name: "",
                        platform_url: "",
                        iconFile: null,
                        is_active: true,
                        sort_order: socialLinks.length,
                    });
                }
            } else {
                const result = await updateSocialLink(linkId, payload, data.iconFile || undefined);
                if (result?.success) {
                    setSocialLinkSuccess((prev) => ({ ...prev, [linkId]: 'Social link updated successfully!' }));
                }
            }

            // Refresh links
            await fetchSocialMedia();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSocialLinkSuccess((prev) => ({ ...prev, [linkId]: '' }));
            }, 3000);
        } catch (err: any) {
            console.error(`Error saving social link ${linkId}:`, err);
            const errorMessage = err.message || 'Failed to save social link';
            setSocialLinkErrors((prev) => ({
                ...prev,
                [linkId]: errorMessage,
            }));
        } finally {
            setSocialLinkSaving((prev) => ({ ...prev, [linkId]: false }));
        }
    };

    const handleDeleteSocialLink = async (linkId: number) => {
        try {
            const link = socialLinks.find((l) => l.id === linkId);
            if (!link) return;

            if (confirm(`Are you sure you want to delete "${link.platform_name}"?`)) {
                await deleteSocialLink(linkId);
                await fetchSocialMedia();
            }
        } catch (err: any) {
            setSocialLinkErrors((prev) => ({
                ...prev,
                [linkId]: err.message || 'Failed to delete social link',
            }));
        }
    };

    // Contact Form Submissions Functions
    const fetchFormSubmissions = async (page: number = 1) => {
        try {
            setSubmissionsLoading(true);
            setSubmissionsError("");

            const token = localStorage.getItem("token");
            if (!token) {
                setSubmissionsError("Authentication required. Please log in.");
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/v1/contact-form-submissions?page=${page}&per_page=15`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setFormSubmissions(data.data.data || []);
                    setSubmissionsPagination({
                        current_page: data.data.current_page || 1,
                        last_page: data.data.last_page || 1,
                        per_page: data.data.per_page || 15,
                        total: data.data.total || 0,
                        from: data.data.from || 0,
                        to: data.data.to || 0,
                    });
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSubmissionsError(errorData.message || `Failed to fetch submissions (${response.status})`);
            }
        } catch (err) {
            console.error("Error fetching form submissions:", err);
            setSubmissionsError("Error loading form submissions. Please check your connection.");
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            setSubmissionActions((prev) => ({ ...prev, [id]: true }));

            const token = localStorage.getItem("token");
            if (!token) {
                setSubmissionsError("Authentication required. Please log in.");
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/v1/contact-form-submissions/${id}/mark-read`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                await fetchFormSubmissions(submissionsPage);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSubmissionsError(errorData.message || "Failed to mark as read");
            }
        } catch (err) {
            console.error("Error marking submission as read:", err);
            setSubmissionsError("Error marking submission as read. Please try again.");
        } finally {
            setSubmissionActions((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleMarkAsUnread = async (id: number) => {
        try {
            setSubmissionActions((prev) => ({ ...prev, [id]: true }));

            const token = localStorage.getItem("token");
            if (!token) {
                setSubmissionsError("Authentication required. Please log in.");
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/v1/contact-form-submissions/${id}/mark-unread`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                await fetchFormSubmissions(submissionsPage);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSubmissionsError(errorData.message || "Failed to mark as unread");
            }
        } catch (err) {
            console.error("Error marking submission as unread:", err);
            setSubmissionsError("Error marking submission as unread. Please try again.");
        } finally {
            setSubmissionActions((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleDeleteSubmission = async (id: number) => {
        try {
            const submission = formSubmissions.find((s) => s.id === id);
            if (!submission) return;

            if (!confirm(`Are you sure you want to delete the submission from ${submission.first_name} ${submission.last_name}?`)) {
                return;
            }

            setSubmissionActions((prev) => ({ ...prev, [id]: true }));

            const token = localStorage.getItem("token");
            if (!token) {
                setSubmissionsError("Authentication required. Please log in.");
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/v1/contact-form-submissions/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                await fetchFormSubmissions(submissionsPage);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSubmissionsError(errorData.message || "Failed to delete submission");
            }
        } catch (err) {
            console.error("Error deleting submission:", err);
            setSubmissionsError("Error deleting submission. Please try again.");
        } finally {
            setSubmissionActions((prev) => ({ ...prev, [id]: false }));
        }
    };

    // Fetch form submissions on component mount
    useEffect(() => {
        fetchFormSubmissions(1);
    }, []);

    // Team Management API Functions
    const fetchTeamMembers = async () => {
        try {
            setTeamMembersLoading(true);
            setTeamMembersError("");

            const response = await fetch("http://localhost:8000/api/v1/team-members", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data?.team_members) {
                    setTeamMembers(data.data.team_members);
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                setTeamMembersError(errorData.message || `Failed to fetch team members (${response.status})`);
            }
        } catch (err) {
            console.error("Error fetching team members:", err);
            setTeamMembersError("Error loading team members. Please check your connection.");
        } finally {
            setTeamMembersLoading(false);
        }
    };

    const createTeamMember = async (memberData: {
        first_name: string;
        last_name: string;
        role: string;
        email: string;
        picture?: File | null;
        order?: number;
    }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required. Please log in.");
            }

            const formData = new FormData();
            formData.append("first_name", memberData.first_name.trim());
            formData.append("last_name", memberData.last_name.trim());
            formData.append("role", memberData.role.trim());
            formData.append("email", memberData.email.trim());
            if (memberData.picture) {
                formData.append("picture", memberData.picture);
            }
            if (memberData.order !== undefined) {
                formData.append("order", memberData.order.toString());
            }

            const response = await fetch("http://localhost:8000/api/v1/team-members", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    await fetchTeamMembers();
                    return data.data.team_member;
                } else {
                    throw new Error(data.message || "Failed to create team member");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `Failed to create team member (${response.status})`;
                if (errorData.errors) {
                    const validationErrors = Object.entries(errorData.errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
                        .join("\n");
                    throw new Error(`${errorMessage}\n${validationErrors}`);
                }
                throw new Error(errorMessage);
            }
        } catch (err: any) {
            console.error("Error creating team member:", err);
            throw err;
        }
    };

    const updateTeamMember = async (id: number, memberData: {
        first_name?: string;
        last_name?: string;
        role?: string;
        email?: string;
        picture?: File | null;
        order?: number;
    }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required. Please log in.");
            }

            const formData = new FormData();
            
            // Laravel Method Spoofing for PUT request with files
            formData.append('_method', 'PUT');

            if (memberData.first_name !== undefined) {
                formData.append("first_name", memberData.first_name.trim());
            }
            if (memberData.last_name !== undefined) {
                formData.append("last_name", memberData.last_name.trim());
            }
            if (memberData.role !== undefined) {
                formData.append("role", memberData.role.trim());
            }
            if (memberData.email !== undefined) {
                formData.append("email", memberData.email.trim());
            }
            if (memberData.picture) {
                formData.append("picture", memberData.picture);
            }
            if (memberData.order !== undefined) {
                formData.append("order", memberData.order.toString());
            }

            const response = await fetch(`http://localhost:8000/api/v1/team-members/${id}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    await fetchTeamMembers();
                    return data.data.team_member;
                } else {
                    throw new Error(data.message || "Failed to update team member");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `Failed to update team member (${response.status})`;
                if (errorData.errors) {
                    const validationErrors = Object.entries(errorData.errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
                        .join("\n");
                    throw new Error(`${errorMessage}\n${validationErrors}`);
                }
                throw new Error(errorMessage);
            }
        } catch (err: any) {
            console.error("Error updating team member:", err);
            throw err;
        }
    };

    const deleteTeamMember = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required. Please log in.");
            }

            const response = await fetch(`http://localhost:8000/api/v1/team-members/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    await fetchTeamMembers();
                } else {
                    throw new Error(data.message || "Failed to delete team member");
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete team member (${response.status})`);
            }
        } catch (err: any) {
            console.error("Error deleting team member:", err);
            throw err;
        }
    };

    // Team Management Handlers
    const handleAddTeamMember = () => {
        setCurrentTeamMember({
            first_name: '',
            last_name: '',
            role: '',
            email: '',
            picture: null,
        });
        setEditingTeamMemberId(null);
        setTeamMemberError("");
        setTeamMemberSuccess("");
    };

    const handleEditTeamMember = (member: TeamMember) => {
        setCurrentTeamMember({
            first_name: member.first_name,
            last_name: member.last_name,
            role: member.role,
            email: member.email,
            picture: null, // Don't set picture file, it's already on server
            order: member.order,
        });
        setEditingTeamMemberId(member.id);
        setTeamMemberError("");
        setTeamMemberSuccess("");
    };

    const handleSaveTeamMember = async () => {
        if (!currentTeamMember.first_name.trim() || !currentTeamMember.last_name.trim() || 
            !currentTeamMember.role.trim() || !currentTeamMember.email.trim()) {
            setTeamMemberError("Please fill in all required fields");
            return;
        }

        try {
            setTeamMemberSaving(true);
            setTeamMemberError("");
            setTeamMemberSuccess("");

            if (editingTeamMemberId !== null) {
                // Update existing member
                const result = await updateTeamMember(editingTeamMemberId, {
                    first_name: currentTeamMember.first_name,
                    last_name: currentTeamMember.last_name,
                    role: currentTeamMember.role,
                    email: currentTeamMember.email,
                    picture: currentTeamMember.picture,
                    order: currentTeamMember.order,
                });
                if (result) {
                    setTeamMemberSuccess("Team member updated successfully!");
                }
            } else {
                // Create new member
                const result = await createTeamMember({
                    first_name: currentTeamMember.first_name,
                    last_name: currentTeamMember.last_name,
                    role: currentTeamMember.role,
                    email: currentTeamMember.email,
                    picture: currentTeamMember.picture,
                    order: currentTeamMember.order,
                });
                if (result) {
                    setTeamMemberSuccess("Team member created successfully!");
                }
            }

            // Reset form
            setCurrentTeamMember({
                first_name: '',
                last_name: '',
                role: '',
                email: '',
                picture: null,
            });
            setEditingTeamMemberId(null);

            setTimeout(() => setTeamMemberSuccess(""), 3000);
        } catch (err: any) {
            console.error("Error saving team member:", err);
            setTeamMemberError(err.message || "Failed to save team member");
        } finally {
            setTeamMemberSaving(false);
        }
    };

    const handleTeamPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCurrentTeamMember(prev => ({ ...prev, picture: file }));
    };

    const getTeamMemberImageUrl = (picture: string | File | null | undefined): string | null => {
        if (!picture) return null;
        if (picture instanceof File) {
            return URL.createObjectURL(picture);
        }
        if (typeof picture === 'string') {
            // If it's already a full URL, return as is
            if (picture.startsWith('http://') || picture.startsWith('https://')) {
                // Fix localhost URLs that might be missing port
                if (picture.startsWith('http://localhost/storage/') || picture.startsWith('http://localhost/')) {
                    return picture.replace('http://localhost/', 'http://localhost:8000/');
                }
                return picture;
            }
            // Remove leading /storage/ or storage/ if present
            let cleanPath = picture;
            if (cleanPath.startsWith('/storage/')) {
                cleanPath = cleanPath.substring(9); // Remove '/storage/'
            } else if (cleanPath.startsWith('storage/')) {
                cleanPath = cleanPath.substring(8); // Remove 'storage/'
            }
            // Remove leading slash if present
            cleanPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
            return `http://localhost:8000/storage/${cleanPath}`;
        }
        return null;
    };

    const handleDeleteTeamMember = async (id: number) => {
        if (!confirm('Are you sure you want to delete this team member?')) {
            return;
        }

        try {
            await deleteTeamMember(id);
            setTeamMemberSuccess("Team member deleted successfully!");
            setTimeout(() => setTeamMemberSuccess(""), 3000);
        } catch (err: any) {
            console.error("Error deleting team member:", err);
            setTeamMemberError(err.message || "Failed to delete team member");
        }
    };

    const getInitials = (firstName: string, lastName: string): string => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const handleCloseTeamModal = () => {
        setShowTeamModal(false);
        setCurrentTeamMember({
            first_name: '',
            last_name: '',
            role: '',
            email: '',
            picture: null,
        });
        setEditingTeamMemberId(null);
        setTeamMemberError("");
        setTeamMemberSuccess("");
    };

    // Fetch team members when modal opens
    useEffect(() => {
        if (showTeamModal) {
            fetchTeamMembers();
        }
    }, [showTeamModal]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-8">
                {/* General Information Section - Hero Section */}
                <div>
                    <div className="flex flex-col items-start mb-6">
                        <h3 className="text-lg font-bold text-pink-600 mb-2">Edit Contact Us Page (General Information)</h3>
                        <div className="h-0.5 bg-pink-600 w-full"></div>
                    </div>

                    {/* Success/Error Messages */}
                    {heroSuccess && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {heroSuccess}
                        </div>
                    )}
                    {heroError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {heroError}
                        </div>
                    )}

                    {heroLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                            <p className="mt-4 text-gray-600">Loading hero section data...</p>
                        </div>
                    ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                <input
                                    type="text"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                                <input
                                    type="text"
                                    name="subheading"
                                    value={formData.subheading}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
                            />
                        </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveHeroSection}
                                    disabled={heroSaving}
                                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {heroSaving ? "Saving..." : "Save Hero Section"}
                                </button>
                    </div>
                        </div>
                    )}
                </div>

                {/* Contact Cards Section */}
                <div>
                    <div className="flex flex-col items-start mb-6">
                        <div className="flex justify-between items-center w-full mb-2">
                            <h3 className="text-lg font-bold text-pink-600">Contact Cards</h3>
                            <button
                                onClick={handleSaveAllCards}
                                disabled={cardsLoading || Object.values(cardSaving).some(saving => saving)}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {Object.values(cardSaving).some(saving => saving) ? 'Saving...' : 'Save All Cards'}
                            </button>
                        </div>
                        <div className="h-0.5 bg-pink-600 w-full"></div>
                    </div>

                    {cardsError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <strong>Error:</strong> {cardsError}
                                </div>
                                <button
                                    onClick={fetchCards}
                                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm whitespace-nowrap"
                                >
                                    Retry
                                </button>
                                </div>
                                </div>
                    )}

                    {cardSuccess._all && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {cardSuccess._all}
                                </div>
                    )}

                    {cardErrors._all && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {cardErrors._all}
                                </div>
                    )}

                    {cardsLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                            <p className="mt-4 text-gray-600">Loading contact cards...</p>
                            </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(['call', 'fax', 'email', 'visit'] as ContactPageCard['card_type'][]).map((cardType) => {
                                const card = getCardByType(cardType);
                                const data = cardData[cardType] || {
                                    badge_title: '',
                                    label: '',
                                    iconFile: null,
                                };

                                return (
                                    <CardFormRenderer
                                        key={cardType}
                                        cardType={cardType}
                                        card={card}
                                        cardData={data}
                                        onInputChange={handleCardInputChange}
                                        onFileChange={handleCardFileChange}
                                        onSave={handleSaveCard}
                                        onDelete={handleDeleteCard}
                                        onOpenTeam={cardType === 'email' ? () => setShowTeamModal(true) : undefined}
                                        saving={cardSaving[cardType] || false}
                                        success={cardSuccess[cardType] || ''}
                                        error={cardErrors[cardType] || ''}
                                        getImageUrl={getImageUrl}
                                    />
                                );
                            })}
                                </div>
                    )}
                                </div>

                {/* Hours of Operation Section */}
                                <div>
                    <div className="flex flex-col items-start mb-6">
                        <div className="flex justify-between items-center w-full mb-2">
                            <h3 className="text-lg font-bold text-pink-600">Hours of Operation</h3>
                            <button
                                onClick={handleSaveAllHours}
                                disabled={hoursLoading || Object.values(hoursSaving).some(saving => saving)}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {Object.values(hoursSaving).some(saving => saving) ? 'Saving...' : 'Save All Hours'}
                            </button>
                                </div>
                        <div className="h-0.5 bg-pink-600 w-full"></div>
                        </div>

                    {hoursError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <strong>Error:</strong> {hoursError}
                                </div>
                                <button
                                    onClick={fetchHours}
                                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm whitespace-nowrap"
                                >
                                    Retry
                                </button>
                                </div>
                                </div>
                    )}

                    {hoursSuccess._all && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {hoursSuccess._all}
                                </div>
                    )}

                    {hoursErrors._all && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {hoursErrors._all}
                                </div>
                    )}

                    {hoursLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                            <p className="mt-4 text-gray-600">Loading hours of operation...</p>
                            </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Section Title - Editable */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                                
                                {sectionTitleSuccess && (
                                    <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                                        {sectionTitleSuccess}
                        </div>
                                )}

                                {sectionTitleError && (
                                    <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                                        {sectionTitleError}
                                </div>
                                )}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editableSectionTitle}
                                        onChange={(e) => setEditableSectionTitle(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                        placeholder="Enter section title"
                                    />
                                    <button
                                        onClick={handleSaveSectionTitle}
                                        disabled={sectionTitleSaving || !editableSectionTitle.trim()}
                                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap"
                                    >
                                        {sectionTitleSaving ? 'Saving...' : 'Save Title'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">This title will be applied to all hours entries</p>
                                </div>

                            {/* Existing Hours of Operation */}
                            {hoursOfOperation.map((hour, index) => {
                                const data = hoursData[hour.id] || {};
                                return (
                                    <div key={hour.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-300">
                                            <h4 className="font-semibold text-gray-800">
                                                {index + 1}️⃣ {hour.category_title || 'Untitled Category'}
                                            </h4>
                                            <button
                                                onClick={() => handleDeleteHours(hour.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                </div>

                                        {hoursSuccess[hour.id] && (
                                            <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                                                {hoursSuccess[hour.id]}
                                </div>
                                        )}

                                        {hoursErrors[hour.id] && (
                                            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                                                <div className="font-semibold mb-1">Error:</div>
                                                <div className="whitespace-pre-wrap break-words">{hoursErrors[hour.id]}</div>
                                </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Title *</label>
                                    <input
                                        type="text"
                                                    value={data.category_title || ''}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'category_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                                    required
                                    />
                                </div>
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Monday – Friday Hours</label>
                                    <input
                                        type="text"
                                                    value={data.monday_friday_hours || ''}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'monday_friday_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Saturday Hours</label>
                                    <input
                                        type="text"
                                                    value={data.saturday_hours || ''}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'saturday_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Hours</label>
                                    <input
                                        type="text"
                                                    value={data.sunday_hours || ''}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'sunday_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Status</label>
                                    <input
                                        type="text"
                                                    value={data.sunday_status || ''}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'sunday_status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                                    placeholder="e.g., Closed"
                                    />
                                </div>
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Public Holidays Hours</label>
                                    <input
                                        type="text"
                                                    value={data.public_holidays_hours || ''}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'public_holidays_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Public Holidays Status</label>
                                    <input
                                        type="text"
                                                    value={data.public_holidays_status || ''}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'public_holidays_status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                                    placeholder="e.g., Closed"
                                    />
                                </div>
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                    <input
                                                    type="number"
                                                    min="0"
                                                    value={data.sort_order ?? hour.sort_order}
                                                    onChange={(e) => handleHoursInputChange(hour.id, 'sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                </div>

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => handleSaveHours(hour.id)}
                                                disabled={hoursSaving[hour.id]}
                                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {hoursSaving[hour.id] ? 'Saving...' : 'Save'}
                                            </button>
                                </div>
                                </div>
                                );
                            })}

                            {/* Add New Hours of Operation */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-300">➕ Add New Hours Category</h4>

                                {hoursSuccess['new'] && (
                                    <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                                        {hoursSuccess['new']}
                    </div>
                                )}

                                {hoursErrors['new'] && (
                                    <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                                        <div className="font-semibold mb-1">Error:</div>
                                        <div className="whitespace-pre-wrap break-words">{hoursErrors['new']}</div>
                        </div>
                                )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Title *</label>
                                    <input
                                        type="text"
                                            value={newHoursData.category_title || ''}
                                            onChange={(e) => handleHoursInputChange('new', 'category_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                            required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monday – Friday Hours</label>
                                    <input
                                        type="text"
                                            value={newHoursData.monday_friday_hours || ''}
                                            onChange={(e) => handleHoursInputChange('new', 'monday_friday_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Saturday Hours</label>
                                    <input
                                        type="text"
                                            value={newHoursData.saturday_hours || ''}
                                            onChange={(e) => handleHoursInputChange('new', 'saturday_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Hours</label>
                                    <input
                                        type="text"
                                            value={newHoursData.sunday_hours || ''}
                                            onChange={(e) => handleHoursInputChange('new', 'sunday_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Status</label>
                                    <input
                                        type="text"
                                            value={newHoursData.sunday_status || ''}
                                            onChange={(e) => handleHoursInputChange('new', 'sunday_status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                            placeholder="e.g., Closed"
                                    />
                                </div>
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Public Holidays Hours</label>
                                    <input
                                        type="text"
                                            value={newHoursData.public_holidays_hours || ''}
                                            onChange={(e) => handleHoursInputChange('new', 'public_holidays_hours', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Public Holidays Status</label>
                                    <input
                                        type="text"
                                            value={newHoursData.public_holidays_status || ''}
                                            onChange={(e) => handleHoursInputChange('new', 'public_holidays_status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                            placeholder="e.g., Closed"
                                    />
                                </div>
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                    <input
                                            type="number"
                                            min="0"
                                            value={newHoursData.sort_order ?? hoursOfOperation.length}
                                            onChange={(e) => handleHoursInputChange('new', 'sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                    />
                                </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleSaveHours('new')}
                                        disabled={hoursSaving['new']}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {hoursSaving['new'] ? 'Creating...' : 'Create New Category'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Social Media Section */}
                                <div>
                    <div className="flex flex-col items-start mb-6">
                        <h3 className="text-lg font-bold text-pink-600 mb-2">Social Media</h3>
                        <div className="h-0.5 bg-pink-600 w-full"></div>
                                </div>

                    {socialMediaError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <strong>Error:</strong> {socialMediaError}
                            </div>
                                <button
                                    onClick={fetchSocialMedia}
                                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm whitespace-nowrap"
                                >
                                    Retry
                                </button>
                        </div>
                        </div>
                    )}

                    {socialMediaLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                            <p className="mt-4 text-gray-600">Loading social media...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Section Heading and Description */}
                        <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-300">Section Information</h4>

                                {socialSectionSuccess && (
                                    <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                                        {socialSectionSuccess}
                                </div>
                                )}

                                {socialSectionError && (
                                    <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                                        {socialSectionError}
                                </div>
                                )}

                                <div className="space-y-4">
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                    <input
                                        type="text"
                                            value={socialSectionData.heading}
                                            onChange={(e) => setSocialSectionData((prev) => ({ ...prev, heading: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white"
                                            placeholder="e.g., Follow Us"
                                    />
                                </div>

                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={socialSectionData.description}
                                            onChange={(e) => setSocialSectionData((prev) => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-gray-900 bg-white"
                                            placeholder="Stay connected with us on social media..."
                                    />
                                </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSaveSocialSection}
                                            disabled={socialSectionSaving}
                                            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {socialSectionSaving ? 'Saving...' : 'Save Section'}
                                        </button>
                                </div>
                            </div>
                        </div>

                            {/* Existing Social Links */}
                            {socialLinks.map((link) => {
                                const data = socialLinkData[link.id] || {};
                                return (
                                    <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-300">
                                            <h4 className="font-semibold text-gray-800">
                                                {link.platform_name || 'Untitled Platform'}
                                            </h4>
                                            <button
                                                onClick={() => handleDeleteSocialLink(link.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                </div>

                                        {socialLinkSuccess[link.id] && (
                                            <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                                                {socialLinkSuccess[link.id]}
                                </div>
                                        )}

                                        {socialLinkErrors[link.id] && (
                                            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                                                {socialLinkErrors[link.id]}
                                </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name *</label>
                                    <input
                                        type="text"
                                                    value={data.platform_name || ''}
                                                    onChange={(e) => handleSocialLinkInputChange(link.id, 'platform_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                                    placeholder="e.g., Facebook, Instagram"
                                                    required
                                    />
                                </div>

                                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform URL *</label>
                                    <input
                                                    type="url"
                                                    value={data.platform_url || ''}
                                                    onChange={(e) => handleSocialLinkInputChange(link.id, 'platform_url', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                                    placeholder="https://example.com/platform"
                                                    required
                                    />
                </div>

                <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Icon</label>
                                                {link.icon && (
                                                    <div className="mb-2">
                                                        <img
                                                            src={getImageUrl(link.icon) || ''}
                                                            alt={link.platform_name}
                                                            className="h-8 w-8 object-contain"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                            <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleSocialLinkFileChange(link.id, e.target.files?.[0] || null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                />
                                                {data.iconFile && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Selected: {data.iconFile.name}
                                                    </p>
                                                )}
                        </div>

                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={data.sort_order ?? link.sort_order}
                                                    onChange={(e) => handleSocialLinkInputChange(link.id, 'sort_order', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                                />
                                            </div>
                        </div>

                                        <div className="mt-4 flex justify-end">
                                <button
                                                onClick={() => handleSaveSocialLink(link.id)}
                                                disabled={socialLinkSaving[link.id]}
                                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {socialLinkSaving[link.id] ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                                    </div>
                                );
                            })}

                            {/* Add New Social Link */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-300">➕ Add New Social Link</h4>

                                {socialLinkSuccess['new'] && (
                                    <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                                        {socialLinkSuccess['new']}
                                    </div>
                                )}

                                {socialLinkErrors['new'] && (
                                    <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                                        {socialLinkErrors['new']}
                                    </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name *</label>
                                                <input
                                                    type="text"
                                            value={newSocialLinkData.platform_name || ''}
                                            onChange={(e) => handleSocialLinkInputChange('new', 'platform_name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                            placeholder="e.g., Facebook, Instagram"
                                            required
                                                />
                                            </div>

                                            <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform URL *</label>
                                                <input
                                                    type="url"
                                            value={newSocialLinkData.platform_url || ''}
                                            onChange={(e) => handleSocialLinkInputChange('new', 'platform_url', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                                    placeholder="https://example.com/platform"
                                            required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Icon</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                            onChange={(e) => handleSocialLinkFileChange('new', e.target.files?.[0] || null)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                />
                                        {newSocialLinkData.iconFile && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                Selected: {newSocialLinkData.iconFile.name}
                                                    </p>
                                                )}
                                            </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newSocialLinkData.sort_order ?? socialLinks.length}
                                            onChange={(e) => handleSocialLinkInputChange('new', 'sort_order', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                                        />
                                        </div>
                                    </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleSaveSocialLink('new')}
                                        disabled={socialLinkSaving['new']}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {socialLinkSaving['new'] ? 'Creating...' : 'Create New Link'}
                                    </button>
                            </div>
                        </div>
                        </div>
                    )}
                </div>

                {/* Contact Form Submissions Table */}
                <div>
                    <div className="flex flex-col items-start mb-6">
                        <div className="flex justify-between items-center w-full mb-2">
                            <h3 className="text-lg font-bold text-pink-600">Contact Form Submissions</h3>
                            <button
                                onClick={() => fetchFormSubmissions(submissionsPage)}
                                disabled={submissionsLoading}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submissionsLoading ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>
                        <div className="h-0.5 bg-pink-600 w-full"></div>
                    </div>

                    {submissionsError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <strong>Error:</strong> {submissionsError}
                                </div>
                                <button
                                    onClick={() => fetchFormSubmissions(submissionsPage)}
                                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm whitespace-nowrap"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    {submissionsLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                            <p className="mt-4 text-gray-600">Loading submissions...</p>
                        </div>
                    ) : formSubmissions.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                First Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Last Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Phone
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Company
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Message
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {formSubmissions.map((submission) => (
                                            <tr 
                                                key={submission.id} 
                                                className={`hover:bg-gray-50 ${submission.is_read ? "bg-gray-50" : "bg-white"}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        submission.is_read 
                                                            ? "bg-green-100 text-green-800" 
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                        {submission.is_read ? "Read" : "Unread"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {submission.first_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {submission.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <a 
                                                        href={`mailto:${submission.email}`}
                                                        className="text-pink-600 hover:text-pink-900"
                                                    >
                                                        {submission.email}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {submission.phone || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {submission.company || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={submission.message}>
                                                    {submission.message || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(submission.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        {submission.is_read ? (
                                                            <button
                                                                onClick={() => handleMarkAsUnread(submission.id)}
                                                                disabled={submissionActions[submission.id]}
                                                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Mark as unread"
                                                            >
                                                                {submissionActions[submission.id] ? "..." : "Mark Unread"}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleMarkAsRead(submission.id)}
                                                                disabled={submissionActions[submission.id]}
                                                                className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Mark as read"
                                                            >
                                                                {submissionActions[submission.id] ? "..." : "Mark Read"}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteSubmission(submission.id)}
                                                            disabled={submissionActions[submission.id]}
                                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Delete submission"
                                                        >
                                                            {submissionActions[submission.id] ? "..." : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {submissionsPagination.last_page > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {submissionsPagination.from} to {submissionsPagination.to} of {submissionsPagination.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const newPage = submissionsPage - 1;
                                                setSubmissionsPage(newPage);
                                                fetchFormSubmissions(newPage);
                                            }}
                                            disabled={submissionsPage === 1 || submissionsLoading}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => {
                                                const newPage = submissionsPage + 1;
                                                setSubmissionsPage(newPage);
                                                fetchFormSubmissions(newPage);
                                            }}
                                            disabled={submissionsPage >= submissionsPagination.last_page || submissionsLoading}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No contact form submissions found.</p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Team Management Modal */}
            {showTeamModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Contact Our Team</h2>
                            <button
                                onClick={handleCloseTeamModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Success/Error Messages */}
                            {teamMemberSuccess && (
                                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                    {teamMemberSuccess}
                                </div>
                            )}
                            {teamMemberError && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    <div className="font-semibold mb-1">Error:</div>
                                    <div className="whitespace-pre-wrap break-words">{teamMemberError}</div>
                                </div>
                            )}
                            {teamMembersError && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <strong>Error:</strong> {teamMembersError}
                                        </div>
                                        <button
                                            onClick={fetchTeamMembers}
                                            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm whitespace-nowrap"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Team Members List */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>
                                {teamMembersLoading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                                        <p className="mt-4 text-gray-600">Loading team members...</p>
                                    </div>
                                ) : teamMembers.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No team members added yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {teamMembers.map((member) => {
                                            const imageUrl = getTeamMemberImageUrl(member.picture);
                                            return (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                                >
                                                    <div className="flex-shrink-0">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={`${member.first_name} ${member.last_name}`}
                                                                className="w-12 h-12 rounded-full object-cover shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 font-semibold text-lg shadow-md">
                                                                {getInitials(member.first_name, member.last_name)}
                                                            </div>
                                                        )}
                                                    </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900">{member.first_name} {member.last_name}</h4>
                                                    <p className="text-sm text-gray-600">{member.role}</p>
                                                    <a
                                                        href={`mailto:${member.email}`}
                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        {member.email}
                                                    </a>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditTeamMember(member)}
                                                        className="px-3 py-1 text-sm text-pink-600 hover:text-pink-800 font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => member.id && handleDeleteTeamMember(member.id)}
                                                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Add/Edit Team Member Form */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    {editingTeamMemberId !== null ? 'Edit Team Member' : 'Add New Team Member'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                        <input
                                            type="text"
                                            value={currentTeamMember.first_name}
                                            onChange={(e) => setCurrentTeamMember(prev => ({ ...prev, first_name: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                        <input
                                            type="text"
                                            value={currentTeamMember.last_name}
                                            onChange={(e) => setCurrentTeamMember(prev => ({ ...prev, last_name: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white"
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                                        <input
                                            type="text"
                                            value={currentTeamMember.role}
                                            onChange={(e) => setCurrentTeamMember(prev => ({ ...prev, role: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white"
                                            placeholder="CEO & Founder"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={currentTeamMember.email}
                                            onChange={(e) => setCurrentTeamMember(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white"
                                            placeholder="john@mecarvi.com"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Picture</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleTeamPictureChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                        />
                                        {(currentTeamMember.picture || (editingTeamMemberId !== null && teamMembers.find(m => m.id === editingTeamMemberId)?.picture)) && (
                                            <div className="mt-3">
                                                {currentTeamMember.picture instanceof File ? (
                                                    <>
                                                        <img
                                                            src={URL.createObjectURL(currentTeamMember.picture)}
                                                            alt="Preview"
                                                            className="w-20 h-20 rounded-full object-cover shadow-md"
                                                        />
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Selected: {currentTeamMember.picture.name}
                                                        </p>
                                                    </>
                                                ) : editingTeamMemberId !== null ? (
                                                    <>
                                                        <img
                                                            src={getTeamMemberImageUrl(teamMembers.find(m => m.id === editingTeamMemberId)?.picture || null) || ''}
                                                            alt="Current picture"
                                                            className="w-20 h-20 rounded-full object-cover shadow-md"
                                                        />
                                                        <p className="text-xs text-gray-600 mt-1">Current picture</p>
                                                    </>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSaveTeamMember}
                                        disabled={teamMemberSaving}
                                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        {teamMemberSaving ? 'Saving...' : editingTeamMemberId !== null ? 'Update Member' : 'Add Member'}
                                    </button>
                                    {editingTeamMemberId !== null && (
                                        <button
                                            onClick={handleAddTeamMember}
                                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

