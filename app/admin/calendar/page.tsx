"use client";

import { useState, useMemo } from "react";
import { useCalendar } from "@/components/admin/calendar/useCalendar";
import CalendarSidebar from "@/components/admin/calendar/CalendarSidebar";
import CalendarHeader from "@/components/admin/calendar/CalendarHeader";
import CalendarGrid from "@/components/admin/calendar/CalendarGrid";
import { CalendarView, EventCategoryType, CalendarEvent } from "@/components/admin/calendar/types";
import Link from "next/link";

export default function CalendarPage() {
  const { events, categories, currentDate, loading, error, navigateMonth, setCurrentDate } = useCalendar();
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [selectedCategories, setSelectedCategories] = useState<EventCategoryType[]>([]);

  // Filter events by selected categories
  const filteredEvents = useMemo(() => {
    if (selectedCategories.length === 0) {
      return events;
    }
    return events.filter((event) => selectedCategories.includes(event.category));
  }, [events, selectedCategories]);

  // Get upcoming events (next 30 days)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);

    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate <= thirtyDaysLater;
      })
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 5); // Show top 5 upcoming events
  }, [events]);

  const handleCategoryToggle = (categoryType: EventCategoryType) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryType)
        ? prev.filter((cat) => cat !== categoryType)
        : [...prev, categoryType]
    );
  };

  const handleDateClick = (date: Date) => {
    console.log("Date clicked:", date);
    // Can implement date selection logic here
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event clicked:", event);
    // Can implement event details modal here
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Full Calendar</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/admin" className="hover:text-gray-900">
                Apps
              </Link>
              <span>→</span>
              <span className="text-gray-900 font-medium">Full Calendar</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Plan Upgrade
            </button>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="flex gap-4">
          {/* Left Sidebar */}
          <CalendarSidebar
            categories={categories}
            upcomingEvents={upcomingEvents}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
          />

          {/* Calendar Area */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="text-gray-600">Loading calendar...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <>
                <CalendarHeader
                  currentDate={currentDate}
                  currentView={currentView}
                  onNavigate={navigateMonth}
                  onViewChange={setCurrentView}
                />
                {currentView === "month" && (
                  <CalendarGrid
                    currentDate={currentDate}
                    events={filteredEvents}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                  />
                )}
                {/* Week, Day, and List views can be added later */}
                {currentView !== "month" && (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-600">{currentView} view coming soon...</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
