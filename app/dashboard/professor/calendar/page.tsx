'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Views, DateLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import localizer from '@/app/helpers/localizer';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';
import Select from 'react-select';
import { Toast } from '@/app/components/Toast';
import { RejectPopup } from '@/app/components/RejectPopup';
import { ApprovePopup } from '@/app/components/ApprovePopup';
import { useUser } from '@/contexts/UserContext';
import { Course, CourseOption } from '@/types/course';

type ExamType = 'Written' | 'Oral' | 'Project' | 'Practice';

type Event = {
  id: string;
  title: string;
  date: Date;
  start: string;
  end: string;
  isConfirmed: boolean;
  details?: {
    professor: {
      firstName: string;
      lastName: string;
    };
    assistant?: {
      firstName: string;
      lastName: string;
    } | null;
    group: string;
    type: ExamType;
    notes?: string;
    rooms: any;
  };
  courseId: string;
  groupName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const ProfessorCalendar: React.FC = () => {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = user?.id || Cookies.get('userId');
      const endpoint = selectedCourse && selectedCourse.value !== 'all'
        ? `/event/exam-request/professor/${userId}/course/${selectedCourse.value}`
        : `/event/exam-request/professor/${userId}`;
      
      const response = await api.get(endpoint);
      if (response.status === 200) {
        const parsedEvents = response.data.map((event: Event) => {
          // Create base date from the date field
          const baseDate = new Date(event.date);
          
          // If start time exists, set it on the base date
          const startDate = new Date(baseDate);
          const endDate = new Date(baseDate);
          
          if (event.start) {
            const [startHours, startMinutes] = event.start.split(':');
            startDate.setHours(parseInt(startHours), parseInt(startMinutes));
          }
          
          if (event.end) {
            const [endHours, endMinutes] = event.end.split(':');
            endDate.setHours(parseInt(endHours), parseInt(endMinutes));
          }
          return {
            id: event.id,
            title: event.title ?? 'Untitled Event',
            start: startDate,
            end: endDate,
            isConfirmed: event.status === 'Approved',
            details: {
              professor: event.details?.professor,
              assistant: event.details?.assistant,
              group: event.details?.group,
              type: event.details?.type ?? 'Written',
              notes: event.details?.notes ?? '',
              rooms: event.details?.rooms,
            },
            courseId: event.courseId,
            groupName: event.details?.group,
            status: event.status
          };
        });
        
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setToastMessage('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedCourse]);

  const fetchCourses = useCallback(async () => {
    try {
      const userId = user?.id || Cookies.get('userId');
      const response = await api.get(`/course/professor/${userId}`);
      if (response.status === 200) {
        const courseOptions = [
          { value: 'all', label: 'All Courses' },
          ...response.data.map((course: Course) => ({
            value: course.id,
            label: course.name
          }))
        ];
        setCourses(courseOptions);
      }
    } catch (error: unknown) {
      console.log('Failed to load courses', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to load courses');
    }
  }, [user]);

  useEffect(() => {
    setIsClient(true);
    if (user) {
      fetchEvents();
      fetchCourses();
    }
  }, [user, selectedCourse, fetchEvents, fetchCourses]);

  const handleConfirm = async (data: {
    timeStart: string;
    timeEnd: string;
    assistantId?: string;
    type: string;
    notes?: string;
    roomsId:number[];
  }) => {
    try {
      if (!selectedEvent) return;
      const response = await api.put(`/event/exam-request/${selectedEvent.id}/approve`, data);
      if (response.status === 200) {
        setToastMessage('Exam request approved successfully');
        setShowApprovePopup(false);
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (error: unknown) {
      console.log('Failed to approve exam request', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to approve exam request');
    }
  };

  const handleReject = async (reason: string) => {
    try {
      if (!selectedEvent) return;
      const response = await api.put(`/event/exam-request/${selectedEvent.id}/reject`, { reason });
      if (response.status === 200) {
        setToastMessage('Exam request rejected successfully');
        setShowRejectPopup(false);
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (error: unknown) {
      console.log('Failed to reject exam request', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to reject exam request');
    }
  };

  const formatEventTitle = (event: Event) => {
    return event.title; // Show only subject name in calendar
  };

  const renderEventDetails = (event: Event) => {
    if (!event.details) {
      return (
        <div className="text-gray-500 italic">
          Details not available
        </div>
      );
    }

    return (
      <>
        <p className="mb-2">
          <strong className="font-semibold">Course:</strong>{' '}
          {event.title}
        </p>
        <p className="mb-2">
          <strong className="font-semibold">Group:</strong>{' '}
          {event.details.group}
        </p>
        {event.details.professor && (
          <p className="mb-2">
            <strong className="font-semibold">Professor:</strong>{' '}
            {`${event.details.professor.firstName} ${event.details.professor.lastName}`}
          </p>
        )}
        <p className="mb-2">
          <strong className="font-semibold">Date:</strong>{' '}
          {new Date(event.start).toLocaleDateString()}
        </p>
        {event.details.notes && (
          <p className="mb-2">
            <strong className="font-semibold">Details:</strong>{' '}
            {event.details.notes}
          </p>
        )}
         {event.details?.rooms && event.details?.rooms.length > 0 && (
          <p className="mb-2">
            <strong className="font-semibold">Sali:</strong>{' '}
            {event.details.rooms.map((room: { name: string; location: string }) => `${room.name} (${room.location})`).join(', ')}
          </p>
        )}
        <p className="mb-2">
          <strong className="font-semibold">Status:</strong>{' '}
          <span className={`px-2 py-1 rounded text-sm ${getStatusStyles(event.status)}`}>
            {event.status}
          </span>
        </p>
      </>
    );
  };

  const getStatusStyles = (status: Event['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const getEventBackgroundColor = (status: Event['status']) => {
    switch (status) {
      case 'Approved':
        return '#22c55e';  // green-500
      case 'Rejected':
        return '#ef4444';  // red-500
      case 'Pending':
        return '#eab308';  // yellow-500
    }
  };

  if (!isClient) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div>
        <Select
          value={selectedCourse}
          onChange={setSelectedCourse}
          options={courses}
          className="w-64"
          placeholder="All Courses"
          isLoading={isLoading}
          isClearable={false}
          classNames={{
            control: () => 'h-8 min-h-[32px] bg-white',
            valueContainer: () => 'h-8',
            input: () => 'h-8 m-0 p-0',
            placeholder: () => 'leading-8',
            singleValue: () => 'leading-8',
            indicatorsContainer: () => 'h-8',
            menu: () => 'bg-white shadow-lg border',
            menuList: () => 'bg-white',
            option: (state) => state.isFocused ? 'bg-gray-100' : 'bg-white'
          }}
          styles={{
            menu: (base) => ({
              ...base,
              backgroundColor: 'white',
              zIndex: 50
            })
          }}
        />
      </div>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      <div className="flex-1">
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
              localizer?.format(date, 'HH:mm', culture ?? 'en-GB') ?? '',
            dayFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
              localizer?.format(date, 'EEE', culture ?? 'en-GB') ?? '',
            dateFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
              localizer?.format(date, 'd', culture ?? 'en-GB') ?? '',
          }}
          titleAccessor={formatEventTitle}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setIsModalOpen(true);
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: getEventBackgroundColor(event.status),
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
                <span className={`ml-2 px-2 py-1 text-sm rounded ${getStatusStyles(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </span>
              </h2>
              
              {renderEventDetails(selectedEvent)}
              
              <div className="flex justify-end space-x-4 mt-6">
                {selectedEvent.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowApprovePopup(true);
                        setIsModalOpen(false);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectPopup(true);
                        setIsModalOpen(false);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </>
                )}
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

      {showRejectPopup && (
        <RejectPopup
          isOpen={showRejectPopup}
          onClose={() => setShowRejectPopup(false)}
          onReject={handleReject}
        />
      )}

      {showApprovePopup && selectedEvent && (
        <ApprovePopup
          isOpen={showApprovePopup}
          onClose={() => setShowApprovePopup(false)}
          courseId={selectedEvent.courseId}
          onApprove={handleConfirm}
        />
      )}
    </div>
  );
};

export default ProfessorCalendar;
