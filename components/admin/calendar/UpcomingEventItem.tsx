"use client";

import { CalendarEvent } from "./types";

interface UpcomingEventItemProps {
  event: CalendarEvent;
  isLast?: boolean;
}

export default function UpcomingEventItem({ event, isLast = false }: UpcomingEventItemProps) {
  // Format date as "02 Mar, 2025"
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="relative pl-8 pb-6">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-3 top-8 bottom-0 w-0.5 border-l-2 border-dashed border-purple-300"></div>
      )}
      
      {/* Timeline dot */}
      <div className={`absolute left-0 w-6 h-6 ${event.bgColor} rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm`}>
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Event Card */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
          </div>
          {/* Date Badge */}
          <span className={`${event.bgColor} text-white text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap`}>
            {formatDate(event.date)}
          </span>
        </div>
      </div>
    </div>
  );
}
