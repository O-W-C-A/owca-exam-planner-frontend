export const formatDateTime = (date: string, start: string | null, end: string | null) => {
  const eventDate = new Date(date);
  const dateStr = eventDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  if (start && end) {
    return `${dateStr} (${start} - ${end})`;
  }
  return dateStr;
}; 