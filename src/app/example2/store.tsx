import { create } from 'zustand';
import { DataState } from './types';

const useFacultyStore = create<DataState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/faculties`,
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

export default useFacultyStore;
