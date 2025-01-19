import React from "react";
import { Calendar, Views } from "react-big-calendar";
import localizer from "@/utils/localizer"; // Localizer for date formatting (e.g., in British format)
import { ExamRequest } from "@/types/examRequest"; // Type for exam request events
import {
  formatExamRequestTitle,
  getExamRequestBackgroundColor,
} from "@/utils/examRequestUtils"; // Utility functions for title and background color formatting

import { View } from "react-big-calendar"; // View types for the calendar (e.g., month, week, day)

interface CalendarViewProps {
  events: ExamRequest[]; // Array of events to display on the calendar
  view: View; // Current view of the calendar (e.g., month, week, day)
  setView: (view: View) => void; // Function to change the current view
  date: Date; // Currently selected date in the calendar
  setDate: (date: Date) => void; // Function to change the selected date
  onEventSelect: (event: ExamRequest) => void; // Callback when an event is selected
  onSlotSelect: (slotInfo: { start: Date; end: Date }) => void; // Callback when a time slot is selected
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
  // Wrap the onSlotSelect to filter invalid date selections (cannot select today or past dates)
  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    const now = new Date(); // Current date and time
    now.setHours(0, 0, 0, 0); // Reset time to midnight (start of the day)
  
    // Create a new date object for the selected start date, setting its time to midnight for comparison
    const selectedStart = new Date(slotInfo.start);
    selectedStart.setHours(0, 0, 0, 0); // Set the time to midnight for correct comparison
  
    // Compare if the selected date is today or in the past
    const isPastOrToday = selectedStart.getTime() <= now.getTime(); // Timestamp comparison
    if (isPastOrToday) {
      // Prevent the user from selecting past or today’s date by showing an alert
      alert("Cannot select slots on the current or past days.");
      return; // Do nothing if the date is invalid
    }
  
    // Check if there are any events on the same day (ignoring time)
    const isDayTaken = events.some((event) => {
      const eventDate = new Date(event.date); // Assuming the event start time is in `start`
      eventDate.setHours(0, 0, 0, 0); // Reset event's time to midnight for comparison
  
      // If the event's date is the same as the selected day, return true
      return selectedStart.getTime() === eventDate.getTime();
    });
  
    if (isDayTaken) {
      // Prevent the user from opening the popup for a day that already has an event
      alert("There is already an event on this day. Please select another day.");
      return; // Do nothing if the day is already taken
    }
  
    // If the date is valid and the slot is not taken, call the onSlotSelect callback
    onSlotSelect(slotInfo);
  };
  

  return (
    <Calendar
      localizer={localizer} // Localizer to format dates according to locale
      events={events} // List of events to display
      startAccessor="start" // Accessor to define where the event start date is stored
      endAccessor="end" // Accessor to define where the event end date is stored
      className="h-full" // Full height for the calendar
      defaultView={Views.MONTH} // Default view is set to month
      view={view} // Current view (can be month, week, or day)
      onView={setView} // Function to set the calendar view
      date={date} // Currently selected date in the calendar
      onNavigate={setDate} // Function to update the selected date when navigating the calendar
      selectable // Enables selecting time slots
      culture="en-GB" // Locale for British English (can be changed as needed)
      formats={{
        eventTimeRangeFormat: () => "", // Do not display the time range in the event title
        eventTimeRangeEndFormat: () => "", // Do not display the time range end in the event title
        timeGutterFormat: (date, culture, localizer) =>
          localizer?.format(date, "HH:mm", culture ?? "en-GB") || "", // Format the time for the gutter (left side of calendar)
        dayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture ?? "en-GB") || "", // Format the day header as short weekday (e.g., Mon, Tue)
        dateFormat: (date, culture, localizer) =>
          localizer?.format(date, "d", culture ?? "en-GB") || "", // Format the date as a single day (e.g., 1, 2, 3)
      }}
      titleAccessor={formatExamRequestTitle} // Function to format the title of the exam request event
      onSelectEvent={onEventSelect} // Function to call when an event is selected
      eventPropGetter={(event) => ({
        style: {
          backgroundColor: getExamRequestBackgroundColor(event.status), // Set event background color based on status
          color: "white", // White text color for contrast
          borderRadius: "5px", // Rounded corners for event box
          border: "none", // No border
        },
      })}
      views={["month", "week", "day"]} // Supported calendar views (month, week, day)
      toolbar={true} // Display the toolbar for changing views
      onSelectSlot={handleSlotSelect} // Handle time slot selection and validation
    />
  );
};

export default CalendarView;
