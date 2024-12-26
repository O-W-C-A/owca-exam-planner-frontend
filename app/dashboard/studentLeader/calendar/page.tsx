'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Views, DateLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import localizer from '@/app/helpers/localizer';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';
import { ExamRequestPopup } from '@/app/components/ExamRequestPopup';
import { ExamRequest, ExamRequestFormData } from '@/types/examRequest';

const StudentLeaderCalendar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExamRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<ExamRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await api.get(`/events/student/${userId}`);
      if (response.status === 200) {
        const parsedEvents = response.data.map((event: ExamRequest) => {
          const eventDate = new Date(event.date);
          
          // Create start date
          const startDate = new Date(eventDate);
          if (event.start) {
            const [hours, minutes] = event.start.split(':');
            startDate.setHours(parseInt(hours), parseInt(minutes));
          }

          // Create end date
          const endDate = new Date(eventDate);
          if (event.end) {
            const [hours, minutes] = event.end.split(':');
            endDate.setHours(parseInt(hours), parseInt(minutes));
          } else {
            // If no end time, set it to 2 hours after start
            endDate.setHours(startDate.getHours() + 2);
          }

          return {
            ...event,
            start: startDate,
            end: endDate,
            isConfirmed: event.status === 'Approved'
          };
        });
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.log('Failed to load events', error);
      setError(error instanceof Error ? error.message : 'Failed to load events');
      setEvents([]);
    }
  };

  const formatEventTitle = (event: ExamRequest) => {
    return event.title; // Show only subject name in calendar
  };

  const renderEventDetails = (event: ExamRequest) => {
    if (!event.details) {
      return (
        <div className="text-gray-500 italic">
          Details will be available once the exam is confirmed
        </div>
      );
    }

    return (
      <>
        <p className="mb-2">
          <strong className="font-semibold">Professor:</strong>{' '}
          {`${event.details.professor.firstName} ${event.details.professor.lastName}`}
        </p>
        {event.details.assistant && (
          <p className="mb-2">
            <strong className="font-semibold">Assistant:</strong>{' '}
            {`${event.details.assistant.firstName} ${event.details.assistant.lastName}`}
          </p>
        )}
        {event.details.type && (
          <p className="mb-2">
            <strong className="font-semibold">Type:</strong> {event.details.type}
          </p>
        )}
        <p className="mb-2">
          <strong className="font-semibold">Date:</strong>{' '}
          {new Date(event.date).toLocaleDateString()}
        </p>
        {event.start && event.end && new Date(event.start).getHours() !== 0 && new Date(event.end).getHours() !== 0 && (
          <p className="mb-2">
            <strong className="font-semibold">Time:</strong>{' '}
            {`${new Date(event.start).toLocaleTimeString()} - ${new Date(event.end).toLocaleTimeString()}`}
          </p>
        )}
        {event.details.notes && (
          <p className="mb-2">
            <strong className="font-semibold">Details:</strong> {event.details.notes}
          </p>
        )}
      </>
    );
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    setShowSuggestionPopup(true);
  };

  const handleExamRequest = async (data: ExamRequestFormData) => {
    try {
      if (!data.courseId) return;
      
      const groupId = Cookies.get('groupId');
      const formattedDate = data.date.toLocaleDateString('en-CA');
      
      const examRequest = {
        courseId: data.courseId,
        groupId: groupId,
        examDate: formattedDate,
        details: data.notes
      };

      await api.post('/event/exam-request', examRequest);
      fetchEvents();
    } catch (error) {
      console.error('Failed to submit exam request:', error);
      setError('Failed to submit exam request');
    }
  };

  if (!isClient) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex-none">
          {error}
        </div>
      )}
      <div className="flex-1 min-h-0">
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
          onNavigate={date => setDate(date)}
          selectable
          culture="en-GB"
          formats={{
            eventTimeRangeFormat: () => '',
            eventTimeRangeEndFormat: () => '',
            timeGutterFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
              localizer?.format(date, 'HH:mm', culture || 'en-GB') || '',
            dayFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
              localizer?.format(date, 'EEE', culture || 'en-GB') || '',
            dateFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
              localizer?.format(date, 'd', culture || 'en-GB') || '',
          }}
          titleAccessor={formatEventTitle}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setIsModalOpen(true);
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.status === 'Approved' 
                ? '#22c55e'  // green-500
                : event.status === 'Rejected'
                ? '#ef4444'  // red-500
                : '#f59e0b', // amber-500 for Pending
              color: 'white',
              borderRadius: '5px',
              border: 'none',
            },
          })}
          messages={{
            today: 'Today',
            previous: 'Previous',
            next: 'Next',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            agenda: 'Agenda'
          }}
          views={['month', 'week', 'day']}
          toolbar={true}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
            <div className="absolute inset-0 bg-white rounded-lg" />
            
            <div className="relative">
              <h2 className="text-xl font-bold mb-4">
                {selectedEvent.title}
                <span className={`ml-2 px-2 py-1 text-sm rounded ${
                  selectedEvent.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : selectedEvent.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedEvent.status}
                </span>
              </h2>
              
              {renderEventDetails(selectedEvent)}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDate && (
        <ExamRequestPopup
          isOpen={showSuggestionPopup}
          onClose={() => setShowSuggestionPopup(false)}
          selectedDate={selectedDate}
          onSubmit={handleExamRequest}
        />
      )}
    </div>
  );
};

export default StudentLeaderCalendar;
