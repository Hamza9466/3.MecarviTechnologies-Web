import { useState, useEffect } from "react";
import { Project, ProjectsResponse } from "./types";

// Dummy data matching the design
const getDummyProjects = (): Project[] => {
  return [
    {
      id: 1,
      name: "Payment App",
      client: "Kevin J. Heal",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
      status: "green",
      statusDot: "green",
      startDate: "2020-06-02",
      deadline: "2020-10-31",
      daysLeft: 35,
      completionPercentage: 34,
      allHours: "530 / 281:30",
      todayHours: "2:45",
      projectIcon: null,
      projectIconUrl: null,
      teamMembers: [
        { id: 1, name: "John Doe", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
        { id: 2, name: "Jane Smith", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
        { id: 3, name: "Bob Wilson", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
        { id: 4, name: "Alice Brown", avatar: null, avatarUrl: null },
        { id: 5, name: "Charlie Davis", avatar: null, avatarUrl: null },
        { id: 6, name: "Diana Miller", avatar: null, avatarUrl: null },
        { id: 7, name: "Eve Johnson", avatar: null, avatarUrl: null },
        { id: 8, name: "Frank Lee", avatar: null, avatarUrl: null },
        { id: 9, name: "Grace White", avatar: null, avatarUrl: null },
      ],
      tasksCompleted: 34,
      totalTasks: 100,
      commentsCount: 3,
      lastMeeting: {
        date: "2020-10-28",
        startTime: "10:30",
        endTime: "12:30",
      },
      nextMeeting: {
        date: "2020-11-06",
        startTime: "10:30",
        endTime: "12:30",
      },
    },
    {
      id: 2,
      name: "Nextjs App",
      client: "Kevin J. Heal",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
      status: "green",
      statusDot: "green",
      startDate: "2024-06-02",
      deadline: "2025-10-31",
      daysLeft: 27,
      completionPercentage: 15,
      allHours: "530 / 281:30",
      todayHours: "2:45",
      projectIcon: null,
      projectIconUrl: null,
      teamMembers: [
        { id: 10, name: "Mike Taylor", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
        { id: 11, name: "Sarah Connor", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        { id: 12, name: "Tom Anderson", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom" },
        { id: 13, name: "Lisa Park", avatar: null, avatarUrl: null },
        { id: 14, name: "David Kim", avatar: null, avatarUrl: null },
        { id: 15, name: "Emma Stone", avatar: null, avatarUrl: null },
        { id: 16, name: "Ryan Garcia", avatar: null, avatarUrl: null },
        { id: 17, name: "Olivia Brown", avatar: null, avatarUrl: null },
        { id: 18, name: "Noah Martinez", avatar: null, avatarUrl: null },
      ],
      tasksCompleted: 34,
      totalTasks: 100,
      commentsCount: 3,
      lastMeeting: {
        date: "2020-10-28",
        startTime: "10:30",
        endTime: "12:30",
      },
      nextMeeting: {
        date: "2020-11-06",
        startTime: "10:30",
        endTime: "12:30",
      },
    },
    {
      id: 3,
      name: "Slack App",
      client: "Kevin J. Heal",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
      status: "green",
      statusDot: "green",
      startDate: "2024-06-02",
      deadline: "2025-10-31",
      daysLeft: 14,
      completionPercentage: 28,
      allHours: "530 / 281:30",
      todayHours: "2:45",
      projectIcon: null,
      projectIconUrl: null,
      teamMembers: [
        { id: 19, name: "Sophia Chen", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia" },
        { id: 20, name: "James Wilson", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
        { id: 21, name: "Isabella Moore", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella" },
        { id: 22, name: "William Jackson", avatar: null, avatarUrl: null },
        { id: 23, name: "Ava Thompson", avatar: null, avatarUrl: null },
        { id: 24, name: "Mason Harris", avatar: null, avatarUrl: null },
        { id: 25, name: "Mia Clark", avatar: null, avatarUrl: null },
        { id: 26, name: "Ethan Lewis", avatar: null, avatarUrl: null },
        { id: 27, name: "Charlotte Walker", avatar: null, avatarUrl: null },
      ],
      tasksCompleted: 34,
      totalTasks: 100,
      commentsCount: 3,
      lastMeeting: {
        date: "2020-10-28",
        startTime: "10:30",
        endTime: "12:30",
      },
      nextMeeting: {
        date: "2020-11-06",
        startTime: "10:30",
        endTime: "12:30",
      },
    },
    {
      id: 4,
      name: "Dribbble App",
      client: "Kevin J. Heal",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
      status: "orange",
      statusDot: "orange",
      startDate: "2020-06-02",
      deadline: "2020-10-31",
      daysLeft: 35,
      completionPercentage: 30,
      allHours: "530 / 281:30",
      todayHours: "2:45",
      projectIcon: null,
      projectIconUrl: null,
      teamMembers: [
        { id: 28, name: "John Doe", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John2" },
        { id: 29, name: "Jane Smith", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane2" },
        { id: 30, name: "Bob Wilson", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob2" },
        { id: 31, name: "Alice Brown", avatar: null, avatarUrl: null },
        { id: 32, name: "Charlie Davis", avatar: null, avatarUrl: null },
        { id: 33, name: "Diana Miller", avatar: null, avatarUrl: null },
        { id: 34, name: "Eve Johnson", avatar: null, avatarUrl: null },
        { id: 35, name: "Frank Lee", avatar: null, avatarUrl: null },
        { id: 36, name: "Grace White", avatar: null, avatarUrl: null },
      ],
      tasksCompleted: 34,
      totalTasks: 100,
      commentsCount: 3,
      lastMeeting: {
        date: "2020-10-28",
        startTime: "10:30",
        endTime: "12:30",
      },
      nextMeeting: {
        date: "2020-11-06",
        startTime: "10:30",
        endTime: "12:30",
      },
    },
    {
      id: 5,
      name: "Vuejs App",
      client: "Kevin J. Heal",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
      status: "red",
      statusDot: "red",
      startDate: "2024-06-02",
      deadline: "2025-10-31",
      daysLeft: 27,
      completionPercentage: 100,
      allHours: "530 / 281:30",
      todayHours: "2:45",
      projectIcon: null,
      projectIconUrl: null,
      teamMembers: [
        { id: 37, name: "Mike Taylor", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike2" },
        { id: 38, name: "Sarah Connor", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah2" },
        { id: 39, name: "Tom Anderson", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom2" },
        { id: 40, name: "Lisa Park", avatar: null, avatarUrl: null },
        { id: 41, name: "David Kim", avatar: null, avatarUrl: null },
        { id: 42, name: "Emma Stone", avatar: null, avatarUrl: null },
        { id: 43, name: "Ryan Garcia", avatar: null, avatarUrl: null },
        { id: 44, name: "Olivia Brown", avatar: null, avatarUrl: null },
        { id: 45, name: "Noah Martinez", avatar: null, avatarUrl: null },
      ],
      tasksCompleted: 34,
      totalTasks: 100,
      commentsCount: 3,
      lastMeeting: {
        date: "2020-10-28",
        startTime: "10:30",
        endTime: "12:30",
      },
      nextMeeting: {
        date: "2020-11-06",
        startTime: "10:30",
        endTime: "12:30",
      },
    },
    {
      id: 6,
      name: "Gitlab App",
      client: "Kevin J. Heal",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
      status: "red",
      statusDot: "red",
      startDate: "2024-06-02",
      deadline: "2025-10-31",
      daysLeft: 14,
      completionPercentage: 0,
      allHours: "530 / 281:30",
      todayHours: "2:45",
      projectIcon: null,
      projectIconUrl: null,
      teamMembers: [
        { id: 46, name: "Sophia Chen", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia2" },
        { id: 47, name: "James Wilson", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James2" },
        { id: 48, name: "Isabella Moore", avatar: null, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella2" },
        { id: 49, name: "William Jackson", avatar: null, avatarUrl: null },
        { id: 50, name: "Ava Thompson", avatar: null, avatarUrl: null },
        { id: 51, name: "Mason Harris", avatar: null, avatarUrl: null },
        { id: 52, name: "Mia Clark", avatar: null, avatarUrl: null },
        { id: 53, name: "Ethan Lewis", avatar: null, avatarUrl: null },
        { id: 54, name: "Charlotte Walker", avatar: null, avatarUrl: null },
      ],
      tasksCompleted: 34,
      totalTasks: 100,
      commentsCount: 3,
      lastMeeting: {
        date: "2020-10-28",
        startTime: "10:30",
        endTime: "12:30",
      },
      nextMeeting: {
        date: "2020-11-06",
        startTime: "10:30",
        endTime: "12:30",
      },
    },
  ];
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const fetchProjects = async () => {
    // TODO: Replace with actual API call when backend is ready
    // For now, return dummy data
    try {
      setLoading(true);
      setError("");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dummyProjects = getDummyProjects();
      setProjects(dummyProjects);
      console.log(`✅ Loaded ${dummyProjects.length} dummy projects`);
    } catch (err: any) {
      console.error("Error loading projects:", err);
      setError(err.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }

    // Original API code (commented out for now):
    /*
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

      const response = await fetch("http://localhost:8000/api/v1/projects", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        // Handle 404 or other errors gracefully
        if (response.status === 404) {
          console.log("⚠️ Projects endpoint not available yet (404)");
          setProjects([]);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data: ProjectsResponse = await response.json();

      if (data.success && data.data?.projects) {
        // Process projects and add image URLs
        const processedProjects = data.data.projects.map((project) => ({
          ...project,
          projectIconUrl: project.projectIcon
            ? project.projectIcon.startsWith("http") || project.projectIcon.startsWith("/storage")
              ? `http://localhost:8000${project.projectIcon}`
              : project.projectIcon
            : null,
          teamMembers: project.teamMembers.map((member) => ({
            ...member,
            avatarUrl: member.avatar
              ? member.avatar.startsWith("http") || member.avatar.startsWith("/storage")
                ? `http://localhost:8000${member.avatar}`
                : member.avatar
              : null,
          })),
        }));

        setProjects(processedProjects);
        console.log(`✅ Loaded ${processedProjects.length} projects`);
      } else {
        setProjects([]);
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
    */
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  };
}

