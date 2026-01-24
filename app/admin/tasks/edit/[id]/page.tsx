"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Task } from "@/components/admin/tasks/types";
import CreateTaskForm from "@/components/admin/tasks/CreateTaskForm";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id ? parseInt(params.id as string) : null;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId]);

  const fetchTask = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/v1/tasks/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.task) {
          setTask(data.data.task);
        } else {
          setError("Task not found");
        }
      } else if (response.status === 404) {
        setError("Task not found");
      } else {
        setError("Failed to load task");
      }
    } catch (err: any) {
      console.error("Error fetching task:", err);
      setError(err.message || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="w-full px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error || "Task not found"}</p>
          <button
            onClick={() => router.push("/admin/tasks")}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Edit Task</h1>
      </div>
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CreateTaskForm task={task} />
        </div>
      </div>
    </div>
  );
}

