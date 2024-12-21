'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import localizer from '@/app/helpers/localizer';

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  isConfirmed: boolean;
};

const StudentLeaderCalendar: React.FC = () => {
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
      const response = await fetch('/api/events/studentleader');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
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

  if (!isClient) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        defaultView={Views.MONTH}
        view={view}
        onView={setView}
        date={date}
        onNavigate={date => setDate(date)}
        selectable
        onSelectEvent={(event) => {
          if (!event.isConfirmed) {
            setSelectedEvent(event);
            setIsModalOpen(true);
          }
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

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Unconfirmed Event</h2>
            <p className="mb-2">
              <strong className="font-semibold">Title:</strong>{' '}
              {selectedEvent.title}
            </p>
            <p className="mb-2">
              <strong className="font-semibold">Starts:</strong>{' '}
              {selectedEvent.start.toLocaleString()}
            </p>
            <p className="mb-4">
              <strong className="font-semibold">Ends:</strong>{' '}
              {selectedEvent.end.toLocaleString()}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLeaderCalendar; 