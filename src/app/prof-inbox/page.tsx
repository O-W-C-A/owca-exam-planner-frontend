import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

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
    dataExamen: '2024-11-25',
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
    dataExamen: '2024-12-05',
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
      {cardsData.map((card, index) => (
        <Card key={index} className="shadow-lg">
          <CardHeader>
            <CardTitle>{card.materie}</CardTitle>
            <CardDescription>Profesor: {card.profesor}</CardDescription>
          </CardHeader>
          <CardContent>
            {card.stare === 'Pending' ? (
              <div>
                <div className="flex">
                  <div className="text-sm text-green-800">
                    Data examenului: 10.10.2024
                  </div>
                  <CalendarIcon className="ml-2 h-5 w-5 text-green-800" />
                </div>
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
                        fill-rule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    id="time"
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    min="09:00"
                    max="18:00"
                    value="00:00"
                    required
                  />
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Aproba
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700
 text-white font-bold py-2 px-4 rounded"
                  >
                    Respinge
                  </button>
                </div>
              </div>
            ) : card.stare === 'Done' ? (
              <div className="px-2 py-1 text-sm rounded-lg bg-yellow-100 text-yellow-800">
                {card.stare}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
