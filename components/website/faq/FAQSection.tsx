"use client";

import { useState, useEffect } from "react";

interface FAQCategory {
  id: number;
  category_name: string;
  order: number;
}

interface FAQItem {
  id: number;
  faq_category_id: number;
  question: string;
  answer: string;
  order: number;
}

export default function FAQSection() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [introParagraph, setIntroParagraph] = useState("Find answers to commonly asked questions about our services, products, and processes. If you can't find what you're looking for, feel free to ask us a question using the form below.");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [askQuestionHeading, setAskQuestionHeading] = useState("Ask a Question");
  const [askQuestionDescription, setAskQuestionDescription] = useState("Can't find what you're looking for? Send us your question and we'll get back to you.");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [introRes, askQuestionRes, categoriesRes, faqItemsRes] = await Promise.allSettled([
        fetch("http://localhost:8000/api/v1/faq-intro-paragraph", {
          method: "GET",
          headers: { Accept: "application/json" },
        }),
        fetch("http://localhost:8000/api/v1/faq-ask-question-section", {
          method: "GET",
          headers: { Accept: "application/json" },
        }),
        fetch("http://localhost:8000/api/v1/faq-categories", {
          method: "GET",
          headers: { Accept: "application/json" },
        }),
        fetch("http://localhost:8000/api/v1/faq-items", {
          method: "GET",
          headers: { Accept: "application/json" },
        }),
      ]);

      // Handle Intro Paragraph
      if (introRes.status === "fulfilled" && introRes.value.ok) {
        try {
          const introData = await introRes.value.json();
          if (introData.success && introData.data?.faq_intro_paragraph?.paragraph_text) {
            setIntroParagraph(introData.data.faq_intro_paragraph.paragraph_text);
          }
        } catch (e) {
          console.error("Error parsing intro paragraph:", e);
        }
      }

      // Handle FAQ Ask Question Section (form heading & description)
      if (askQuestionRes.status === "fulfilled" && askQuestionRes.value.ok) {
        try {
          const askData = await askQuestionRes.value.json();
          if (askData.success && askData.data?.faq_ask_question_section) {
            const section = askData.data.faq_ask_question_section;
            if (section.heading) setAskQuestionHeading(section.heading);
            if (section.description) setAskQuestionDescription(section.description);
          }
        } catch (e) {
          console.error("Error parsing FAQ ask question section:", e);
        }
      }

      // Handle Categories
      if (categoriesRes.status === "fulfilled" && categoriesRes.value.ok) {
        try {
          const categoriesData = await categoriesRes.value.json();
          if (categoriesData.success && categoriesData.data) {
            const cats = Array.isArray(categoriesData.data)
              ? categoriesData.data
              : categoriesData.data.faq_categories || [];
            const sortedCats = cats
              .map((cat: any) => ({
                id: cat.id,
                category_name: cat.category_name || "",
                order: cat.order || 0,
              }))
              .sort((a: FAQCategory, b: FAQCategory) => a.order - b.order);
            setCategories(sortedCats);
            // Keep activeCategory null so "All Categories" shows all FAQs by default
          }
        } catch (e) {
          console.error("Error parsing categories:", e);
        }
      }

      // Handle FAQ Items - ensure we always get an array and parse every item
      if (faqItemsRes.status === "fulfilled" && faqItemsRes.value.ok) {
        try {
          const faqItemsData = await faqItemsRes.value.json();
          if (faqItemsData.success && faqItemsData.data) {
            const raw = Array.isArray(faqItemsData.data)
              ? faqItemsData.data
              : faqItemsData.data.faq_items;
            const items = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
            const sortedItems = items
              .map((item: any, index: number) => ({
                id: item.id ?? index,
                faq_category_id: item.faq_category_id ?? item.category_id ?? 0,
                question: item.question || "",
                answer: item.answer || "",
                order: item.order ?? index,
              }))
              .sort((a: FAQItem, b: FAQItem) => a.order - b.order);
            setFaqItems(sortedItems);
          }
        } catch (e) {
          console.error("Error parsing FAQ items:", e);
        }
      }
    } catch (err) {
      console.error("Error fetching FAQ data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/user-submitted-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          question_message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit question");
      }

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error: any) {
      setSubmitError(error.message || "Failed to submit question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter FAQs by active category
  const filteredFAQs = activeCategory
    ? faqItems.filter((faq) => faq.faq_category_id === activeCategory)
    : faqItems;

  // Split FAQs into two columns
  const column1FAQs = filteredFAQs.filter((_, index) => index % 2 === 0);
  const column2FAQs = filteredFAQs.filter((_, index) => index % 2 === 1);

  return (
    <section className="bg-white py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 mr-8 md:mr-12 lg:mr-16">
      <div className="w-full max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-8 md:gap-12">
          {/* Left Navigation Menu */}
          <div className="relative" data-aos="fade-up">
            <div className="space-y-6">
              {/* Navigation Menu */}
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 sticky top-24">
                {/* Icon at top */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">N</span>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {loading ? (
                    <div className="text-center text-gray-500 py-4">Loading categories...</div>
                  ) : (
                    <>
                      {/* All Categories - show all FAQs */}
                      <button
                        onClick={() => setActiveCategory(null)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          activeCategory === null
                            ? "bg-pink-500 text-white font-semibold"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                              activeCategory === category.id
                                ? "bg-pink-500 text-white font-semibold"
                                : "text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {category.category_name}
                          </button>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-4 text-sm">No categories available</div>
                      )}
                    </>
                  )}
                  
                </nav>
              </div>

              {/* Ask Question Form - always visible */}
              <div className="rounded-lg shadow-sm border border-gray-100 p-6 md:p-8" style={{ backgroundColor: '#F3F4F6' }}>
                  {submitSuccess && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      Question submitted successfully! We'll get back to you soon.
                    </div>
                  )}
                  {submitError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {submitError}
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmitQuestion}
                    className="space-y-6"
                  >
                    {/* Form Heading & Description - from API */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{askQuestionHeading}</h3>
                      <p className="text-sm text-gray-600">
                        {askQuestionDescription}
                      </p>
                    </div>

                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Write your message"
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-y"
                        required
                      />
                    </div>

                    {/* Submit Button - smaller and centered on large screens */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full lg:w-auto lg:max-w-xs lg:px-8 lg:py-2.5 text-base lg:text-sm bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Submitting..." : "Ask Question Now"}
                      </button>
                    </div>
                  </form>
                </div>
            </div>
          </div>

          {/* Right FAQ Display Area */}
          <div className="relative" data-aos="fade-up">
            <div className="space-y-6">
                {/* Paragraph Text */}
                <div className="mb-8 md:mb-12">
                  <p className="text-black text-base md:text-lg leading-relaxed text-center font-bold">
                    {loading ? "Loading..." : introParagraph}
                  </p>
                </div>

            {/* Grid Layout - 2 columns */}
            {loading ? (
              <div className="text-center text-gray-500 py-12">Loading FAQs...</div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                {activeCategory ? "No FAQs found for this category." : "No FAQs available."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1 */}
                <div className="relative">
                  {/* Vertical line with circle at top */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-gray-300 rounded-full bg-white"></div>
                  </div>
                  
                  <div className="space-y-4 pl-12">
                    {column1FAQs.map((faq, idx) => (
                      <div key={`faq-c1-${faq.id}-${idx}`} className="relative">
                        {/* FAQ Item */}
                        <div className="border-2 border-pink-500 rounded-lg p-4 md:p-6 bg-white hover:shadow-md transition-shadow">
                          <button
                            onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <h3 className="text-black font-medium text-base md:text-lg pr-4 flex-1">
                              {faq.question}
                            </h3>
                            
                            {/* Expandable Arrow Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full border-2 border-pink-500 flex items-center justify-center bg-white">
                                <svg
                                  className={`w-4 h-4 text-pink-500 transition-transform duration-300 ${
                                    openFAQ === faq.id ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </button>
                          
                          {/* Answer (Expandable) */}
                          {openFAQ === faq.id && (
                            <div className="mt-4 pt-4 border-t border-pink-200">
                              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="relative">
                  {/* Vertical line with circle at top */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-gray-300 rounded-full bg-white"></div>
                  </div>
                  
                  <div className="space-y-4 pl-12">
                    {column2FAQs.map((faq, idx) => (
                      <div key={`faq-c2-${faq.id}-${idx}`} className="relative">
                        {/* FAQ Item */}
                        <div className="border-2 border-pink-500 rounded-lg p-4 md:p-6 bg-white hover:shadow-md transition-shadow">
                          <button
                            onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <h3 className="text-black font-medium text-base md:text-lg pr-4 flex-1">
                              {faq.question}
                            </h3>
                            
                            {/* Expandable Arrow Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full border-2 border-pink-500 flex items-center justify-center bg-white">
                                <svg
                                  className={`w-4 h-4 text-pink-500 transition-transform duration-300 ${
                                    openFAQ === faq.id ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </button>
                          
                          {/* Answer (Expandable) */}
                          {openFAQ === faq.id && (
                            <div className="mt-4 pt-4 border-t border-pink-200">
                              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
