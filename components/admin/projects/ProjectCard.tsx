"use client";

import { Project } from "./types";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
  isDeleting?: boolean;
}

export default function ProjectCard({ project, onEdit, onDelete, isDeleting = false }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-500";
      case "orange":
        return "bg-orange-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      // Assuming time format is "HH:MM" or "HH:MM:SS"
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes}${ampm}`;
    } catch {
      return timeString;
    }
  };

  const visibleTeamMembers = project.teamMembers.slice(0, 3);
  const additionalMembers = project.teamMembers.length - 3;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
      {/* Status Dot at corner */}
      <div className={`absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full ${getStatusColor(project.statusDot)} border-2 border-white z-10`} />
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Project Icon and Name */}
          <div className="flex items-start gap-3 flex-1">
            {project.projectIconUrl ? (
              <div className="w-8 h-8 flex-shrink-0">
                <img
                  src={project.projectIconUrl}
                  alt={project.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-xs font-semibold">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                {project.name}
              </h3>
              <p className="text-xs text-gray-600">Client: {project.client}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-xs text-gray-600">
            <div>Start: {formatDate(project.startDate)}</div>
            <div>Deadline: {formatDate(project.deadline)}</div>
          </div>
        </div>
      </div>

      {/* Hours Section - Horizontal Row */}
      <div className="mb-3 flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-800 font-medium">All Hours</span>
          <span className="text-gray-500">:</span>
          <span className="text-gray-500">{project.allHours}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-800 font-medium">Today</span>
          <span className="text-gray-500">:</span>
          <span className="text-gray-500">{project.todayHours}</span>
        </div>
        {/* Days Left Badge */}
        <span className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full text-xs font-medium ml-auto">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {project.daysLeft} days left
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-6 line-clamp-2">
        {project.description || "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form."}
      </p>

      {/* Progress Bar */}
      <div className="mb-3 relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              project.completionPercentage === 100
                ? "bg-green-500"
                : project.completionPercentage >= 50
                ? "bg-blue-500"
                : "bg-yellow-500"
            }`}
            style={{ width: `${project.completionPercentage}%` }}
          />
        </div>
        <span className="absolute top-0 right-0 text-xs font-medium text-gray-500 -mt-4">
          {project.completionPercentage}% Complete
        </span>
      </div>

      {/* Team & Actions */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          {/* Team Avatars */}
          {visibleTeamMembers.map((member, index) => (
            <div key={member.id || index} className="relative">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
          {additionalMembers > 0 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-gray-600 text-xs font-medium">+{additionalMembers}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Task Count */}
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-xs font-medium">
              {project.tasksCompleted}/{project.totalTasks}
            </span>
          </div>

          {/* Comments Count */}
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-medium">{project.commentsCount}</span>
          </div>

          {/* Edit Icon */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Edit project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {/* Delete Icon */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              disabled={isDeleting}
              className="text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete project"
            >
              {isDeleting ? (
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Meeting Schedule */}
      <div className="space-y-2">
        {/* Last Meeting */}
        {project.lastMeeting && (
          <div className="flex items-center gap-2 text-xs">
            <div className="text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-gray-600 font-medium">Last Meeting</div>
              <div className="text-gray-500">
                {formatDate(project.lastMeeting.date)} / {formatTime(project.lastMeeting.startTime)} - {formatTime(project.lastMeeting.endTime)}
              </div>
            </div>
          </div>
        )}

        {/* Next Meeting */}
        {project.nextMeeting && (
          <div className="flex items-center gap-2 text-xs">
            <div className="text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-gray-600 font-medium">Next Meeting</div>
              <div className="text-gray-500">
                {formatDate(project.nextMeeting.date)} / {formatTime(project.nextMeeting.startTime)} - {formatTime(project.nextMeeting.endTime)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

