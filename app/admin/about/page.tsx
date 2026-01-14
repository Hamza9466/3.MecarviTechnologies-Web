"use client";

import { useRef, useState } from "react";
import AboutEditor from "@/components/admin/about/AboutEditor";
import CoreValuesEditor from "@/components/admin/about/CoreValuesEditor";

export default function AboutPageEditor() {
  const aboutEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    console.log("Save button clicked in AboutPageEditor");
    console.log("aboutEditorRef.current:", aboutEditorRef.current);
    
    if (isSaving) {
      console.log("Already saving, ignoring click");
      return;
    }
    
    if (aboutEditorRef.current) {
      try {
        setIsSaving(true);
        console.log("Calling save method...");
        await aboutEditorRef.current.save();
        console.log("Save completed");
      } catch (error) {
        console.error("Error in handleSave:", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      console.error("aboutEditorRef.current is null!");
      alert("Editor not ready. Please wait for the page to load completely.");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">About Page Section</h1>
      </div>
      
      {/* Edit Section */}
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-pink-600 mb-2">Edit About Page</h2>
            <div className="h-0.5 bg-pink-600 w-full"></div>
          </div>
          
          <AboutEditor ref={aboutEditorRef} />
          
          {/* Save Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Button clicked, calling handleSave");
                if (!isSaving) {
                  handleSave();
                }
              }}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Core Values Cards Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-pink-600 mb-2">Core Values Management</h2>
            <div className="h-0.5 bg-pink-600 w-full"></div>
          </div>
          <CoreValuesEditor />
        </div>
      </div>
    </div>
  );
}

