"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./types";

interface TaskKanbanCardProps {
  task: Task;
  columnColor?: string;
  columnId?: string;
  columnBgColor?: string;
  showImage?: boolean;
  onClick?: () => void;
  onOptionsClick?: (e: React.MouseEvent) => void;
}

export default function TaskKanbanCard({ 
  task, 
  columnColor = "text-purple-600",
  columnId = "new",
  columnBgColor = "bg-purple-50",
  showImage = false,
  onClick, 
  onOptionsClick 
}: TaskKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Format created date
  const formatCreatedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleDateString("en-US", { month: "short" });
      return `${day} ${month}`;
    } catch {
      return "N/A";
    }
  };

  // Calculate days left
  const getDaysLeft = (dueDate: string | null) => {
    if (!dueDate) return null;
    try {
      const due = new Date(dueDate);
      const now = new Date();
      const diffTime = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  // Use the column's background color for all cards in that section
  const cardBg = columnBgColor;

  // Get tag styles - matching image design with borders
  const getTagStyles = (tags?: string[]) => {
    const tagStyles: Array<{ border: string; text: string; label: string }> = [];
    
    // First tag is always the task ID - can be red or green border based on task ID
    const taskIdNum = parseInt(task.taskId?.replace(/[^0-9]/g, '') || task.id.toString()) || task.id;
    const taskIdBorder = taskIdNum % 2 === 0 ? "border border-green-500" : "border border-red-500";
    const taskIdText = taskIdNum % 2 === 0 ? "text-green-500" : "text-red-500";
    tagStyles.push({ 
      border: taskIdBorder, 
      text: taskIdText, 
      label: task.taskId || `#SPK-${task.id}` 
    });
    
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        const tagLower = tag.toLowerCase();
        // Subsequent tags have different border colors based on content
        if (tagLower.includes("ui") || tagLower.includes("ux") || tagLower.includes("ix")) {
          // UI/UX can be purple or orange
          if (tagLower.includes("design") && !tagLower.includes("ui")) {
            tagStyles.push({ border: "border border-orange-500", text: "text-orange-500", label: tag });
          } else {
            tagStyles.push({ border: "border border-purple-500", text: "text-purple-500", label: tag });
          }
        } else if (tagLower.includes("auth")) {
          tagStyles.push({ border: "border border-green-500", text: "text-green-500", label: tag });
        } else if (tagLower.includes("dev") || tagLower.includes("develop")) {
          tagStyles.push({ border: "border border-red-500", text: "text-red-500", label: tag });
        } else if (tagLower.includes("plan")) {
          tagStyles.push({ border: "border border-orange-500", text: "text-orange-500", label: tag });
        } else if (tagLower.includes("update")) {
          tagStyles.push({ border: "border border-red-500", text: "text-red-500", label: tag });
        } else if (tagLower.includes("discuss")) {
          tagStyles.push({ border: "border border-green-500", text: "text-green-500", label: tag });
        } else if (tagLower.includes("design")) {
          tagStyles.push({ border: "border border-orange-500", text: "text-orange-500", label: tag });
        } else {
          tagStyles.push({ border: "border border-blue-500", text: "text-blue-500", label: tag });
        }
      });
    } else {
      // Default second tag if none provided - alternate between purple and orange
      const defaultTag = task.id % 2 === 0 ? { border: "border border-orange-500", text: "text-orange-500", label: "Ui Design" } : { border: "border border-purple-500", text: "text-purple-500", label: "UI/UX" };
      tagStyles.push(defaultTag);
    }

    return tagStyles;
  };

  const createdDate = formatCreatedDate(task.createdAt);
  const daysLeft = getDaysLeft(task.dueDate);
  const tags = getTagStyles(task.tags);
  // Use comments count for likes, or generate based on task ID for variety
  const likesCount = task.comments?.length || (task.id % 2 === 0 ? 40 : 12);
  const commentsCount = task.comments?.length || (task.id % 2 === 0 ? 8 : 2);
  const teamMembers = task.assignedTeam || (task.assignedToName ? [{ id: task.assignedTo || 0, name: task.assignedToName, role: "", avatarUrl: task.assignedToAvatar }] : []);
  
  // Icon color matches column color
  const getIconColor = (colId: string) => {
    switch (colId) {
      case "new": return "text-purple-500";
      case "todo": return "text-orange-500";
      case "in_progress": return "text-blue-500";
      case "review": return "text-yellow-500";
      case "done": return "text-green-500";
      default: return "text-gray-500";
    }
  };
  const iconColor = getIconColor(columnId);

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOptionsClick) {
      onOptionsClick(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`${cardBg} rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow`}
    >
      {/* Header Section: Created Date with Clock Icon and Options */}
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1.5 ${columnColor}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">Created - {createdDate}</span>
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

      {/* Optional Image */}
      {showImage && (
        <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={`https://picsum.photos/seed/${task.id}/400/200`}
            alt={task.title}
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2">{task.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
        {task.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla soluta consectetur sit amet elit dolor sit amet."}
      </p>

      {/* Tags and Days Left */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {tags.map((tag, index) => (
            <span key={index} className={`px-2 py-1 text-xs font-medium rounded bg-transparent ${tag.border} ${tag.text}`}>
              {tag.label}
            </span>
          ))}
        </div>
        {daysLeft !== null && (
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {daysLeft.toString().padStart(2, "0")} days left
          </span>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {/* Thumbs Up */}
          <div className={`flex items-center gap-1.5 ${iconColor}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="text-xs font-medium">{likesCount}</span>
          </div>

          {/* Comments (Speech Bubble) */}
          <div className={`flex items-center gap-1.5 ${iconColor}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-medium">{commentsCount}</span>
          </div>
        </div>

        {/* Team Members */}
        <div className="flex items-center gap-1">
          {teamMembers.slice(0, 4).map((member, index) => (
            <div key={member.id || index} className="relative">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
          {teamMembers.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-gray-600 text-xs font-medium">+{teamMembers.length - 4}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
