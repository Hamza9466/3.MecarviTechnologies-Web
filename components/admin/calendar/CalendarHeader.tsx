"use client";

import { CalendarView } from "./types";

interface CalendarHeaderProps {
  currentDate: Date;
  currentView: CalendarView;
  onNavigate: (direction: "prev" | "next" | "today") => void;
  onViewChange: (view: CalendarView) => void;
}

export default function CalendarHeader({
  currentDate,
  currentView,
  onNavigate,
  onViewChange,
}: CalendarHeaderProps) {
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        {/* Left: Title and Navigation */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Full Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("prev")}
              className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Next month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate("today")}
              className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg text-xs font-medium transition-colors"
            >
              today
            </button>
          </div>
        </div>

        {/* Center: Month/Year Display */}
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold text-gray-900">{formatMonthYear(currentDate)}</h3>
        </div>

        {/* Right: View Toggles */}
        <div className="flex items-center gap-2">
          {(["month", "week", "day", "list"] as CalendarView[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentView === view
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
