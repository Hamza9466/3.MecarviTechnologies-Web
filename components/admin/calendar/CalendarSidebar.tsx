"use client";

import { EventCategory, CalendarEvent } from "./types";
import EventCategoryButton from "./EventCategoryButton";
import UpcomingEventItem from "./UpcomingEventItem";

interface CalendarSidebarProps {
  categories: EventCategory[];
  upcomingEvents: CalendarEvent[];
  selectedCategories: EventCategoryType[];
  onCategoryToggle: (categoryType: EventCategoryType) => void;
}

export default function CalendarSidebar({
  categories,
  upcomingEvents,
  selectedCategories,
  onCategoryToggle,
}: CalendarSidebarProps) {
  return (
    <div className="w-[28%] bg-gray-50 rounded-lg p-4 flex flex-col h-full overflow-hidden">
      {/* All Events Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">All Events</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <EventCategoryButton
              key={category.id}
              category={category}
              isActive={selectedCategories.includes(category.type)}
              onClick={() => onCategoryToggle(category.type)}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Events</h3>
        <div className="space-y-0">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <UpcomingEventItem
                key={event.id}
                event={event}
                isLast={index === upcomingEvents.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No upcoming events
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
