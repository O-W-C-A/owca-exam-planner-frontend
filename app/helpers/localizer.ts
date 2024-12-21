import { format, getDay, parse, startOfWeek } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';
import { ro } from 'date-fns/locale';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    ro: ro
  }
});

export default localizer; 