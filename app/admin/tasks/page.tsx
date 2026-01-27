"use client";

import { useTasks } from "@/components/admin/tasks/useTasks";
import { Task } from "@/components/admin/tasks/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import TaskListCard from "@/components/admin/tasks/TaskListCard";

type SortOption = "name" | "date" | "priority" | "status";

export default function TasksPage() {
  const router = useRouter();
  const { tasks, loading, error } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 4 columns x 2 rows

  // Get user name from localStorage for avatar
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "User" : "User";
  const userInitial = userName.charAt(0).toUpperCase();

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.taskId && task.taskId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.projectName && task.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "date":
          const aDate = new Date(a.startDate || a.createdAt).getTime();
          const bDate = new Date(b.startDate || b.createdAt).getTime();
          return bDate - aDate;
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

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTasks = filteredAndSortedTasks.slice(startIndex, endIndex);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Get all unique team members from all tasks for the team avatars row
  const allTeamMembers = useMemo(() => {
    const memberMap = new Map<number, { id: number; name: string; avatarUrl?: string }>();
    tasks.forEach((task) => {
      if (task.assignedTeam) {
        task.assignedTeam.forEach((member) => {
          if (!memberMap.has(member.id)) {
            memberMap.set(member.id, {
              id: member.id,
              name: member.name,
              avatarUrl: member.avatarUrl,
            });
          }
        });
      } else if (task.assignedTo && task.assignedToName) {
        if (!memberMap.has(task.assignedTo)) {
          memberMap.set(task.assignedTo, {
            id: task.assignedTo,
            name: task.assignedToName,
            avatarUrl: task.assignedToAvatar,
          });
        }
      }
    });
    return Array.from(memberMap.values());
  }, [tasks]);

  const visibleTeamMembers = allTeamMembers.slice(0, 7);
  const additionalTeamMembers = allTeamMembers.length - 7;

  const handleView = (task: Task) => {
    router.push(`/admin/tasks/${task.id}`);
  };

  const handleEdit = (task: Task) => {
    router.push(`/admin/tasks/edit/${task.id}`);
  };

  const handleOptionsClick = (task: Task) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // Could open a menu here, for now just navigate to edit
    handleEdit(task);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filteredAndSortedTasks useMemo
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Tasks List</h1>
          <div className="flex items-center gap-4">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-600">
              <Link href="/admin/tasks" className="hover:text-gray-900">
                Tasks
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Tasks List</span>
            </div>
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
              {userInitial}
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left: New Task Button */}
          <Link
            href="/admin/tasks/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Link>

          {/* Center: Sort By Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Center: Team Avatars */}
          {allTeamMembers.length > 0 && (
            <div className="flex items-center gap-1">
              {visibleTeamMembers.map((member) => (
                <div key={member.id} className="relative">
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
              {additionalTeamMembers > 0 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-medium">+{additionalTeamMembers}</span>
                </div>
              )}
            </div>
          )}

          {/* Right: Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Task"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-700">{error}</p>
            <p className="text-sm text-yellow-600 mt-2">
              Note: Backend API is not available. Using mock data for frontend development.
            </p>
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No tasks found.</p>
            <p className="text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search criteria." : "Tasks will appear here once they are created."}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/tasks/create"
                className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Your First Task
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Task Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {paginatedTasks.map((task) => (
                <TaskListCard
                  key={task.id}
                  task={task}
                  onClick={() => handleView(task)}
                  onOptionsClick={handleOptionsClick(task)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
