export const formatDateTime = (
  date: string,
  start: string | null,
  end: string | null
): string => {
  const eventDate = new Date(date);
  const dateStr = eventDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (start && end) {
    return `${dateStr} (${start} - ${end})`;
  }
  return dateStr;
};

export const getStatusStyles = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-red-100 text-red-800";
  }
};
