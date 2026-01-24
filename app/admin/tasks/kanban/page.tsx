"use client";

import { useTasks } from "@/components/admin/tasks/useTasks";
import TaskKanban from "@/components/admin/tasks/TaskKanban";
import { Task, TaskStatus } from "@/components/admin/tasks/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TasksKanbanPage() {
  const router = useRouter();
  const { tasks, loading, error, refetch } = useTasks();
  const [updating, setUpdating] = useState<number | null>(null);

  const handleTaskUpdate = async (taskId: number, status: TaskStatus) => {
    try {
      setUpdating(taskId);
      const token = localStorage.getItem("token");
      
      try {
        const response = await fetch(`http://localhost:8000/api/v1/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ status }),
        });

        if (response.ok) {
          if (refetch) {
            refetch();
          }
        } else {
          console.log("⚠️ Backend not available - task update will be reflected locally");
          // For frontend development, just refetch to update local state
          if (refetch) {
            refetch();
          }
        }
      } catch (networkErr: any) {
        // Handle network errors gracefully for frontend development
        if (networkErr.message?.includes("Failed to fetch") || networkErr.message?.includes("NetworkError")) {
          console.log("⚠️ Backend not available - task update will be reflected locally");
          // Refetch to update local state with mock data
          if (refetch) {
            refetch();
          }
        } else {
          throw networkErr;
        }
      }
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleTaskClick = (task: Task) => {
    router.push(`/admin/tasks/${task.id}`);
  };

  const handleTaskEdit = (task: Task) => {
    router.push(`/admin/tasks/edit/${task.id}`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Tasks Kanban</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tasks"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            List View
          </Link>
          <Link
            href="/admin/tasks/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <TaskKanban
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskClick={handleTaskClick}
            onTaskEdit={handleTaskEdit}
          />
        )}
      </div>
    </div>
  );
}

