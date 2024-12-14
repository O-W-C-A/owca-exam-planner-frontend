"use client";
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

interface ExamRequestDto {
  courseId: number;
  courseName: string;
  firstNameProf: string;
  lastNameProf: string;
  examDate: string | null;
  timeStart: string | null;
  status: string;
  id: number;
  details: string;
}

interface RoomDTO {
  roomID: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  departmentName?: string;
  examRequestCount: number;
}

interface ProfessorDTO {
  profID: number;
  firstName: string;
  lastName: string;
}

export default function Cards() {
  const [cardsData, setCardsData] = useState<ExamRequestDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [assistants, setAssistants] = useState<{ [key: number]: ProfessorDTO[] }>({});
  const [selectedRoom, setSelectedRoom] = useState<{ [key: number]: number[] }>({}); // Multiple rooms for each exam
  const [selectedAssistant, setSelectedAssistant] = useState<{ [key: number]: number }>({});

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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await fetch('https://localhost:7267/GetAllRooms', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }

        const data: RoomDTO[] = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchExamRequests();
    fetchRooms();
  }, []);

  const fetchAssistants = async (courseId: number) => {
    try {
      const response = await fetch(`https://localhost:7267/GetAssistentByCourse/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assistants');
      }

      const data: ProfessorDTO[] = await response.json();
      setAssistants((prev) => ({ ...prev, [courseId]: data }));
    } catch (error) {
      console.error('Error fetching assistants:', error);
    }
  };

  const handleReject = async (id: number) => {
    const roomsId = selectedRoom[id] || [];
    const assistantId = selectedAssistant[id];

    try {
      const response = await fetch(`https://localhost:7267/UpdateExamStatus/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Rejected',
          roomsId: roomsId,
          assistentId: assistantId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reject exam. Status: ${response.status}`);
      }

      setCardsData((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, status: 'Rejected' } : card
        )
      );
    } catch (error) {
      console.error('Error rejecting exam:', error);
      alert('Failed to reject the exam. Please try again later.');
    }
  };

  const handleApprove = async (id: number) => {
    const roomsId = selectedRoom[id] || [];
    const assistantId = selectedAssistant[id];

    try {
      const response = await fetch(`https://localhost:7267/UpdateExamStatus/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Approved',
          roomsId: roomsId,
          assistentId: assistantId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to approve exam. Status: ${response.status}`);
      }

      setCardsData((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, status: 'Approved' } : card
        )
      );
    } catch (error) {
      console.error('Error approving exam:', error);
      alert('Failed to approve the exam. Please try again later.');
    }
  };

  const handleRoomChange = (id: number, roomID: number) => {
    setSelectedRoom((prevState) => {
      const updatedRooms = [...(prevState[id] || [])];
      if (updatedRooms.includes(roomID)) {
        updatedRooms.splice(updatedRooms.indexOf(roomID), 1);
      } else {
        updatedRooms.push(roomID);
      }
      return { ...prevState, [id]: updatedRooms };
    });
  };

  const handleAssistantChange = (id: number, assistantID: number) => {
    setSelectedAssistant((prevState) => ({ ...prevState, [id]: assistantID }));
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

                <div className="relative pt-3">
                  {[1, 2, 3].map((roomSelectNumber) => (
                    <select
                      key={roomSelectNumber}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={selectedRoom[card.id]?.[roomSelectNumber - 1] || ''}
                      onChange={(e) =>
                        handleRoomChange(card.id, Number(e.target.value))
                      }
                      required={selectedRoom[card.id]?.length > 0}
                    >
                      <option value="" disabled>Selectează sala {roomSelectNumber}</option>
                      {rooms.map((room) => (
                        <option key={room.roomID} value={room.roomID}>
                          {room.name} ({room.location}, Capacitate: {room.capacity})
                        </option>
                      ))}
                    </select>
                  ))}
                </div>

                <div className="relative pt-3">
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={selectedAssistant[card.id] || ''}
                    onFocus={() => !assistants[card.courseId] && fetchAssistants(card.courseId)}
                    onChange={(e) => handleAssistantChange(card.id, Number(e.target.value))}
                  >
                    <option value="" disabled>Selectează asistentul</option>
                    {(assistants[card.courseId] || []).map((assistant) => (
                      <option key={assistant.profID} value={assistant.profID}>
                        {assistant.firstName} {assistant.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="relative pt-3">
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={card.details}
                    readOnly
                  />
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleApprove(card.id)}
                  >
                    Aproba
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleReject(card.id)}
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
