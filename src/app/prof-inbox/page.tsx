'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

// Definirea tipului de date pe care le așteptăm de la API
interface ExamRequestDto {
  courseName: string;
  firstNameProf: string;
  lastNameProf: string;
  examDate: string | null;
  timeStart: string | null;
  status: string;
  id: number; // Adăugăm ID-ul pentru a-l folosi în API call
}

export default function Cards() {
  const [cardsData, setCardsData] = useState<ExamRequestDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeStart, setTimeStart] = useState<string>("");

  useEffect(() => {
    const fetchExamRequests = async () => {
      try {
        const response = await fetch('https://localhost:7267/GetExamRequestsByProfID/2?status=Pending', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data: ExamRequestDto[] = await response.json();
        setCardsData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamRequests();
  }, []);

  // Funcția care face apelul API pentru a actualiza statusul examenului ca "Rejected"
  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7267/UpdateExamStatus/${id}?status=Rejected`, {
        method: 'PATCH', // Folosim PATCH pentru a actualiza statusul
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to reject exam. Status code: ${response.status}, Error: ${errorText}`);
        throw new Error(`Failed to reject exam. Status: ${response.status}`);
      }

      setCardsData(prevCards =>
        prevCards.map(card =>
          card.id === id ? { ...card, status: 'Rejected' } : card
        )
      );
      console.log(`Exam with ID ${id} rejected successfully`);
    } catch (error) {
      console.error('Error rejecting exam:', error);
      alert('Failed to reject the exam. Please try again later.');
    }
  };

  // Funcția care face apelul API pentru a actualiza statusul examenului ca "Approved"
  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7267/UpdateExamStatus/${id}?status=Approved`, {
        method: 'PATCH', // Folosim PATCH pentru a actualiza statusul
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to approve exam. Status code: ${response.status}, Error: ${errorText}`);
        throw new Error(`Failed to approve exam. Status: ${response.status}`);
      }

      setCardsData(prevCards =>
        prevCards.map(card =>
          card.id === id ? { ...card, status: 'Approved' } : card
        )
      );
      console.log(`Exam with ID ${id} approved successfully`);
    } catch (error) {
      console.error('Error approving exam:', error);
      alert('Failed to approve the exam. Please try again later.');
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeStart(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardsData.map((card, index) => (
        <Card key={index} className="shadow-lg">
          <CardHeader>
            <CardTitle>{card.courseName}</CardTitle>
            <CardDescription>
              Profesor: {card.firstNameProf} {card.lastNameProf}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {card.status === 'Pending' ? (
              <div>
                {card.examDate ? (
                  <div className="flex">
                    <div className="text-sm text-green-800">
                      Data examenului: {new Date(card.examDate).toLocaleDateString()}
                    </div>
                    <CalendarIcon className="ml-2 h-5 w-5 text-green-800" />
                  </div>
                ) : null}
                {card.timeStart ? (
                  <div className="relative pt-3">
                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="time"
                      className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      min="09:00"
                      max="18:00"
                      value={timeStart || new Date(`1970-01-01T${card.timeStart}`).toISOString().slice(11, 16)}
                      onChange={handleTimeChange}
                      required
                    />
                  </div>
                ) : null}
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleApprove(card.id)} // Adăugăm onClick pentru aprobare
                  >
                    Aproba
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleReject(card.id)} // Adăugăm onClick pentru respingere
                  >
                    Respinge
                  </button>
                </div>
              </div>
            ) : card.status === 'Done' ? (
              <div className="px-2 py-1 text-sm rounded-lg bg-yellow-100 text-yellow-800">
                {card.status}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
