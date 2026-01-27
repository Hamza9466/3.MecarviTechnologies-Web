"use client";

import { Task } from "./types";

interface TaskListCardProps {
  task: Task;
  onClick?: () => void;
  onOptionsClick?: (e: React.MouseEvent) => void;
}

export default function TaskListCard({ task, onClick, onOptionsClick }: TaskListCardProps) {
  // Format date as "DD, MMM YYYY"
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day}, ${month} ${year}`;
    } catch {
      return "N/A";
    }
  };

  // Calculate tasks completed from subtasks or progress
  const getTasksCompleted = () => {
    if (task.subtasks && task.subtasks.length > 0) {
      const completed = task.subtasks.filter((s) => s.completed).length;
      const total = task.subtasks.length;
      return { completed, total };
    }
    // If no subtasks, use progress to estimate
    const progress = task.progress || 0;
    const estimatedTotal = 22; // Default estimate to match image
    const completed = Math.round((progress / 100) * estimatedTotal);
    return { completed, total: estimatedTotal };
  };

  const tasksInfo = getTasksCompleted();

  // Get priority badge color - matching image exactly (light colors with white text)
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-green-300 text-white"; // Light green background, white text
      case "medium":
        return "bg-blue-300 text-white"; // Light blue background, white text
      case "high":
      case "urgent":
        return "bg-red-300 text-white"; // Light red background, white text
      default:
        return "bg-gray-300 text-white";
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (task.progress !== undefined) {
      return task.progress;
    }
    if (task.subtasks && task.subtasks.length > 0) {
      const completed = task.subtasks.filter((s) => s.completed).length;
      return Math.round((completed / task.subtasks.length) * 100);
    }
    return 0;
  };

  const completionPercentage = getCompletionPercentage();

  // Get task icon SVG with gradient colors (pink/magenta to blue) - reduced size
  const getTaskIcon = () => {
    const iconIndex = task.id % 4;
    const icons = [
      // Swirling C-like icon with gradient
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <defs>
          <linearGradient id={`gradient-${task.id}-1`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8c-1.1 0-2.14-.22-3.1-.62L8 16l1.38-1.38C8.78 14.14 8 13.1 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-.55 0-1.05-.11-1.52-.3L9 11l1.3-1.48c.47.19.97.3 1.52.3 2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4c0 .55.11 1.05.3 1.52L7 9l-1.48-1.3C5.11 7.55 5 7.05 5 6.5c0-2.21 1.79-4 4-4z" fill="url(#gradient-${task.id}-1)" opacity="0.8"/>
        <circle cx="16" cy="8" r="4" fill="#3B82F6" opacity="0.9"/>
      </svg>,
      // Circle with gradient
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <defs>
          <linearGradient id={`gradient-${task.id}-2`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="8" fill="url(#gradient-${task.id}-2)" opacity="0.8"/>
        <circle cx="16" cy="8" r="3" fill="#3B82F6"/>
      </svg>,
      // Swirling shape
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <defs>
          <linearGradient id={`gradient-${task.id}-3`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 4c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" fill="url(#gradient-${task.id}-3)" opacity="0.8"/>
        <path d="M16 8c0-2.21-1.79-4-4-4S8 5.79 8 8c0 1.1.45 2.1 1.17 2.83L12 14l2.83-3.17c.72-.73 1.17-1.73 1.17-2.83z" fill="#3B82F6" opacity="0.9"/>
      </svg>,
      // Abstract swirl
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <defs>
          <linearGradient id={`gradient-${task.id}-4`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4-8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="url(#gradient-${task.id}-4)" opacity="0.8"/>
        <circle cx="16" cy="8" r="3" fill="#3B82F6"/>
      </svg>
    ];
    return icons[iconIndex];
  };

  // Get team members
  const teamMembers = task.assignedTeam || (task.assignedToName ? [
    {
      id: task.assignedTo || 0,
      name: task.assignedToName,
      role: "",
      avatarUrl: task.assignedToAvatar,
    }
  ] : []);

  const visibleTeamMembers = teamMembers.slice(0, 3);
  const additionalMembers = teamMembers.length - 3;

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOptionsClick) {
      onOptionsClick(e);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer relative"
    >
      {/* Header: Icon, Title, Progress, and Options */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Icon with gradient/pinkish background - reduced size */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 to-blue-200/50"></div>
            <div className="relative z-10">
              {getTaskIcon()}
            </div>
          </div>
          
          {/* Title and Progress Block */}
          <div className="flex-1 min-w-0">
            {/* Title - further reduced font size, bold, dark gray */}
            <h3 className="text-sm font-bold text-gray-900 truncate leading-tight mb-0.5">
              {task.title}
            </h3>
            {/* Tasks Completed - smaller, lighter grey with bold numbers */}
            <div className="text-xs text-gray-500">
              Total <span className="font-bold text-gray-700">{tasksInfo.completed}/{tasksInfo.total}</span> tasks completed
            </div>
          </div>
        </div>
        
        {/* Options Menu - square button with rounded corners, light gray background */}
        <button
          onClick={handleOptionsClick}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
          aria-label="Options"
        >
          <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Team and Priority Row */}
      <div className="flex items-start justify-between mb-3">
        {/* Team Section */}
        <div className="flex-1">
          <div className="text-xs text-gray-900 font-medium mb-2">Team :</div>
          <div className="flex items-center -space-x-2">
            {visibleTeamMembers.map((member, index) => (
              <div key={member.id || index} className="relative">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {additionalMembers > 0 && (
              <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-medium">+{additionalMembers}</span>
              </div>
            )}
          </div>
        </div>

        {/* Priority Section */}
        <div className="flex-shrink-0">
          <div className="text-xs text-gray-900 font-medium mb-2">Priority :</div>
          <span className={`px-3 py-1 text-xs font-normal rounded ${getPriorityColor(task.priority)} shadow-sm`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <span className="text-sm text-gray-600 font-medium">Description :</span>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
          {task.description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi maiores similique tempore."}
        </p>
      </div>

      {/* Status with Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">Status :</span>
          <span className="text-sm font-medium text-gray-900">{completionPercentage}% Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Border separator */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Dates - bottom row */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <div className="text-gray-500 font-normal">Assigned Date :</div>
          <div className="text-gray-900 font-bold mt-0.5">{formatDate(task.startDate || task.createdAt)}</div>
        </div>
        <div>
          <div className="text-gray-500 font-normal">Due Date :</div>
          <div className="text-gray-900 font-bold mt-0.5">{formatDate(task.dueDate)}</div>
        </div>
      </div>
    </div>
  );
}

