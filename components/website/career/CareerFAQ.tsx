"use client";

import { useState } from "react";
import Image from "next/image";

export default function CareerFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How Does Product Customization Work?",
      answer: "This Store Is A Demonstration Of A Luxury Brand Using The Stiletto Shopify Theme. Products And Imagery For This Demo Graciously Provided By St. AgniOur Dresses Pair Timeless Designs With Sustainable.",
    },
    {
      id: 2,
      question: "How Does Product Customization Work?",
      answer: "Getting started with Flowbite is easy. You can install it via npm or yarn, or simply include the CSS file in your project. Check out our documentation for detailed instructions.",
    },
    {
      id: 3,
      question: "How Does Product Customization Work?",
      answer: "Flowbite is a collection of utility-first CSS components built with Tailwind CSS that you can use to build faster custom layouts and components.",
    },
    {
      id: 4,
      question: "How Does Product Customization Work?",
      answer: "Getting started with Flowbite is easy. You can install it via npm or yarn, or simply include the CSS file in your project. Check out our documentation for detailed instructions.",
    },
    {
      id: 5,
      question: "How Does Product Customization Work?",
      answer: "Flowbite is a collection of utility-first CSS components built with Tailwind CSS that you can use to build faster custom layouts and components.",
    },
    {
      id: 6,
      question: "How Does Product Customization Work?",
      answer: "Getting started with Flowbite is easy. You can install it via npm or yarn, or simply include the CSS file in your project. Check out our documentation for detailed instructions.",
    },
    {
      id: 7,
      question: "How Does Product Customization Work?",
      answer: "Flowbite is a collection of utility-first CSS components built with Tailwind CSS that you can use to build faster custom layouts and components.",
    },
    {
      id: 8,
      question: "How Does Product Customization Work?",
      answer: "Getting started with Flowbite is easy. You can install it via npm or yarn, or simply include the CSS file in your project. Check out our documentation for detailed instructions.",
    },
    {
      id: 9,
      question: "How Does Product Customization Work?",
      answer: "Flowbite is a collection of utility-first CSS components built with Tailwind CSS that you can use to build faster custom layouts and components.",
    },
    {
      id: 10,
      question: "How Does Product Customization Work?",
      answer: "Getting started with Flowbite is easy. You can install it via npm or yarn, or simply include the CSS file in your project. Check out our documentation for detailed instructions.",
    },
  ];

  return (
    <section className="bg-white px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Items - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border-b border-gray-200 pb-4 cursor-pointer"
              onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-base md:text-lg font-medium pr-4 ${
                  openFAQ === faq.id ? "text-green-700" : "text-gray-700"
                }`}>
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
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
              {openFAQ === faq.id && (
                <div className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-16 md:mt-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 md:mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600">Submit your application through our online portal with your resume and cover letter.</p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review</h3>
              <p className="text-gray-600">Our team reviews your application and assesses your qualifications for the role.</p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview</h3>
              <p className="text-gray-600">Meet with our team to discuss your experience and how you can contribute to Mecarvi.</p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Join</h3>
              <p className="text-gray-600">Welcome aboard! Start your journey with Mecarvi and grow your career with us.</p>
            </div>
          </div>
        </div>

              </div>
    </section>
  );
}
