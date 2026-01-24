"use client";

import { useProjects } from "@/components/admin/projects/useProjects";
import ProjectCard from "@/components/admin/projects/ProjectCard";
import { Project } from "@/components/admin/projects/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectKanbanPage() {
  const router = useRouter();
  const { projects, loading, error } = useProjects();

  const handleView = (project: Project) => {
    router.push(`/admin/projects/${project.id}`);
  };

  const handleEdit = (project: Project) => {
    router.push(`/admin/projects/edit/${project.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-50 border-green-200";
      case "orange":
        return "bg-orange-50 border-orange-200";
      case "red":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "green":
        return "On Track";
      case "orange":
        return "At Risk";
      case "red":
        return "Delayed";
      default:
        return "Unknown";
    }
  };

  const projectsByStatus = {
    green: projects.filter((p) => p.status === "green"),
    orange: projects.filter((p) => p.status === "orange"),
    red: projects.filter((p) => p.status === "red"),
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Projects Kanban</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            List View
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* On Track Column */}
            <div className={`rounded-lg border-2 ${getStatusColor("green")} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{getStatusTitle("green")}</h2>
                <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {projectsByStatus.green.length}
                </span>
              </div>
              <div className="space-y-4">
                {projectsByStatus.green.map((project) => (
                  <div key={project.id} onClick={() => handleView(project)} className="cursor-pointer">
                    <ProjectCard project={project} onEdit={handleEdit} />
                  </div>
                ))}
                {projectsByStatus.green.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No projects in this status
                  </div>
                )}
              </div>
            </div>

            {/* At Risk Column */}
            <div className={`rounded-lg border-2 ${getStatusColor("orange")} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{getStatusTitle("orange")}</h2>
                <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {projectsByStatus.orange.length}
                </span>
              </div>
              <div className="space-y-4">
                {projectsByStatus.orange.map((project) => (
                  <div key={project.id} onClick={() => handleView(project)} className="cursor-pointer">
                    <ProjectCard project={project} onEdit={handleEdit} />
                  </div>
                ))}
                {projectsByStatus.orange.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No projects in this status
                  </div>
                )}
              </div>
            </div>

            {/* Delayed Column */}
            <div className={`rounded-lg border-2 ${getStatusColor("red")} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{getStatusTitle("red")}</h2>
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {projectsByStatus.red.length}
                </span>
              </div>
              <div className="space-y-4">
                {projectsByStatus.red.map((project) => (
                  <div key={project.id} onClick={() => handleView(project)} className="cursor-pointer">
                    <ProjectCard project={project} onEdit={handleEdit} />
                  </div>
                ))}
                {projectsByStatus.red.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No projects in this status
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

