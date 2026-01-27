"use client";

import { Project } from "./types";

interface ProjectKanbanCardProps {
  project: Project;
  onClick?: () => void;
  onOptionsClick?: (e: React.MouseEvent) => void;
}

export default function ProjectKanbanCard({ project, onClick, onOptionsClick }: ProjectKanbanCardProps) {
  // Get tag color based on category - matching image colors
  const getTagColor = (category?: string) => {
    if (!category) return "bg-green-100 text-green-800";
    const cat = category.toLowerCase();
    if (cat.includes("marketing")) return "bg-green-100 text-green-800";
    if (cat.includes("authentication")) return "bg-orange-100 text-orange-800";
    if (cat.includes("design") || cat.includes("review")) return "bg-blue-100 text-blue-800";
    if (cat.includes("development")) return "bg-green-100 text-green-800";
    if (cat.includes("ui") || cat.includes("front end")) return "bg-orange-100 text-orange-800";
    if (cat.includes("react")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  // Format project ID
  const projectId = project.projectId || `#SPRU${project.id}`;
  const category = project.categories || "Marketing";
  const priority = project.priorityStatus || "Low";
  const assignedTo = project.projectManager || project.teamMembers[0]?.name || "Unassigned";
  const assignedRole = "Project Manager"; // Default role
  const attachmentsCount = 23; // Placeholder - can be added to project type later

  // Get first team member avatar for assigned to
  const assignedAvatar = project.teamMembers[0]?.avatarUrl || null;
  const assignedInitials = assignedTo.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Handle options menu click
  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOptionsClick) {
      onOptionsClick(e);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Top Section: ID, Tag, and Options Menu */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">ID:</span>
          <span className="text-sm font-semibold text-gray-900">{projectId}</span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTagColor(category)}`}>
            {category}
          </span>
        </div>
        <button
          onClick={handleOptionsClick}
          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          aria-label="Options"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2">{project.name}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
        {project.description || "No description available."}
      </p>

      {/* Status Section: Priority and Status in Column */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Priority:</span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              priority.toLowerCase() === "high"
                ? "bg-red-500 text-white"
                : priority.toLowerCase() === "medium"
                ? "bg-orange-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600">Status:</span>
          <span className="text-xs text-gray-700">{project.completionPercentage}% Completed</span>
          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>

      {/* Bottom Section: User Profile and Engagement Metrics */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        {/* Left: User Profile */}
        <div className="flex items-center gap-2">
          {assignedAvatar ? (
            <img
              src={assignedAvatar}
              alt={assignedTo}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium border-2 border-gray-200">
              {assignedInitials}
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-gray-900">{assignedTo}</div>
            <div className="text-[10px] text-gray-500">{assignedRole}</div>
          </div>
        </div>

        {/* Right: Engagement Metrics Icons */}
        <div className="flex items-center gap-2">
          {/* People Count - Light Blue/Teal */}
          <div className="flex items-center gap-1.5 text-cyan-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium">{project.teamMembers.length}</span>
          </div>

          {/* Projects/Tasks Count - Orange/Amber (Swirl/P-like icon) */}
          <div className="flex items-center gap-1.5 text-amber-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8c-1.1 0-2.14-.22-3.1-.62L8 16l1.38-1.38C8.78 14.14 8 13.1 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-.55 0-1.05-.11-1.52-.3L9 11l1.3-1.48c.47.19.97.3 1.52.3 2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4c0 .55.11 1.05.3 1.52L7 9l-1.48-1.3C5.11 7.55 5 7.05 5 6.5c0-2.21 1.79-4 4-4z" fill="currentColor"/>
            </svg>
            <span className="text-xs font-medium">{project.tasksCompleted || 8}</span>
          </div>

          {/* Comments Count - Light Blue */}
          <div className="flex items-center gap-1.5 text-cyan-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-medium">{project.commentsCount || 4}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
