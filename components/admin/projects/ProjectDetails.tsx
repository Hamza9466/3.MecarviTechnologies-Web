"use client";

import { Project } from "./types";
import Link from "next/link";

interface ProjectDetailsProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
}

export default function ProjectDetails({ project, onEdit, onDelete }: ProjectDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-100 text-green-800";
      case "orange":
        return "bg-orange-100 text-orange-800";
      case "red":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDotColor = (status: string) => {
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

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(project)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Project ID</label>
              <p className="text-gray-900 font-medium">{project.projectId || `PRJ-${project.id}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Client</label>
              <p className="text-gray-900 font-medium">{project.client}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${getStatusDotColor(project.status)}`}></span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-gray-900 font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">End Date / Deadline</label>
              <p className="text-gray-900 font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
            </div>
            {project.budget && (
              <div>
                <label className="text-sm font-medium text-gray-500">Budget</label>
                <p className="text-gray-900 font-medium">{project.budget}</p>
              </div>
            )}
            {project.categories && (
              <div>
                <label className="text-sm font-medium text-gray-500">Categories</label>
                <p className="text-gray-900 font-medium">{project.categories}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Completion</label>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{project.completionPercentage}%</span>
                  <span className="text-sm text-gray-600">{project.tasksCompleted} / {project.totalTasks} tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Hours</label>
              <div className="space-y-1 mt-1">
                <p className="text-gray-900 font-medium">All Hours: {project.allHours || "0 / 0:00"}</p>
                <p className="text-gray-900 font-medium">Today: {project.todayHours || "0:00"}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Days Left</label>
              <p className="text-gray-900 font-medium">{project.daysLeft} days</p>
            </div>
            {project.priorityStatus && (
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <p className="text-gray-900 font-medium capitalize">{project.priorityStatus}</p>
              </div>
            )}
            {project.projectManager && (
              <div>
                <label className="text-sm font-medium text-gray-500">Project Manager</label>
                <p className="text-gray-900 font-medium">{project.projectManager}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Comments</label>
              <p className="text-gray-900 font-medium">{project.commentsCount}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">Description</label>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>

        {/* Team Members */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-3 block">Team Members</label>
          <div className="flex flex-wrap gap-3">
            {project.teamMembers.length > 0 ? (
              project.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">{member.name}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No team members assigned</p>
            )}
          </div>
        </div>

        {/* Meetings */}
        {(project.lastMeeting || project.nextMeeting) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            {project.lastMeeting && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Last Meeting</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">
                    {new Date(project.lastMeeting.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.lastMeeting.startTime} - {project.lastMeeting.endTime}
                  </p>
                </div>
              </div>
            )}
            {project.nextMeeting && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Next Meeting</label>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">
                    {new Date(project.nextMeeting.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.nextMeeting.startTime} - {project.nextMeeting.endTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

