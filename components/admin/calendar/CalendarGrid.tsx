"use client";

import { CalendarEvent } from "./types";
import CalendarEventCard from "./CalendarEventCard";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export default function CalendarGrid({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: CalendarGridProps) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get first day of month and number of days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get previous month's last days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays: number[] = [];
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i);
  }

  // Get next month's first days
  const totalCells = prevMonthDays.length + daysInMonth;
  const remainingCells = 42 - totalCells; // 6 rows * 7 days
  const nextMonthDays: number[] = [];
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(i);
  }

  // Get events for a specific date
  const getEventsForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      );
    });
  };

  const today = new Date();
  const isToday = (day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center py-2">
            <span className="text-xs font-semibold text-gray-600">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Previous Month Days */}
        {prevMonthDays.map((day) => {
          const dateEvents = getEventsForDate(day, false);
          return (
            <div
              key={`prev-${day}`}
              className="min-h-[100px] border border-gray-200 rounded-lg p-2 bg-gray-50"
            >
              <div className="text-right mb-1">
                <span className="text-xs text-gray-400">{day}</span>
              </div>
              <div className="space-y-1">
                {dateEvents.map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick?.(event)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateEvents = getEventsForDate(day, true);
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day}
              onClick={() => onDateClick?.(new Date(year, month, day))}
              className={`min-h-[100px] border rounded-lg p-2 cursor-pointer transition-colors ${
                isCurrentDay
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-right mb-1">
                <span
                  className={`text-xs font-medium ${
                    isCurrentDay ? "text-purple-600" : "text-gray-700"
                  }`}
                >
                  {day}
                </span>
              </div>
              <div className="space-y-1">
                {dateEvents.map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick?.(event)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Next Month Days */}
        {nextMonthDays.map((day) => {
          const dateEvents = getEventsForDate(day, false);
          return (
            <div
              key={`next-${day}`}
              className="min-h-[100px] border border-gray-200 rounded-lg p-2 bg-gray-50"
            >
              <div className="text-right mb-1">
                <span className="text-xs text-gray-400">{day}</span>
              </div>
              <div className="space-y-1">
                {dateEvents.map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick?.(event)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
