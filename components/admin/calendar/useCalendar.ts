import { useState, useEffect } from "react";
import { CalendarEvent, EventCategory, CalendarEventsResponse, EventCategoryType } from "./types";

// Mock categories matching the design
const getMockCategories = (): EventCategory[] => {
  return [
    {
      id: 1,
      name: "Calendar Events",
      type: "calendar",
      color: "text-purple-700",
      bgColor: "bg-purple-500",
      icon: "calendar",
    },
    {
      id: 2,
      name: "Birthday Events",
      type: "birthday",
      color: "text-orange-700",
      bgColor: "bg-orange-400",
      icon: "cake",
    },
    {
      id: 3,
      name: "Holiday Calendar",
      type: "holiday",
      color: "text-green-700",
      bgColor: "bg-green-500",
      icon: "tree",
    },
    {
      id: 4,
      name: "Office Events",
      type: "office",
      color: "text-blue-700",
      bgColor: "bg-blue-500",
      icon: "building",
    },
    {
      id: 5,
      name: "Other Events",
      type: "other",
      color: "text-yellow-700",
      bgColor: "bg-yellow-400",
      icon: "folder",
    },
    {
      id: 6,
      name: "Festival Events",
      type: "festival",
      color: "text-red-700",
      bgColor: "bg-red-400",
      icon: "banner",
    },
  ];
};

// Mock events matching the design
const getMockEvents = (): CalendarEvent[] => {
  const currentYear = 2026;
  const currentMonth = 1; // February (0-indexed, but we'll use 1-12)
  
  return [
    {
      id: 1,
      title: "Annual School Day",
      description: "A celebration of the school year with various events and activities for students and staff.",
      date: `${currentYear}-03-02`,
      category: "calendar",
      color: "text-purple-700",
      bgColor: "bg-purple-500",
      allDay: true,
    },
    {
      id: 2,
      title: "Science Fair",
      description: "Students will showcase their science projects. Open to all parents and students.",
      date: `${currentYear}-03-17`,
      category: "office",
      color: "text-blue-700",
      bgColor: "bg-blue-500",
      allDay: true,
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      description: "An important event where parents meet teachers to discuss the progress children.",
      date: `${currentYear}-03-15`,
      category: "office",
      color: "text-blue-700",
      bgColor: "bg-blue-500",
      allDay: true,
    },
    {
      id: 4,
      title: "Spring Break",
      description: "The students get a break for the spring holidays. No school during this period.",
      date: `${currentYear}-03-13`,
      category: "holiday",
      color: "text-green-700",
      bgColor: "bg-green-500",
      allDay: true,
    },
    {
      id: 5,
      title: "Holiday Celebrations",
      description: "Celebrating the upcoming national holiday with various cultural activities and festivities.",
      date: `${currentYear}-03-20`,
      category: "festival",
      color: "text-red-700",
      bgColor: "bg-red-400",
      allDay: true,
    },
    {
      id: 6,
      title: "Spruko Meetup",
      description: "Team meetup event to align on weekly goals, blockers, and next sprint planning.",
      date: `${currentYear}-02-02`,
      category: "office",
      color: "text-blue-700",
      bgColor: "bg-blue-500",
      allDay: true,
    },
    {
      id: 7,
      title: "Harcates Birthday",
      description: "Birthday celebration with cake cutting and a small get-together for the whole team.",
      date: `${currentYear}-02-04`,
      category: "birthday",
      color: "text-orange-700",
      bgColor: "bg-orange-400",
      allDay: true,
    },
    {
      id: 8,
      title: "Festival Day",
      description: "Cultural festival with traditional performances, food stalls, and community activities.",
      date: `${currentYear}-02-05`,
      category: "festival",
      color: "text-red-700",
      bgColor: "bg-red-400",
      allDay: true,
    },
    {
      id: 9,
      title: "My Rest Day",
      description: "Personal rest day to recharge and focus on wellbeing. No meetings scheduled this day.",
      date: `${currentYear}-02-07`,
      category: "other",
      color: "text-yellow-700",
      bgColor: "bg-yellow-400",
      allDay: true,
    },
    {
      id: 10,
      title: "Music Festival",
      description: "Annual music festival featuring multiple artists, live performances, and family-friendly fun.",
      date: `${currentYear}-02-10`,
      category: "festival",
      color: "text-red-700",
      bgColor: "bg-red-400",
      allDay: true,
    },
    {
      id: 11,
      title: "Music Festival",
      description: "Annual music festival featuring multiple artists, live performances, and family-friendly fun.",
      date: `${currentYear}-02-11`,
      category: "festival",
      color: "text-red-700",
      bgColor: "bg-red-400",
      allDay: true,
    },
    {
      id: 12,
      title: "Lifestyle Conference",
      description: "Conference event covering lifestyle, productivity, and wellness with guest speakers and panels.",
      date: `${currentYear}-02-13`,
      category: "office",
      color: "text-blue-700",
      bgColor: "bg-blue-500",
      allDay: true,
    },
    {
      id: 13,
      title: "Festival Day",
      description: "Cultural festival",
      date: `${currentYear}-02-17`,
      category: "festival",
      color: "text-red-700",
      bgColor: "bg-red-400",
      allDay: true,
    },
    {
      id: 14,
      title: "Memorial Day",
      description: "Memorial day observance",
      date: `${currentYear}-02-18`,
      category: "holiday",
      color: "text-green-700",
      bgColor: "bg-green-500",
      allDay: true,
    },
    {
      id: 15,
      title: "Team Weekly Brownbag",
      description: "Weekly team meeting to share updates, demo progress, and discuss improvements together.",
      date: `${currentYear}-02-21`,
      category: "office",
      color: "text-blue-700",
      bgColor: "bg-blue-500",
      allDay: true,
    },
    {
      id: 16,
      title: "Attend Lea's Wedding",
      description: "Wedding celebration",
      date: `${currentYear}-02-23`,
      category: "other",
      color: "text-yellow-700",
      bgColor: "bg-yellow-400",
      allDay: true,
    },
    {
      id: 17,
      title: "Attend Lea's Wedding",
      description: "Wedding celebration",
      date: `${currentYear}-02-24`,
      category: "other",
      color: "text-yellow-700",
      bgColor: "bg-yellow-400",
      allDay: true,
    },
    {
      id: 18,
      title: "Diwali",
      description: "Diwali festival",
      date: `${currentYear}-02-25`,
      category: "festival",
      color: "text-red-700",
      bgColor: "bg-red-400",
      allDay: true,
    },
    {
      id: 19,
      title: "Bunnysin's Birthday",
      description: "Birthday celebration",
      date: `${currentYear}-02-27`,
      category: "birthday",
      color: "text-orange-700",
      bgColor: "bg-orange-400",
      allDay: true,
    },
    {
      id: 20,
      title: "My Rest Day",
      description: "Personal rest day",
      date: `${currentYear}-02-30`,
      category: "other",
      color: "text-yellow-700",
      bgColor: "bg-yellow-400",
      allDay: true,
    },
    {
      id: 21,
      title: "Lee shin's Birthday",
      description: "Birthday celebration",
      date: `${currentYear}-02-31`,
      category: "birthday",
      color: "text-orange-700",
      bgColor: "bg-orange-400",
      allDay: true,
    },
  ];
};

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const fetchEvents = async () => {
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

      const response = await fetch("http://localhost:8000/api/v1/calendar/events", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("⚠️ Calendar events endpoint not available yet (404) - using mock data");
          const mockEvents = getMockEvents();
          const mockCategories = getMockCategories();
          setEvents(mockEvents);
          setCategories(mockCategories);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
      }

      const data: CalendarEventsResponse = await response.json();

      if (data.success && data.data) {
        setEvents(data.data.events || []);
        setCategories(data.data.categories || getMockCategories());
      } else {
        setEvents([]);
        setCategories(getMockCategories());
      }
    } catch (err: any) {
      console.error("Error fetching calendar events:", err);
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        console.log("⚠️ Backend not available - using mock data for frontend development");
        const mockEvents = getMockEvents();
        const mockCategories = getMockCategories();
        setEvents(mockEvents);
        setCategories(mockCategories);
        setError("");
      } else {
        setError(err.message || "Failed to fetch calendar events");
        setEvents([]);
        setCategories(getMockCategories());
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (direction === "next") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setTime(Date.now());
    }
    setCurrentDate(newDate);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    categories,
    currentDate,
    loading,
    error,
    navigateMonth,
    setCurrentDate,
    refetch: fetchEvents,
  };
}
