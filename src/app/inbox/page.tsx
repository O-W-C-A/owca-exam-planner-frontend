'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import * as Dialog from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Tipul CardData definit
type CardData = {
  materie: string;
  profesor: string;
  stare: 'Done' | 'Pending' | 'Netrimisă' | 'Active'; // "Active" adăugat pentru status
  dataExamen: string | null;
};

// Tipul pentru răspunsul de la API
type ApiResponse = {
  title: string;
  numeProfesor: string;
  prenumeProfesor: string;
  status: 'Active' | 'Pending' | 'Netrimisă'; // Tipuri de status disponibile
};

export default function Cards() {
  const [cardsData, setCardsData] = useState<CardData[]>([
    {
      materie: 'Loading...',
      profesor: 'Loading...',
      stare: 'Pending', // "Pending" ca stare de încărcare
      dataExamen: null,
    },
  ]);

  // Fetch API pentru a obține datele
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7267/GetCoursersForExamByUserID?userId=1'); // URL-ul corect
      if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        // Tipizează răspunsul de la API
        const data: ApiResponse[] = await response.json();

        // Mapează datele de la backend într-un format care respectă tipul `CardData`
        const mappedData: CardData[] = data.map((item) => ({
          materie: item.title,
          profesor: `${item.numeProfesor} ${item.prenumeProfesor}`,
          stare: item.status === 'Active' ? 'Done' : item.status === 'Pending' ? 'Pending' : 'Netrimisă',
          dataExamen: null, // Poți adăuga logică pentru data examenului dacă există
        }));

        setCardsData(mappedData); // Actualizează cardsData cu datele mapate
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Apel API la montarea componentei
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardsData.map((cardData, index) => (
        <CourseCard key={index} cardData={cardData} />
      ))}
    </div>
  );
}

function CourseCard({ cardData }: { cardData: CardData }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const renderStatus = () => {
    switch (cardData.stare) {
      case 'Done':
        return (
          <div className="text-sm text-green-800">
            Data examenului:{' '}
            {cardData.dataExamen
              ? new Date(cardData.dataExamen).toLocaleString('ro-RO', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })
              : 'Neprogramată'}
          </div>
        );
      case 'Pending':
        return (
          <div className="px-2 py-1 text-sm rounded-lg bg-yellow-100 text-yellow-800">
            {cardData.stare}
          </div>
        );
      case 'Netrimisă':
        return (
          <div>
            <div className="px-2 py-1 text-sm rounded-lg bg-red-100 text-red-800 mb-2">
              {cardData.stare}
            </div>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant="outline"
                  className="px-4 py-2 border rounded-md "
                  onClick={() => setIsDialogOpen(true)}
                >
                  Sugerează dată
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <Dialog.Content
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white p-6 rounded-lg shadow-lg z-50 max-w-md w-full"
                >
                  <Dialog.Title className="text-xl font-bold mb-4">
                    Sugereaza data examenului
                  </Dialog.Title>
                  <Dialog.Description className="text-gray-600 mb-4">
                    Alege o data pentru examenul de iar apoi apasa butonul de
                    confirmare
                  </Dialog.Description>

                  <Input
                    type="date"
                    id="date"
                    className=" text-sm rounded-lg  block w-full p-2.5  "
                    required
                  />

                  <div className="flex justify-end mt-4">
                    <Button variant="outline">Sugerează</Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{cardData.materie}</CardTitle>
        <CardDescription>Profesor: {cardData.profesor}</CardDescription>
      </CardHeader>
      <CardContent>{renderStatus()}</CardContent>
    </Card>
  );
}
