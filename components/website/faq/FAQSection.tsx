"use client";

import { useState } from "react";

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("Inquery");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const categories = ["Inquery", "AboutUs", "ContactUs", "MoreQuestions", "FaqCategory"];

  const faqs = [
    {
      id: 1,
      question: "What is Flowbite?",
      answer: "Flowbite is a collection of utility-first CSS components built with Tailwind CSS that you can use to build faster custom layouts and components.",
    },
    {
      id: 2,
      question: "How can I get started with Flowbite?",
      answer: "Getting started with Flowbite is easy. You can install it via npm or yarn, or simply include the CSS file in your project. Check out our documentation for detailed instructions.",
    },
    {
      id: 3,
      question: "What is Tailwind CSS?",
      answer: "Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without leaving your HTML. It's highly customizable and allows for rapid UI development.",
    },
    {
      id: 4,
      question: "How do I install Tailwind CSS?",
      answer: "You can install Tailwind CSS via npm, yarn, or by using the CDN. For the best experience, we recommend using the npm installation method and following the official Tailwind CSS setup guide.",
    },
  ];

  return (
    <section className="bg-white py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 mr-8 md:mr-12 lg:mr-16">
      <div className="w-full max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-8 md:gap-12">
          {/* Left Navigation Menu */}
          <div className="relative">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 sticky top-24">
              {/* Icon at top */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setShowAskQuestion(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeCategory === category && !showAskQuestion
                        ? "bg-pink-500 text-white font-semibold"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                
                {/* Ask Question Button */}
                <button
                  onClick={() => {
                    setShowAskQuestion(true);
                    setActiveCategory("");
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    showAskQuestion
                      ? "bg-pink-500 text-white font-semibold"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Ask Question
                </button>
              </nav>
            </div>
          </div>

          {/* Right FAQ Display Area */}
          <div className="relative">
            {/* Ask Question Form */}
            {showAskQuestion ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Handle form submission here
                    console.log("Form submitted:", formData);
                    // You can add API call here to submit the question
                    alert("Question submitted successfully!");
                    setFormData({ name: "", message: "" });
                  }}
                  className="space-y-6"
                >
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                      Name
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

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                      Message
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Ask Question Now
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Paragraph Text */}
                <div className="mb-8 md:mb-12">
                  <p className="text-black text-base md:text-lg leading-relaxed text-center font-bold">
                    Find answers to commonly asked questions about our services, products, and processes. If you can't find what you're looking for, feel free to ask us a question using the form below.
                  </p>
                </div>

            {/* Grid Layout - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1 */}
              <div className="relative">
                {/* Vertical line with circle at top */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-gray-300 rounded-full bg-white"></div>
                </div>
                
                <div className="space-y-4 pl-12">
                  {faqs.filter((_, index) => index % 2 === 0).map((faq, idx) => {
                    const actualIndex = idx * 2;
                    return (
                      <div key={faq.id} className="relative">
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
                    );
                  })}
                </div>
              </div>

              {/* Column 2 */}
              <div className="relative">
                {/* Vertical line with circle at top */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-gray-300 rounded-full bg-white"></div>
                </div>
                
                <div className="space-y-4 pl-12">
                  {faqs.filter((_, index) => index % 2 === 1).map((faq, idx) => {
                    const actualIndex = idx * 2 + 1;
                    return (
                      <div key={faq.id} className="relative">
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
                    );
                  })}
                </div>
              </div>
            </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
