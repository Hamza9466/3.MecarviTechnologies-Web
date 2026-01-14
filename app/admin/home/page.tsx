"use client";

import { useState, useRef } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import HeroEditor from "@/components/admin/home/HeroEditor";
import AboutEditor from "@/components/admin/home/AboutEditor";
import ExploreEditor from "@/components/admin/home/ExploreEditor";
import ServicesEditor from "@/components/admin/home/ServicesEditor";
import WhatWeDoEditor from "@/components/admin/home/WhatWeDoEditor";
import WhyChooseUsEditor from "@/components/admin/home/WhyChooseUsEditor";
import OurFactsEditor from "@/components/admin/home/OurFactsEditor";
import PortfolioEditor from "@/components/admin/home/PortfolioEditor";
import ReviewsEditor from "@/components/admin/home/ReviewsEditor";
import QuoteEditor from "@/components/admin/home/QuoteEditor";

export default function HomePageEditor() {
  const [activeTab, setActiveTab] = useState("Hero");
  const [saving, setSaving] = useState(false);
  const heroEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const aboutEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const servicesEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const whatWeDoEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const whyChooseUsEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const ourFactsEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const reviewsEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const portfolioEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const quoteEditorRef = useRef<{ save: () => Promise<void> }>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Save button clicked, activeTab:", activeTab);
      
      if (activeTab === "Hero" && heroEditorRef.current) {
        console.log("Calling HeroEditor save");
        await heroEditorRef.current.save();
      } else if (activeTab === "About") {
        console.log("About tab active, aboutEditorRef.current:", aboutEditorRef.current);
        if (aboutEditorRef.current) {
          console.log("Calling AboutEditor save");
          await aboutEditorRef.current.save();
        } else {
          console.error("AboutEditor ref is null!");
        }
      } else if (activeTab === "Services") {
        console.log("Services tab active, servicesEditorRef.current:", servicesEditorRef.current);
        if (servicesEditorRef.current) {
          console.log("Calling ServicesEditor save");
          await servicesEditorRef.current.save();
        } else {
          console.error("ServicesEditor ref is null!");
        }
      } else if (activeTab === "What We Create") {
        console.log("What We Create tab active, whatWeDoEditorRef.current:", whatWeDoEditorRef.current);
        if (whatWeDoEditorRef.current) {
          console.log("Calling WhatWeDoEditor save");
          await whatWeDoEditorRef.current.save();
        } else {
          console.error("WhatWeDoEditor ref is null!");
        }
      } else if (activeTab === "Why Choose Us") {
        console.log("Why Choose Us tab active, whyChooseUsEditorRef.current:", whyChooseUsEditorRef.current);
        if (whyChooseUsEditorRef.current) {
          console.log("Calling WhyChooseUsEditor save");
          await whyChooseUsEditorRef.current.save();
        } else {
          console.error("WhyChooseUsEditor ref is null!");
        }
      } else if (activeTab === "Our Facts") {
        console.log("Our Facts tab active, ourFactsEditorRef.current:", ourFactsEditorRef.current);
        if (ourFactsEditorRef.current) {
          console.log("Calling OurFactsEditor save");
          await ourFactsEditorRef.current.save();
        } else {
          console.error("OurFactsEditor ref is null!");
        }
      } else if (activeTab === "Reviews") {
        console.log("Reviews tab active, reviewsEditorRef.current:", reviewsEditorRef.current);
        if (reviewsEditorRef.current) {
          console.log("Calling ReviewsEditor save");
          await reviewsEditorRef.current.save();
        } else {
          console.error("ReviewsEditor ref is null!");
        }
      } else if (activeTab === "Portfolio") {
        console.log("Portfolio tab active, portfolioEditorRef.current:", portfolioEditorRef.current);
        if (portfolioEditorRef.current) {
          console.log("Calling PortfolioEditor save");
          await portfolioEditorRef.current.save();
        } else {
          console.error("PortfolioEditor ref is null!");
        }
      } else if (activeTab === "Quote") {
        console.log("Quote tab active, quoteEditorRef.current:", quoteEditorRef.current);
        if (quoteEditorRef.current) {
          console.log("Calling QuoteEditor save");
          await quoteEditorRef.current.save();
        } else {
          console.error("QuoteEditor ref is null!");
        }
      } else {
        console.warn(`Save handler not implemented for tab: ${activeTab}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      // Error messages are handled by individual editor components
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    "Hero",
    "About",
    "Explore",
    "Services",
    "What We Create",
    "Why Choose Us",
    "Our Facts",
    "Portfolio",
    "Reviews",
    "Quote",
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Home Page</h1>
      </div>
      
      {/* Tabs */}
      <div className="px-6 mb-4">
        <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Edit Section */}
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">
              {activeTab === "Quote" ? "Edit Quote Section" : activeTab === "Explore" ? "Edit Explore Page" : activeTab === "About" ? "About Home Page" : activeTab === "Portfolio" ? "Portfolio Section" : activeTab === "Services" ? "Edit Services Section" : activeTab === "Our Facts" ? "Edit Our Facts Section" : "Edit Home Page"}
            </h2>
            {activeTab !== "Portfolio" && activeTab !== "Services" && <div className="h-1 bg-pink-600 w-full"></div>}
          </div>
          
          {/* Content based on active tab */}
          {activeTab === "Hero" && <HeroEditor ref={heroEditorRef} />}
          {activeTab === "About" && <AboutEditor ref={aboutEditorRef} />}
          {activeTab === "Explore" && <ExploreEditor />}
          {activeTab === "Services" && <ServicesEditor ref={servicesEditorRef} />}
          {activeTab === "What We Create" && <WhatWeDoEditor ref={whatWeDoEditorRef} />}
          {activeTab === "Why Choose Us" && <WhyChooseUsEditor ref={whyChooseUsEditorRef} />}
          {activeTab === "Our Facts" && <OurFactsEditor ref={ourFactsEditorRef} />}
          {activeTab === "Portfolio" && <PortfolioEditor ref={portfolioEditorRef} />}
          {activeTab === "Reviews" && <ReviewsEditor ref={reviewsEditorRef} />}
          {activeTab === "Quote" && <QuoteEditor ref={quoteEditorRef} />}
          
          {/* Save Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

