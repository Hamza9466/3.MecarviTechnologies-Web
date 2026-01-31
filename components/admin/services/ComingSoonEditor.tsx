"use client";

import React from 'react';

interface ComingSoonEditorProps {
  sectionName: string;
}

export default function ComingSoonEditor({ sectionName }: ComingSoonEditorProps) {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{sectionName} Section</h3>
        <p className="text-gray-500">This section is coming soon...</p>
        <p className="text-sm text-gray-400 mt-2">We're working on adding editing capabilities for this section.</p>
      </div>
    </div>
  );
}
