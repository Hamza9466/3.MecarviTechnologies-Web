"use client";

import { CalendarEvent } from "./types";

interface CalendarEventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
}

export default function CalendarEventCard({ event, onClick }: CalendarEventCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${event.bgColor} text-white rounded px-2 py-1 mb-1 cursor-pointer hover:opacity-80 transition-opacity text-xs`}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
        <span className="font-medium truncate">{event.title}</span>
      </div>
    </div>
  );
}
