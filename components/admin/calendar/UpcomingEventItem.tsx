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
    <div className="relative pl-10 pb-3">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-2.5 top-6 bottom-0 w-0.5 border-l-2 border-dashed border-purple-200"></div>
      )}
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-4 w-5 h-5 rounded-full bg-white border-2 border-purple-200 flex items-center justify-center shadow-sm">
        <div className="w-2 h-2 rounded-full bg-purple-300"></div>
      </div>

      {/* Event Card */}
      <div className="bg-indigo-50/60 rounded-lg p-3 border border-indigo-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 min-h-[2.75rem]">{event.description}</p>
          </div>
          {/* Date Badge */}
          <span className={`${event.bgColor} text-white text-xs font-medium px-3 py-1 rounded-md flex-shrink-0 whitespace-nowrap`}>
            {formatDate(event.date)}
          </span>
        </div>
      </div>
    </div>
  );
}
