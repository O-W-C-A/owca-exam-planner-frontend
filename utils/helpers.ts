export const formatDateTime = (
  date: string,
): string => {
  const eventDate = new Date(date);
  const dateStr = eventDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // If start and end are provided, return just the date without appending the time
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
