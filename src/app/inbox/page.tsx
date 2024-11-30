'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const cardsData = [
  {
    materie: 'Matematică Avansată',
    profesor: 'Prof. Dr. Ion Popescu',
    stare: 'Pending',
    dataExamen: null,
  },
  {
    materie: 'Programare Web',
    profesor: 'Prof. Dr. Ana Ionescu',
    stare: 'Done',
    dataExamen: '2024-11-25T10:00:00',
  },
  {
    materie: 'Baze de Date',
    profesor: 'Prof. Dr. Mihai Georgescu',
    stare: 'Netrimisă',
    dataExamen: null,
  },
  {
    materie: 'Structuri de Date',
    profesor: 'Prof. Dr. Maria Constantinescu',
    stare: 'Done',
    dataExamen: '2024-12-05T14:00:00',
  },
  {
    materie: 'Inteligență Artificială',
    profesor: 'Prof. Dr. Dan Dumitrescu',
    stare: 'Pending',
    dataExamen: null,
  },
  {
    materie: 'Rețele de Calculatoare',
    profesor: 'Prof. Dr. Elena Vasilescu',
    stare: 'Netrimisă',
    dataExamen: null,
  },
];

export default function Cards() {
  //   const [suggestedDates, setSuggestedDates] = useState<
  //     Record<number, string | null>
  //   >({});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardsData.map((cardData, index) => CourseCard(index, cardData))}
    </div>
  );
}

function CourseCard(
  index: number,
  cardData: {
    materie: string;
    profesor: string;
    stare: string;
    dataExamen: string | null;
  },
) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  // const [date, setDate] = React.useState<Date>(new Date());

  // const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const renderStatus = () => {
    switch (cardData.stare) {
      case 'Done':
        return (
          <div className="text-sm text-green-800">
            Data examenului:{' '}
            {new Date(cardData.dataExamen!).toLocaleString('ro-RO', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
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

                  {/* <Calendar
                    mode="single"
                    // selected={date}
                    // onSelect={setDate}}
                    className="rounded-md border"
                  /> */}

                  {/* Suggest button */}
                  <div className="flex justify-end mt-4">
                    <Button variant="outline">Sugerează</Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* <DayPickerProvider
              initialProps={{
                mode: 'single',
                selected: selectedDate,
                onSelect: setSelectedDate,
              }}
            />

            <DateSuggestionPopup /> */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card key={index} className="shadow-lg">
      <CardHeader>
        <CardTitle>{cardData.materie}</CardTitle>
        <CardDescription>Profesor: {cardData.profesor}</CardDescription>
      </CardHeader>
      <CardContent>{renderStatus()}</CardContent>
    </Card>
  );
}
