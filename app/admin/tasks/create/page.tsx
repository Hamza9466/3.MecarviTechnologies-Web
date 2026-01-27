"use client";

import CreateTaskForm from "@/components/admin/tasks/CreateTaskForm";
import Link from "next/link";

export default function CreateTaskPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Create Project Tasks</h1>
          <div className="text-sm text-purple-600">
            <Link href="/admin/projects" className="hover:text-purple-700">
              Projects
            </Link>
            <span className="mx-2">/</span>
            <Link href="/admin/tasks/create" className="hover:text-purple-700">
              Create Project
            </Link>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-lg">
          <CreateTaskForm />
        </div>
      </div>
    </div>
  );
}
