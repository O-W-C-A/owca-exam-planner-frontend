import React, {useState} from "react";
import { Calendar, Views } from "react-big-calendar";
import localizer from "@/utils/localizer";
import { ExamRequest } from "@/types/examRequest";
import { formatExamRequestTitle, getExamRequestBackgroundColor } from "@/utils/examRequestUtils";

import { View } from "react-big-calendar";

interface CalendarViewProps {
  events: ExamRequest[];
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  onEventSelect: (event: ExamRequest) => void;
  onSlotSelect: (slotInfo: { start: Date; end: Date }) => void;
}
const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  view,
  setView,
  date,
  setDate,
  onEventSelect,
  onSlotSelect,
}) => (
  <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    className="h-full"
    defaultView={Views.MONTH}
    view={view}
    onView={setView}
    date={date}
    onNavigate={setDate}
    selectable
    culture="en-GB"
    formats={{
      eventTimeRangeFormat: () => "",
      eventTimeRangeEndFormat: () => "",
      timeGutterFormat: (date, culture, localizer) =>
        localizer?.format(date, "HH:mm", culture ?? "en-GB") || "",
      dayFormat: (date, culture, localizer) =>
        localizer?.format(date, "EEE", culture ?? "en-GB") || "",
      dateFormat: (date, culture, localizer) =>
        localizer?.format(date, "d", culture ?? "en-GB") || "",
    }}
    titleAccessor={formatExamRequestTitle}
    onSelectEvent={onEventSelect}
    eventPropGetter={(event) => ({
      style: {
        backgroundColor: getExamRequestBackgroundColor(event.status),
        color: "white",
        borderRadius: "5px",
        border: "none",
      },
    })}
    views={["month", "week", "day"]}
    toolbar={true}
    onSelectSlot={onSlotSelect}
  />
);

export default CalendarView;
