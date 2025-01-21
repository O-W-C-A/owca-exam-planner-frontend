import Select from "react-select";
import { Course } from "@/types/course";

interface CourseSelectProps {
  readonly courses: Course[];
  readonly selectedCourse: Course | null;
  readonly setSelectedCourse: (course: Course | null) => void;
  readonly isLoading: boolean;
}

export function CourseSelect({ courses, selectedCourse, setSelectedCourse, isLoading }: CourseSelectProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="course-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Filter by Course
      </label>
      <Select
        id="course-select"
        value={
          selectedCourse
            ? { value: selectedCourse.id, label: selectedCourse.name }
            : null
        }
        onChange={(option) =>
          setSelectedCourse(
            option ? { id: option.value, name: option.label } : null
          )
        }
        options={courses.map((course) => ({
          value: course.id,
          label: course.name,
        }))}
        className="w-64"
        placeholder="Select a course..."
        isLoading={isLoading}
        isClearable
      />
    </div>
  );
}
