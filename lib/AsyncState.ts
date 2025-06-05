export type AsyncState<T> = {
  loading: boolean;
  data: T | null;
  error: Error | null;
};
