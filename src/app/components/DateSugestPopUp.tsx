'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Calendar, CalendarIcon } from 'lucide-react'; // biblioteca ta de iconițe
import { useState } from 'react';
import { Button } from 'react-day-picker';

function DateSuggestionPopup() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [status, setStatus] = useState<string | null>(null);

  const handleDateSubmit = () => {
    if (selectedDate) {
      setStatus(
        `Data selectată a fost trimisă: ${selectedDate.toLocaleDateString(
          'ro-RO',
        )}`,
      );
      // Aici poți face apelul către server pentru a trimite data
    } else {
      setStatus('Te rugăm să alegi o dată înainte de a trimite.');
    }
  };

  return (
    <div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex items-center gap-2">
              <CalendarIcon />
              {selectedDate
                ? selectedDate.toLocaleDateString('ro-RO')
                : 'Alege o dată'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 flex flex-col gap-4">
            <Calendar
              mode="single"
              onSelect={() => {
                //   setSelectedDate(a);
              }}
              // selected={date}
              // onSelect={setDate}
              //   initialFocus
            />

            <Button onClick={handleDateSubmit} className="self-end">
              Trimite sugestia de dată
            </Button>
          </PopoverContent>
        </Popover>
        {status && <div className="mt-4 text-sm text-gray-700">{status}</div>}
      </div>
    </div>
  );
}

export default DateSuggestionPopup;
