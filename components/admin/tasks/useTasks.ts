import { useState, useEffect } from "react";
import { Task, TasksResponse } from "./types";

// Mock data for frontend development
const getMockTasks = (): Task[] => {
  return [
    {
      id: 1,
      taskId: "SPK - 11",
      title: "New template dashboard design.",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit, Nulla soluta consectetur sit amet elit dolor sit amet.",
      status: "new",
      priority: "high",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startDate: "2024-06-01",
      projectId: 1,
      projectName: "Dashboard Project",
      projectStatus: "New",
      assignedTo: 1,
      assignedToName: "John Doe",
      assignedTeam: [
        { id: 1, name: "Robert Fox", role: "Web Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" },
        { id: 2, name: "Simon Cowall", role: "UI Tester", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simon" },
        { id: 3, name: "Meisha Kerr", role: "React Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meisha" },
        { id: 4, name: "Sarah Johnson", role: "Designer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
      ],
      projectManager: {
        id: 1,
        name: "S.K.Jacob",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jacob",
      },
      createdBy: 1,
      createdByName: "Admin",
      createdAt: "2024-06-05T10:00:00Z",
      updatedAt: "2024-06-05T10:00:00Z",
      lastUpdated: "1 Day Ago",
      progress: 0,
      comments: Array(2).fill(null),
      tags: ["UI/UX"],
    },
    {
      id: 2,
      taskId: "SPK - 24",
      title: "Marketing next projects design.",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla soluta",
      status: "new",
      priority: "medium",
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startDate: "2024-07-01",
      projectId: 2,
      projectName: "Marketing Project",
      projectStatus: "New",
      assignedTo: 2,
      assignedToName: "Jane Smith",
      assignedTeam: [
        { id: 5, name: "Mike Johnson", role: "Marketing Lead", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
        { id: 6, name: "Emma Wilson", role: "Designer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
      ],
      createdBy: 1,
      createdByName: "Admin",
      createdAt: "2024-07-12T09:00:00Z",
      updatedAt: "2024-07-12T09:00:00Z",
      progress: 0,
      comments: Array(8).fill(null),
      tags: ["Ui Design"],
    },
    {
      id: 3,
      taskId: "SPK - 123",
      title: "Task Management Web App Design",
      description: "A sleek and intuitive web application designed to help individuals and teams manage their tasks efficiently. This app offers a user-friendly interface where users can create, organize, and prioritize tasks, set deadlines, and track progress in real-time.",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-12-31",
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
        { id: 1, title: "Define the key features based on user research, such as task creation.", completed: true },
        { id: 2, title: "Design interfaces for creating, editing, and deleting tasks.", completed: true },
        { id: 3, title: "Map out the user journey from task creation to completion.", completed: false },
      ],
      skills: ["Teamwork", "Graphic Design", "Responsive Design", "Web Accessibility"],
      tags: ["Web Design", "Responsive Design"],
      discussions: [
        {
          id: 1,
          content: "Conduct a Meeting for all Team Members. Discuss the new feature need to implement for the e-commerce site Design.",
          userId: 1,
          userName: "Admin",
          createdAt: "2024-11-15T12:15:00Z",
        },
      ],
    },
    {
      id: 2,
      taskId: "SPK - 124",
      title: "Implement User Authentication",
      description: "Set up login and registration functionality with secure password hashing and JWT tokens",
      status: "todo",
      priority: "urgent",
      dueDate: "2024-12-25",
      startDate: "2024-12-20",
      projectId: 1,
      projectName: "Website Redesign",
      projectStatus: "In Progress",
      assignedTo: 2,
      assignedToName: "Jane Smith",
      assignedTeam: [
        { id: 2, name: "Jane Smith", role: "Backend Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
      ],
      createdBy: 1,
      createdByName: "Admin",
      createdAt: "2024-01-16T09:00:00Z",
      updatedAt: "2024-01-16T09:00:00Z",
      progress: 0,
      tags: ["backend", "security"],
    },
    {
      id: 3,
      taskId: "SPK - 125",
      title: "Code Review: Payment Module",
      description: "Review the payment integration code for security and best practices",
      status: "review",
      priority: "medium",
      dueDate: "2024-12-28",
      startDate: "2024-12-15",
      projectId: 2,
      projectName: "E-commerce Platform",
      projectStatus: "In Progress",
      assignedTo: 3,
      assignedToName: "Bob Wilson",
      assignedTeam: [
        { id: 3, name: "Bob Wilson", role: "Senior Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
      ],
      createdBy: 1,
      createdByName: "Admin",
      createdAt: "2024-01-17T11:00:00Z",
      updatedAt: "2024-01-19T16:00:00Z",
      progress: 50,
      tags: ["review", "payment"],
    },
    {
      id: 4,
      taskId: "SPK - 126",
      title: "Update Documentation",
      description: "Update API documentation with new endpoints",
      status: "done",
      priority: "low",
      dueDate: "2024-12-20",
      startDate: "2024-12-10",
      projectId: null,
      projectName: undefined,
      assignedTo: 4,
      assignedToName: "Alice Brown",
      assignedTeam: [
        { id: 4, name: "Alice Brown", role: "Technical Writer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
      ],
      createdBy: 1,
      createdByName: "Admin",
      createdAt: "2024-01-10T08:00:00Z",
      updatedAt: "2024-01-18T12:00:00Z",
      progress: 100,
      tags: ["documentation"],
    },
    {
      id: 5,
      taskId: "SPK - 127",
      title: "Fix Mobile Responsiveness",
      description: "Fix layout issues on mobile devices and ensure responsive design works across all screen sizes",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-12-30",
      startDate: "2024-12-25",
      projectId: 1,
      projectName: "Website Redesign",
      projectStatus: "In Progress",
      assignedTo: 1,
      assignedToName: "John Doe",
      assignedTeam: [
        { id: 1, name: "John Doe", role: "Frontend Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
      ],
      createdBy: 1,
      createdByName: "Admin",
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-20T15:00:00Z",
      progress: 60,
      tags: ["frontend", "mobile"],
    },
  ];
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:8000/api/v1/tasks", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("⚠️ Tasks endpoint not available yet (404) - using mock data");
          const mockTasks = getMockTasks();
          setTasks(mockTasks);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data: TasksResponse = await response.json();

      if (data.success && data.data?.tasks) {
        setTasks(data.data.tasks);
        console.log(`✅ Loaded ${data.data.tasks.length} tasks`);
      } else {
        setTasks([]);
      }
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      // Handle network errors gracefully - use mock data for frontend development
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        console.log("⚠️ Backend not available - using mock data for frontend development");
        const mockTasks = getMockTasks();
        setTasks(mockTasks);
        setError(""); // Don't show error for network issues during frontend development
      } else {
        setError(err.message || "Failed to fetch tasks");
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
}

