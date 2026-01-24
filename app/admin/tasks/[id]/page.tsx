"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Task } from "@/components/admin/tasks/types";
import Link from "next/link";

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id ? parseInt(params.id as string) : null;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");

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
          setTask(getMockTask(id));
        }
      } else {
        setTask(getMockTask(id));
      }
    } catch (err: any) {
      console.error("Error fetching task:", err);
      setTask(getMockTask(id));
    } finally {
      setLoading(false);
    }
  };

  const getMockTask = (id: number): Task => {
    return {
      id: id,
      taskId: "SPK - 123",
      title: "Task Management Web App Design",
      description: "A sleek and intuitive web application designed to help individuals and teams manage their tasks efficiently. This app offers a user-friendly interface where users can create, organize, and prioritize tasks, set deadlines, and track progress in real-time.",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-02-10",
      startDate: "2024-12-22",
      projectId: 1,
      projectName: "Website Redesign",
      projectStatus: "In Progress",
      assignedTo: 1,
      assignedToName: "John Doe",
      assignedTeam: [
        { id: 1, name: "Robert Fox", role: "Web Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" },
        { id: 2, name: "Simon Cowall", role: "UI Tester", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simon" },
        { id: 3, name: "Meisha Kerr", role: "React Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meisha" },
        { id: 4, name: "Jessica", role: "UX Designer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
        { id: 5, name: "Amanda B", role: "HTML Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda" },
        { id: 6, name: "Stathman", role: "Web Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stathman" },
      ],
      projectManager: {
        id: 1,
        name: "S.K.Jacob",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jacob",
      },
      createdBy: 1,
      createdByName: "Admin",
      createdAt: "2024-11-15T10:00:00Z",
      updatedAt: "2024-12-20T14:30:00Z",
      lastUpdated: "1 Day Ago",
      progress: 70,
      subtasks: [
        { id: 1, title: "Define the key features based on user research, such as task creation.", completed: false },
        { id: 2, title: "Map out the user journey from task creation to completion.", completed: false },
        { id: 3, title: "Design a clear and simple navigation system, considering both desktop.", completed: false },
        { id: 4, title: "Design interfaces for creating, editing, and deleting tasks.", completed: false },
        { id: 5, title: "Prepare detailed documentation and guidelines for developers.", completed: false },
        { id: 6, title: "Provide ongoing support to the development team during implementation.", completed: false },
      ],
      documents: [
        { id: 1, fileName: "Full Project", fileSize: 471859, fileType: "pdf", iconColor: "purple", uploadedAt: "2024-12-20T10:00:00Z" },
        { id: 2, fileName: "assets.doc", fileSize: 1038090, fileType: "doc", iconColor: "orange", uploadedAt: "2024-12-19T14:00:00Z" },
        { id: 3, fileName: "image-1.png", fileSize: 250880, fileType: "png", iconColor: "green", uploadedAt: "2024-12-18T11:00:00Z" },
        { id: 4, fileName: "documentation.zip", fileSize: 2097152, fileType: "zip", iconColor: "blue", uploadedAt: "2024-12-17T09:00:00Z" },
        { id: 5, fileName: "landing.pdf", fileSize: 3628072, fileType: "pdf", iconColor: "orange", uploadedAt: "2024-12-16T15:00:00Z" },
        { id: 6, fileName: "main.doc", fileSize: 1038090, fileType: "doc", iconColor: "red", uploadedAt: "2024-12-15T12:00:00Z" },
      ],
      comments: [
        {
          id: 1,
          content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
          userId: 1,
          userName: "Mary Cateline",
          userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
          createdAt: "2024-12-20T10:30:00Z",
        },
        {
          id: 2,
          content: "Dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius.",
          userId: 2,
          userName: "Monte vin",
          userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Monte",
          createdAt: "2024-12-19T14:20:00Z",
        },
        {
          id: 3,
          content: "Lorem ipsum dolor sit amet consectetur elit.",
          userId: 3,
          userName: "Christopher Chil",
          userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher",
          createdAt: "2024-12-18T16:45:00Z",
        },
      ],
      discussions: [
        {
          id: 1,
          content: "Conduct a Meeting for all Team Members.",
          userId: 1,
          userName: "Admin",
          createdAt: "2024-11-15T12:15:00Z",
        },
      ],
      activities: [
        {
          id: 1,
          type: "meeting",
          title: "Conduct a Meeting for all team Members.",
          description: "Discuss the new feature need to implement for the e-commerce site Design.",
          createdAt: "2024-11-15T12:15:00Z",
        },
        {
          id: 2,
          type: "file",
          title: "All Task Releted Important Files and Images.",
          description: "This folder contains all essential files and images associated with various tasks and projects.",
          files: [
            { name: "Images", icon: "zip", count: "246 Files" },
            { name: "Images", icon: "folder", count: "246 Files" },
          ],
          createdAt: "2024-12-21T15:32:00Z",
        },
        {
          id: 3,
          type: "update",
          title: "The list of Team Memebrs not completed the assign task till now.",
          description: "Every one should follow the deadline and complete the task as per the deadline.",
          teamMembers: [
            { id: 1, name: "Robert Fox", role: "Web Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" },
            { id: 2, name: "Simon Tensir", role: "UI Tester", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simon2" },
            { id: 3, name: "Meisha Kerr", role: "UI Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meisha" },
          ],
          createdAt: "2024-12-24T14:34:00Z",
        },
      ],
      skills: ["Teamwork", "Graphic Design", "Responsive Design", "Web Accessibility", "Front-End Build Tools", "RESTful APIs", "Performance Testing", "Angular", "Vue.js"],
      tags: ["Web Design", "Responsive Design"],
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day},${month} ${year}`;
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileType: string, iconColor?: string) => {
    const colorClasses: Record<string, string> = {
      purple: "text-purple-600",
      orange: "text-orange-600",
      green: "text-green-600",
      blue: "text-blue-600",
      red: "text-red-600",
    };
    const colorClass = iconColor ? colorClasses[iconColor] || "text-gray-600" : "text-gray-600";

    if (fileType === "pdf") {
      return (
        <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === "doc" || fileType === "docx") {
      return (
        <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
      return (
        <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === "zip") {
      return (
        <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    }
    return (
      <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    // TODO: Implement comment posting
    console.log("Posting comment:", newComment);
    setNewComment("");
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

  if (error && !task) {
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

  if (!task) {
    return null;
  }

  return (
    <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      {/* Top Header with Breadcrumbs and Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <Link href="/admin" className="hover:text-gray-900">Apps</Link>
          <span className="mx-2">/</span>
          <Link href="/admin/tasks" className="hover:text-gray-900">Task</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Task Details</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Plan Upgrade
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Task Summary</h2>
            
            {/* Task Header with Icon, Title, Status */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => router.push(`/admin/tasks/edit/${task.id}`)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Task
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    In progress
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Last Updated {task.lastUpdated || "1 Day Ago"}
                  </div>
                </div>
                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 mt-3">
                  <button className="w-10 h-10 p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Task Description :</h2>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </div>

            {/* Sub Tasks in Two Columns */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sub tasks :</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <p className="text-sm text-gray-700">{subtask.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {task.skills && task.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills :</h2>
                <div className="flex flex-wrap gap-2">
                  {task.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Team */}
            {task.assignedTeam && task.assignedTeam.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Team :</h2>
                <div className="flex flex-wrap gap-4">
                  {task.assignedTeam.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Project Documents, Sub Tasks, Comments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Documents */}
            {task.documents && task.documents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Documents</h2>
                <div className="space-y-3">
                  {task.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(doc.fileType, doc.iconColor)}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Tasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Sub Tasks</h2>
                  <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    + Sub Task
                  </button>
                </div>
                <ul className="space-y-4">
                  {task.subtasks.map((subtask) => (
                    <li key={subtask.id} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          readOnly
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-gray-700 ${subtask.completed ? "line-through text-gray-500" : ""}`}>
                          {subtask.title}
                        </p>
                        {subtask.notes && (
                          <div className="mt-2 bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600">{subtask.notes}</p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Comments */}
            {task.comments && task.comments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      {comment.userAvatar ? (
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName || "User"}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                          {(comment.userName || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">{comment.userName || "Anonymous"}</p>
                        <p className="text-sm text-gray-700 mb-2 break-words">{comment.content}</p>
                        <div className="flex items-center gap-3">
                          <button className="p-1 text-purple-600 hover:bg-purple-50 rounded">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.8.6l2.7-3.6-2.7-3.6a1 1 0 00-1.8.6zM15 8h-1.586l-1.293-1.293a1 1 0 00-1.414 0L10.586 8H9a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 00-1-1z" />
                            </svg>
                          </button>
                          <button className="p-1 text-orange-600 hover:bg-orange-50 rounded">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a1 1 0 00-1.8-.6l-2.7 3.6 2.7 3.6a1 1 0 001.8-.6zM5 12H3.586l1.293-1.293a1 1 0 00-1.414-1.414L2.172 10.586A1 1 0 002 11v4a1 1 0 001 1h2a1 1 0 100-2z" />
                            </svg>
                          </button>
                          <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
                            <button className="hover:text-purple-600 text-purple-600">Reply</button>
                            <span>•</span>
                            <button className="hover:text-orange-600 text-orange-600">View Details</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Additional Details and Task Discussions */}
        <div className="space-y-6">
          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
              <button className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                + Add New
              </button>
            </div>
            <div className="space-y-0">
              {/* Task ID */}
              {task.taskId && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    <span className="text-gray-500">Task ID:</span>
                    <span className="ml-2 text-gray-900">{task.taskId}</span>
                  </span>
                </div>
              )}

              {/* Assigned */}
              {task.assignedTeam && task.assignedTeam.length > 0 && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-gray-500">Assigned:</span>
                    <div className="flex -space-x-2 ml-2">
                      {task.assignedTeam.slice(0, 4).map((member) => (
                        <div key={member.id} className="relative">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-8 h-8 rounded-full border-2 border-white"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </span>
                </div>
              )}

              {/* Project Status */}
              {task.projectStatus && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    <span className="text-gray-500">Project Status:</span>
                    <span className="ml-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {task.projectStatus}
                      </span>
                    </span>
                  </span>
                </div>
              )}

              {/* Timeline */}
              {task.startDate && task.dueDate && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    <span className="text-gray-500">Timeline:</span>
                    <span className="ml-2 text-gray-900">{formatDate(task.startDate)} - {formatDate(task.dueDate)}</span>
                  </span>
                </div>
              )}

              {/* Project Priority */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-700">
                  <span className="text-gray-500">Project Priority:</span>
                  <span className="ml-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                      task.priority === "high" || task.priority === "urgent" ? "bg-red-500" :
                      task.priority === "medium" ? "bg-orange-500" : "bg-gray-500"
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </span>
                </span>
              </div>

              {/* Project Manager */}
              {task.projectManager && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <svg className="w-5 h-5 text-pink-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-gray-500">Project Manager:</span>
                    <span className="ml-2 flex items-center gap-2">
                      {task.projectManager.avatar ? (
                        <img
                          src={task.projectManager.avatar}
                          alt={task.projectManager.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">
                          {task.projectManager.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-gray-900">{task.projectManager.name}</span>
                    </span>
                  </span>
                </div>
              )}

              {/* Task Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-gray-500">Task Tags:</span>
                    <div className="flex flex-wrap gap-2 ml-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </span>
                </div>
              )}

              {/* Progress */}
              {task.progress !== undefined && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-pink-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-gray-700 flex items-center gap-2 flex-1">
                    <span className="text-gray-500">Progress:</span>
                    <div className="flex items-center gap-2 flex-1 ml-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Task Discussions - Combined Section */}
          {((task.discussions && task.discussions.length > 0) || (task.activities && task.activities.length > 0)) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Discussions</h2>
              <div className="space-y-6">
                {(() => {
                  const formatTime = (dateString: string) => {
                    const date = new Date(dateString);
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const displayHours = hours % 12 || 12;
                    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
                  };

                  // Combine and sort all items
                  const allItems: Array<{
                    id: number;
                    type: 'discussion' | 'activity';
                    createdAt: string;
                    content?: string;
                    title?: string;
                    description?: string;
                    activityType?: string;
                    files?: any[];
                    teamMembers?: any[];
                  }> = [
                    ...(task.discussions || []).map((d) => ({
                      id: d.id,
                      type: 'discussion' as const,
                      createdAt: d.createdAt,
                      content: d.content,
                    })),
                    ...(task.activities || []).map((a) => ({
                      id: a.id,
                      type: 'activity' as const,
                      createdAt: a.createdAt,
                      title: a.title,
                      description: a.description,
                      activityType: a.type,
                      files: a.files,
                      teamMembers: a.teamMembers,
                    })),
                  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                  return allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;

                    if (item.type === 'discussion') {
                      return (
                        <div key={`discussion-${item.id}`} className="relative pl-8">
                          {!isLast && (
                            <div className="absolute left-3 top-8 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>
                          )}
                          <div className="relative">
                            <div className="absolute left-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div className="ml-8">
                              <p className="text-sm font-medium text-gray-900 mb-1">{item.content}</p>
                              <p className="text-xs text-gray-500 mb-2">
                                {formatDate(item.createdAt)} - {formatTime(item.createdAt)}
                              </p>
                              {item.id === 1 && (
                                <p className="text-sm text-gray-600">Discuss the new feature need to implement for the e-commerce site Design.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={`activity-${item.id}`} className="relative pl-8">
                          {!isLast && (
                            <div className="absolute left-3 top-8 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>
                          )}
                          <div className="relative">
                            <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.activityType === "meeting" ? "bg-purple-100" :
                              item.activityType === "file" ? "bg-orange-100" :
                              item.activityType === "update" ? "bg-green-100" : "bg-blue-100"
                            }`}>
                              {item.activityType === "meeting" && (
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              )}
                              {item.activityType === "file" && (
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                              {item.activityType === "update" && (
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-8">
                              <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
                              <p className="text-xs text-gray-500 mb-2">
                                {formatDate(item.createdAt)} - {formatTime(item.createdAt)}
                              </p>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                              )}
                              {item.files && item.files.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 mt-3 mb-3">
                                  {item.files.map((file, fileIndex) => (
                                    <div key={fileIndex} className="bg-white border border-gray-200 rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        {file.icon === "zip" ? (
                                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                          </svg>
                                        ) : (
                                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                          </svg>
                                        )}
                                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                                      </div>
                                      <p className="text-xs text-gray-500">{file.count}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {item.teamMembers && item.teamMembers.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {item.teamMembers.map((member) => (
                                    <div key={member.id} className="flex items-center gap-2">
                                      {member.avatarUrl ? (
                                        <img
                                          src={member.avatarUrl}
                                          alt={member.name}
                                          className="w-8 h-8 rounded-full flex-shrink-0"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                          {member.name.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  });
                })()}
              </div>
            </div>
          )}

          {/* Post Anything */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium text-sm">U</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Post Anything"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handlePostComment}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
