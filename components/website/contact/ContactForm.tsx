"use client";

import { useState, useEffect } from "react";

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface ContactHeroData {
  heading: string;
  subheading: string;
  description: string;
}

interface ContactPageCard {
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
}

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

export default function ContactForm() {
  const [heroData, setHeroData] = useState<ContactHeroData | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [contactCards, setContactCards] = useState<ContactPageCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);

  const [formData, setFormData] = useState<ContactFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  // Fetch team members function
  const fetchTeamMembers = async () => {
    try {
      setTeamMembersLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/team-members", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.team_members) {
          // Sort by order field
          const sortedMembers = [...data.data.team_members].sort((a: TeamMember, b: TeamMember) => a.order - b.order);
          setTeamMembers(sortedMembers);
        }
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
    } finally {
      setTeamMembersLoading(false);
    }
  };

  // Fetch contact cards function
  const fetchContactCards = async () => {
    try {
      setCardsLoading(true);
      console.log("ContactForm: Fetching contact cards from API...");

      const response = await fetch("http://localhost:8000/api/v1/contact-page-cards", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      console.log("ContactForm: Contact cards API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("ContactForm: Contact cards API response data:", data);

        if (data.success && data.data?.contact_cards) {
          // Filter only active cards
          const activeCards = data.data.contact_cards.filter((card: ContactPageCard) => card.is_active);

          // Define the desired order for card types
          const cardTypeOrder: { [key: string]: number } = {
            'call': 1,
            'fax': 2,
            'email': 3,
            'visit': 4,
            'store_hours': 5,
            'online_hours': 6,
          };

          // Sort by card type order first, then by sort_order
          const sortedCards = activeCards.sort((a: ContactPageCard, b: ContactPageCard) => {
            const orderA = cardTypeOrder[a.card_type] || 999;
            const orderB = cardTypeOrder[b.card_type] || 999;
            if (orderA !== orderB) {
              return orderA - orderB;
            }
            return a.sort_order - b.sort_order;
          });

          console.log("ContactForm: Active cards found:", sortedCards.length, sortedCards);
          setContactCards(sortedCards);
        } else {
          console.warn("ContactForm: No contact cards in response or invalid structure:", data);
          setContactCards([]);
        }
      } else {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("ContactForm: Failed to fetch contact cards:", response.status, errorText);
        setContactCards([]);
      }
    } catch (err) {
      console.error("ContactForm: Error fetching contact cards:", err);
      setContactCards([]);
    } finally {
      setCardsLoading(false);
    }
  };

  // Fetch hero section data
  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        setHeroLoading(true);
        console.log("ContactForm: Fetching hero section from API...");

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

        console.log("ContactForm: Hero API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("ContactForm: Hero API response data:", data);
          console.log("ContactForm: Response structure:", {
            success: data.success,
            hasData: !!data.data,
            hasHeroSections: !!data.data?.hero_sections,
            heroSectionsLength: data.data?.hero_sections?.length || 0,
            fullData: data
          });

          if (data.success && data.data?.hero_sections?.length > 0) {
            // Get the first active hero section or the first one
            const activeSection = data.data.hero_sections.find(
              (section: any) => section.is_active
            ) || data.data.hero_sections[0];
            console.log("ContactForm: Setting hero data:", activeSection);
            setHeroData({
              heading: activeSection.heading,
              subheading: activeSection.subheading,
              description: activeSection.description,
            });
          } else {
            console.warn("ContactForm: No hero sections found. Response:", data);
          }
        } else if (response.status === 401) {
          // API requires authentication - this is expected for public website views
          // The endpoint should be made public on the backend, but for now we'll use default content
          console.warn("ContactForm: Hero section API requires authentication. Using default content.");
          // Don't set heroData, let it use the default text
        } else {
          const errorText = await response.text().catch(() => "Unknown error");
          console.error("ContactForm: Failed to fetch hero section:", response.status, errorText);
        }
      } catch (err) {
        console.error("ContactForm: Error fetching contact hero section:", err);
      } finally {
        setHeroLoading(false);
      }
    };

    fetchHeroSection();
    fetchContactCards();
    fetchTeamMembers();
  }, []);

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
      cleanPath = cleanPath.substring(9);
    } else if (cleanPath.startsWith('storage/')) {
      cleanPath = cleanPath.substring(8);
    }
    cleanPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
    return `http://localhost:8000/storage/${cleanPath}`;
  };

  const getTeamMemberImageUrl = (picture: string | null | undefined): string | null => {
    if (!picture) return null;
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

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderContactCard = (card: ContactPageCard) => {
    const iconUrl = getImageUrl(card.icon);
    const badgeTitle = card.badge_title || card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1).replace('_', ' ');
    const label = card.label || '';

    // Determine card height based on type
    const isHoursCard = card.card_type === 'store_hours' || card.card_type === 'online_hours';
    const cardHeight = '260px';

    return (
      <div
        key={card.id}
        className="bg-white p-6 rounded-4xl border-12 border-[#F0ECF8] shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col w-full max-w-[320px] mx-auto sm:mx-0"
        style={{ height: cardHeight }}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-indigo-600 shrink-0">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={badgeTitle}
                  className="w-6 h-6 object-contain"
                  style={{ color: '#7E70E5' }}
                  onError={(e) => {
                    console.error("Image failed to load:", iconUrl);
                    // Hide the image and show SVG fallback
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <svg className="w-6 h-6" style={{ color: '#7E70E5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getDefaultIcon(card.card_type)}
                </svg>
              )}
            </div>
            {label && (
              <h4 className="text-gray-900 font-bold text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>
                {label}:
              </h4>
            )}
          </div>

          {card.secondary_badge && (
            <button
              onClick={() => {
                if (card.card_type === 'email') {
                  setShowEmailPopup(true);
                }
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] px-3 py-1 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-semibold shadow-sm uppercase tracking-wider"
            >
              {card.secondary_badge}
            </button>
          )}
        </div>

        <div className="w-full h-px bg-gray-300 mb-4"></div>

        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            {renderCardContent(card)}
          </div>
        </div>
      </div>
    );
  };

  const getDefaultIcon = (cardType: string) => {
    switch (cardType) {
      case 'call':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;
      case 'fax':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />;
      case 'email':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
      case 'visit':
        return (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </>
        );
      case 'store_hours':
      case 'online_hours':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  const renderCardContent = (card: ContactPageCard) => {
    switch (card.card_type) {
      case 'call':
        return (
          <>
            {card.phone_number_1 && (
              <p className="text-gray-600 text-[15px] truncate font-medium">{card.phone_number_1}</p>
            )}
            {card.phone_number_2 && (
              <p className="text-gray-600 text-[15px] truncate font-medium">{card.phone_number_2}</p>
            )}
          </>
        );
      case 'fax':
        return card.fax_number ? (
          <p className="text-gray-600 text-[15px] truncate font-medium">{card.fax_number}</p>
        ) : null;
      case 'email':
        return card.email_address ? (
          <p className="text-gray-600 text-[15px] truncate font-medium">{card.email_address}</p>
        ) : null;
      case 'visit':
        return (
          <>
            {card.street_address && (
              <p className="text-gray-600 text-[15px] truncate font-medium">{card.street_address}</p>
            )}
            {(card.state_postal_code || card.country) && (
              <p className="text-gray-600 text-[15px] truncate font-medium">
                {[card.state_postal_code, card.country].filter(Boolean).join(', ')}
              </p>
            )}
          </>
        );
      case 'store_hours':
      case 'online_hours':
        return (
          <>
            {card.monday_friday_hours && (
              <p className="text-gray-600 text-[15px] font-medium">Monday-Friday: {card.monday_friday_hours}</p>
            )}
            {card.saturday_hours && (
              <p className="text-gray-600 text-[15px] font-medium">Saturday: {card.saturday_hours}</p>
            )}
            {card.sunday_hours && (
              <p className="text-gray-600 text-[15px] font-medium">Sunday: {card.sunday_hours}</p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (success) setSuccess("");
    if (error) setError("");
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.first_name.trim()) errors.push("First name is required");
    if (!formData.last_name.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.message.trim()) errors.push("Message is required");

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submission started with data:", formData);

    const errors = validateForm();
    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      setError(errors.join(", "));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Sending API request to: http://localhost:8000/api/v1/contact-form");

      const response = await fetch("http://localhost:8000/api/v1/contact-form", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API response status:", response.status);
      console.log("API response ok:", response.ok);

      const responseData = await response.json();
      console.log("API response data:", responseData);

      if (response.ok) {
        if (responseData.success) {
          setSuccess(responseData.message || "Contact form submitted successfully!");
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
          });
          console.log("Form submitted successfully!");
        } else {
          throw new Error(responseData.message || "Failed to submit contact form");
        }
      } else {
        console.log("API request failed with status:", response.status);
        if (responseData.errors) {
          // Handle validation errors
          const errorMessages = Object.values(responseData.errors).flat();
          console.log("Validation errors from API:", errorMessages);
          setError(errorMessages.join(", "));
        } else {
          throw new Error(responseData.message || "Failed to submit contact form");
        }
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError(err instanceof Error ? err.message : "Failed to submit contact form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-white pt-16 sm:pt-20 md:pt-24 pb-15 px-1 sm:px-2 md:px-4 lg:px-6 lg:mt-[-70px]">
        <div className="max-w-[95%] mx-auto">
          <div className="rounded-lg p-8 md:p-10 lg:pt-12 lg:px-12 lg:pb-0">
            {/* Section Header */}
            <div className="text-center mb-12">
              {heroLoading ? (
                <div className="py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              ) : (
                <>
                  {heroData?.subheading && (
                    <h3 className="text-gray-700 text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
                      {heroData.subheading}
                    </h3>
                  )}
                  {heroData?.description ? (
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                      {heroData.description}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                      Feel free to reach out to us for any inquiries, collaborations, or support. We're here to help and will get back to you as soon as possible.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
              {/* Left Column - Contact Info with 6 Boxes */}
              <div className="space-y-0">
                <div>



                </div>

                {/* Dynamic Contact Cards */}
                {cardsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    <p className="ml-4 text-gray-600">Loading contact cards...</p>
                  </div>
                ) : contactCards.length > 0 ? (
                  <div className="flex flex-col gap-y-4">
                    {/* Row 1: First 2 cards */}
                    {contactCards.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {contactCards.slice(0, 2).map((card) => renderContactCard(card))}
                      </div>
                    )}
                    {/* Row 2: Next 2 cards */}
                    {contactCards.length > 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {contactCards.slice(2, 4).map((card) => renderContactCard(card))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No contact cards available.</p>
                  </div>
                )}
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 flex flex-col min-h-[530px]">
                <h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Contact Form
                </h2>

                {/* Success/Error Messages */}
                {success && (
                  <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* First Name */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                          required
                        />
                      </div>

                      {/* Last Name */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Email */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your Phone"
                          className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company (Optional)"
                        className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] text-sm"
                      />
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <div className="absolute left-3 top-3 w-4 h-4 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Message"
                        rows={4}
                        className="w-full pl-9 pr-3 py-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-[#8A8A8A] resize-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-start pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-8 rounded-lg transition-all text-sm md:text-base"
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Contact Our Team</h3>
              <button
                onClick={() => setShowEmailPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {teamMembersLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                <p className="mt-4 text-gray-600">Loading team members...</p>
              </div>
            ) : teamMembers.length > 0 ? (
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const imageUrl = getTeamMemberImageUrl(member.picture);
                  return (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`${member.first_name} ${member.last_name}`}
                            className="w-12 h-12 rounded-full object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold shadow-md">
                            {getInitials(member.first_name, member.last_name)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{member.first_name} {member.last_name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <a
                            href={`mailto:${member.email}`}
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                          >
                            {member.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No team members available.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
