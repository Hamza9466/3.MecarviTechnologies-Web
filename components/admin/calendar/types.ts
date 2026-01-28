export type CalendarView = "month" | "week" | "day" | "list";
export type EventCategoryType = "calendar" | "birthday" | "holiday" | "office" | "other" | "festival";

export interface EventCategory {
  id: number;
  name: string;
  type: EventCategoryType;
  color: string;
  bgColor: string;
  icon: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: string; // ISO date string
  category: EventCategoryType;
  color: string;
  bgColor: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
}

export interface CalendarEventsResponse {
  success: boolean;
  data: {
    events: CalendarEvent[];
    categories: EventCategory[];
  };
}
