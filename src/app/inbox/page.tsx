'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Tipul pentru datele de la API
interface ExamRequestDto {
  courseName: string;
  firstNameProf: string;
  lastNameProf: string;
  examDate: string | null;
  timeStart: string | null;
  status: string;
  id: number;
}

export default function Cards() {
  const [cardsData, setCardsData] = useState<ExamRequestDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Apelul API pentru a obține examenele cu statusul "Approved"
  useEffect(() => {
    const fetchExamRequests = async () => {
      try {
        const response = await fetch('https://localhost:7267/GetExamRequestsByGroupID/1?status=Approved', {
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

    fetchExamRequests(); // Apelul API la montarea componentei
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardsData.map((cardData) => (
        <CourseCard key={cardData.id} cardData={cardData} />
      ))}
    </div>
  );
}
function CourseCard({ cardData }: { cardData: ExamRequestDto }) {
  const renderStatus = () => {
    // Verificăm dacă examDate și timeStart nu sunt null înainte de a le folosi
    if (cardData.examDate && cardData.timeStart) {
      const combinedDate = new Date(cardData.examDate);
      const timeParts = cardData.timeStart.split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);

      // Setăm ora și minutele pe data examenului
      combinedDate.setHours(hours, minutes);

      switch (cardData.status) {
        case 'Approved':
          return (
            <div className="text-sm text-green-800">
              {/* Afișăm data examenului */}
              Data examenului:{' '}
              {cardData.examDate
                ? combinedDate.toLocaleDateString('ro-RO', { dateStyle: 'short' })
                : 'Neprogramată'}
              {/* Afișăm ora examenului */}
              <div>
                Ora examenului:{' '}
                {cardData.timeStart
                  ? combinedDate.toLocaleTimeString('ro-RO', { timeStyle: 'short' })
                  : 'Neprogramată'}
              </div>
            </div>
          );
        case 'Pending':
          return (
            <div className="px-2 py-1 text-sm rounded-lg bg-yellow-100 text-yellow-800">
              {cardData.status}
            </div>
          );
        case 'Netrimisă':
          return (
            <div className="px-2 py-1 text-sm rounded-lg bg-red-100 text-red-800">
              {cardData.status}
            </div>
          );
        default:
          return null;
      }
    } else {
      // Dacă examDate sau timeStart sunt null, putem returna un mesaj
      return (
        <div className="text-sm text-red-800">
          Data și ora examenului sunt neprogramate.
        </div>
      );
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{cardData.courseName}</CardTitle>
        <CardDescription>
          Profesor: {cardData.firstNameProf} {cardData.lastNameProf}
        </CardDescription>
      </CardHeader>
      <CardContent>{renderStatus()}</CardContent>
    </Card>
  );
}
