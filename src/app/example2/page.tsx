'use client';
import { Button } from '../../components/ui/button';
import FacultyCard from './components/faculty-card';
import useFacultyStore from './store';

export default function ExamplePage2() {
  const { data, isLoading, error, fetchData } = useFacultyStore();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Button onClick={fetchData}>Fetch courses</Button>

      {data.map((faculty) => (
        <FacultyCard key={faculty.facultyID} faculty={faculty} />
      ))}
    </div>
  );
}
