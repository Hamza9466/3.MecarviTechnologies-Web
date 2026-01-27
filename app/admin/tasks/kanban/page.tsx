"use client";

import { useState, useMemo } from "react";
import { useTasks } from "@/components/admin/tasks/useTasks";
import TaskKanbanBoard from "@/components/admin/tasks/TaskKanbanBoard";
import { Task, TaskStatus } from "@/components/admin/tasks/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SortOption = "name" | "date" | "priority" | "status";

export default function TasksKanbanPage() {
  const router = useRouter();
  const { tasks, loading, error, refetch } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.taskId && task.taskId.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority] || 1;
          const bPriority = priorityOrder[b.priority] || 1;
          return bPriority - aPriority;
        case "status":
          const statusOrder = { new: 1, todo: 2, in_progress: 3, review: 4, done: 5 };
          const aStatus = statusOrder[a.status] || 1;
          const bStatus = statusOrder[b.status] || 1;
          return aStatus - bStatus;
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, sortBy]);

  const handleTaskUpdate = async (taskId: number, status: TaskStatus) => {
    try {
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
          if (refetch) {
            refetch();
          }
        }
      } catch (networkErr: any) {
        if (networkErr.message?.includes("Failed to fetch") || networkErr.message?.includes("NetworkError")) {
          console.log("⚠️ Backend not available - task update will be reflected locally");
          if (refetch) {
            refetch();
          }
        } else {
          throw networkErr;
        }
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleTaskClick = (task: Task) => {
    router.push(`/admin/tasks/${task.id}`);
  };

  const handleTaskEdit = (task: Task) => {
    router.push(`/admin/tasks/edit/${task.id}`);
  };

  // Extract unique team members from tasks for avatar display
  const teamMembers = useMemo(() => {
    const memberMap = new Map();
    tasks.forEach((task) => {
      if (task.assignedTeam) {
        task.assignedTeam.forEach((member) => {
          if (!memberMap.has(member.id)) {
            memberMap.set(member.id, member);
          }
        });
      }
      if (task.assignedToName && task.assignedTo) {
        if (!memberMap.has(task.assignedTo)) {
          memberMap.set(task.assignedTo, {
            id: task.assignedTo,
            name: task.assignedToName,
            role: "",
            avatarUrl: task.assignedToAvatar,
          });
        }
      }
    });
    return Array.from(memberMap.values());
  }, [tasks]);

  const visibleMembers = teamMembers.slice(0, 7);
  const additionalMembers = teamMembers.length - 7;

  return (
    <div className="w-full bg-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Plan Upgrade
            </button>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/admin" className="hover:text-gray-900">Apps</Link>
          <span>&gt;</span>
          <Link href="/admin/tasks" className="hover:text-gray-900">Task</Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Kanban Board</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/tasks/create"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              + New Board
            </Link>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
            >
              <option value="name">Sort By</option>
              <option value="date">Sort By: Date</option>
              <option value="priority">Sort By: Priority</option>
              <option value="status">Sort By: Status</option>
            </select>
          </div>

          {/* User Avatars */}
          <div className="flex items-center gap-2">
            {visibleMembers.map((member, index) => (
              <div key={member.id || index} className="relative">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {additionalMembers > 0 && (
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">+{additionalMembers}</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm w-64"
            />
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-slate-50 flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <TaskKanbanBoard
            tasks={filteredAndSortedTasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskClick={handleTaskClick}
            onTaskEdit={handleTaskEdit}
          />
        )}
      </div>
    </div>
  );
}
