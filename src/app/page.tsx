'use client';
import { Button } from '../components/ui/button';
import useDataStore from './store/courses-store';

export default function Home() {
  const { data, isLoading, error, fetchData } = useDataStore();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Facultati:</h1>
      <ul>
        {data.map((faculty) => (
          <li key={faculty.facultyID}>
            {faculty.longName} {faculty.shortName}{' '}
          </li>
        ))}
      </ul>

      <Button onClick={fetchData}>Fetch courses</Button>
    </div>
  );

  // return <Calendar />;
}
