'use client';
import { useEffect } from 'react';
import useDataStore from './state/courses-state';

export default function Home() {
  const { data, isLoading, error, fetchData } = useDataStore();

  useEffect(() => {
    fetchData(); // Obținem datele când componenta se montează
  }, [fetchData]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Posts:</h1>
      <ul>
        {data.map((post) => (
          <li key={post.numeProfesor}>
            {post.title}
            <p>{post.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  // return <Calendar />;
}
