import { create } from 'zustand';

interface Post {
  title: string;
  numeProfesor: string;
  prenumeProfesor: string;
  status: string;
}

interface DataState {
  data: Post[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useDataStore = create<DataState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/GetCoursersForExamByUserID?userId=1`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(response);

      const result: Post[] = await response.json();

      set({ data: result, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },
}));

export default useDataStore;
