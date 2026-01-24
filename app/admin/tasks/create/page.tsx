"use client";

import CreateTaskForm from "@/components/admin/tasks/CreateTaskForm";

export default function CreateTaskPage() {
  return (
    <div className="w-full">
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Create New Task</h1>
      </div>
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CreateTaskForm />
        </div>
      </div>
    </div>
  );
}

