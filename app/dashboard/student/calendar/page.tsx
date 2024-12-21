/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Select from 'react-select';
import localizer from '@/app/helpers/localizer';

// Definim tipul unui eveniment
type Event = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  isConfirmed: boolean;
};

const MyCalendar: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<any>({
    value: 'George Mahalu',
    label: 'George Mahalu',
  });

  const options = [
    { value: 'George Mahalu', label: 'George Mahalu' },
    { value: 'Mihai Popescu', label: 'Mihai Popescu' },
    { value: 'Andrei Gherasim', label: 'Andrei Gherasim' },
    { value: 'Maria Ionescu', label: 'Maria Ionescu' },
  ];

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
  };

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Definim evenimentele din calendar
  const [events] = useState<Event[]>([
    {
      title: 'Examen PCLP',
      start: new Date(2024, 11, 18, 10, 0),
      end: new Date(2024, 11, 18, 12, 0),
      isConfirmed: true,
    },
    {
      title: 'SIIEP',
      start: new Date(2024, 11, 19, 14, 0),
      end: new Date(2024, 11, 19, 15, 0),
      isConfirmed: false,
    },
  ]);

  const handleConfirm = (): void => {
    if (selectedEvent) {
      setSelectedEvent((prevEvent) => ({
        ...prevEvent!,
        isConfirmed: true,
      }));
      setIsModalOpen(false);
    }
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        className="w-64"
      />
      <div className="flex-1">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="h-full"
          defaultView={Views.WEEK}
          selectable
          onSelectEvent={(event) => {
            console.log('Eveniment selectat: ', event);
            const isConfirmed = event.isConfirmed;
            if (!isConfirmed) {
              setSelectedEvent(event);
              setIsModalOpen(true);
            }
          }}
          onSelectSlot={(slotInfo) => console.log('Slot selectat: ', slotInfo)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.isConfirmed ? 'green' : 'red',
              color: 'white',
              borderRadius: '5px',
              border: 'none',
            },
          })}
        />
      </div>

      {/* Modal cu două butoane */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Eveniment Neconfirmat</h2>
            <p className="mb-2">
              <strong className="font-semibold">Titlu:</strong>{' '}
              {selectedEvent.title}
            </p>
            <p className="mb-2">
              <strong className="font-semibold">Începe:</strong>{' '}
              {selectedEvent.start.toLocaleString()}
            </p>
            <p className="mb-4">
              <strong className="font-semibold">Se termină:</strong>{' '}
              {selectedEvent.end.toLocaleString()}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Confirmă
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
