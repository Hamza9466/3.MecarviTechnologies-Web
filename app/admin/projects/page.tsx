"use client";

import { useProjects } from "@/components/admin/projects/useProjects";
import ProjectCard from "@/components/admin/projects/ProjectCard";
import { Project } from "@/components/admin/projects/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading, error, refetch } = useProjects();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (project: Project) => {
    router.push(`/admin/projects/edit/${project.id}`);
  };

  const handleView = (project: Project) => {
    router.push(`/admin/projects/${project.id}`);
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(projectId);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        // Refresh projects list
        if (refetch) {
          refetch();
        } else {
          window.location.reload();
        }
      } else {
        alert("Failed to delete project");
      }
    } catch (err: any) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/kanban"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Kanban
          </Link>
          <Link
            href="/admin/projects/dashboard"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/admin/projects/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No projects found.</p>
            <p className="text-sm text-gray-500">
              Projects will appear here once they are created.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id}>
                <div onClick={() => handleView(project)} className="cursor-pointer">
                  <ProjectCard
                    project={project}
                    onEdit={(p) => {
                      handleEdit(p);
                    }}
                    onDelete={(id) => {
                      handleDelete(id);
                    }}
                    isDeleting={deletingId === project.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

