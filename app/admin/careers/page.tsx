"use client";

import { useRef, useState } from "react";
import CareersEditor from "@/components/admin/careers/CareersEditor";

export default function CareersPageEditor() {
  const editorRef = useRef<any>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    console.log("Save button clicked");
    console.log("Editor ref:", editorRef.current);

    setIsSaving(true);
    setSaveMessage("");

    try {
      // Save Hero Section
      if (editorRef.current && editorRef.current.handleSaveHeroSection) {
        console.log("Calling handleSaveHeroSection");
        await editorRef.current.handleSaveHeroSection();
      }

      // Save Jobs Section
      if (editorRef.current && editorRef.current.saveJobsSection) {
        console.log("Calling saveJobsSection");
        await editorRef.current.saveJobsSection();
      }

      setSaveMessage("All sections saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveMessage("Error saving sections. Please try again.");
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Careers</h1>
      </div>

      {/* Edit Section */}
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Save Message */}
          {saveMessage && (
            <div className={`mb-4 p-4 rounded-lg ${saveMessage.includes("Error")
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
              }`}>
              {saveMessage}
            </div>
          )}

          <CareersEditor ref={editorRef} />

          {/* Save Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

