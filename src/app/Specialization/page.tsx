"use client";

import { useEffect, useState } from "react";
import "./style.css"; 

const CreateSpecializationPage = () => {
  const [faculties, setFaculties] = useState<{
    facultyID: number;
    shortName: string;
    longName: string | null;
    description: string | null;
    creationDate: string;
  }[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [creationDate] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch("https://localhost:7267/GetFaculties");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    fetchFaculties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFaculty) {
      alert("Please select a faculty.");
      return;
    }

    const specialization = {
      SpecializationID: 0,
      FacultyID: selectedFaculty,
      Name: name,
      Description: description,
      CreationDate: creationDate,
    };

    try {
      const response = await fetch("https://localhost:7267/specialization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(specialization),
      });

      if (!response.ok) {
        throw new Error("Failed to create specialization");
      }

      alert("Specialization created successfully!");
    } catch (error) {
      console.error("Error creating specialization:", error);
    }
  };

  return (
    <div className="form-container">
      <h1>Create Specialization</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="faculty">Faculty:</label>
          <select
            id="faculty"
            value={selectedFaculty || ""}
            onChange={(e) => setSelectedFaculty(Number(e.target.value))}
          >
            <option value="">Select a faculty</option>
            {faculties.length === 0 ? (
              <option value="">Loading faculties...</option>
            ) : (
              faculties.map((faculty) => (
                <option key={faculty.facultyID} value={faculty.facultyID}>
                  {faculty.shortName && faculty.shortName.trim() !== "" 
                    ? faculty.shortName 
                    : "Unnamed Faculty"}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="name">Name:</label>
          <textarea
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></textarea>
        </div>

        <div className="input-container">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="button-container">
          <button type="submit">Create Specialization</button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpecializationPage;
