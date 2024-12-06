export type Faculty = {
  facultyID: number;
  shortName: string;
  longName: string;
  description?: string;
  creationDate: string;
};
export interface DataState {
  data: Faculty[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}
