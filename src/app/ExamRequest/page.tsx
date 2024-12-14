'use client';

import React, { useEffect, useState } from 'react';
import './style.css';

// Define TypeScript interfaces for API responses
interface CourseDTO {
  id :number;
  title: string;
  numeProfesor: string;
  prenumeProfesor: string;
  status: string;
}

interface Room {
  roomID: number;
  departmentID: number | null;
  name: string;
  location: string;
  capacity: number | null;
  description: string;
  creationDate: string;
}

interface ProfessorDTO {
  profID: number;
  firstName: string;
  lastName: string;
}

const CreateExamRequestPage = () => {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assistants, setAssistants] = useState<ProfessorDTO[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null); // Changed to number
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<number | null>(null);
  const [timeStart, setTimeStart] = useState<string>('12:00');
  const [details, setDetails] = useState<string>('');
  const [date] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomResponse = await fetch('https://localhost:7267/GetAllRooms');
        if (!roomResponse.ok) throw new Error('Failed to fetch rooms');
        const roomData: Room[] = await roomResponse.json();
        setRooms(roomData);
        const courseResponse = await fetch('https://localhost:7267/GetCoursersForExamByUserID?userId=1');
        if (!courseResponse.ok) throw new Error('Failed to fetch courses');
        const courseData: CourseDTO[] = await courseResponse.json();
        setCourses(courseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch assistants when the course changes
  useEffect(() => {
    const fetchAssistants = async () => {
      if (!selectedCourse) {
        setAssistants([]);
        return;
      }

      try {
        const assistantResponse = await fetch(
          `https://localhost:7267/GetAssistentByCourse/${selectedCourse}`
        );

        if (!assistantResponse.ok || assistantResponse.headers.get('Content-Length') === '0') {
          setAssistants([]);
          return;
        }

        const assistantData: ProfessorDTO[] = await assistantResponse.json();
        setAssistants(assistantData);
      } catch (error) {
        console.error('Error fetching assistants:', error);
      }
    };

    fetchAssistants();
  }, [selectedCourse]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse || !selectedAssistant || selectedRooms.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    const examRequest = {
      groupID: 1, // Fixed
      courseID: selectedCourse, // Passing the string selectedCourse
      roomIDs: selectedRooms, // Passing selected room IDs (number[])
      assistantID: selectedAssistant, // Passing selected assistant ID (number)
      sessionID: 1, // Fixed
      type: '', // No type for now
      date: new Date(date).toISOString(), 
      timeStart: timeStart+":00",
      duration: '01:00:00', // Fixed duration
      details: details,
      status: 'Pending', // Fixed status
    };
    console.log('Exam request object being sent:', examRequest);
    try {
      const response = await fetch('https://localhost:7267/CreateExamRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to create exam request');
      }

      alert('Exam request created successfully!');
    } catch (error) {
      console.error('Error creating exam request:', error);
    }
  };

  // Handle room selection (toggle)
  const handleRoomSelection = (roomID: number) => {
    setSelectedRooms((prev) =>
      prev.includes(roomID) ? prev.filter((id) => id !== roomID) : [...prev, roomID]
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-container">
      <h1>Create Exam Request</h1>
      <form onSubmit={handleSubmit}>
        {/* Course Selection */}
        <div className="input-container">
        <label htmlFor="course">Course:</label>
        <select
            id="course"
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(Number(e.target.value))} // Use ID as value
        >
            <option value="">Select a course</option>
            {courses.map((course) => (
            <option key={course.id} value={course.id}> {/* Use course.Id for value */}
                {course.title} - {course.numeProfesor} {course.prenumeProfesor}
            </option>
            ))}
        </select>
        </div>

        {/* Room Selection */}
        <div className="input-container">
          <label htmlFor="rooms">Rooms:</label>
          <div className="room-checkbox-container">
            {rooms.map((room) => (
              <div key={room.roomID} className="room-checkbox">
                <input
                  type="checkbox"
                  id={`room-${room.roomID}`}
                  value={room.roomID}
                  onChange={() => handleRoomSelection(room.roomID)}
                />
                <label htmlFor={`room-${room.roomID}`}>{room.name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Assistant Selection */}
        <div className="input-container">
          <label htmlFor="assistant">Assistant:</label>
          <select
            id="assistant"
            value={selectedAssistant || ''}
            onChange={(e) => setSelectedAssistant(Number(e.target.value))}
          >
            <option value="">Select an assistant</option>
            {assistants.map((assistant) => (
              <option key={assistant.profID} value={assistant.profID}>
                {assistant.firstName}
              </option>
            ))}
          </select>
        </div>

        {/* Time Start Selection */}
        <div className="input-container">
          <label htmlFor="timeStart">Start Time:</label>
          <input
            type="time"
            id="timeStart"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            required
          />
        </div>

        {/* Details */}
        <div className="input-container">
          <label htmlFor="details">Details:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="button-container">
          <button type="submit">Create Exam Request</button>
        </div>
      </form>
    </div>
  );
};

export default CreateExamRequestPage;
