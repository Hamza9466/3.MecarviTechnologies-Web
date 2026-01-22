"use client";

import { useState, useRef } from "react";

export default function QuoteForm() {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    projectType: "",
    estimateBudget: "",
    maximumTime: "",
    companyName: "",
    requiredSkills: "",
    country: "",
    message: "",
    uploadedFiles: [] as File[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...newFiles],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...newFiles],
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formDataToSend = new FormData();

      // Required fields
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("email", formData.email);

      // Optional fields
      if (formData.phone) {
        formDataToSend.append("phone", formData.phone);
      }
      if (formData.companyName) {
        formDataToSend.append("company_name", formData.companyName);
      }
      if (formData.country) {
        formDataToSend.append("country", formData.country);
      }
      if (formData.projectType) {
        formDataToSend.append("project_type", formData.projectType);
      }
      if (formData.estimateBudget) {
        formDataToSend.append("estimate_budget", formData.estimateBudget);
      }
      if (formData.maximumTime) {
        formDataToSend.append("maximum_time_for_project", formData.maximumTime);
      }
      if (formData.requiredSkills) {
        formDataToSend.append("required_skills", formData.requiredSkills);
      }
      if (formData.message) {
        formDataToSend.append("message", formData.message);
      }

      // Append files as uploaded_files array
      formData.uploadedFiles.forEach((file) => {
        formDataToSend.append("uploaded_files[]", file);
      });

      const response = await fetch("http://localhost:8000/api/v1/quote-form", {
        method: "POST",
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.status === 201 && responseData.success) {
        setSubmitSuccess(responseData.message || "Thank you! Your quote request has been submitted successfully.");
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          projectType: "",
          estimateBudget: "",
          maximumTime: "",
          companyName: "",
          requiredSkills: "",
          country: "",
          message: "",
          uploadedFiles: [],
        });
        setActiveTab(1);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess("");
        }, 5000);
      } else if (response.status === 422) {
        // Validation errors
        const errorMessages: string[] = [];
        if (responseData.errors) {
          Object.keys(responseData.errors).forEach((field) => {
            const fieldErrors = responseData.errors[field];
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            }
          });
        }
        setSubmitError(errorMessages.length > 0 ? errorMessages.join(" ") : (responseData.message || "Validation failed. Please check your input."));
      } else {
        setSubmitError(responseData.message || "Failed to submit form. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting quote form:", err);
      setSubmitError("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canGoBack = activeTab > 1;
  const canProceed = activeTab < 2;

  const handleNext = () => {
    if (canProceed) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setActiveTab((prev) => prev - 1);
    }
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 pt-10 pb-12 md:pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 md:p-8 lg:p-10 shadow-2xl">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                    }`}>
                    {activeTab > 1 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">1</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${activeTab === 1 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                    Basic Information
                  </span>
                </div>
                {/* Connector Line */}
                <div className={`w-32 md:w-48 lg:w-64 h-0.5 mx-4 md:mx-6 ${activeTab >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 2
                    ? 'bg-blue-600 text-white'
                    : activeTab > 2
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                    }`}>
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <span className={`mt-2 text-xs font-medium ${activeTab === 2 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                    Project Details
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {submitSuccess}
            </div>
          )}
          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Tab 1: Basic Information */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Type your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 appearance-none bg-white"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="usa">United States</option>
                    <option value="canada">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Project Type *</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 appearance-none bg-white"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="software-engineering">Software Engineering</option>
                    <option value="ai-automation">AI & Automation</option>
                    <option value="cloud-devops">Cloud & DevOps</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Estimate Budget *</label>
                  <input
                    type="text"
                    name="estimateBudget"
                    value={formData.estimateBudget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Project Details, Files & Message */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Maximum time for the project *</label>
                  <input
                    type="text"
                    name="maximumTime"
                    value={formData.maximumTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Required Skills *</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-gray-900 mb-3 font-medium">Upload file</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="text-gray-600 mb-4">Drag file here or click the button below</p>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Upload file
                  </button>
                </div>

                {/* Display selected files */}
                {formData.uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                    {formData.uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <svg
                            className="w-5 h-5 text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm text-gray-900 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="ml-2 text-red-600 hover:text-red-800 flex-shrink-0"
                          title="Remove file"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Section */}
              <div>
                <label className="block text-gray-900 mb-2 font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                  placeholder="Enter your message here..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={!canGoBack}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${canGoBack
                ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              Previous
            </button>

            {canProceed ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${submitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {submitting ? "Submitting..." : "Request a quote"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
