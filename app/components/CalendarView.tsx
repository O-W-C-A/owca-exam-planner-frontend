"use client";
import React, { useState } from "react";
import { Calendar, Views, View } from "react-big-calendar";
import localizer from "@/utils/localizer"; // Localization utility for date formats
import { ExamRequest } from "@/types/examRequest"; // Exam request type definition
import {
  formatExamRequestTitle,
  getExamRequestBackgroundColor,
} from "@/utils/examRequestUtils"; // Utility functions for event titles and styles

import Cookies from "js-cookie"; // To fetch user role from cookies
import { UserType } from "@/types/userType"; // User type enum
import ToastMessage from "@/app/components/ToastMessage"; // Toast Message component

// Define the component's props interface
interface CalendarViewProps {
  events: ExamRequest[]; // List of events to display on the calendar
  view: View; // Current calendar view (month, week, day)
  setView: (view: View) => void; // Function to update the calendar view
  date: Date; // Current date displayed in the calendar
  setDate: (date: Date) => void; // Function to update the calendar date
  onEventSelect: (event: ExamRequest) => void; // Callback when an event is selected
  onSlotSelect: (slotInfo: { start: Date; end: Date }) => void; // Callback when a calendar slot is selected
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  view,
  setView,
  date,
  setDate,
  onEventSelect,
  onSlotSelect,
}) => {
  const userRole = Cookies.get("role"); // Fetch user role from cookies
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  /**
   * Handles slot selection with validation:
   * - Prevents selecting today or past dates.
   * - Checks if the selected day already has an event.
   */
  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to the start of the current day

    const selectedStart = new Date(slotInfo.start);
    selectedStart.setHours(0, 0, 0, 0); // Normalize to the start of the selected day

    if (selectedStart.getTime() <= now.getTime()) {
      const errorMessage = "Cannot select slots on the current or past days.";
        setToast({
          message: errorMessage,
          type: "error",
        });
      return;
    }

    const isDayTaken = events.some((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return selectedStart.getTime() === eventDate.getTime();
    });

    if (isDayTaken) {
      const errorMessage = "There is already an event on this day. Please select another day.";
        setToast({
          message: errorMessage,
          type: "error",
        });
      return;
    }

    // Proceed with the valid slot selection
    onSlotSelect(slotInfo);
  };

  // Clear toast
  const clearToast = () => {
    setToast(null);
  };

  return (
    <>
      {/* ToastMessage notification */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      <Calendar
        localizer={localizer}
        events={events} // Event data
        startAccessor="start" // Field for event start time
        endAccessor="end" // Field for event end time
        className="h-full"
        defaultView={Views.MONTH} // Default view is month
        view={view} // Controlled view
        onView={setView} // Handle view changes
        date={date} // Controlled date
        onNavigate={setDate} // Handle date navigation
        selectable={userRole !== UserType.Student} // Allow slot selection only for non-student users
        culture="en-GB" // Set culture for date formats
        formats={{
          eventTimeRangeFormat: () => "", // Hide time range in events
          eventTimeRangeEndFormat: () => "", // Hide end time
          timeGutterFormat: (date, culture, localizer) =>
            localizer?.format(date, "HH:mm", culture ?? "en-GB") || "",
          dayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEE", culture ?? "en-GB") || "",
          dateFormat: (date, culture, localizer) =>
            localizer?.format(date, "d", culture ?? "en-GB") || "",
        }}
        titleAccessor={formatExamRequestTitle} // Custom title accessor
        onSelectEvent={onEventSelect} // Handle event selection
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: getExamRequestBackgroundColor(event.status), // Event background color based on status
            color: "white",
            borderRadius: "5px",
            border: "none",
          },
        })}
        views={["month", "week", "day"]} // Enable month, week, and day views
        toolbar={true} // Show toolbar
        onSelectSlot={
          userRole !== UserType.Student && userRole !== UserType.Professor
            ? handleSlotSelect
            : undefined
        } // Pass slot selection handler only for non-student users
      />
    </>
  );
};

export default CalendarView;
