"use client";

import { useState, useEffect } from "react";

interface SupportSection {
  id: number;
  section_title: string;
  title: string;
  description: string;
  call_icon: string | null;
  call_title: string;
  call_description: string;
  call_phone: string;
  email_icon: string | null;
  email_title: string;
  email_description: string;
  email_address: string;
  is_active: boolean;
  sort_order: number;
}

export default function CareerSupport() {
  const [supportData, setSupportData] = useState<SupportSection | null>(null);
  const [loadingSupport, setLoadingSupport] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobLocation: "",
    preferredContact: "",
    bestTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch support section data
  useEffect(() => {
    const fetchSupportSection = async () => {
      try {
        setLoadingSupport(true);
        console.log("Fetching support sections from API...");
        
        // Try with authentication token if available (for logged-in users)
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
          "Accept": "application/json",
        };
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        let response = await fetch("http://localhost:8000/api/v1/support-sections", {
          method: "GET",
          headers,
        });

        console.log("API Response status:", response.status, response.ok);

        // If 401 and we didn't use a token, try with token if available
        if (response.status === 401 && !token) {
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            console.log("Retrying with authentication token...");
            response = await fetch("http://localhost:8000/api/v1/support-sections", {
              method: "GET",
              headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${storedToken}`,
              },
            });
          }
        }

        if (response.ok) {
          const data = await response.json();
          console.log("Support section API response:", JSON.stringify(data, null, 2));
          
          // Check different possible response structures
          let sections: SupportSection[] = [];
          
          if (data.success) {
            if (data.data?.support_sections && Array.isArray(data.data.support_sections)) {
              sections = data.data.support_sections;
            } else if (data.data?.support_section) {
              // Single section response
              sections = [data.data.support_section];
            } else if (Array.isArray(data.data)) {
              sections = data.data;
            }
          }
          
          console.log("Extracted sections:", sections);
          console.log("Number of sections:", sections.length);

          if (sections.length > 0) {
            // Get the first active support section, or the first one if none are active
            const activeSection = sections.find(
              (section: SupportSection) => section.is_active === true
            ) || sections[0];

            console.log("Selected support section:", activeSection);
            console.log("Section data:", {
              id: activeSection.id,
              section_title: activeSection.section_title,
              title: activeSection.title,
              description: activeSection.description,
              call_title: activeSection.call_title,
              call_description: activeSection.call_description,
              call_phone: activeSection.call_phone,
              email_title: activeSection.email_title,
              email_description: activeSection.email_description,
              email_address: activeSection.email_address,
              is_active: activeSection.is_active,
            });

            setSupportData(activeSection);
          } else {
            console.warn("No support sections found in API response. Full response:", data);
            setSupportData(null);
          }
        } else {
          const errorText = await response.text().catch(() => "");
          console.error("Support section API error:", response.status, errorText);
          try {
            const errorData = JSON.parse(errorText);
            console.error("Error details:", errorData);
            
            // If it's an authentication error, show a helpful message
            if (response.status === 401) {
              console.warn("API requires authentication. The support-sections endpoint may need to be made public on the backend.");
            }
          } catch (e) {
            console.error("Error response is not JSON:", errorText);
          }
          setSupportData(null);
        }
      } catch (err) {
        console.error("Error fetching support section:", err);
        if (err instanceof Error) {
          console.error("Error message:", err.message);
          console.error("Error stack:", err.stack);
        }
        setSupportData(null);
      } finally {
        setLoadingSupport(false);
      }
    };

    fetchSupportSection();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      if (!formData.email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }
      if (!formData.message.trim()) {
        setError("Message is required");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Build submission data for career support form
      const submissionData: Record<string, string> = {
        full_name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      // Add optional fields only if they have values
      if (formData.phone.trim()) {
        submissionData.phone = formData.phone.trim();
      }
      if (formData.jobLocation.trim()) {
        submissionData.job_location = formData.jobLocation.trim();
      }
      if (formData.preferredContact) {
        submissionData.preferred_contact_method = formData.preferredContact;
      }
      if (formData.bestTime) {
        submissionData.best_time_to_contact = formData.bestTime;
      }

      console.log("Submitting career support form:", submissionData);

      let response: Response;
      try {
        response = await fetch("http://localhost:8000/api/v1/career-support-form", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });
      } catch (networkError) {
        console.error("Network error:", networkError);
        throw new Error("Network error: Unable to connect to the server. Please check if the API server is running on http://localhost:8000");
      }

      console.log("Contact form response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Contact form response data:", data);
        if (data.success) {
          setSuccess("Thank you! Your submission has been received. We'll get back to you soon.");
          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            jobLocation: "",
            preferredContact: "",
            bestTime: "",
            message: "",
          });
          setTimeout(() => setSuccess(""), 5000);
        } else {
          const errorMsg = data.message || data.error || "Failed to submit form";
          console.error("API returned success=false:", data);
          throw new Error(errorMsg);
        }
      } else {
        // Try to get error details from response
        let errorData: any = {};
        let errorText = "";
        
        console.log("Response not OK. Status:", response.status, "StatusText:", response.statusText);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));
        
        try {
          // Clone the response to read it without consuming it
          const clonedResponse = response.clone();
          errorText = await clonedResponse.text();
          console.log("Raw error response text length:", errorText.length);
          console.log("Raw error response text:", errorText);
          
          if (errorText && errorText.trim()) {
            try {
              errorData = JSON.parse(errorText);
              console.log("Parsed error data:", errorData);
            } catch (parseError) {
              console.error("JSON parse error:", parseError);
              // If it's not JSON, use the text as error message
              errorData = { message: errorText || `Server error (${response.status})` };
            }
          } else {
            console.warn("Error response body is empty");
            errorData = { message: `Server returned empty response (${response.status})` };
          }
        } catch (e) {
          console.error("Could not read error response:", e);
          errorData = { message: `Network error or server unavailable (${response.status})` };
        }
        
        // Build a more detailed error message
        let errorMsg = `Failed to submit form (${response.status} ${response.statusText})`;
        
        // Check if we have any error data
        const hasErrorData = errorData && Object.keys(errorData).length > 0;
        const hasErrorText = errorText && errorText.trim().length > 0;
        
        console.log("Error handling summary:", {
          hasErrorData,
          hasErrorText,
          errorDataKeys: errorData ? Object.keys(errorData) : [],
          errorTextLength: errorText ? errorText.length : 0,
          errorTextPreview: errorText ? errorText.substring(0, 100) : "none"
        });
        
        if (hasErrorData) {
          console.error("Contact form API error data:", errorData);
          
          if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
          } else if (errorData.errors) {
            // Handle validation errors
            const validationErrors = Object.entries(errorData.errors)
              .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            errorMsg = `Validation errors: ${validationErrors}`;
          } else {
            // We have an object but no known error fields - stringify it
            errorMsg = `Server error: ${JSON.stringify(errorData)}`;
          }
        } else if (hasErrorText) {
          // If we have text but couldn't parse it as JSON, use it as the error message
          if (!errorText.startsWith('{') && !errorText.startsWith('[')) {
            errorMsg = errorText;
          } else {
            errorMsg = `Server error: ${errorText.substring(0, 200)}`;
          }
        } else {
          // No error data at all - provide a generic message based on status code
          if (response.status === 500) {
            errorMsg = "Server error (500): The server encountered an internal error. Please check the server logs or try again later.";
          } else if (response.status === 422) {
            errorMsg = "Validation error (422): Please check your form data and try again.";
          } else if (response.status === 401) {
            errorMsg = "Authentication error (401): The request requires authentication.";
          } else if (response.status === 404) {
            errorMsg = "Endpoint not found (404): The contact form endpoint may not be available. Please check the API URL.";
          } else if (response.status === 405) {
            errorMsg = "Method not allowed (405): The HTTP method may not be supported by this endpoint.";
          } else {
            errorMsg = `Failed to submit form (${response.status} ${response.statusText}). The server returned an empty response. Please check the API server logs.`;
          }
        }
        
        console.error("Contact form API error - Final details:", {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          errorText: errorText,
          errorTextLength: errorText ? errorText.length : 0,
          submissionData: submissionData,
          finalErrorMessage: errorMsg
        });
        
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : err instanceof TypeError && err.message.includes('fetch')
          ? "Network error: Please check your connection and ensure the API server is running"
          : "Failed to submit form. Please try again.";
      setError(errorMessage);
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get image URL
  const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      // Fix localhost URLs that might be missing port
      if (imagePath.startsWith("http://localhost/storage/") || imagePath.startsWith("http://localhost/")) {
        return imagePath.replace("http://localhost/", "http://localhost:8000/");
      }
      return imagePath;
    }
    // Remove leading /storage/ or storage/ if present to avoid double paths
    let cleanPath = imagePath;
    if (cleanPath.startsWith("/storage/")) {
      cleanPath = cleanPath.substring(9); // Remove '/storage/'
    } else if (cleanPath.startsWith("storage/")) {
      cleanPath = cleanPath.substring(8); // Remove 'storage/'
    }
    // Remove leading slash if present
    cleanPath = cleanPath.startsWith("/") ? cleanPath.substring(1) : cleanPath;
    return `http://localhost:8000/storage/${cleanPath}`;
  };

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Quick Support */}
          <div className="bg-gray-50 rounded-lg p-8 md:p-10 lg:p-12" data-aos="fade-up">
            {loadingSupport ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                <p className="mt-4 text-gray-600">Loading support information...</p>
              </div>
            ) : supportData ? (
              <>
                <h3 className="text-blue-600 text-lg md:text-xl font-semibold mb-4">
                  Quick Support
                </h3>
                <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  {supportData.section_title || supportData.title || "Get in Touch"}
                </h2>
                {supportData.description && (
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
                    {supportData.description}
                  </p>
                )}

                {/* Contact Methods */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Call Us */}
                  <div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                      {supportData.call_icon ? (
                        <img
                          src={getImageUrl(supportData.call_icon) || ''}
                          alt="Call Us"
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            // Hide image on error and show fallback
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      )}
                    </div>
                    <h4 className="text-gray-900 font-bold text-lg mb-2">
                      {supportData.call_title?.trim() || "Call Us"}
                    </h4>
                    {supportData.call_description?.trim() ? (
                      <p className="text-gray-700 text-sm mb-2">
                        {supportData.call_description}
                      </p>
                    ) : null}
                    {supportData.call_phone?.trim() ? (
                      <a
                        href={`tel:${supportData.call_phone}`}
                        className="text-gray-900 font-semibold hover:text-blue-600 transition-colors"
                      >
                        {supportData.call_phone}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-semibold">Contact us for support</p>
                    )}
                  </div>

                  {/* Email Us */}
                  <div>
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                      {supportData.email_icon ? (
                        <img
                          src={getImageUrl(supportData.email_icon) || ''}
                          alt="Email Us"
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            // Hide image on error and show fallback
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <h4 className="text-gray-900 font-bold text-lg mb-2">
                      {supportData.email_title?.trim() || "Email Us"}
                    </h4>
                    {supportData.email_description?.trim() ? (
                      <p className="text-gray-700 text-sm mb-2">
                        {supportData.email_description}
                      </p>
                    ) : null}
                    {supportData.email_address?.trim() ? (
                      <a
                        href={`mailto:${supportData.email_address}`}
                        className="text-gray-900 font-semibold hover:text-pink-600 transition-colors"
                      >
                        {supportData.email_address}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-semibold">Send us an email</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No support information available.</p>
              </div>
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-50 rounded-lg p-8 md:p-10 lg:p-12" data-aos="fade-up">
            <p className="text-gray-700 text-sm md:text-base mb-6">
              Fill out the form and we'll be in touch shortly.
            </p>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Phone and Job Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="jobLocation"
                    value={formData.jobLocation}
                    onChange={handleInputChange}
                    placeholder="Job Location"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Preferred Contact Method and Best Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="" className="bg-white">Preferred Contact Method</option>
                    <option value="email" className="bg-white">Email</option>
                    <option value="phone" className="bg-white">Phone</option>
                    <option value="sms" className="bg-white">SMS</option>
                    <option value="whatsapp" className="bg-white">WhatsApp</option>
                    <option value="any" className="bg-white">Any</option>
                  </select>
                </div>
                <div>
                  <select
                    name="bestTime"
                    value={formData.bestTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="" className="bg-white">Best Time to Contact</option>
                    <option value="morning" className="bg-white">Morning</option>
                    <option value="afternoon" className="bg-white">Afternoon</option>
                    <option value="evening" className="bg-white">Evening</option>
                    <option value="anytime" className="bg-white">Anytime</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your project or any special requirements"
                  rows={4}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors text-base md:text-lg"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

