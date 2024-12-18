/* eslint-disable @typescript-eslint/no-require-imports */
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';

// Configurăm localele pentru limbă și formatul datelor
const locales = {
  //   'en-US': require('date-fns/locale/en-US'),
  ro: require('date-fns/locale/ro'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default localizer;
