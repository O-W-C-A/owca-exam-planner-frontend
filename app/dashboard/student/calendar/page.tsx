'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import localizer from '@/app/helpers/localizer';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';

type ExamType = 'Written' | 'Oral' | 'Project' | 'Practice';

type Event = {
  id: string;
  title: string;          // Subject name
  start: Date;           // Exam date and time
  end: Date;             // Exam end time
  isConfirmed: boolean;
  details?: {            // Optional details (might be empty for unconfirmed exams)
    professor: {
      firstName: string;
      lastName: string;
    };
    assistant?: {        // Optional assistant
      firstName: string;
      lastName: string;
    };
    room?: string;       // Optional room
    type?: ExamType;     // Optional exam type
    notes?: string;      // Optional notes
  };
};

const StudentCalendar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setIsClient(true);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await api.get(`/events/student/${userId}`);
      if (response.status === 200) {
        // Parse dates from the response
        const parsedEvents = response.data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(parsedEvents);
      }
    } catch (error) {
      setError('Failed to load events');
      setEvents([]);
    }
  };

  const handleConfirm = async (): Promise<void> => {
    if (selectedEvent) {
      try {
        await fetch(`/api/events/${selectedEvent.id}/confirm`, {
          method: 'PUT'
        });
        
        setSelectedEvent((prevEvent) => ({
          ...prevEvent!,
          isConfirmed: true,
        }));
        setIsModalOpen(false);
        
        fetchEvents();
      } catch (error) {
        setError('Failed to confirm event');
      }
    }
  };

  const formatEventTitle = (event: Event) => {
    return event.title; // Show only subject name in calendar
  };

  const renderEventDetails = (event: Event) => {
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
        {event.details.room && (
          <p className="mb-2">
            <strong className="font-semibold">Room:</strong> {event.details.room}
          </p>
        )}
        {event.details.type && (
          <p className="mb-2">
            <strong className="font-semibold">Type:</strong> {event.details.type}
          </p>
        )}
        <p className="mb-2">
          <strong className="font-semibold">Date:</strong>{' '}
          {event.start.toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong className="font-semibold">Time:</strong>{' '}
          {`${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`}
        </p>
        {event.details.notes && (
          <p className="mb-2">
            <strong className="font-semibold">Notes:</strong> {event.details.notes}
          </p>
        )}
      </>
    );
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
            timeGutterFormat: (date, culture, localizer: any) =>
              localizer.format(date, 'HH:mm', culture),
            dayFormat: (date, culture, localizer) =>
              localizer.format(date, 'EEE', culture),
            dateFormat: (date, culture, localizer) =>
              localizer.format(date, 'd', culture),
          }}
          titleAccessor={formatEventTitle}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setIsModalOpen(true);
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.isConfirmed ? 'green' : 'red',
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
                  selectedEvent.isConfirmed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedEvent.isConfirmed ? 'Confirmed' : 'Unconfirmed'}
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
    </div>
  );
};

export default StudentCalendar;
