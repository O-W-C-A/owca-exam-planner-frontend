import { ExamRequest } from "@/types/examRequest";

// Function to format the event title
export const formatExamRequestTitle = (event: ExamRequest) => event.title;

// Function to get the background color based on the status
export const getExamRequestBackgroundColor = (status: string) => {
    switch (status) {
        case "Approved":
            return "#22c55e";
        case "Rejected":
            return "#ef4444";
        case "Pending":
            return "#f59e0b";
        default:
            return "#f59e0b";
    }
};

// Function to get the styles for a specific status
export const getExamRequestStatusStyles = (status: string) => {
    switch (status) {
        case "Approved":
            return "bg-green-100 text-green-800";
        case "Rejected":
            return "bg-red-100 text-red-800";
        case "Pending":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};
