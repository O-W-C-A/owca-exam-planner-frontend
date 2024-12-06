'use client';
import { useEffect, useState } from 'react';

const ExamplePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setdata] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://localhost:7267/GetAllGroups')
      .then((response) => response.json())
      .then((data) => setdata(data[0].name))
      .then(() => setIsLoading(false));
  }, []);

  return <div>{isLoading ? 'Loading...' : data}</div>;
};

export default ExamplePage;
