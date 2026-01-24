"use client";

import CreateProjectForm from "@/components/admin/projects/CreateProjectForm";

export default function CreateProjectPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Create New Project</h1>
      </div>

      {/* Form Section */}
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CreateProjectForm />
        </div>
      </div>
    </div>
  );
}

