'use client';
import { Button } from '../../components/ui/button';
import useGroupStore from '../store/group-store';

export default function Cards() {
  const { data, isLoading, error, fetchData } = useGroupStore();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Button onClick={fetchData}>Fetch courses</Button>

      {data.map((group) => (
        <p key={group.groupID}>{group.name}</p>
      ))}
    </div>
  );
}
