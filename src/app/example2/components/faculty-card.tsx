import { Faculty } from '../types';

const FacultyCard = ({ faculty }: { faculty: Faculty }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-bold">{faculty.longName}</h2>
      <p className="text-gray-600">{faculty.shortName}</p>
      {faculty.description && (
        <p className="text-gray-700">{faculty.description}</p>
      )}
      <p className="text-gray-500">Created: {faculty.creationDate}</p>
    </div>
  );
};

export default FacultyCard;
