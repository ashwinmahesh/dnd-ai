export type ApiResponse<T = null> = {
  data: T;
  error: string | null;
};
