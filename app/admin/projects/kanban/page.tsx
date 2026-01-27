"use client";

import { useState, useMemo } from "react";
import { useProjects } from "@/components/admin/projects/useProjects";
import ProjectKanbanCard from "@/components/admin/projects/ProjectKanbanCard";
import { Project } from "@/components/admin/projects/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

type KanbanColumn = "todo" | "in_progress" | "in_review" | "completed";
type SortOption = "name" | "date" | "priority" | "status";

export default function ProjectKanbanPage() {
  const router = useRouter();
  const { projects, loading, error } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Map project to kanban column based on completion percentage
  const getProjectColumn = (project: Project): KanbanColumn => {
    const completion = project.completionPercentage;
    if (completion === 100) return "completed";
    if (completion >= 76) return "in_review";
    if (completion >= 26) return "in_progress";
    return "todo";
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.projectId && project.projectId.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[(a.priorityStatus?.toLowerCase() as keyof typeof priorityOrder) || "low"] || 1;
          const bPriority = priorityOrder[(b.priorityStatus?.toLowerCase() as keyof typeof priorityOrder) || "low"] || 1;
          return bPriority - aPriority;
        case "status":
          return a.completionPercentage - b.completionPercentage;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, sortBy]);

  // Group projects by column
  const projectsByColumn = useMemo(() => {
    const grouped: Record<KanbanColumn, Project[]> = {
      todo: [],
      in_progress: [],
      in_review: [],
      completed: [],
    };

    filteredAndSortedProjects.forEach((project) => {
      const column = getProjectColumn(project);
      grouped[column].push(project);
    });

    return grouped;
  }, [filteredAndSortedProjects]);

  const handleCardClick = (project: Project) => {
    router.push(`/admin/projects/${project.id}`);
  };

  const handleAddProject = () => {
    router.push("/admin/projects/create");
  };

  const columns: Array<{
    id: KanbanColumn;
    title: string;
    textColor: string;
    buttonColor: string;
    contentBgColor: string;
    borderColor: string;
  }> = [
    {
      id: "todo",
      title: "Todo Tasks",
      textColor: "text-purple-600",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      contentBgColor: "bg-purple-100/30",
      borderColor: "border-purple-300",
    },
    {
      id: "in_progress",
      title: "In Progress Tasks",
      textColor: "text-orange-600",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      contentBgColor: "bg-orange-100/30",
      borderColor: "border-orange-300",
    },
    {
      id: "in_review",
      title: "In Review Tasks",
      textColor: "text-teal-600",
      buttonColor: "bg-teal-500 hover:bg-teal-600",
      contentBgColor: "bg-teal-100/30",
      borderColor: "border-teal-300",
    },
    {
      id: "completed",
      title: "Completed Tasks",
      textColor: "text-red-600",
      buttonColor: "bg-red-500 hover:bg-red-600",
      contentBgColor: "bg-red-100/30",
      borderColor: "border-red-300",
    },
  ];

  return (
    <div className="w-full bg-white h-screen flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          .kanban-scrollable::-webkit-scrollbar {
            width: 8px;
          }
          .kanban-scrollable::-webkit-scrollbar-track {
            background: transparent;
          }
          .kanban-scrollable::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .kanban-scrollable::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .kanban-scrollable {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
        `
      }} />
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/admin" className="hover:text-gray-900">Apps</Link>
          <span>→</span>
          <Link href="/admin/projects" className="hover:text-gray-900">Task</Link>
          <span>→</span>
          <span className="text-gray-900 font-medium">Kanban Board</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">WorkSpace:</span>
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search Tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium text-sm transition-colors">
                Search
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
            >
              <option value="name">Sort By: Name</option>
              <option value="date">Sort By: Date</option>
              <option value="priority">Sort By: Priority</option>
              <option value="status">Sort By: Status</option>
            </select>
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-slate-50 flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-12 h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-full">
              {columns.map((column) => {
                const columnProjects = projectsByColumn[column.id];
                return (
                  <div key={column.id} className="flex flex-col h-full min-h-0">
                    {/* Column Header */}
                    <div className="bg-white px-4 py-3 rounded-t-lg flex items-center justify-between border-l border-r border-t border-gray-200 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <h2 className={`text-base font-semibold ${column.textColor}`}>
                          {column.title} ({columnProjects.length})
                        </h2>
                      </div>
                      <button
                        onClick={handleAddProject}
                        className={`w-7 h-7 ${column.buttonColor} text-white flex items-center justify-center rounded transition-colors`}
                        title="Add new project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Column Content - Scrollable */}
                    <div className={`${column.contentBgColor} border-l border-r border-b ${column.borderColor} border-dashed border-t-2 border-b-2 rounded-b-lg flex-1 flex flex-col overflow-hidden min-h-0`}>
                      <div className="flex-1 overflow-y-auto p-3 min-h-0 kanban-scrollable">
                        <div className="space-y-2">
                          {columnProjects.length > 0 ? (
                            columnProjects.map((project) => (
                              <ProjectKanbanCard
                                key={project.id}
                                project={project}
                                onClick={() => handleCardClick(project)}
                              />
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                              No projects in this status
                            </div>
                          )}
                        </div>
                      </div>
                      {columnProjects.length > 0 && (
                        <div className="p-4 pt-0 flex-shrink-0 border-t border-gray-200">
                          <button
                            className={`w-full ${column.buttonColor} text-white py-2 rounded-lg font-medium text-sm transition-colors`}
                          >
                            View More
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
