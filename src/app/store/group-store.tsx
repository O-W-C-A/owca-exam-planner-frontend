import { create } from 'zustand';

export type Group = {
  groupID: number;
  specializationID: number;
  name: string;
  creationDate: string;
  specialization: {
    specializationID: number;
    facultyID: number;
    name: string;
    description: string;
    creationDate: string;
    faculty: null;
  };
};

interface DataState {
  data: Group[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useGroupStore = create<DataState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/GetAllGroups`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      set({ data: result, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },
}));

export default useGroupStore;
