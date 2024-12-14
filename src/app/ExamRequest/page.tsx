'use client';

import React, { useEffect, useState } from 'react';
import './style.css';

// Define TypeScript interfaces for API responses
interface CourseDTO {
  id: number;
  title: string;
  numeProfesor: string;
  prenumeProfesor: string;
  status: string;
}

const CreateExamRequestPage = () => {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [details, setDetails] = useState<string>('');
  const [date] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await fetch('https://localhost:7267/GetCoursersForExamByUserID?userId=816');
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert('Please fill in all required fields.');
      return;
    }

    const examRequest = {
      groupID: 1, // Fixed
      courseID: selectedCourse, // Passing the selected course ID (number)
      sessionID: 1, // Fixed
      type: '', // No type for now
      date: new Date(date).toISOString(),
      timeStart: '12:00:00', // Fixed time start
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
              <option key={course.id} value={course.id}>
                {course.title} - {course.numeProfesor} {course.prenumeProfesor}
              </option>
            ))}
          </select>
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
