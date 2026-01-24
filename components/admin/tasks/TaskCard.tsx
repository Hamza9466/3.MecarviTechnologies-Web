"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit: () => void;
}

export default function TaskCard({ task, onClick, onEdit }: TaskCardProps) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 flex-1">{task.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      {task.assignedToName && (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {task.assignedToName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-600">{task.assignedToName}</span>
        </div>
      )}
    </div>
  );
}

